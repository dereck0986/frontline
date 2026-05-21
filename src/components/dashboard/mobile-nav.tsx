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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/leads", label: "Leads", icon: Users, exact: false },
  { href: "/dashboard/intake", label: "Lead Intake", icon: ClipboardPlus, exact: false },
  { href: "/dashboard/lead-records", label: "Lead Records", icon: Users, exact: false },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessagesSquare, exact: false },
  { href: "/dashboard/automations", label: "Automations", icon: Workflow, exact: false },
  { href: "/dashboard/templates", label: "Templates", icon: FileText, exact: false },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

interface MobileNavProps {
  userEmail: string;
  businessName: string;
}

export function MobileNav({ businessName }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <div className="min-w-0">
            <span className="block text-white font-semibold text-sm truncate">Frontline</span>
            <span className="block text-gray-400 text-xs truncate">{businessName}</span>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 text-gray-400 hover:text-white"
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="bg-gray-900 border-b border-gray-800 px-3 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
