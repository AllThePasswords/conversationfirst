import { useEffect, useRef } from 'react'

interface WaveformVisualizerProps {
  stream: MediaStream | null
  active: boolean
}

const POINT_COUNT = 50
const LERP_FACTOR = 0.12
const IDLE_LERP = 0.06

export default function WaveformVisualizer({ stream, active }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const ctxRef = useRef<{ audioCtx: AudioContext; analyser: AnalyserNode } | null>(null)
  const smoothedRef = useRef(new Float32Array(POINT_COUNT))
  const timeRef = useRef(0)
  const accentRef = useRef('#3d6b5e')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Read accent colour from CSS custom property
    const style = getComputedStyle(document.documentElement)
    const accent = style.getPropertyValue('--accent').trim()
    if (accent) accentRef.current = accent

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Set up audio context if we have a stream
    if (active && stream) {
      const audioCtx = new AudioContext()
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      ctxRef.current = { audioCtx, analyser }
    }

    const ctx = canvas.getContext('2d')!
    const dataArr = ctxRef.current
      ? new Uint8Array(ctxRef.current.analyser.frequencyBinCount)
      : null

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    let lastReducedDraw = 0

    function draw() {
      if (!canvas) return
      const now = performance.now()

      if (prefersReduced) {
        // Reduced motion: update at ~4fps
        if (now - lastReducedDraw < 250) {
          animRef.current = requestAnimationFrame(draw)
          return
        }
        lastReducedDraw = now
      }

      animRef.current = requestAnimationFrame(draw)
      timeRef.current = now / 1000

      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const centerY = H / 2
      const maxAmplitude = H * 0.38
      const smoothed = smoothedRef.current
      const t = timeRef.current

      // Read frequency data
      if (dataArr && ctxRef.current) {
        ctxRef.current.analyser.getByteFrequencyData(dataArr)
      }

      // Compute target values for each point
      for (let i = 0; i < POINT_COUNT; i++) {
        let target: number

        if (dataArr && active) {
          // Logarithmic mapping: emphasise voice frequencies (80-4000Hz)
          const ratio = i / (POINT_COUNT - 1)
          const logMin = Math.log(1)
          const logMax = Math.log(dataArr.length)
          const binIndex = Math.floor(Math.exp(logMin + ratio * (logMax - logMin)))
          const clampedBin = Math.min(binIndex, dataArr.length - 1)

          // Average a small range of bins for smoother mapping
          const rangeStart = Math.max(0, clampedBin - 1)
          const rangeEnd = Math.min(dataArr.length - 1, clampedBin + 1)
          let sum = 0
          let count = 0
          for (let b = rangeStart; b <= rangeEnd; b++) {
            sum += dataArr[b]
            count++
          }
          const normalised = (sum / count) / 255

          // Add subtle idle noise even when speaking, for organic feel
          const idle = Math.sin(t * 0.8 + i * 0.4) * 0.02 +
                       Math.sin(t * 1.3 + i * 0.7) * 0.015
          target = Math.max(normalised, 0.02) + idle
        } else {
          // Idle: composite sine waves for gentle undulation
          target = Math.sin(t * 0.6 + i * 0.35) * 0.04 +
                   Math.sin(t * 1.1 + i * 0.6) * 0.025 +
                   Math.sin(t * 0.3 + i * 0.15) * 0.015 +
                   0.02
        }

        // Spring-like lerp
        const factor = active ? LERP_FACTOR : IDLE_LERP
        smoothed[i] += (target - smoothed[i]) * factor
      }

      // Clear canvas
      ctx.clearRect(0, 0, W, H)

      const accent = accentRef.current

      // Parse accent to RGB for alpha manipulation
      const rgb = hexToRgb(accent)

      // Draw centre line
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(W, centerY)
      ctx.strokeStyle = `rgba(${rgb}, 0.12)`
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw upper waveform
      drawWave(ctx, smoothed, W, H, centerY, maxAmplitude, -1, rgb, 0.85, 0.06)

      // Draw mirror reflection (lower)
      drawWave(ctx, smoothed, W, H, centerY, maxAmplitude * 0.4, 1, rgb, 0.25, 0.03)
    }

    draw()

    return () => {
      observer.disconnect()
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (ctxRef.current) {
        ctxRef.current.audioCtx.close()
        ctxRef.current = null
      }
    }
  }, [stream, active])

  return <canvas ref={canvasRef} className="vc-waveform-canvas" />
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  smoothed: Float32Array,
  W: number,
  _H: number,
  centerY: number,
  maxAmp: number,
  direction: number, // -1 = above centre, 1 = below
  rgb: string,
  strokeAlpha: number,
  fillAlpha: number,
) {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const x = (i / (POINT_COUNT - 1)) * W
    const y = centerY + direction * smoothed[i] * maxAmp
    points.push({ x, y })
  }

  // Draw filled area with gradient
  ctx.beginPath()
  ctx.moveTo(points[0].x, centerY)
  ctx.lineTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    ctx.quadraticCurveTo(prev.x + (cpx - prev.x) * 0.8, prev.y, cpx, (prev.y + curr.y) / 2)
    ctx.quadraticCurveTo(cpx + (curr.x - cpx) * 0.2, curr.y, curr.x, curr.y)
  }

  ctx.lineTo(points[points.length - 1].x, centerY)
  ctx.closePath()

  const gradient = ctx.createLinearGradient(0, centerY, 0, centerY + direction * maxAmp)
  gradient.addColorStop(0, `rgba(${rgb}, ${fillAlpha})`)
  gradient.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = gradient
  ctx.fill()

  // Draw stroke
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    ctx.quadraticCurveTo(prev.x + (cpx - prev.x) * 0.8, prev.y, cpx, (prev.y + curr.y) / 2)
    ctx.quadraticCurveTo(cpx + (curr.x - cpx) * 0.2, curr.y, curr.x, curr.y)
  }

  ctx.strokeStyle = `rgba(${rgb}, ${strokeAlpha})`
  ctx.lineWidth = 2
  ctx.stroke()
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
