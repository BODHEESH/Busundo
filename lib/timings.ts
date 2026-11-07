/**
 * Departure timings for routes.
 *
 * Input format (one per line):
 *   08:30            -> every day
 *   07:15 weekday    -> Monday to Friday
 *   09:00 sunday     -> Sundays only
 *
 * Times are the departure time at the route's first (origin) stop, in IST.
 */

export type DayType = "daily" | "weekday" | "sunday";

export interface Timing {
  time: string; // "HH:MM" (24-hour)
  days: DayType;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAY_TYPES: DayType[] = ["daily", "weekday", "sunday"];

export function parseTimingLines(text: string): { timings: Timing[]; errors: string[] } {
  const timings: Timing[] = [];
  const errors: string[] = [];

  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line, index) => {
      const [time, dayRaw = "daily"] = line.split(/\s+/);
      const days = dayRaw.toLowerCase() as DayType;

      if (!TIME_RE.test(time)) {
        errors.push(`Line ${index + 1} ("${line}"): time must look like 08:30`);
      } else if (!DAY_TYPES.includes(days)) {
        errors.push(`Line ${index + 1} ("${line}"): day must be daily, weekday or sunday`);
      } else {
        timings.push({ time, days });
      }
    });

  return { timings, errors };
}

export function formatTimingLines(timings: Timing[] | undefined): string {
  return (timings || []).map((t) => `${t.time} ${t.days}`).join("\n");
}

// India has no daylight saving time, so a fixed offset is correct.
const IST_OFFSET_MINUTES = 330;

function istClock(now: Date) {
  const ist = new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000);
  return {
    minutes: ist.getUTCHours() * 60 + ist.getUTCMinutes(),
    weekday: ist.getUTCDay(), // 0 = Sunday
  };
}

function appliesOn(days: DayType, weekday: number): boolean {
  if (days === "daily") return true;
  if (days === "sunday") return weekday === 0;
  return weekday >= 1 && weekday <= 5; // weekday
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Next departures from the origin stop today (IST), soonest first. */
export function upcomingDepartures(
  timings: Timing[] | undefined,
  now: Date = new Date(),
  limit = 3
): string[] {
  if (!timings?.length) return [];
  const { minutes, weekday } = istClock(now);

  return timings
    .filter((t) => appliesOn(t.days, weekday))
    .map((t) => ({ time: t.time, at: toMinutes(t.time) }))
    .filter((t) => t.at >= minutes)
    .sort((a, b) => a.at - b.at)
    .slice(0, limit)
    .map((t) => t.time);
}
