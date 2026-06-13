import { Stop } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RouteLine({
  stops,
  currentIndex,
}: {
  stops: Stop[];
  currentIndex?: number;
}) {
  return (
    <ol className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />
      {stops.map((stop, i) => {
        const isCurrent = currentIndex === i;
        const isPast = currentIndex !== undefined && i < currentIndex;
        return (
          <li key={stop.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
            <span
              className={cn(
                "relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2",
                isCurrent
                  ? "border-signal bg-signal-soft"
                  : isPast
                  ? "border-transit bg-transit"
                  : "border-line bg-paper"
              )}
            >
              {isCurrent && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-40" />
              )}
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isCurrent ? "bg-signal" : isPast ? "bg-paper" : "bg-line"
                )}
              />
            </span>
            <div className="flex w-full items-baseline justify-between gap-3">
              <span
                className={cn(
                  "text-sm",
                  isCurrent
                    ? "font-semibold text-ink"
                    : isPast
                    ? "text-ink/50"
                    : "text-ink/80"
                )}
              >
                {stop.name}
                {isCurrent && (
                  <span className="ml-2 rounded-full bg-signal-soft px-2 py-0.5 text-[11px] font-semibold text-signal">
                    Now here
                  </span>
                )}
              </span>
              <span className="tabular text-xs text-ink/40">{stop.time}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
