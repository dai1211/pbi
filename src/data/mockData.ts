import { BusStop, CongestionInfo, CongestionLevel, MinibusTrip } from '../types';

export const CONGESTION_CONFIG: Record<CongestionLevel, CongestionInfo> = {
  low: {
    level: 'low',
    label: '空いている',
    badgeBg: '#E7EFE8',
    textColor: '#1E472D',
    borderColor: '#B9D4BF',
    iconClass: 'fa-solid fa-face-smile',
    description: '座席に十分なゆとりがあります。ゆったり乗車できます。',
    predictedOccupancyRate: 30,
  },
  medium: {
    level: 'medium',
    label: 'やや混んでいる',
    badgeBg: '#FAF2E6',
    textColor: '#834C13',
    borderColor: '#E6C99E',
    iconClass: 'fa-solid fa-user-group',
    description: '適度な乗車率です。車いす・ベビーカーは乗務員がご案内します。',
    predictedOccupancyRate: 65,
  },
  high: {
    level: 'high',
    label: '満席に近い',
    badgeBg: '#FAECE9',
    textColor: '#91281F',
    borderColor: '#E7B4AF',
    iconClass: 'fa-solid fa-triangle-exclamation',
    description: '乗車人数が上限に近いため、次の便のご利用をおすすめします。',
    predictedOccupancyRate: 90,
  },
};

export const BUS_STOPS: BusStop[] = [
  {
    id: 'stop-park',
    name: '中央公園前',
    kana: 'ちゅうおうこうえんまえ',
    category: 'park',
    tagLabel: '公園',
    iconClass: 'fa-solid fa-tree',
    emoji: '🌲',
    coords: { x: 45, y: 55 },
    address: '緑が丘3-1 中央広場北口',
  },
  {
    id: 'stop-station',
    name: '緑が丘中央駅前',
    kana: 'みどりがおかちゅうおうえきまえ',
    category: 'station',
    tagLabel: '駅 🚉',
    iconClass: 'fa-solid fa-train',
    emoji: '🚉',
    coords: { x: 20, y: 22 },
    address: '駅前ロータリー 2番ミニバスのりば',
  },
  {
    id: 'stop-hospital',
    name: '市民総合医療センター',
    kana: 'しみんそうごういりょうせんたー',
    category: 'hospital',
    tagLabel: '病院 🏥',
    iconClass: 'fa-solid fa-hospital',
    emoji: '🏥',
    coords: { x: 78, y: 28 },
    address: '病院正面エントランス前',
  },
  {
    id: 'stop-convenience',
    name: 'セブンタウン桜町前',
    kana: 'せぶんたうんさくらちょうまえ',
    category: 'convenience',
    tagLabel: 'コンビニ 🏪',
    iconClass: 'fa-solid fa-store',
    emoji: '🏪',
    coords: { x: 75, y: 72 },
    address: '商業施設プラザ駐車場側',
  },
  {
    id: 'stop-school',
    name: '東部学園・小学校前',
    kana: 'とうぶがくえん・しょうがっこうまえ',
    category: 'school',
    tagLabel: '学校 🏫',
    iconClass: 'fa-solid fa-school',
    emoji: '🏫',
    coords: { x: 22, y: 78 },
    address: '学園前通り 正門バスベイ',
  },
  {
    id: 'stop-culture',
    name: '市民交流プラザ・図書館',
    kana: 'しみんこうりゅうぷらざ・としょかん',
    category: 'culture',
    tagLabel: '図書館 📚',
    iconClass: 'fa-solid fa-book-open',
    emoji: '📚',
    coords: { x: 50, y: 20 },
    address: '文化通り 総合案内棟前',
  },
];

export const MAP_ROUTE_WAYPOINTS = [
  { x: 20, y: 22 }, // 駅
  { x: 35, y: 21 },
  { x: 50, y: 20 }, // 図書館
  { x: 65, y: 22 },
  { x: 78, y: 28 }, // 病院
  { x: 80, y: 50 },
  { x: 75, y: 72 }, // コンビニ
  { x: 60, y: 76 },
  { x: 45, y: 55 }, // 中央公園
  { x: 32, y: 65 },
  { x: 22, y: 78 }, // 学校
  { x: 18, y: 50 },
  { x: 20, y: 22 }, // ループ
];

export function getMockTripsForDestination(origin: BusStop, destination: BusStop): MinibusTrip[] {
  const now = new Date();
  
  // Format helper
  const formatTime = (minutesToAdd: number) => {
    const target = new Date(now.getTime() + minutesToAdd * 60000);
    const h = target.getHours().toString().padStart(2, '0');
    const m = target.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return [
    {
      id: 'trip-101',
      busNumber: '1号車 (みどり号)',
      departureTime: formatTime(5),
      departureMinutesLeft: 5,
      durationMinutes: 12,
      arrivalTime: formatTime(17),
      congestion: 'low',
      availableSeats: 9,
      totalSeats: 12,
      isAiRecommended: true,
      aiRecommendationReason: 'AI予測：現在混雑度が最も低く、お座席に十分な余裕があります。待ち時間も最短です。',
      driverName: '佐藤 健一（優良運転手）',
      routeColor: '#2E7D32',
      hasWheelchairSpace: true,
    },
    {
      id: 'trip-102',
      busNumber: '2号車 (さくら号)',
      departureTime: formatTime(20),
      departureMinutesLeft: 20,
      durationMinutes: 10,
      arrivalTime: formatTime(30),
      congestion: 'medium',
      availableSeats: 4,
      totalSeats: 12,
      isAiRecommended: false,
      aiRecommendationReason: 'AI予測：駅周辺の電車到着時刻と重なるため、中盤でやや乗客が増加する見込みです。',
      driverName: '高橋 美咲',
      routeColor: '#E91E63',
      hasWheelchairSpace: true,
    },
    {
      id: 'trip-103',
      busNumber: '3号車 (やまぶき号)',
      departureTime: formatTime(35),
      departureMinutesLeft: 35,
      durationMinutes: 12,
      arrivalTime: formatTime(47),
      congestion: 'low',
      availableSeats: 10,
      totalSeats: 12,
      isAiRecommended: false,
      aiRecommendationReason: 'AI予測：通学ピーク終了後のため、快適にご乗車いただけます。',
      driverName: '小林 宏',
      routeColor: '#F57C00',
      hasWheelchairSpace: true,
    },
  ];
}

export const FARE_CONFIG = {
  adult: 200, // 大人 200円
  child: 100, // 小学生 100円
  infant: 0,  // 幼児 無料
  seniorDiscountApplied: false,
};
