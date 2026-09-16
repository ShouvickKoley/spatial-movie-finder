import { Canvas } from '@react-three/fiber'
import { Html, MapControls } from '@react-three/drei'
import { Suspense } from 'react'

import { GENRE_MAP } from '@/lib/genres'
import type { LayoutNode } from '@/lib/layout'
import type { ScreenRect } from '@/lib/projection'
import { GenreAtmosphere } from './GenreAtmosphere'
import { NodeHalo } from './NodeHalo'
import { PosterField } from './PosterField'

interface SceneProps {
  movies: LayoutNode[]
  hoveredMovie: LayoutNode | null
  selectedMovie: LayoutNode | null
  matchedIds: Set<number> | null
  onHover: (movie: LayoutNode | null) => void
  onSelect: (movie: LayoutNode, rect: ScreenRect) => void
}

export function Scene({
  movies,
  hoveredMovie,
  selectedMovie,
  matchedIds,
  onHover,
  onSelect,
}: SceneProps) {
  const showTooltip = hoveredMovie && hoveredMovie.id !== selectedMovie?.id
  const tooltipGenre = hoveredMovie ? GENRE_MAP[hoveredMovie.genreId] : null

  return (
    <Canvas
      orthographic
      camera={{ zoom: 0.42, position: [0, 0, 500], near: 0.1, far: 2000 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0a0a10']} />
      <Suspense fallback={null}>
        <GenreAtmosphere />
        <PosterField
          movies={movies}
          hoveredId={hoveredMovie?.id ?? null}
          selectedId={selectedMovie?.id ?? null}
          matchedIds={matchedIds}
          onHover={onHover}
          onSelect={onSelect}
        />
        <NodeHalo movie={hoveredMovie} baseScale={70} opacity={0.35} />
        <NodeHalo movie={selectedMovie} baseScale={95} opacity={0.55} pulse />
        {showTooltip && hoveredMovie && (
          <Html
            position={[hoveredMovie.x, hoveredMovie.y, 1]}
            center
            distanceFactor={undefined}
            style={{ pointerEvents: 'none', transform: 'translateY(-140%)' }}
            occlude={false}
          >
            <div className="whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 text-xs shadow-xl backdrop-blur-sm">
              <span className="font-medium text-white">{hoveredMovie.title}</span>
              <span className="mx-1.5 text-white/30">·</span>
              <span style={{ color: tooltipGenre?.color }}>{tooltipGenre?.label}</span>
              <span className="mx-1.5 text-white/30">·</span>
              <span className="text-white/60">{hoveredMovie.year}</span>
            </div>
          </Html>
        )}
      </Suspense>
      <MapControls
        enableRotate={false}
        enableDamping
        dampingFactor={0.14}
        screenSpacePanning
        minZoom={0.08}
        maxZoom={9}
        zoomSpeed={0.9}
        panSpeed={1.1}
        makeDefault
      />
    </Canvas>
  )
}
