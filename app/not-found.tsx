import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-transit/10">
            <span className="text-5xl font-display font-bold text-transit">?</span>
          </span>
        </div>

        <h1 className="font-display text-6xl font-bold text-ink/20 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
          Page not found
        </h2>
        <p className="text-ink/60 mb-8">
          Looks like this bus route doesn't exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-transit px-6 py-3 text-sm font-semibold text-paper transition hover:bg-transit-dark"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-transit hover:bg-transit/5"
          >
            <Search className="h-4 w-4" />
            Search Routes
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-xs text-ink/40">
            Need help? Contact us at{" "}
            <a href="mailto:support@busundo.com" className="text-transit hover:underline">
              support@busundo.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
