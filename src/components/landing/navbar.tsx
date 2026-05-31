"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Frontline</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard/operations"
              className="text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
            >
              Try Demo
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Start Pilot</Button>
              </Link>
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-gray-100 bg-white transition-all",
          open ? "block" : "hidden"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          <Link
            href="#features"
            className="text-sm text-gray-600"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-gray-600"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard/operations"
            className="text-sm font-medium text-brand-700"
            onClick={() => setOpen(false)}
          >
            Try Demo
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="w-full">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="w-full">
              Start Pilot
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
