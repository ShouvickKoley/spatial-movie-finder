import * as THREE from 'three'

/**
 * A single shared alpha-masked "poster card" texture: a rounded rectangle,
 * opaque inside, transparent outside, with a soft vertical shade baked into
 * RGB so every instance reads as a card even before instance color tints it.
 * Using alphaTest (not blending) keeps thousands of instances depth-correct
 * without per-instance sorting.
 */
export function createPosterMaskTexture(): THREE.CanvasTexture {
  const w = 128
  const h = 192
  const radius = 20

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, w, h)
  roundedRectPath(ctx, 2, 2, w - 4, h - 4, radius)
  ctx.clip()

  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.92)')
  grad.addColorStop(1, 'rgba(210,210,210,0.85)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // subtle top sheen
  const sheen = ctx.createLinearGradient(0, 0, 0, h * 0.4)
  sheen.addColorStop(0, 'rgba(255,255,255,0.35)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, w, h * 0.4)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.anisotropy = 4
  return texture
}

/** A soft radial glow sprite used for hover/selection rings. */
export function createGlowTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  grad.addColorStop(0, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.25)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
