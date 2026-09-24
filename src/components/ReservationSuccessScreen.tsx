import React, { useState, useEffect } from 'react';
import { ReservationData } from '../types';
import { CONGESTION_CONFIG } from '../data/mockData';

interface ReservationSuccessScreenProps {
  reservation: ReservationData;
  onReturnHome: () => void;
  onCancelReservation: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
}

export const ReservationSuccessScreen: React.FC<ReservationSuccessScreenProps> = ({
  reservation,
  onReturnHome,
  onCancelReservation,
}) => {
  // Countdown timer for approaching bus: starts at 200 seconds (3m 20s as prompt example)
  const [secondsLeft, setSecondsLeft] = useState<number>(200);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('予定が変わったため');
  const [isQrZoomed, setIsQrZoomed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Compute approaching step: 3 steps (前の停留所を出発 -> 接近中 -> まもなく到着)
  const approachProgress = Math.max(0, Math.min(100, Math.round(((200 - secondsLeft) / 200) * 100)));
  const cong = CONGESTION_CONFIG[reservation.trip.congestion];

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    onCancelReservation();
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-14">
      {/* 1. 完了メッセージ (Prompt requirement: 「予約が完了しました！」) */}
      <div className="bg-gradient-to-br from-[#21432E] via-[#2A5239] to-[#183424] text-white rounded-3xl p-6 sm:p-7 text-center shadow-[0_4px_20px_rgba(24,52,36,0.18)] relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner text-[#E5B074]">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-['Zen_Maru_Gothic',sans-serif] tracking-tight">
          予約が完了しました！
        </h2>
        <p className="text-[#DCE7DF] text-sm mt-1">
          予約番号: <strong className="font-mono text-[#E5B074] text-base">#{reservation.reservationId}</strong>
        </p>

        {/* Quick Summary Pill */}
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-2xl text-xs border border-white/20">
          <span>{reservation.originStop.name} 発</span>
          <i className="fa-solid fa-arrow-right text-[#E5B074] text-[10px]"></i>
          <span>{reservation.destinationStop.name} 行き</span>
          <span className="text-white/60">|</span>
          <span>{reservation.trip.busNumber}</span>
          <span className="text-white/60">|</span>
          <span className="font-bold text-[#E5B074]">{reservation.adultCount + reservation.childCount}名</span>
        </div>
      </div>

      {/* 2. 乗車用QRコード (Prompt requirement: 画面中央に大きくダミーQRコードと車内リーダー注記) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE4DC] text-center space-y-4">
        <div>
          <span className="text-xs font-bold text-[#637568] uppercase tracking-wider block">
            BOARDING PASS
          </span>
          <h3 className="text-lg font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
            乗車用 2次元コード
          </h3>
        </div>

        {/* High-Contrast SVG QR Code with Minibus Emblem */}
        <div className="inline-block p-4 bg-white rounded-2xl border-4 border-[#1E2B22] shadow-sm relative group cursor-pointer"
             onClick={() => setIsQrZoomed(!isQrZoomed)}
             title="タップして拡大表示"
        >
          <svg
            viewBox="0 0 200 200"
            className={`transition-all duration-200 mx-auto ${isQrZoomed ? 'w-64 h-64' : 'w-48 h-48 sm:w-56 sm:h-56'}`}
          >
            {/* Background */}
            <rect width="200" height="200" fill="#FFFFFF" />

            {/* Position markers (Top-left, Top-right, Bottom-left) */}
            {/* Top-Left */}
            <rect x="15" y="15" width="45" height="45" fill="#21432E" rx="4" />
            <rect x="23" y="23" width="29" height="29" fill="#FFFFFF" rx="2" />
            <rect x="29" y="29" width="17" height="17" fill="#21432E" rx="2" />

            {/* Top-Right */}
            <rect x="140" y="15" width="45" height="45" fill="#21432E" rx="4" />
            <rect x="148" y="23" width="29" height="29" fill="#FFFFFF" rx="2" />
            <rect x="154" y="29" width="17" height="17" fill="#21432E" rx="2" />

            {/* Bottom-Left */}
            <rect x="15" y="140" width="45" height="45" fill="#21432E" rx="4" />
            <rect x="23" y="148" width="29" height="29" fill="#FFFFFF" rx="2" />
            <rect x="29" y="154" width="17" height="17" fill="#21432E" rx="2" />

            {/* Simulated Data Pattern Matrix */}
            <g fill="#21432E">
              {/* Timing patterns */}
              <rect x="68" y="32" width="6" height="6" />
              <rect x="80" y="32" width="6" height="6" />
              <rect x="92" y="32" width="6" height="6" />
              <rect x="104" y="32" width="6" height="6" />
              <rect x="116" y="32" width="6" height="6" />

              <rect x="32" y="68" width="6" height="6" />
              <rect x="32" y="80" width="6" height="6" />
              <rect x="32" y="92" width="6" height="6" />
              <rect x="32" y="104" width="6" height="6" />
              <rect x="32" y="116" width="6" height="6" />

              {/* Data clusters */}
              <rect x="70" y="65" width="12" height="12" />
              <rect x="90" y="70" width="10" height="10" />
              <rect x="120" y="65" width="14" height="10" />
              <rect x="140" y="75" width="12" height="8" />
              <rect x="160" y="68" width="10" height="14" />

              <rect x="20" y="70" width="8" height="10" />
              <rect x="40" y="85" width="10" height="10" />
              <rect x="20" y="105" width="12" height="10" />
              <rect x="50" y="110" width="10" height="12" />

              <rect x="70" y="140" width="12" height="12" />
              <rect x="90" y="145" width="8" height="8" />
              <rect x="110" y="135" width="14" height="12" />
              <rect x="135" y="140" width="10" height="14" />
              <rect x="155" y="145" width="12" height="12" />

              <rect x="145" y="100" width="12" height="10" />
              <rect x="165" y="110" width="12" height="12" />
              <rect x="130" y="115" width="10" height="10" />
              <rect x="70" y="115" width="14" height="10" />
              <rect x="100" y="165" width="10" height="14" />
              <rect x="130" y="165" width="12" height="12" />
              <rect x="150" y="165" width="10" height="10" />
            </g>

            {/* Center Emblem Shield */}
            <circle cx="100" cy="100" r="22" fill="#FFFFFF" stroke="#21432E" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="18" fill="#D97736" />
            <text x="100" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">
              🚌
            </text>
          </svg>

          <span className="text-[10px] text-[#637568] font-bold block mt-1">
            {isQrZoomed ? 'タップで標準サイズに戻す' : 'タップでQRを拡大'}
          </span>
        </div>

        {/* 注記 (Prompt requirement: 「車内リーダーにかざしてください」) */}
        <div className="bg-[#FDF3EA] text-[#6A320C] p-3.5 rounded-2xl border border-[#F2D1BA] inline-block max-w-md mx-auto">
          <p className="text-sm font-extrabold flex items-center justify-center gap-2 text-[#8F4412]">
            <i className="fa-solid fa-mobile-screen-button text-[#D97736] text-base"></i>
            <span>車内リーダーにかざしてください</span>
          </p>
          <span className="text-xs text-[#8F4412]/80 block mt-0.5">
            乗車口の読み取り機にかざすと「ピピッ」と音が鳴り受付完了となります。
          </span>
        </div>
      </div>

      {/* 3. リアルタイム接近情報 (Prompt requirement: カウントダウンタイマー & バスの接近を示すミニマップ/ステータスゲージ) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DCE4DC] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#1E2B22] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#48825C] animate-ping" />
            リアルタイムバス接近情報
          </h3>
          <span className="text-xs font-bold text-[#214730] bg-[#EAF1EC] px-2.5 py-1 rounded-full border border-[#CCD8CE]">
            GPS自動追跡
          </span>
        </div>

        {/* カウントダウンタイマー (Prompt: 「バス到着まで あと 3分20秒」) */}
        <div className="bg-[#EEF5EF] p-4 sm:p-5 rounded-2xl border border-[#CFE0D2] text-center">
          <span className="text-xs sm:text-sm font-bold text-[#244B34] block">
            バス到着まで あと
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#214730] font-mono tracking-tight my-1">
            {minutes}<span className="text-lg font-sans font-bold ml-1">分</span>
            {seconds.toString().padStart(2, '0')}<span className="text-lg font-sans font-bold ml-1">秒</span>
          </div>
          <span className="text-xs text-[#5C6F61] font-medium">
            乗車予定：{reservation.trip.departureTime} / 車両：{reservation.trip.busNumber}
          </span>
        </div>

        {/* バスの接近を示すステータスゲージ (Prompt requirement) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#55695B]">
            <span>① 1つ前の停留所を出発</span>
            <span className="text-[#214730] font-extrabold">② まもなく到着 (接近中)</span>
            <span>③ のりば到着</span>
          </div>

          {/* Progress Track */}
          <div className="relative h-4 bg-[#E5ECE6] rounded-full overflow-hidden border border-[#D4DFD6]">
            <div
              className="h-full bg-gradient-to-r from-[#4E8863] via-[#3B6C4D] to-[#21432E] rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(15, approachProgress)}%` }}
            />
          </div>

          {/* Animated Minibus along progress */}
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-1.5 text-[#214730] font-bold">
              <i className="fa-solid fa-van-shuttle text-[#D97736] animate-pulse text-sm"></i>
              <span>ミニバスは現在、中央通り交差点を通過しました</span>
            </div>
            <span className="text-xs text-[#637568] font-mono">
              進捗: {approachProgress}%
            </span>
          </div>
        </div>

        {/* 混雑度＆乗車案内バッジ */}
        <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#DCE4DC] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#334437]">車内混雑状況:</span>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs border"
              style={{
                backgroundColor: cong.badgeBg,
                color: cong.textColor,
                borderColor: cong.borderColor,
              }}
            >
              {cong.label}
            </span>
          </div>
          <span className="text-[#637568] font-medium">
            乗務員：{reservation.trip.driverName}
          </span>
        </div>
      </div>

      {/* 4. サブアクション (Prompt requirement: 「ホームに戻る」ボタン & 「予約をキャンセル」ボタン（モーダル確認付き）) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          id="return-home-success-btn"
          type="button"
          onClick={onReturnHome}
          className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-[#F2F5F2] text-[#214730] font-bold text-base border-2 border-[#3B6C4D] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-house"></i>
          <span>ホーム（運行マップ）に戻る</span>
        </button>

        <button
          id="cancel-reservation-btn"
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#FDF2F0] hover:bg-[#FBE6E3] text-[#A8382A] font-bold text-base border border-[#F4CCC6] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-trash-can"></i>
          <span>予約をキャンセルする</span>
        </button>
      </div>

      {/* キャンセル確認モーダル (Prompt requirement: モーダル確認付き) */}
      {showCancelModal && (
        <div
          id="cancel-confirmation-modal"
          className="fixed inset-0 z-50 bg-[#1E2B22]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#A8382A] flex items-center justify-center text-xl mx-auto border border-[#F4CCC6]">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
                ご予約をキャンセルしますか？
              </h4>
              <p className="text-xs text-[#637568] mt-1 leading-relaxed">
                キャンセルすると発行された乗車用QRコードは無効になります。キャンセル料は一切かかりません。
              </p>
            </div>

            {/* Cancel Reason */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-[#334437]">
                キャンセル理由（任意）：
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#CCD8CE] bg-[#F8FAF7] focus:outline-none focus:ring-2 focus:ring-[#D97736]"
              >
                <option value="予定が変わったため">予定が変わったため</option>
                <option value="別の便を利用するため">別の便を利用するため</option>
                <option value="誤って操作したため">誤って操作したため</option>
                <option value="徒歩や他の手段に変更したため">徒歩や他の手段に変更したため</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                id="dismiss-cancel-modal-btn"
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#F0F4F1] hover:bg-[#E3EEE5] text-[#28372D] font-bold text-xs"
              >
                予約を続ける（戻る）
              </button>
              <button
                id="execute-cancel-btn"
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-[#B8473B] hover:bg-[#A33B30] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                キャンセルを確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
