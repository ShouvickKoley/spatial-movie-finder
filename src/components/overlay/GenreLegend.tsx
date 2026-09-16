import { GENRES } from '@/lib/genres'
import { cn } from '@/lib/utils'

interface GenreLegendProps {
  activeGenreIds: Set<string>
  counts: Record<string, number>
  onToggle: (genreId: string) => void
  onReset: () => void
}

export function GenreLegend({ activeGenreIds, counts, onToggle, onReset }: GenreLegendProps) {
  const allActive = activeGenreIds.size === GENRES.length

  return (
    <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md">
      {GENRES.map((genre) => {
        const active = activeGenreIds.has(genre.id)
        return (
          <button
            key={genre.id}
            onClick={() => onToggle(genre.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
              active
                ? 'border-transparent text-white'
                : 'border-white/10 text-white/35 hover:text-white/60',
            )}
            style={active ? { backgroundColor: `${genre.color}26`, borderColor: `${genre.color}80` } : undefined}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: active ? genre.color : 'rgba(255,255,255,0.25)' }}
            />
            {genre.label}
            <span className="text-[10px] text-white/40">{counts[genre.id] ?? 0}</span>
          </button>
        )
      })}
      {!allActive && (
        <button
          onClick={onReset}
          className="ml-1 rounded-full px-2 py-1 text-xs text-white/50 underline decoration-dotted underline-offset-2 hover:text-white"
        >
          reset
        </button>
      )}
    </div>
  )
}
