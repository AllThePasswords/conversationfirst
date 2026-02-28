// Video utilities for presentation mode

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080

export interface VideoInfo {
  videoUrl: string
  autoplay: boolean
  loop: boolean
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  cornerRadius: number
}

export function extractVideoFromCanvasJson(canvasJson: string): VideoInfo | null {
  if (!canvasJson) return null

  try {
    const data = JSON.parse(canvasJson)
    if (!data.objects) return null

    for (const obj of data.objects) {
      if (obj.isVideo === true && obj.videoUrl) {
        let cornerRadius = 0
        if (obj.clipPath && obj.clipPath.rx) {
          cornerRadius = obj.clipPath.rx * (obj.scaleX ?? 1)
        }

        return {
          videoUrl: obj.videoUrl,
          autoplay: obj.videoAutoplay ?? true,
          loop: obj.videoLoop ?? false,
          left: obj.left ?? CANVAS_WIDTH / 2,
          top: obj.top ?? CANVAS_HEIGHT / 2,
          width: obj.width ?? 800,
          height: obj.height ?? 450,
          scaleX: obj.scaleX ?? 1,
          scaleY: obj.scaleY ?? 1,
          cornerRadius,
        }
      }
    }
  } catch {
    // Invalid JSON
  }

  return null
}

export function calculateVideoOverlayStyle(
  videoInfo: VideoInfo,
  canvasScale: number
): {
  left: number
  top: number
  width: number
  height: number
  borderRadius: number
} {
  const displayWidth = videoInfo.width * videoInfo.scaleX
  const displayHeight = videoInfo.height * videoInfo.scaleY

  return {
    left: (videoInfo.left - displayWidth / 2) * canvasScale,
    top: (videoInfo.top - displayHeight / 2) * canvasScale,
    width: displayWidth * canvasScale,
    height: displayHeight * canvasScale,
    borderRadius: videoInfo.cornerRadius > 0 ? videoInfo.cornerRadius * canvasScale : 0,
  }
}
