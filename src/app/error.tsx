'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] border border-zinc-200 shadow-2xl p-12 text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">
            System Anomaly
          </h1>
          <p className="text-zinc-600 font-medium">
            A temporary disruption has occurred in the AI document engine. Our engineers have been notified.
          </p>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
             <p className="text-[10px] font-mono text-zinc-400 break-all">
               ERROR_ID: {error.digest || 'UNKNOWN_ANOMALY'}
             </p>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => reset()}
            className="w-full rounded-2xl px-8 py-6 h-auto font-bold bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-3"
          >
            <RefreshCcw className="h-5 w-5" />
            REBOOT SESSION
          </Button>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
          Neural Core Status: Degraded
        </p>
      </div>
    </div>
  )
}
