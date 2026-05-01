"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FileText, Zap, ArrowRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Document, JobApplication } from "@/db/schema";
import { ApplicationTracker } from "./application-tracker";

interface Props {
  user: { id: string; name: string | null; creditsRemaining: number; creditsTotal: number } | undefined;
  recentDocs: Document[];
  applications: JobApplication[];
  subscription: { status: string; currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean } | null;
}

const statusConfig: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pending:    { icon: Clock,         label: "Pending",    className: "bg-zinc-100 text-zinc-600" },
  processing: { icon: Loader2,       label: "Generating", className: "bg-amber-50 text-amber-700" },
  completed:  { icon: CheckCircle,   label: "Ready",      className: "bg-emerald-50 text-emerald-700" },
  failed:     { icon: AlertCircle,   label: "Failed",     className: "bg-red-50 text-red-700" },
};

const typeLabels: Record<string, string> = {
  resume: "Resume",
  cover_letter: "Cover Letter",
  linkedin_summary: "LinkedIn",
  executive_bio: "Executive Bio",
  other: "Document",
};

export function DashboardOverview({ user, recentDocs, applications, subscription }: Props) {
  const creditsRemaining = user?.creditsRemaining ?? 0;
  const creditsTotal = user?.creditsTotal ?? 5;
  const creditPct = creditsTotal > 0 ? Math.round((creditsRemaining / creditsTotal) * 100) : 0;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-fade-up">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-zinc-500 mt-2 text-base lg:text-lg">Ready to create your next career document?</p>
        </div>
        <Button asChild size="xl" className="shadow-lg shadow-indigo-100">
          <Link href="/dashboard/documents/new" className="flex items-center gap-2.5">
            <Plus className="h-5 w-5" />
            Create new document
          </Link>
        </Button>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="p-6 lg:p-8 border-none shadow-float transition-all hover:shadow-float-lg">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Zap className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">AI Credits</span>
                </div>
                <span className="text-3xl font-bold text-zinc-900">{creditsRemaining}</span>
              </div>
              <Progress value={creditPct} className="h-2" />
              <p className="text-xs text-zinc-400 font-medium">{creditsRemaining} of {creditsTotal} remaining</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-6 lg:p-8 border-none shadow-float transition-all hover:shadow-float-lg">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <FileText className="h-4 w-4 text-zinc-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Documents</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900">{recentDocs.length}</p>
              <p className="text-xs text-zinc-400 font-medium">Across all types</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="p-6 lg:p-8 border-none shadow-float transition-all hover:shadow-float-lg h-full">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-600 uppercase tracking-wider">Active Plan</span>
                <Badge variant={subscription?.status === "active" ? "success" : "secondary"} className="h-6 px-3">
                  {subscription?.status === "active" ? "Active" : "Free"}
                </Badge>
              </div>
              {creditsRemaining === 0 ? (
                <Button asChild size="lg" className="w-full mt-2">
                  <Link href="/pricing">Upgrade now</Link>
                </Button>
              ) : (
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {subscription?.status === "active" ? "Premium features unlocked" : "5 free credits included"}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent documents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-none shadow-float overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-zinc-100">
            <CardTitle className="text-lg lg:text-xl font-bold">Recent documents</CardTitle>
            <Link href="/dashboard/documents" className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 group transition-colors">
              View all documents <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
                  <FileText className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="font-medium text-zinc-700 mb-1">No documents yet</p>
                <p className="text-sm text-zinc-400 mb-4">Create your first AI-powered career document in 60 seconds.</p>
                <Button asChild size="sm">
                  <Link href="/dashboard/documents/new">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create first document
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentDocs.map((doc) => {
                  const status = statusConfig[doc.generationStatus] ?? statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <Link
                      key={doc.id}
                      href={`/builder/${doc.id}`}
                      className="flex items-center justify-between px-8 py-5 hover:bg-zinc-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-5 min-w-0">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 text-base truncate group-hover:text-indigo-600 transition-colors mb-0.5">{doc.title}</p>
                          <p className="text-[13px] text-zinc-400 font-medium">{typeLabels[doc.type] ?? doc.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider", status.className)}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                        <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Application Tracker Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <ApplicationTracker applications={applications} />
      </motion.div>
    </div>
  );
}
