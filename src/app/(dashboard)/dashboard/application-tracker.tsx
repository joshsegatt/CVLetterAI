"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  Search,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobApplication } from "@/db/schema";

interface Props {
  applications: JobApplication[];
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  saved:        { label: "Saved",        color: "bg-zinc-100 text-zinc-600",    icon: Clock },
  applied:      { label: "Applied",      color: "bg-indigo-50 text-indigo-700", icon: SendIcon },
  interviewing: { label: "Interviewing", color: "bg-amber-50 text-amber-700",   icon: Search },
  offered:      { label: "Offered",      color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  rejected:     { label: "Rejected",     color: "bg-red-50 text-red-700",       icon: Clock },
};

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export function ApplicationTracker({ applications }: Props) {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 px-8 py-6 bg-zinc-50/30">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2.5">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Executive Tracker
          </CardTitle>
          <p className="text-[13px] text-zinc-500 font-medium mt-1">Manage your elite career opportunities</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all">
             <Plus className="h-3.5 w-3.5 mr-1.5" /> Add New Job
           </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {applications.length === 0 ? (
          <div className="py-24 text-center px-8">
            <div className="h-20 w-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl shadow-indigo-100">
              <Briefcase className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-zinc-900 text-lg font-bold mb-2">Track your applications</h3>
            <p className="text-zinc-500 text-[13px] max-w-[280px] mx-auto leading-relaxed">
              Start tracking your applications to see insights and stay organized during your job hunt.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {applications.map((app, index) => {
              const status = statusMap[app.status] || statusMap.saved;
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={app.id}
                  className="group flex items-center justify-between px-8 py-5 hover:bg-zinc-50/80 transition-all cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                      <Building2 className="h-6 w-6 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h4 className="text-[15px] font-bold text-zinc-900 truncate tracking-tight">{app.companyName}</h4>
                        {app.url && <ExternalLink className="h-3.5 w-3.5 text-zinc-300 hover:text-indigo-500 transition-colors" />}
                      </div>
                      <p className="text-[13px] text-zinc-500 font-medium truncate">{app.jobTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="hidden sm:flex flex-col items-end gap-1.5">
                      <Badge className={cn("text-[10px] px-2.5 py-0.5 h-6 font-bold uppercase tracking-wider whitespace-nowrap", status.color)}>
                        <StatusIcon className="h-3 w-3 mr-1.5" />
                        {status.label}
                      </Badge>
                      <p className="text-[11px] text-zinc-400 font-medium flex items-center whitespace-nowrap">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Saved"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 transition-all">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
