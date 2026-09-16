// Fixed categorical palette, dark-surface steps, in validated non-cycled order.
// Source: dataviz skill reference palette (8-slot categorical theme).
export interface Genre {
  id: string
  label: string
  color: string
}

export const GENRES: Genre[] = [
  { id: 'action', label: 'Action', color: '#3987e5' },
  { id: 'comedy', label: 'Comedy', color: '#d95926' },
  { id: 'scifi', label: 'Sci-Fi', color: '#199e70' },
  { id: 'adventure', label: 'Adventure', color: '#c98500' },
  { id: 'romance', label: 'Romance', color: '#d55181' },
  { id: 'documentary', label: 'Documentary', color: '#2f9e2f' },
  { id: 'fantasy', label: 'Fantasy', color: '#9085e9' },
  { id: 'horror', label: 'Horror', color: '#e66767' },
]

export const GENRE_MAP: Record<string, Genre> = Object.fromEntries(
  GENRES.map((g) => [g.id, g]),
)
