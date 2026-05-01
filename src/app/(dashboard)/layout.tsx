import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles, LayoutDashboard, FileText, User, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/documents", icon: FileText, label: "Documents" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-zinc-200 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
        <div className="flex h-16 items-center gap-3 border-b border-zinc-100 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-black text-zinc-900 text-[15px] tracking-tight">
              CVLetter<span className="text-emerald-500">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-zinc-600 transition-all hover:bg-zinc-50 hover:text-emerald-600 group"
              )}
            >
              <item.icon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-100 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50/80 p-2.5 border border-zinc-100/50">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9 rounded-lg shadow-sm",
                  userButtonTrigger: "p-0"
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-zinc-900 truncate leading-none mb-1">Account Settings</p>
              <p className="text-[10px] text-zinc-400 truncate uppercase tracking-widest font-bold">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-zinc-900 text-sm tracking-tight">
              CVLetter<span className="text-emerald-500">AI</span>
            </span>
          </Link>
          <UserButton />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
