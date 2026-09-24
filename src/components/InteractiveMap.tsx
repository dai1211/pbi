import React, { useEffect, useState, useRef } from 'react';
import { BusStop, CongestionLevel, MinibusPosition } from '../types';
import { BUS_STOPS, CONGESTION_CONFIG, MAP_ROUTE_WAYPOINTS } from '../data/mockData';

interface InteractiveMapProps {
  selectedStop?: BusStop;
  onSelectStop?: (stop: BusStop) => void;
  onSelectDestination?: (stop: BusStop) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedStop,
  onSelectStop,
  onSelectDestination,
}) => {
  // Bus movement simulation states
  const [buses, setBuses] = useState<MinibusPosition[]>([
    {
      id: 'bus-1',
      name: '1号車 (みどり号)',
      latRatio: 36,
      lngRatio: 60,
      targetStopName: '中央公園前 (次停)',
      currentSegment: 7,
      progress: 0.65,
      congestion: 'low',
      speedKmh: 24,
      headingAngle: 305,
    },
    {
      id: 'bus-2',
      name: '2号車 (さくら号)',
      latRatio: 65,
      lngRatio: 24,
      targetStopName: '市民総合医療センター',
      currentSegment: 3,
      progress: 0.2,
      congestion: 'medium',
      speedKmh: 20,
      headingAngle: 85,
    },
  ]);

  const [activeBusId, setActiveBusId] = useState<string | null>('bus-1');
  const [isSimSpeedFast, setIsSimSpeedFast] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Animate buses smoothly along waypoints
  useEffect(() => {
    const waypoints = MAP_ROUTE_WAYPOINTS;
    const numSegments = waypoints.length - 1;

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const speedFactor = isSimSpeedFast ? 0.04 : 0.012;
          let newProgress = bus.progress + speedFactor;
          let newSegment = bus.currentSegment;

          if (newProgress >= 1) {
            newProgress = 0;
            newSegment = (newSegment + 1) % numSegments;
          }

          const p1 = waypoints[newSegment];
          const p2 = waypoints[(newSegment + 1) % waypoints.length];

          const currentX = p1.x + (p2.x - p1.x) * newProgress;
          const currentY = p1.y + (p2.y - p1.y) * newProgress;

          // Calculate approximate angle
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          // Determine next stop
          let targetStop = bus.targetStopName;
          if (newSegment === 7 || newSegment === 8) {
            targetStop = '中央公園前 (接近中)';
          } else if (newSegment >= 3 && newSegment <= 5) {
            targetStop = '市民病院前';
          } else if (newSegment >= 0 && newSegment <= 2) {
            targetStop = '緑が丘中央駅前';
          } else {
            targetStop = 'さくら町前';
          }

          return {
            ...bus,
            latRatio: currentX,
            lngRatio: currentY,
            currentSegment: newSegment,
            progress: newProgress,
            targetStopName: targetStop,
            headingAngle: angle,
          };
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isSimSpeedFast]);

  // Convert waypoints to SVG path
  const svgPathString = MAP_ROUTE_WAYPOINTS.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x * 6} ${pt.y * 4.5}`,
    ''
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#CCD8CE] shadow-sm bg-[#EFF5F0]">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D4E0D6] shadow-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#48825C] animate-ping"></span>
          <span className="text-xs font-bold text-[#214730]">
            AIリアルタイム運行マップ
          </span>
          <span className="text-[10px] text-[#637568] bg-[#EEF3EF] px-1.5 py-0.5 rounded font-mono border border-[#DEE7E0]">
            GPS同期中
          </span>
        </div>

        {/* Speed toggle & Bus Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSimSpeedFast(!isSimSpeedFast)}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors shadow-sm ${
              isSimSpeedFast
                ? 'bg-[#D97736] text-white border-[#C46322]'
                : 'bg-white/95 text-[#2C3E30] hover:bg-white border-[#D2DDD4]'
            }`}
            title="ミニバスのシミュレーション移動速度を切り替えます"
          >
            <i className="fa-solid fa-gauge-high mr-1"></i>
            {isSimSpeedFast ? '倍速中' : '通常速度'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="w-full h-80 sm:h-96 relative select-none overflow-hidden">
        {/* Background Grid & Geographical Accents */}
        <svg
          viewBox="0 0 600 450"
          className="w-full h-full object-cover"
          style={{ backgroundColor: '#EFF5F0' }}
        >
          {/* Subtle Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DCE7DD" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#244B34" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#457D59" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#244B34" stopOpacity="0.85" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#1E3827" floodOpacity="0.2" />
            </filter>
          </defs>
          <rect width="600" height="450" fill="url(#grid)" />

          {/* Green Park Zones */}
          <circle cx="270" cy="245" r="75" fill="#D9E8D9" opacity="0.9" />
          <text x="270" y="270" textAnchor="middle" fill="#2A543A" fontSize="12" fontWeight="bold" opacity="0.7">
            🌳 中央森林公園 🌳
          </text>
          
          <rect x="390" y="70" width="160" height="90" rx="16" fill="#E2ECE3" opacity="0.9" />
          <text x="470" y="125" textAnchor="middle" fill="#2A543A" fontSize="11" fontWeight="bold" opacity="0.7">
            🏥 医療福祉ゾーン
          </text>

          {/* River / Water Stream */}
          <path
            d="M 0 320 Q 150 300 250 350 T 450 330 T 600 370"
            fill="none"
            stroke="#CFE2D3"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 0 320 Q 150 300 250 350 T 450 330 T 600 370"
            fill="none"
            stroke="#B6D6BE"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.85"
          />
          <text x="50" y="325" fill="#245E3B" fontSize="10" fontWeight="bold" opacity="0.6">
            緑川
          </text>

          {/* Secondary Roads */}
          <path d="M 0 100 L 600 100" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.95" />
          <path d="M 120 0 L 120 450" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.95" />
          <path d="M 450 0 L 450 450" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.95" />
          <path d="M 0 350 L 600 350" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity="0.95" />

          {/* Bus Route Glow Background */}
          <path
            d={svgPathString}
            fill="none"
            stroke="#CBE0CE"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bus Route Main Track */}
          <path
            d={svgPathString}
            fill="none"
            stroke="url(#routeGlow)"
            strokeWidth="5"
            strokeDasharray="8 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bus Stops Pins */}
          {BUS_STOPS.map((stop) => {
            const isOrigin = stop.id === 'stop-park';
            const cx = stop.coords.x * 6;
            const cy = stop.coords.y * 4.5;

            return (
              <g
                key={stop.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => {
                  onSelectStop?.(stop);
                  if (!isOrigin) {
                    onSelectDestination?.(stop);
                  }
                }}
              >
                {/* Ping ring for current location */}
                {isOrigin && (
                  <circle cx={cx} cy={cy} r="22" fill="#2E583F" opacity="0.22" className="animate-pulse" />
                )}

                {/* Stop Base Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isOrigin ? 15 : 12}
                  fill={isOrigin ? '#214730' : '#FFFFFF'}
                  stroke={isOrigin ? '#D97736' : '#336145'}
                  strokeWidth={isOrigin ? 3 : 2.5}
                  filter="url(#shadow)"
                />

                {/* Inner symbol */}
                {isOrigin ? (
                  <circle cx={cx} cy={cy} r="5" fill="#E5B074" />
                ) : (
                  <circle cx={cx} cy={cy} r="4" fill="#336145" />
                )}

                {/* Stop Label Banner */}
                <rect
                  x={cx - 52}
                  y={cy + (isOrigin ? 18 : 15)}
                  width="104"
                  height="22"
                  rx="6"
                  fill={isOrigin ? '#214730' : '#FFFFFF'}
                  stroke={isOrigin ? '#D97736' : '#D1DFD4'}
                  strokeWidth="1.5"
                  filter="url(#shadow)"
                />
                <text
                  x={cx}
                  y={cy + (isOrigin ? 33 : 30)}
                  textAnchor="middle"
                  fill={isOrigin ? '#FFFFFF' : '#214730'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {isOrigin ? `★ ${stop.name}` : stop.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic HTML Moving Minibuses with Floating Congestion Badges */}
        {buses.map((bus) => {
          const cong = CONGESTION_CONFIG[bus.congestion];
          const isPrimary = bus.id === 'bus-1';

          return (
            <div
              key={bus.id}
              className="absolute z-20 transition-all duration-200 pointer-events-auto cursor-pointer"
              style={{
                left: `${bus.latRatio}%`,
                top: `${bus.lngRatio}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setActiveBusId(bus.id)}
            >
              {/* Floating Congestion Badge (Explicitly requested in prompt!) */}
              <div
                className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full shadow-md border text-xs font-black flex items-center gap-1.5 animate-bounce"
                style={{
                  backgroundColor: cong.badgeBg,
                  color: cong.textColor,
                  borderColor: cong.borderColor,
                }}
              >
                <i className={cong.iconClass}></i>
                <span>{bus.name.split(' ')[0]}: {cong.label}</span>
              </div>

              {/* Minibus Marker Icon */}
              <div className="relative group">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border-2 transition-transform duration-300 ${
                    isPrimary
                      ? 'bg-[#214730] border-[#E5B074] text-[#E5B074] ring-4 ring-[#457D58]/30'
                      : 'bg-[#9A583A] border-white text-white'
                  }`}
                >
                  <i className="fa-solid fa-van-shuttle text-lg"></i>
                </div>

                {/* Approaching beacon ripple */}
                {isPrimary && (
                  <span className="absolute -inset-1 rounded-2xl bg-[#457D58] opacity-40 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Footer Intelligence Info */}
      <div className="p-3 bg-white/95 border-t border-[#DDE4DC] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#28372D]">
          <span className="px-2 py-0.5 rounded bg-[#EAF1EC] text-[#244B34] font-bold text-[11px] flex items-center gap-1 border border-[#D4DFD6]">
            <i className="fa-solid fa-sparkles text-[#D97736]"></i>
            AI予測稼働中
          </span>
          <span className="text-[#5C6F61] font-medium">
            現在、道路渋滞なし・平常運行中（中央公園前まで 1号車が約4分で到着）
          </span>
        </div>

        {/* Legend for senior/citizens */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-[#4B5E50] ml-auto">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B6B4C]"></span>
            空き
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97736]"></span>
            やや混雑
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8473B]"></span>
            満席
          </span>
        </div>
      </div>
    </div>
  );
};
