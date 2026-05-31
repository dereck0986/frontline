import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span className="text-white font-semibold">Frontline</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="#features" className="hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard/operations" className="hover:text-white transition-colors">
                Try Demo
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                Sign up
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-xs md:flex-row">
            <p>© {new Date().getFullYear()} Frontline. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
