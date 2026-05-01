import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[12rem] font-black text-zinc-50 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">
                  Route Disrupted.
                </h2>
                <p className="text-zinc-500 font-medium">
                  The executive path you're seeking doesn't exist or has been relocated.
                </p>
             </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="outline" className="rounded-2xl px-8 py-6 h-auto font-bold border-zinc-200">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              BACK TO SITE
            </Link>
          </Button>
          <Button asChild className="rounded-2xl px-8 py-6 h-auto font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              GO HOME
            </Link>
          </Button>
        </div>

        <div className="pt-12 border-t border-zinc-100">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
             CVLetterAI © 2026 — AI Intelligence
           </p>
        </div>
      </div>
    </div>
  )
}
