"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardPlus,
  MessagesSquare,
  Workflow,
  FileText,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/leads", label: "Leads", icon: Users, exact: false },
  { href: "/dashboard/lead-intake", label: "Lead Intake", icon: ClipboardPlus, exact: false },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessagesSquare, exact: false },
  { href: "/dashboard/automations", label: "Automations", icon: Workflow, exact: false },
  { href: "/dashboard/templates", label: "Templates", icon: FileText, exact: false },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

interface SidebarProps {
  userEmail: string;
  businessName: string;
}

export function Sidebar({ userEmail, businessName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 min-h-screen">
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-bold text-lg">Frontline</span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Business</p>
        <p className="text-sm font-medium text-white truncate">{businessName}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
