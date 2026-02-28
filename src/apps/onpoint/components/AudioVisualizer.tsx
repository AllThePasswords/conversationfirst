import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  stream: MediaStream | null
  active: boolean
}

export default function AudioVisualizer({ stream, active }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const ctxRef = useRef<{ audioCtx: AudioContext; analyser: AnalyserNode } | null>(null)

  useEffect(() => {
    if (!active || !stream || !canvasRef.current) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (ctxRef.current) {
        ctxRef.current.audioCtx.close()
        ctxRef.current = null
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      return
    }

    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 64
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(analyser)
    ctxRef.current = { audioCtx, analyser }

    const bufLen = analyser.frequencyBinCount
    const dataArr = new Uint8Array(bufLen)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const barCount = 7
    const barW = 4
    const gap = 3

    function draw() {
      animRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArr)
      ctx.clearRect(0, 0, W, H)

      const totalW = barCount * barW + (barCount - 1) * gap
      const startX = (W - totalW) / 2

      for (let i = 0; i < barCount; i++) {
        const idx = Math.min(i + 1, bufLen - 1)
        const val = dataArr[idx] / 255
        const barH = Math.max(3, val * H * 0.85)
        const x = startX + i * (barW + gap)
        const y = (H - barH) / 2

        ctx.fillStyle = `rgba(61, 107, 94, ${0.4 + val * 0.6})`
        ctx.fillRect(x, y, barW, barH)
      }
    }

    draw()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      audioCtx.close()
      ctxRef.current = null
    }
  }, [stream, active])

  return <canvas ref={canvasRef} className="op-viz-canvas" width={120} height={40} />
}
