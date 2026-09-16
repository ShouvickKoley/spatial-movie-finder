import { useEffect, useRef, useState } from 'react'

/** Lightweight rAF-based FPS meter for the on-screen performance readout. */
export function useFps(): number {
  const [fps, setFps] = useState(60)
  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    let raf = 0
    const loop = () => {
      frames.current += 1
      const now = performance.now()
      const elapsed = now - lastTime.current
      if (elapsed >= 500) {
        setFps(Math.round((frames.current * 1000) / elapsed))
        frames.current = 0
        lastTime.current = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return fps
}
