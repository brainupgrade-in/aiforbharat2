/**
 * Cheap client-side image quality checks for fundus uploads.
 *
 * - dimensions: hard reject below the model's input size (224×224)
 * - sharpness: Laplacian-of-grayscale variance, downsampled to 256×256 for speed.
 *   Higher variance → sharper. Empirical thresholds (gathered from APTOS samples
 *   + smartphone test captures): well-focused fundus photos clear ~150; severe
 *   motion/defocus blur drops well under 50. We pick 80 to skip only obvious
 *   blur and avoid blocking marginal-but-usable shots.
 *
 * `result.ok` is true only when both checks pass.
 * `result.reason` is one of: 'too_small' | 'blurry' | null.
 */

const DOWNSAMPLE = 256
const BLUR_THRESHOLD = 80
const MIN_DIM = 224

function computeLaplacianVariance(imageData) {
  const { data, width, height } = imageData
  // Grayscale (Rec. 601 luma)
  const gray = new Float32Array(width * height)
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }

  // 3×3 Laplacian: center = -4, neighbours = +1
  const lap = new Float32Array((width - 2) * (height - 2))
  let li = 0
  let sum = 0
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const v = gray[i - width] + gray[i + width] + gray[i - 1] + gray[i + 1] - 4 * gray[i]
      lap[li++] = v
      sum += v
    }
  }
  const mean = sum / lap.length
  let variance = 0
  for (let k = 0; k < lap.length; k++) {
    const d = lap[k] - mean
    variance += d * d
  }
  return variance / lap.length
}

/** Loads a URL/dataURL and returns { ok, reason, width, height, blurScore }. */
export function checkImageQuality(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onerror = () => resolve({ ok: false, reason: 'too_small', width: 0, height: 0, blurScore: 0 })
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      if (w < MIN_DIM || h < MIN_DIM) {
        resolve({ ok: false, reason: 'too_small', width: w, height: h, blurScore: 0 })
        return
      }
      try {
        const canvas = document.createElement('canvas')
        canvas.width = DOWNSAMPLE
        canvas.height = DOWNSAMPLE
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, DOWNSAMPLE, DOWNSAMPLE)
        const data = ctx.getImageData(0, 0, DOWNSAMPLE, DOWNSAMPLE)
        const score = computeLaplacianVariance(data)
        resolve({
          ok: score >= BLUR_THRESHOLD,
          reason: score >= BLUR_THRESHOLD ? null : 'blurry',
          width: w,
          height: h,
          blurScore: score,
        })
      } catch {
        // If anything browser-side trips (CORS on canvas, OOM), don't block — fall through to dimension-only pass
        resolve({ ok: true, reason: null, width: w, height: h, blurScore: -1 })
      }
    }
    img.src = src
  })
}
