import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'
import { GENRES } from './genres'
import type { Movie } from './mockMovies'

export interface LayoutNode extends Movie {
  x: number
  y: number
}

const CLUSTER_RING_RADIUS = 780

export function genreClusterCenters(): Record<string, { x: number; y: number }> {
  const centers: Record<string, { x: number; y: number }> = {}
  GENRES.forEach((g, i) => {
    const angle = (i / GENRES.length) * Math.PI * 2 - Math.PI / 2
    centers[g.id] = {
      x: Math.cos(angle) * CLUSTER_RING_RADIUS,
      y: Math.sin(angle) * CLUSTER_RING_RADIUS,
    }
  })
  return centers
}

export function nodeRadius(m: Movie): number {
  return 5 + Math.sqrt(m.popularity) * 26
}

/**
 * Runs a synchronous d3-force simulation clustering movies by genre into
 * organic, force-packed blobs arranged around a ring. Mutates and returns
 * the same movie objects with settled x/y coordinates.
 */
export function computeLayout(movies: Movie[], ticks = 260): LayoutNode[] {
  const centers = genreClusterCenters()

  // Seed initial positions near their cluster so the sim converges fast
  // and doesn't briefly explode from an all-origin start.
  for (const m of movies) {
    const c = centers[m.genreId]
    const seedAngle = (m.id * 2.399963) % (Math.PI * 2) // golden-angle spread
    const seedR = 40 + (m.id % 37) * 6
    m.x = c.x + Math.cos(seedAngle) * seedR
    m.y = c.y + Math.sin(seedAngle) * seedR
    m.vx = 0
    m.vy = 0
  }

  const simulation = forceSimulation(movies as unknown as Array<Movie & { index?: number }>)
    .force('charge', forceManyBody().strength(-18).distanceMax(240).theta(0.9))
    .force(
      'collide',
      forceCollide<Movie>((d) => nodeRadius(d) + 2.5).iterations(2),
    )
    .force(
      'x',
      forceX<Movie>((d) => centers[d.genreId].x).strength(0.05),
    )
    .force(
      'y',
      forceY<Movie>((d) => centers[d.genreId].y).strength(0.05),
    )
    .stop()

  for (let i = 0; i < ticks; i++) simulation.tick()

  return movies as LayoutNode[]
}
