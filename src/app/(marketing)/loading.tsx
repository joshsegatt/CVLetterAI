export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
      <div className="space-y-6 flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-zinc-100 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900">
            CVLetterAI
          </span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
            Neural Engine Loading
          </span>
        </div>
      </div>
    </div>
  )
}
