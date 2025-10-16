import { FileText, FileSignature, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="mt-2 text-neutral-400">
          Quick snapshot of your activity and shortcuts to get started.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <FileText className="h-8 w-8 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-sm text-neutral-400">CVs Created</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <FileSignature className="h-8 w-8 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-sm text-neutral-400">Letters Generated</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <Clock className="h-8 w-8 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">Oct 12</p>
          <p className="text-sm text-neutral-400">Last Activity</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <BarChart3 className="h-8 w-8 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">Pro</p>
          <p className="text-sm text-neutral-400">Current Plan</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          <p className="text-sm text-neutral-400">
            Start a new document or continue where you left off.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/cv-builder">+ New CV</Link>
          </Button>
          <Button asChild size="lg" intent="secondary">
            <Link href="/letter-builder">+ New Letter</Link>
          </Button>
        </div>
      </div>

      {/* Insights / Activity */}
      <div className="glass-panel p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-sm text-neutral-300">
          <li>✔ Generated CV for “Marketing Manager” — Oct 12</li>
          <li>✔ Drafted Letter: Rent Notice — Oct 10</li>
          <li>✔ Exported CV in PDF — Oct 8</li>
        </ul>
      </div>
    </div>
  );
}
