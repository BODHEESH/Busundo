export const TRAVEL_STATUS = {
  WAITING: 'waiting',
  REACHED_STOP: 'reached_stop',
  BOARDED: 'boarded',
  DELAYED: 'delayed',
  COMPLETED: 'completed',
} as const

export const GROUP_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const REPORT_TYPE = {
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
  FULL: 'full',
  OTHER: 'other',
} as const

export const KERALA_CITIES = [
  'Thiruvananthapuram',
  'Kochi',
  'Kozhikode',
  'Thrissur',
  'Kollam',
  'Palakkad',
  'Alappuzha',
  'Kannur',
  'Kottayam',
  'Malappuram',
  'Ernakulam',
  'Aluva',
  'Kakkanad',
  'Palarivattom',
  'Edapally',
]

export const COLLEGES = [
  'MEC',
  'CUSAT',
  'CET',
  'Rajagiri',
  'FISAT',
  'TKM',
  'GEC',
  'Other',
]
