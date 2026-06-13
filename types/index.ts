export type TravelStatus =
  | "waiting"
  | "reached_stop"
  | "boarded"
  | "delayed"
  | "completed";

export interface Stop {
  id: string;
  name: string;
  time: string;
}

export interface RouteInfo {
  id: string;
  code: string;
  source: string;
  destination: string;
  duration: string;
  distance: string;
  stops: Stop[];
}

export interface Member {
  id: string;
  name: string;
  initial: string;
  status: TravelStatus;
  isYou?: boolean;
}

export interface TravelGroup {
  id: string;
  routeId: string;
  label: string;
  departureTime: string;
  capacity: number;
  currentStopIndex: number;
  college?: string;
  members: Member[];
}

export interface HistoryEntry {
  id: string;
  routeLabel: string;
  date: string;
  status: TravelStatus;
}
