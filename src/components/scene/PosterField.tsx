import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { GENRE_MAP } from '@/lib/genres'
import { nodeRadius } from '@/lib/layout'
import type { LayoutNode } from '@/lib/layout'
import { projectNodeToScreenRect, type ScreenRect } from '@/lib/projection'
import { createPosterMaskTexture } from '@/lib/textures'

interface PosterFieldProps {
  movies: LayoutNode[]
  hoveredId: number | null
  selectedId: number | null
  matchedIds: Set<number> | null // null = no active filter, everything matches
  onHover: (movie: LayoutNode | null) => void
  onSelect: (movie: LayoutNode, rect: ScreenRect) => void
}

const DIM_FACTOR = 0.1
const dummy = new THREE.Object3D()
const tmpColor = new THREE.Color()

export function PosterField({
  movies,
  hoveredId,
  selectedId,
  matchedIds,
  onHover,
  onSelect,
}: PosterFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const maskTexture = useMemo(() => createPosterMaskTexture(), [])
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const size = useThree((s) => s.size)

  // Per-instance static data computed once per dataset.
  const layout = useMemo(() => {
    const count = movies.length
    const widths = new Float32Array(count)
    const heights = new Float32Array(count)
    const phases = new Float32Array(count)
    const baseColors = new Float32Array(count * 3)

    movies.forEach((m, i) => {
      const r = nodeRadius(m)
      widths[i] = r * 1.55
      heights[i] = widths[i] * 1.5
      phases[i] = (m.id % 977) * 0.0173

      const genre = GENRE_MAP[m.genreId]
      tmpColor.set(genre?.color ?? '#888888')
      baseColors[i * 3] = tmpColor.r
      baseColors[i * 3 + 1] = tmpColor.g
      baseColors[i * 3 + 2] = tmpColor.b
    })

    return { widths, heights, phases, baseColors }
  }, [movies])

  // Initial matrices + instance colors.
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    movies.forEach((m, i) => {
      dummy.position.set(m.x, m.y, (m.id % 997) * 0.0006)
      dummy.scale.set(layout.widths[i], layout.heights[i], 1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true

    const colorAttr = new THREE.InstancedBufferAttribute(layout.baseColors.slice(), 3)
    mesh.instanceColor = colorAttr
    mesh.instanceColor.needsUpdate = true
  }, [movies, layout])

  // Re-tint on filter change (search / genre toggles).
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh || !mesh.instanceColor) return

    for (let i = 0; i < movies.length; i++) {
      const isMatch = !matchedIds || matchedIds.has(movies[i].id)
      const factor = isMatch ? 1 : DIM_FACTOR
      mesh.instanceColor.setXYZ(
        i,
        layout.baseColors[i * 3] * factor,
        layout.baseColors[i * 3 + 1] * factor,
        layout.baseColors[i * 3 + 2] * factor,
      )
    }
    mesh.instanceColor.needsUpdate = true
  }, [matchedIds, movies, layout])

  // Ambient drift: gentle bob so the universe never sits perfectly still.
  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < movies.length; i++) {
      const m = movies[i]
      const isSelected = m.id === selectedId
      const isHovered = m.id === hoveredId
      const bump = isSelected ? 1.18 : isHovered ? 1.08 : 1

      const bobY = Math.sin(t * 0.6 + layout.phases[i]) * 2.2
      const bobX = Math.cos(t * 0.4 + layout.phases[i]) * 1.1

      dummy.position.set(m.x + bobX, m.y + bobY, (m.id % 997) * 0.0006 + (isSelected ? 0.05 : 0))
      dummy.scale.set(layout.widths[i] * bump, layout.heights[i] * bump, 1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (e.instanceId === undefined) return
    onHover(movies[e.instanceId] ?? null)
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    onHover(null)
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.instanceId === undefined) return
    const movie = movies[e.instanceId]
    if (!movie) return
    const rect = projectNodeToScreenRect(camera, size, movie)
    onSelect(movie, rect)
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, movies.length]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={maskTexture} alphaTest={0.5} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  )
}
