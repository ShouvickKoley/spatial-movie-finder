import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TopBarProps {
  query: string
  onQueryChange: (value: string) => void
}

export function TopBar({ query, onQueryChange }: TopBarProps) {
  return (
    <div className="pointer-events-auto flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-white sm:text-base">
          Spatial Movie Finder
        </h1>
        <p className="text-xs text-white/50">Pan &amp; zoom to explore the universe</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search titles or directors…"
          className="bg-black/40 pl-8 backdrop-blur-md"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
            onClick={() => onQueryChange('')}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
