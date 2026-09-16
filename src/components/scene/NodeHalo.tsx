import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { GENRE_MAP } from '@/lib/genres'
import type { LayoutNode } from '@/lib/layout'
import { createGlowTexture } from '@/lib/textures'

interface NodeHaloProps {
  movie: LayoutNode | null
  baseScale: number
  opacity: number
  pulse?: boolean
}

/** A soft glowing ring that tracks a hovered or selected poster. */
export function NodeHalo({ movie, baseScale, opacity, pulse }: NodeHaloProps) {
  const spriteRef = useRef<THREE.Sprite>(null)
  const glowTexture = useMemo(() => createGlowTexture(), [])

  useFrame(({ clock }) => {
    const sprite = spriteRef.current
    if (!sprite || !movie) return
    const t = clock.getElapsedTime()
    const pulseScale = pulse ? 1 + Math.sin(t * 2.4) * 0.06 : 1
    sprite.position.set(movie.x, movie.y, 0.2)
    sprite.scale.setScalar(baseScale * pulseScale)
  })

  if (!movie) return null

  const color = GENRE_MAP[movie.genreId]?.color ?? '#ffffff'

  return (
    <sprite ref={spriteRef} position={[movie.x, movie.y, 0.2]} scale={baseScale}>
      <spriteMaterial
        map={glowTexture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}
