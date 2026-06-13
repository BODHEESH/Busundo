import { RouteInfo, TravelGroup, HistoryEntry } from "./types";

export const mockRoutes: RouteInfo[] = [
  {
    id: "r1",
    code: "KL-07 / 412",
    source: "Aluva",
    destination: "Kakkanad (Infopark)",
    duration: "45 min",
    distance: "18 km",
    stops: [
      { id: "s1", name: "Aluva Metro Station", time: "8:05 AM" },
      { id: "s2", name: "Kalamassery", time: "8:18 AM" },
      { id: "s3", name: "CUSAT Gate", time: "8:30 AM" },
      { id: "s4", name: "Infopark Gate 1", time: "8:45 AM" },
      { id: "s5", name: "Kakkanad SBI", time: "8:50 AM" },
    ],
  },
  {
    id: "r2",
    code: "KL-07 / 219",
    source: "Edappally",
    destination: "Vyttila Hub",
    duration: "25 min",
    distance: "9 km",
    stops: [
      { id: "s6", name: "Edappally Toll", time: "9:00 AM" },
      { id: "s7", name: "Palarivattom", time: "9:08 AM" },
      { id: "s8", name: "Kadavanthra", time: "9:18 AM" },
      { id: "s9", name: "Vyttila Mobility Hub", time: "9:25 AM" },
    ],
  },
];

export const mockGroups: TravelGroup[] = [
  {
    id: "g1",
    routeId: "r1",
    label: "Aluva → Kakkanad",
    departureTime: "8:30 AM",
    capacity: 6,
    currentStopIndex: 1,
    college: "Rajagiri SOET",
    members: [
      { id: "m1", name: "Aathira Menon", initial: "A", status: "boarded", isYou: true },
      { id: "m2", name: "Nikhil Raj", initial: "N", status: "boarded" },
      { id: "m3", name: "Sneha Pillai", initial: "S", status: "reached_stop" },
      { id: "m4", name: "Vivek S", initial: "V", status: "waiting" },
    ],
  },
  {
    id: "g2",
    routeId: "r1",
    label: "Aluva → Kakkanad",
    departureTime: "9:00 AM",
    capacity: 4,
    currentStopIndex: 0,
    college: "Open to all",
    members: [
      { id: "m5", name: "Dev Krishna", initial: "D", status: "waiting" },
      { id: "m6", name: "Anjali T", initial: "A", status: "waiting" },
    ],
  },
  {
    id: "g3",
    routeId: "r2",
    label: "Edappally → Vyttila",
    departureTime: "9:15 AM",
    capacity: 5,
    currentStopIndex: 0,
    college: "Open to all",
    members: [
      { id: "m7", name: "Rahul M", initial: "R", status: "waiting" },
      { id: "m8", name: "Fathima K", initial: "F", status: "waiting" },
      { id: "m9", name: "Joel Thomas", initial: "J", status: "waiting" },
    ],
  },
];

export const mockHistory: HistoryEntry[] = [
  { id: "h1", routeLabel: "Aluva → Kakkanad · 8:30 AM", date: "Today", status: "boarded" },
  { id: "h2", routeLabel: "Kakkanad → Aluva · 5:45 PM", date: "Yesterday", status: "completed" },
  { id: "h3", routeLabel: "Aluva → Kakkanad · 8:30 AM", date: "Yesterday", status: "completed" },
  { id: "h4", routeLabel: "Edappally → Vyttila · 9:15 AM", date: "Mon, 9 Jun", status: "completed" },
];

export const currentUser = {
  name: "Aathira Menon",
  email: "aathira.menon@rajagiritech.edu.in",
  college: "Rajagiri School of Engineering & Technology",
  initial: "A",
  favoriteRouteIds: ["r1", "r2"],
};
