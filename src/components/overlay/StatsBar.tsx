import { useFps } from '@/hooks/useFps'
import { cn } from '@/lib/utils'

interface StatsBarProps {
  total: number
  visible: number
}

export function StatsBar({ total, visible }: StatsBarProps) {
  const fps = useFps()
  const healthy = fps >= 50

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] text-white/60 backdrop-blur-md">
      <span className="flex items-center gap-1.5">
        <span
          className={cn('h-1.5 w-1.5 rounded-full', healthy ? 'bg-emerald-400' : 'bg-amber-400')}
        />
        {fps} fps
      </span>
      <span className="h-3 w-px bg-white/10" />
      <span>
        {visible.toLocaleString()} / {total.toLocaleString()} films
      </span>
      <span className="h-3 w-px bg-white/10" />
      <span>instanced WebGL · single draw call</span>
    </div>
  )
}
