import React, { useState, useEffect } from 'react';
import { BusStop } from '../types';
import { BUS_STOPS } from '../data/mockData';
import { InteractiveMap } from './InteractiveMap';

interface HomeScreenProps {
  originStop: BusStop;
  selectedDestination: BusStop;
  onSelectDestination: (dest: BusStop) => void;
  onProceedToBooking: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  originStop,
  selectedDestination,
  onSelectDestination,
  onProceedToBooking,
  fontSizeMode,
}) => {
  // Real-time Countdown timer for next bus (e.g. 4 minutes 18 seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(258); // 4m 18s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 300; // loop back to 5 mins
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Quick search category stops
  const quickCategories = [
    { label: '駅 🚉', category: 'station', desc: '緑が丘中央駅' },
    { label: 'コンビニ 🏪', category: 'convenience', desc: 'セブンタウン桜町' },
    { label: '病院 🏥', category: 'hospital', desc: '市民総合医療センター' },
    { label: '学校 🏫', category: 'school', desc: '東部学園小学校' },
  ];

  const handleQuickTagClick = (category: string) => {
    const matched = BUS_STOPS.find((s) => s.category === category);
    if (matched) {
      onSelectDestination(matched);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10">
      {/* 1. Location & Quick Search Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(30,45,34,0.04)] border border-[#DCE4DC]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EBEFEA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EDF4EE] text-[#244B34] flex items-center justify-center text-xl shadow-sm border border-[#CCDCCF]">
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#2E5A3E] uppercase tracking-wide flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#48825C] animate-pulse" />
                あなたの現在地（乗車地）
              </span>
              <h2 className="text-xl font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
                {originStop.name}
              </h2>
            </div>
          </div>

          {/* Destination Selector / Status */}
          <div className="flex items-center gap-2 bg-[#F4F7F3] px-3.5 py-2 rounded-xl border border-[#D4DFD6]">
            <span className="text-xs text-[#5C6F61] font-medium">目的地:</span>
            <span className="text-sm font-bold text-[#244B34] flex items-center gap-1">
              <span>{selectedDestination.emoji}</span>
              <span>{selectedDestination.name}</span>
            </span>
          </div>
        </div>

        {/* 生活拠点クイック検索バー (Prompt requirement: 駅 🚉 / コンビニ 🏪 / 病院 🏥 / 学校 🏫) */}
        <div className="pt-3">
          <label className="block text-xs font-extrabold text-[#334437] mb-2">
            生活拠点クイック選択（行きたい場所をワンタップ）：
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {quickCategories.map((item) => {
              const matchedStop = BUS_STOPS.find((s) => s.category === item.category);
              const isSelected = selectedDestination.category === item.category;

              return (
                <button
                  key={item.category}
                  id={`quick-search-${item.category}`}
                  type="button"
                  onClick={() => handleQuickTagClick(item.category)}
                  className={`px-3 py-3 rounded-xl font-bold text-center flex flex-col items-center justify-center gap-1 transition-all border-2 text-sm active:scale-95 shadow-sm min-h-[56px] ${
                    isSelected
                      ? 'bg-[#EDF4EE] border-[#3B6C4D] text-[#1F412D] ring-2 ring-[#3B6C4D]/25'
                      : 'bg-[#FCFDFB] hover:bg-[#F5F8F5] border-[#DCE4DC] text-[#28372D]'
                  }`}
                >
                  <span className="text-base sm:text-lg font-black">{item.label}</span>
                  <span className="text-[11px] text-[#637568] font-normal">
                    {matchedStop?.name.slice(0, 7)}...
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Interactive Map Area */}
      <section>
        <InteractiveMap
          selectedStop={selectedDestination}
          onSelectDestination={onSelectDestination}
        />
      </section>

      {/* 3. 下部スライド情報パネル (Prompt requirement) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_14px_rgba(30,45,34,0.06)] border border-[#DCE4DC] relative overflow-hidden">
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#244B34] via-[#D97736] to-[#244B34]" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: Nearest stop and AI Prediction */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#EAF1EC] text-[#244B34] text-xs font-black">
                最寄り停留所
              </span>
              <span className="text-xs text-[#637568] font-bold">
                {originStop.address}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1E2B22] tracking-tight font-['Zen_Maru_Gothic',sans-serif]">
                {originStop.name}
              </h3>
              <span className="text-xs bg-[#F2F5F2] text-[#415045] px-2 py-0.5 rounded font-medium border border-[#DEE5DF]">
                のりば：公園北口
              </span>
            </div>

            {/* AI predicted arrival countdown */}
            <div className="bg-[#EEF5EF] p-3.5 rounded-xl border border-[#CFE0D2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white text-[#244B34] flex items-center justify-center text-lg shadow-sm border border-[#BFD5C3]">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1C3B26] block">
                    AI予測：1号車（みどり号）接近中
                  </span>
                  <span className="text-xs text-[#3E5C47]">
                    現在の混雑度: <strong className="text-[#214D32] font-black">空いている 🟢</strong>
                  </span>
                </div>
              </div>

              {/* Big Countdown display */}
              <div className="text-right">
                <span className="text-xs text-[#2A4833] font-bold block">次のバスまで あと</span>
                <div className="text-2xl sm:text-3xl font-black text-[#214730] font-mono tracking-tight">
                  {minutes}<span className="text-sm font-sans font-bold ml-0.5">分</span>
                  {seconds.toString().padStart(2, '0')}<span className="text-sm font-sans font-bold ml-0.5">秒</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Big Accent Reservation Button (Prompt: 暖かみのあるオレンジ #D97736 / #C36322) */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <button
              id="start-reservation-button"
              type="button"
              onClick={onProceedToBooking}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D97736] to-[#C36322] hover:from-[#C86A2B] hover:to-[#B2571A] text-white font-black text-lg sm:text-xl shadow-[0_4px_16px_rgba(195,99,34,0.25)] hover:shadow-[0_6px_20px_rgba(195,99,34,0.3)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 border border-[#E9A46F]"
            >
              <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white">
                <i className="fa-solid fa-ticket"></i>
              </div>
              <span>今すぐ乗車予約する</span>
              <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>

            <p className="text-center text-xs text-[#637568] mt-2 font-medium flex items-center justify-center gap-1">
              <i className="fa-solid fa-circle-check text-[#3B6C4D]"></i>
              <span>会員登録不要・予約後すぐにQRコードが発行されます</span>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Citizen Community Advisory Banner */}
      <section className="bg-gradient-to-r from-[#EEF5EF] to-[#F5F8F3] p-4 rounded-xl border border-[#D8E4D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#214530]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2D5A3F] text-white flex items-center justify-center text-sm">
            <i className="fa-solid fa-wheelchair"></i>
          </div>
          <div>
            <span className="font-black block text-sm text-[#1E2B22]">バリアフリー＆福祉運行対応</span>
            <span className="text-[#5C6F61] font-medium">
              全便ノンステップ・車いす用スロープ完備。予約時に優先乗車を設定できます。
            </span>
          </div>
        </div>
        <div className="text-right whitespace-nowrap">
          <span className="inline-block bg-white text-[#244B34] px-3 py-1 rounded-full font-bold border border-[#CFDFD1] shadow-sm">
            片道均一 大人 200円
          </span>
        </div>
      </section>
    </div>
  );
};
