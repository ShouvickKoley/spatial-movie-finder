import { useMemo } from 'react'
import * as THREE from 'three'

import { GENRES } from '@/lib/genres'
import { genreClusterCenters } from '@/lib/layout'
import { createGlowTexture } from '@/lib/textures'

/** Faint colored haze behind each genre cluster so the map reads at a glance,
 * even before any poster resolves at low zoom. Purely atmospheric. */
export function GenreAtmosphere() {
  const glowTexture = useMemo(() => createGlowTexture(), [])
  const centers = useMemo(() => genreClusterCenters(), [])

  return (
    <group renderOrder={-1}>
      {GENRES.map((genre) => {
        const c = centers[genre.id]
        return (
          <sprite key={genre.id} position={[c.x, c.y, -1]} scale={720}>
            <spriteMaterial
              map={glowTexture}
              color={genre.color}
              transparent
              opacity={0.16}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        )
      })}
    </group>
  )
}
