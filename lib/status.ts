import { TravelStatus } from "./types";

export const STATUS_META: Record<
  TravelStatus,
  { label: string; dot: string; chip: string }
> = {
  waiting: {
    label: "Waiting",
    dot: "bg-muted",
    chip: "bg-line text-ink/70",
  },
  reached_stop: {
    label: "Reached stop",
    dot: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700",
  },
  boarded: {
    label: "Boarded bus",
    dot: "bg-transit",
    chip: "bg-transit/10 text-transit-dark",
  },
  delayed: {
    label: "Delayed",
    dot: "bg-signal",
    chip: "bg-signal-soft text-signal",
  },
  completed: {
    label: "Journey completed",
    dot: "bg-ink/40",
    chip: "bg-ink/5 text-ink/50",
  },
};

export const STATUS_ORDER: TravelStatus[] = [
  "waiting",
  "reached_stop",
  "boarded",
  "delayed",
  "completed",
];
