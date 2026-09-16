import { useCallback, useEffect, useMemo, useState } from 'react'

import { GenreLegend } from '@/components/overlay/GenreLegend'
import { LoadingScreen } from '@/components/overlay/LoadingScreen'
import { MorphPanel } from '@/components/overlay/MorphPanel'
import { StatsBar } from '@/components/overlay/StatsBar'
import { TopBar } from '@/components/overlay/TopBar'
import { Scene } from '@/components/scene/Scene'
import { GENRES } from '@/lib/genres'
import { computeLayout, type LayoutNode } from '@/lib/layout'
import { generateMovies } from '@/lib/mockMovies'
import type { ScreenRect } from '@/lib/projection'

const MOVIE_COUNT = 2000
const ALL_GENRE_IDS = new Set(GENRES.map((g) => g.id))

function App() {
  const [movies, setMovies] = useState<LayoutNode[] | null>(null)
  const [hoveredMovie, setHoveredMovie] = useState<LayoutNode | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<LayoutNode | null>(null)
  const [originRect, setOriginRect] = useState<ScreenRect | null>(null)
  const [query, setQuery] = useState('')
  const [activeGenreIds, setActiveGenreIds] = useState<Set<string>>(ALL_GENRE_IDS)

  // Defer the heavy simulation one frame so the loading screen actually paints first.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const raw = generateMovies(MOVIE_COUNT)
      setMovies(computeLayout(raw))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    if (!movies) return c
    for (const g of GENRES) c[g.id] = 0
    for (const m of movies) c[m.genreId] = (c[m.genreId] ?? 0) + 1
    return c
  }, [movies])

  const matchedIds = useMemo(() => {
    if (!movies) return null
    const q = query.trim().toLowerCase()
    const allGenresActive = activeGenreIds.size === GENRES.length
    if (!q && allGenresActive) return null

    const set = new Set<number>()
    for (const m of movies) {
      if (!activeGenreIds.has(m.genreId)) continue
      if (q && !m.title.toLowerCase().includes(q) && !m.director.toLowerCase().includes(q)) {
        continue
      }
      set.add(m.id)
    }
    return set
  }, [movies, query, activeGenreIds])

  const handleSelect = useCallback((movie: LayoutNode, rect: ScreenRect) => {
    setSelectedMovie(movie)
    setOriginRect(rect)
  }, [])

  const handleToggleGenre = useCallback((id: string) => {
    setActiveGenreIds((prev) => {
      const allActive = prev.size === GENRES.length
      if (allActive) return new Set([id])

      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        if (next.size === 0) return new Set(ALL_GENRE_IDS)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleResetGenres = useCallback(() => setActiveGenreIds(new Set(ALL_GENRE_IDS)), [])

  if (!movies) return <LoadingScreen />

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a10]">
      <Scene
        movies={movies}
        hoveredMovie={hoveredMovie}
        selectedMovie={selectedMovie}
        matchedIds={matchedIds}
        onHover={setHoveredMovie}
        onSelect={handleSelect}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <TopBar query={query} onQueryChange={setQuery} />
        <GenreLegend
          activeGenreIds={activeGenreIds}
          counts={counts}
          onToggle={handleToggleGenre}
          onReset={handleResetGenres}
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-20">
        <StatsBar total={movies.length} visible={matchedIds ? matchedIds.size : movies.length} />
      </div>

      <MorphPanel movie={selectedMovie} originRect={originRect} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default App
