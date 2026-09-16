import { GENRES } from './genres'

export interface Movie {
  id: number
  title: string
  genreId: string
  year: number
  rating: number // 0-10
  runtime: number // minutes
  popularity: number // 0-1, drives node size
  synopsis: string
  director: string
  x: number
  y: number
  vx: number
  vy: number
}

// Deterministic PRNG (mulberry32) so the "universe" is stable across reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20260916)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const range = (min: number, max: number) => min + rand() * (max - min)

const TITLE_A = [
  'Silent', 'Crimson', 'Last', 'Broken', 'Hidden', 'Electric', 'Velvet', 'Distant',
  'Golden', 'Forgotten', 'Endless', 'Wild', 'Quiet', 'Burning', 'Neon', 'Frozen',
  'Sacred', 'Wandering', 'Midnight', 'Paper', 'Iron', 'Glass', 'Lost', 'Radiant',
  'Savage', 'Hollow', 'Gilded', 'Restless', 'Faded', 'Shattered',
]
const TITLE_B = [
  'Horizon', 'Garden', 'Kingdom', 'Machine', 'Signal', 'Harbor', 'Ocean', 'City',
  'Empire', 'Orchard', 'River', 'Station', 'Mirror', 'Echo', 'Frontier', 'Circuit',
  'Valley', 'Prophet', 'Wolves', 'Ashes', 'Dream', 'Coast', 'Engine', 'Century',
  'Paradox', 'Ledger', 'Compass', 'Threshold', 'Tide', 'Static',
]
const TITLE_SUFFIX = ['', '', '', ': Origins', ' II', ' Rising', ': Requiem', ' Redux', ': Chapter One', ' Forever']

const FIRST_NAMES = [
  'Amara', 'Dev', 'Elin', 'Noor', 'Kaito', 'Priya', 'Mateo', 'Solvi', 'Iris', 'Rafael',
  'Yuki', 'Lena', 'Omar', 'Freya', 'Tomas', 'Aiyana', 'Bex', 'Sasha', 'Nadia', 'Kian',
]
const LAST_NAMES = [
  'Reyes', 'Okafor', 'Lindqvist', 'Haddad', 'Moreau', 'Takahashi', 'Novak', 'Alvarez',
  'Osei', 'Bergstrom', 'Kowalski', 'Chowdhury', 'Falco', 'Marchetti', 'Solis', 'Vance',
]

const SYNOPSIS_TEMPLATES: Record<string, string[]> = {
  action: [
    'A disavowed operative races against a private militia to stop a stolen warhead from reaching the black market.',
    'After a heist goes wrong, a getaway driver must fight through a city on lockdown to reach the one person who can clear her name.',
  ],
  comedy: [
    'Two feuding wedding planners are forced to co-run the event of the season after a scheduling mix-up.',
    'A washed-up game show host reluctantly mentors his awkward replacement, with chaotic results.',
  ],
  scifi: [
    'A deep-space archivist discovers a signal that predicts events before they happen, and no one believes her.',
    'When a colony ship’s AI starts rewriting its own directives, the last waking crew member has one cycle to intervene.',
  ],
  adventure: [
    'A disgraced cartographer sets out to prove a lost trade route exists, chased by rivals who want the map first.',
    'Three estranged siblings inherit a map to their grandfather’s final, impossible expedition.',
  ],
  romance: [
    'Two rival chefs are forced to share a food truck for one summer, and neither expected the reservations to fill up like this.',
    'A letter meant for someone else changes the course of two strangers’ lives across a single rainy season.',
  ],
  documentary: [
    'An intimate look at the last lighthouse keepers of a disappearing coastline, told over four seasons.',
    'Archival footage and first-person testimony trace the rise and quiet collapse of a utopian factory town.',
  ],
  fantasy: [
    'The youngest child of a dethroned sorceress must master a forbidden craft before the kingdom’s protective wards fail.',
    'A cartographer of dreams is hired to map a realm that erases anyone who stays too long.',
  ],
  horror: [
    'A family renovating a remote farmhouse begins to suspect the previous owners never actually left.',
    'A graveyard-shift radio host starts receiving calls from listeners who died decades ago.',
  ],
}

function makeTitle(): string {
  return `${pick(TITLE_A)} ${pick(TITLE_B)}${pick(TITLE_SUFFIX)}`
}

function makeDirector(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
}

export function generateMovies(count: number): Movie[] {
  const movies: Movie[] = []
  const usedTitles = new Set<string>()

  for (let i = 0; i < count; i++) {
    let title = makeTitle()
    let guard = 0
    while (usedTitles.has(title) && guard < 5) {
      title = makeTitle()
      guard++
    }
    usedTitles.add(title)

    const genre = pick(GENRES)
    const templates = SYNOPSIS_TEMPLATES[genre.id]

    movies.push({
      id: i,
      title,
      genreId: genre.id,
      year: Math.floor(range(1978, 2027)),
      rating: Math.round(range(4.5, 9.6) * 10) / 10,
      runtime: Math.floor(range(82, 165)),
      popularity: Math.pow(rand(), 2.2), // skew toward smaller nodes, few big ones
      synopsis: pick(templates),
      director: makeDirector(),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    })
  }

  return movies
}
