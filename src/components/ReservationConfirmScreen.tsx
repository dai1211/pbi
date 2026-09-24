import React, { useState } from 'react';
import { BusStop, MinibusTrip, ReservationData } from '../types';
import { CONGESTION_CONFIG, FARE_CONFIG } from '../data/mockData';

interface ReservationConfirmScreenProps {
  originStop: BusStop;
  destinationStop: BusStop;
  selectedTrip: MinibusTrip;
  onConfirmReservation: (data: ReservationData) => void;
  onBackToSelection: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
}

export const ReservationConfirmScreen: React.FC<ReservationConfirmScreenProps> = ({
  originStop,
  destinationStop,
  selectedTrip,
  onConfirmReservation,
  onBackToSelection,
}) => {
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(0);
  const [needsWheelchair, setNeedsWheelchair] = useState<boolean>(false);
  const [needsStroller, setNeedsStroller] = useState<boolean>(false);

  const cong = CONGESTION_CONFIG[selectedTrip.congestion];
  const totalFare = adultCount * FARE_CONFIG.adult + childCount * FARE_CONFIG.child;

  const handleConfirm = () => {
    const randomId = 'MB-' + Math.floor(1000 + Math.random() * 9000);
    const nowStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    onConfirmReservation({
      reservationId: randomId,
      originStop,
      destinationStop,
      trip: selectedTrip,
      adultCount,
      childCount,
      needsWheelchair,
      needsStroller,
      totalFare,
      bookedAt: nowStr,
      status: 'active',
    });
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-selection-btn"
          type="button"
          onClick={onBackToSelection}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#F2F5F2] text-[#214730] font-bold text-sm border border-[#CCD8CE] shadow-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>便選択に戻る</span>
        </button>

        <span className="text-xs font-bold text-[#244B34] bg-[#EAF1EC] px-3 py-1 rounded-full border border-[#CCD8CE]">
          ステップ 3 / 4 : 人数・内容確認
        </span>
      </div>

      <div className="text-center py-2">
        <h2 className="text-2xl font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
          予約内容の最終確認
        </h2>
        <p className="text-xs text-[#637568] mt-1">
          内容をご確認の上、「予約を確定する（QR発行）」を押してください。
        </p>
      </div>

      {/* 1. 予約内容カード (Prompt requirement) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE4DC] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEFEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF4EE] text-[#244B34] flex items-center justify-center font-bold border border-[#CCD8CE]">
              <i className="fa-solid fa-bus"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-[#637568] block">選択中の便</span>
              <span className="text-base font-extrabold text-[#1E2B22]">{selectedTrip.busNumber}</span>
            </div>
          </div>

          {/* 混雑度バッジ表示 (Prompt requirement) */}
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
        </div>

        {/* Boarding and Destination Route visual */}
        <div className="bg-[#F4F7F3] p-4 rounded-xl border border-[#D4DFD6] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2E5A3E] flex items-center gap-1">
              <i className="fa-solid fa-circle-dot text-[#3B6C4D]"></i>
              乗車地（出発）
            </span>
            <div className="text-lg font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
              {originStop.name}
            </div>
            <div className="text-sm font-bold text-[#214730]">
              予定時刻：{selectedTrip.departureTime} 発
              <span className="text-xs text-[#637568] ml-1 font-normal">(あと約{selectedTrip.departureMinutesLeft}分)</span>
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#D4DFD6] sm:pl-4">
            <span className="text-xs font-bold text-[#9A583A] flex items-center gap-1">
              <i className="fa-solid fa-location-dot text-[#D97736]"></i>
              目的地（到着）
            </span>
            <div className="text-lg font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
              {destinationStop.name}
            </div>
            <div className="text-sm font-bold text-[#214730]">
              到着予定：{selectedTrip.arrivalTime} 頃
              <span className="text-xs text-[#637568] ml-1 font-normal">(所要時間 {selectedTrip.durationMinutes}分)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 乗車人数選択 (Prompt requirement: 大人・子どものプラス・マイナスボタンカウンター) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE4DC] space-y-4">
        <h3 className="text-base font-extrabold text-[#1E2B22] flex items-center gap-2">
          <i className="fa-solid fa-users text-[#244B34]"></i>
          <span>乗車人数の指定</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 大人カウンター */}
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] flex items-center justify-between">
            <div>
              <span className="text-base font-black text-[#1E2B22] block">大人</span>
              <span className="text-xs text-[#637568]">中学生以上 / 1人 200円</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="adult-minus-btn"
                type="button"
                onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                disabled={adultCount <= 1}
                className="w-11 h-11 rounded-xl bg-white border-2 border-[#CCD8CE] text-[#334437] font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2F5F2] active:scale-95 shadow-sm transition-all flex items-center justify-center"
                aria-label="大人の人数を減らす"
              >
                <i className="fa-solid fa-minus"></i>
              </button>

              <span className="w-8 text-center text-2xl font-black text-[#1E2B22] font-mono">
                {adultCount}
              </span>

              <button
                id="adult-plus-btn"
                type="button"
                onClick={() => setAdultCount(Math.min(6, adultCount + 1))}
                disabled={adultCount >= 6}
                className="w-11 h-11 rounded-xl bg-white border-2 border-[#3B6C4D] text-[#214730] font-black text-lg disabled:opacity-40 hover:bg-[#EDF4EE] active:scale-95 shadow-sm transition-all flex items-center justify-center"
                aria-label="大人の人数を増やす"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          {/* 子どもカウンター */}
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DC] flex items-center justify-between">
            <div>
              <span className="text-base font-black text-[#1E2B22] block">子ども</span>
              <span className="text-xs text-[#637568]">小学生 / 1人 100円 (未就学児無料)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="child-minus-btn"
                type="button"
                onClick={() => setChildCount(Math.max(0, childCount - 1))}
                disabled={childCount <= 0}
                className="w-11 h-11 rounded-xl bg-white border-2 border-[#CCD8CE] text-[#334437] font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F2F5F2] active:scale-95 shadow-sm transition-all flex items-center justify-center"
                aria-label="子どもの人数を減らす"
              >
                <i className="fa-solid fa-minus"></i>
              </button>

              <span className="w-8 text-center text-2xl font-black text-[#1E2B22] font-mono">
                {childCount}
              </span>

              <button
                id="child-plus-btn"
                type="button"
                onClick={() => setChildCount(Math.min(6, childCount + 1))}
                disabled={childCount >= 6}
                className="w-11 h-11 rounded-xl bg-white border-2 border-[#3B6C4D] text-[#214730] font-black text-lg disabled:opacity-40 hover:bg-[#EDF4EE] active:scale-95 shadow-sm transition-all flex items-center justify-center"
                aria-label="子どもの人数を増やす"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Universal Accessibility Needs Toggle */}
        <div className="pt-2 border-t border-[#EBEFEA] flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-[#28372D] cursor-pointer bg-[#F4F7F3] px-3.5 py-2 rounded-xl border border-[#D4DFD6] hover:bg-[#EDF4EE] transition-colors">
            <input
              type="checkbox"
              checked={needsWheelchair}
              onChange={(e) => setNeedsWheelchair(e.target.checked)}
              className="w-4 h-4 rounded text-[#214730] focus:ring-[#3B6C4D]"
            />
            <i className="fa-solid fa-wheelchair text-[#214730]"></i>
            <span>車いす固定スペースを利用する</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-[#28372D] cursor-pointer bg-[#F4F7F3] px-3.5 py-2 rounded-xl border border-[#D4DFD6] hover:bg-[#EDF4EE] transition-colors">
            <input
              type="checkbox"
              checked={needsStroller}
              onChange={(e) => setNeedsStroller(e.target.checked)}
              className="w-4 h-4 rounded text-[#214730] focus:ring-[#3B6C4D]"
            />
            <i className="fa-solid fa-baby-carriage text-[#214730]"></i>
            <span>ベビーカー優先スペースを利用する</span>
          </label>
        </div>

        {/* Fare Total Display */}
        <div className="bg-[#EEF5EF] p-4 rounded-xl border border-[#CFE0D2] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#5C6F61] block">乗車合計（お支払いは乗車時または交通系IC・現金）</span>
            <span className="text-sm font-bold text-[#1E2B22]">
              合計人数：{adultCount + childCount}名
              {needsWheelchair && '（車いす優先枠）'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#637568] block">お支払い予定額</span>
            <span className="text-2xl font-black text-[#214730] font-mono">
              ¥{totalFare.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. 確定アクション (Prompt requirement: 「予約を確定する（QR発行）」の大きなオレンジ色ボタン) */}
      <div className="pt-2">
        <button
          id="confirm-reservation-btn"
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D97736] to-[#C36322] hover:from-[#C86A2B] hover:to-[#B2571A] text-white font-black text-xl shadow-[0_4px_16px_rgba(195,99,34,0.25)] hover:shadow-[0_6px_20px_rgba(195,99,34,0.3)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 border border-[#E9A46F]"
        >
          <i className="fa-solid fa-qrcode text-2xl"></i>
          <span>予約を確定する（QR発行）</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>

        <p className="text-center text-xs text-[#637568] mt-2.5">
          ※ 予約確定後のキャンセル・便の変更も手数料なしで無料で行えます。
        </p>
      </div>
    </div>
  );
};
