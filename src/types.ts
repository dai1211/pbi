export type ScreenId = 'home' | 'select' | 'confirm' | 'success';

export type CongestionLevel = 'low' | 'medium' | 'high';

export interface CongestionInfo {
  level: CongestionLevel;
  label: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  iconClass: string;
  description: string;
  predictedOccupancyRate: number; // e.g. 35%
}

export interface BusStop {
  id: string;
  name: string;
  kana: string;
  category: 'station' | 'hospital' | 'convenience' | 'school' | 'park' | 'culture';
  tagLabel: string;
  iconClass: string;
  emoji: string;
  coords: { x: number; y: number }; // Percentage 0-100 on map
  address: string;
}

export interface MinibusTrip {
  id: string;
  busNumber: string; // e.g., "1号車 (みどり号)"
  departureTime: string; // e.g., "10:15"
  departureMinutesLeft: number; // relative minutes from current
  durationMinutes: number; // e.g., 12
  arrivalTime: string; // e.g., "10:27"
  congestion: CongestionLevel;
  availableSeats: number;
  totalSeats: number;
  isAiRecommended?: boolean;
  aiRecommendationReason?: string;
  driverName: string;
  routeColor: string;
  hasWheelchairSpace: boolean;
}

export interface ReservationData {
  reservationId: string;
  originStop: BusStop;
  destinationStop: BusStop;
  trip: MinibusTrip;
  adultCount: number;
  childCount: number;
  needsWheelchair: boolean;
  needsStroller: boolean;
  totalFare: number;
  bookedAt: string;
  status: 'active' | 'cancelled' | 'completed';
}

export interface MinibusPosition {
  id: string;
  name: string;
  latRatio: number; // 0 - 100 on map
  lngRatio: number; // 0 - 100 on map
  targetStopName: string;
  currentSegment: number; // segment index along route
  progress: number; // 0 to 1
  congestion: CongestionLevel;
  speedKmh: number;
  headingAngle: number;
}
