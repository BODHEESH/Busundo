import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-transit">
        <span className="h-2 w-2 rounded-full bg-signal" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        BusUndo
      </span>
    </Link>
  );
}

export function TopNav({
  back,
  title,
}: {
  back?: { href: string; label: string };
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {back ? (
          <Link
            href={back.href}
            className="flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        ) : (
          <Logo />
        )}
        {title && (
          <span className="font-display text-sm font-semibold text-ink/80">
            {title}
          </span>
        )}
        <Link
          href="/profile"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-transit font-display text-sm font-bold text-paper",
            back ? "" : ""
          )}
        >
          A
        </Link>
      </div>
    </header>
  );
}
