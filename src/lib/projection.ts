import * as THREE from 'three'
import { nodeRadius } from './layout'
import type { Movie } from './mockMovies'

export interface ScreenRect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Projects a movie's world-space node into a CSS pixel rect on screen,
 * assuming an orthographic camera looking down the Z axis. Used to seed the
 * canvas-to-DOM morph animation from the exact spot the user clicked.
 */
export function projectNodeToScreenRect(
  camera: THREE.OrthographicCamera,
  size: { width: number; height: number },
  movie: Movie,
): ScreenRect {
  const center = new THREE.Vector3(movie.x, movie.y, 0).project(camera)
  const cx = (center.x * 0.5 + 0.5) * size.width
  const cy = (-center.y * 0.5 + 0.5) * size.height

  const pixelsPerUnit = size.height / ((camera.top - camera.bottom) / camera.zoom)
  const r = nodeRadius(movie)
  const width = r * 2 * pixelsPerUnit
  const height = width * 1.5

  return {
    left: cx - width / 2,
    top: cy - height / 2,
    width,
    height,
  }
}
