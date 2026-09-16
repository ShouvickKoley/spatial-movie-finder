export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#0a0a10]">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/70 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-white/50">Clustering the universe by genre…</p>
    </div>
  )
}
