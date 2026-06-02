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
  MessageSquareReply,
  CalendarDays,
  ClipboardList,
  Command,
  BellRing,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/operations", label: "Operations Inbox", icon: Command, exact: false },
  { href: "/dashboard/notifications", label: "Notifications", icon: BellRing, exact: false, showBadge: true },
  { href: "/dashboard/intake", label: "Lead Intake", icon: ClipboardPlus, exact: false },
  { href: "/dashboard/lead-records", label: "Lead Records", icon: Users, exact: false },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquareReply, exact: false },
  { href: "/dashboard/scheduling", label: "Scheduling", icon: CalendarDays, exact: false },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList, exact: false },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessagesSquare, exact: false },
  { href: "/dashboard/automations", label: "Automations", icon: Workflow, exact: false },
  { href: "/dashboard/templates", label: "Templates", icon: FileText, exact: false },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

interface SidebarProps {
  userEmail: string;
  businessName: string;
  unreadNotificationCount?: number;
}

export function Sidebar({ userEmail, businessName, unreadNotificationCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 min-h-screen">
      <div className="px-6 py-5 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-bold text-lg">Frontline</span>
        </Link>
      </div>

      <div className="px-6 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Business</p>
        <p className="text-sm font-medium text-white truncate">{businessName}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const badgeCount = item.showBadge ? unreadNotificationCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-brand-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
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
