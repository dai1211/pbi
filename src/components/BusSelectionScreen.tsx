import React, { useState } from 'react';
import { BusStop, MinibusTrip } from '../types';
import { BUS_STOPS, CONGESTION_CONFIG, getMockTripsForDestination } from '../data/mockData';

interface BusSelectionScreenProps {
  originStop: BusStop;
  destinationStop: BusStop;
  onChangeDestination: (dest: BusStop) => void;
  onSelectTrip: (trip: MinibusTrip) => void;
  onBackToHome: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
}

export const BusSelectionScreen: React.FC<BusSelectionScreenProps> = ({
  originStop,
  destinationStop,
  onChangeDestination,
  onSelectTrip,
  onBackToHome,
}) => {
  const trips = getMockTripsForDestination(originStop, destinationStop);
  const [isChangingDest, setIsChangingDest] = useState(false);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-home-btn"
          type="button"
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#F2F5F2] text-[#214730] font-bold text-sm border border-[#CCD8CE] shadow-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>リアルタイムマップへ戻る</span>
        </button>

        <span className="text-xs font-bold text-[#244B34] bg-[#EAF1EC] px-3 py-1 rounded-full border border-[#CCD8CE]">
          ステップ 2 / 4 : 便の選択
        </span>
      </div>

      {/* 1. 検索・目的地確認カード (Prompt requirement) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#DCE4DC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEFEA]">
          <div>
            <span className="text-xs font-bold text-[#2E5A3E] uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-route text-[#3B6C4D]"></i>
              運行ルート・区間指定
            </span>
            <div className="flex items-center gap-2 text-lg sm:text-xl font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
              <span className="text-[#3F4F43]">{originStop.name}</span>
              <i className="fa-solid fa-arrow-right text-[#3B6C4D] text-sm"></i>
              <span className="text-[#214730]">{destinationStop.name}</span>
            </div>
            <p className="text-xs text-[#637568] mt-1">
              片道所要時間：約10〜12分 / 運賃：一律200円
            </p>
          </div>

          <button
            id="change-destination-btn"
            type="button"
            onClick={() => setIsChangingDest(!isChangingDest)}
            className="px-4 py-2.5 rounded-xl bg-[#EDF4EE] hover:bg-[#E3EEE5] text-[#214730] font-bold text-xs sm:text-sm border border-[#CCD8CE] transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>{isChangingDest ? '選択を閉じる' : '目的地を変更する'}</span>
          </button>
        </div>

        {/* Destination Quick Selector Grid (expanded if toggled) */}
        {isChangingDest && (
          <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="block text-xs font-bold text-[#38483B] mb-2">
              変更したい目的地を選択してください：
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUS_STOPS.filter((s) => s.id !== originStop.id).map((stop) => {
                const isSelected = stop.id === destinationStop.id;
                return (
                  <button
                    key={stop.id}
                    id={`dest-option-${stop.id}`}
                    type="button"
                    onClick={() => {
                      onChangeDestination(stop);
                      setIsChangingDest(false);
                    }}
                    className={`p-3 rounded-xl text-left border-2 transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#EDF4EE] border-[#3B6C4D] text-[#1F412D] ring-2 ring-[#3B6C4D]/25'
                        : 'bg-white hover:bg-[#F6F8F5] border-[#DCE4DC] text-[#28372D]'
                    }`}
                  >
                    <span className="text-2xl">{stop.emoji}</span>
                    <div>
                      <span className="block text-sm font-bold leading-tight">{stop.name}</span>
                      <span className="text-[11px] text-[#637568] font-normal">{stop.tagLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Advice Callout */}
      <div className="bg-gradient-to-r from-[#EEF5EF] via-[#F4F7F3] to-[#EEF5EF] p-4 rounded-2xl border border-[#CFDFD2] flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#244B34] text-[#E5B074] flex items-center justify-center shrink-0 shadow-sm">
          <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-[#214730]">
              AI時間帯予測アドバイス
            </h4>
            <span className="text-[10px] bg-[#CFE2D3] text-[#1C3B26] px-1.5 py-0.5 rounded font-bold">
              信頼度 98%
            </span>
          </div>
          <p className="text-xs text-[#3D4F42] mt-1 leading-relaxed">
            現在、<strong>10:15発（1号車）</strong>は空席が多く最も快適にご乗車いただけます。10:30発は近隣施設の利用終了時刻と重なるため乗車率が上がる予測です。
          </p>
        </div>
      </div>

      {/* 2. AI推奨便カードリスト (Prompt requirement) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-[#1E2B22] flex items-center gap-2">
            <span>ご乗車可能なミニバス便</span>
            <span className="text-xs text-[#637568] font-medium">(AI予測混雑度順)</span>
          </h3>
          <span className="text-xs text-[#244B34] font-bold">
            自動更新中 (10秒前更新)
          </span>
        </div>

        {trips.map((trip, idx) => {
          const cong = CONGESTION_CONFIG[trip.congestion];

          return (
            <div
              key={trip.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border-2 transition-all hover:shadow-md relative overflow-hidden ${
                trip.isAiRecommended
                  ? 'border-[#3B6C4D] ring-2 ring-[#3B6C4D]/20'
                  : 'border-[#DCE4DC]'
              }`}
            >
              {/* AI Recommended Badge */}
              {trip.isAiRecommended && (
                <div className="absolute top-0 right-0 bg-[#244B34] text-[#E5B074] px-3 py-1 rounded-bl-xl text-xs font-black flex items-center gap-1 shadow-sm">
                  <i className="fa-solid fa-crown text-[#E5B074]"></i>
                  <span>AIおすすめ最速・快適便</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Left: Time and bus name */}
                <div className="md:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F0F4F1] text-[#334437] font-bold">
                      便{idx + 1}：{trip.busNumber}
                    </span>

                    {/* Congestion Status Badge (Prompt requirement) */}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm border"
                      style={{
                        backgroundColor: cong.badgeBg,
                        color: cong.textColor,
                        borderColor: cong.borderColor,
                      }}
                    >
                      <i className={cong.iconClass}></i>
                      <span>混雑度: {cong.label}</span>
                    </span>

                    {trip.hasWheelchairSpace && (
                      <span className="text-[11px] text-[#415546] bg-[#EEF4EF] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                        <i className="fa-solid fa-wheelchair text-[#2D5A3F]"></i>
                        車いす可
                      </span>
                    )}
                  </div>

                  {/* Departure & Arrival Schedule */}
                  <div className="flex flex-wrap items-baseline gap-3 pt-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
                      {trip.departureTime}
                      <span className="text-sm font-sans font-bold text-[#55695B] ml-1">発</span>
                    </div>

                    <div className="px-2.5 py-1 bg-[#FDF3EA] text-[#8F4412] border border-[#F2D1BA] rounded-lg text-xs font-extrabold flex items-center gap-1">
                      <i className="fa-solid fa-stopwatch text-[#D97736]"></i>
                      <span>あと {trip.departureMinutesLeft} 分</span>
                    </div>

                    <div className="text-sm text-[#55695B] font-medium">
                      所要時間: <strong className="text-[#1E2B22]">{trip.durationMinutes}分</strong> (到着予定 {trip.arrivalTime})
                    </div>
                  </div>

                  {/* AI Prediction reason */}
                  <p className="text-xs text-[#485B4E] bg-[#F6F8F5] p-2.5 rounded-xl border border-[#E3EBE4]">
                    <i className="fa-solid fa-circle-info text-[#3B6C4D] mr-1.5"></i>
                    {trip.aiRecommendationReason}
                  </p>
                </div>

                {/* Right: Select Action Button */}
                <div className="md:col-span-4 flex flex-col justify-center">
                  <button
                    id={`select-trip-btn-${trip.id}`}
                    type="button"
                    onClick={() => onSelectTrip(trip)}
                    className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D97736] to-[#C36322] hover:from-[#C86A2B] hover:to-[#B2571A] text-white font-black text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-[#E9A46F]"
                  >
                    <span>この便を選択</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                  <span className="text-[11px] text-center text-[#637568] mt-1 font-medium">
                    空席数：約{trip.availableSeats}席 / 全{trip.totalSeats}席
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
