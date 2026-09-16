import { AnimatePresence, motion } from 'framer-motion'
import { Clapperboard, Clock, Star, User, X } from 'lucide-react'
import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GENRE_MAP } from '@/lib/genres'
import type { LayoutNode } from '@/lib/layout'
import type { ScreenRect } from '@/lib/projection'

interface MorphPanelProps {
  movie: LayoutNode | null
  originRect: ScreenRect | null
  onClose: () => void
}

export function MorphPanel({ movie, originRect, onClose }: MorphPanelProps) {
  const target = useMemo(() => {
    if (typeof window === 'undefined') return { left: 0, width: 420 }
    const width = Math.min(420, window.innerWidth * 0.92)
    return { left: window.innerWidth - width, width }
  }, [movie?.id])

  const genre = movie ? GENRE_MAP[movie.genreId] : null

  return (
    <AnimatePresence>
      {movie && originRect && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            key={movie.id}
            className="fixed z-50 flex flex-col overflow-hidden border-l border-white/10 bg-card text-card-foreground shadow-2xl"
            initial={{
              top: originRect.top,
              left: originRect.left,
              width: originRect.width,
              height: originRect.height,
              borderRadius: 18,
              opacity: 0.5,
            }}
            animate={{
              top: 0,
              left: target.left,
              width: target.width,
              height: '100vh',
              borderRadius: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              x: 24,
              transition: { duration: 0.16 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }}
          >
            <div
              className="relative flex h-40 shrink-0 items-end p-5"
              style={{
                background: `linear-gradient(160deg, ${genre?.color}55, ${genre?.color}10 60%, transparent)`,
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-black/30 hover:bg-black/50"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <Clapperboard
                className="absolute top-5 left-5 h-8 w-8 opacity-70"
                style={{ color: genre?.color }}
              />
              <h2 className="pr-8 text-xl leading-tight font-semibold text-white">
                {movie.title}
              </h2>
            </div>

            <div className="thin-scrollbar flex-1 space-y-5 overflow-y-auto p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge style={{ backgroundColor: genre?.color, color: '#0a0a10' }}>
                  {genre?.label}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-white/70">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="text-sm text-white/40">{movie.year}</span>
                <span className="flex items-center gap-1 text-sm text-white/40">
                  <Clock className="h-3.5 w-3.5" />
                  {movie.runtime}m
                </span>
              </div>

              <p className="text-sm leading-relaxed text-white/75">{movie.synopsis}</p>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/60">
                <User className="h-4 w-4" />
                Directed by {movie.director}
              </div>

              <p className="pt-2 text-xs text-white/30">
                Generated placeholder data for demo purposes — not a real title.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
