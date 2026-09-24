import { useState, useEffect } from 'react';
import { BusStop, MinibusTrip, ReservationData, ScreenId } from './types';
import { BUS_STOPS, getMockTripsForDestination } from './data/mockData';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { BusSelectionScreen } from './components/BusSelectionScreen';
import { ReservationConfirmScreen } from './components/ReservationConfirmScreen';
import { ReservationSuccessScreen } from './components/ReservationSuccessScreen';
import { AiExplainerModal } from './components/AiExplainerModal';
import { playChime, speakMessage } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [originStop, setOriginStop] = useState<BusStop>(BUS_STOPS[0]); // 中央公園前
  const [selectedDestination, setSelectedDestination] = useState<BusStop>(BUS_STOPS[1]); // 駅前
  const [selectedTrip, setSelectedTrip] = useState<MinibusTrip>(() => {
    return getMockTripsForDestination(BUS_STOPS[0], BUS_STOPS[1])[0];
  });
  const [reservation, setReservation] = useState<ReservationData | null>(null);

  // Universal design: font-size mode & voice guidance
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Scroll to top upon screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  // Voice guide toggle handler
  const handleToggleVoiceGuide = () => {
    const nextVal = !voiceGuideEnabled;
    setVoiceGuideEnabled(nextVal);
    if (nextVal) {
      playChime('confirm');
      speakMessage('音声案内を有効にしました。');
      showToast('音声案内をONにしました');
    } else {
      playChime('tap');
      showToast('音声案内をOFFにしました');
    }
  };

  // Handle destination change
  const handleSelectDestination = (dest: BusStop) => {
    setSelectedDestination(dest);
    const trips = getMockTripsForDestination(originStop, dest);
    setSelectedTrip(trips[0]);
    if (voiceGuideEnabled) {
      playChime('tap');
      speakMessage(`目的地を ${dest.name} に設定しました。`);
    }
    showToast(`目的地を「${dest.name}」に設定しました`);
  };

  // Step 1 -> Step 2
  const handleProceedToBooking = () => {
    if (voiceGuideEnabled) {
      playChime('tap');
      speakMessage(`${selectedDestination.name} 行きの便選択画面へ進みます。`);
    }
    setCurrentScreen('select');
  };

  // Step 2 -> Step 3
  const handleSelectTrip = (trip: MinibusTrip) => {
    setSelectedTrip(trip);
    if (voiceGuideEnabled) {
      playChime('tap');
      speakMessage(`${trip.departureTime} 発の便を選択しました。`);
    }
    setCurrentScreen('confirm');
  };

  // Step 3 -> Step 4
  const handleConfirmReservation = (data: ReservationData) => {
    setReservation(data);
    setCurrentScreen('success');
    playChime('confirm');
    if (voiceGuideEnabled) {
      speakMessage('ミニバスの予約が完了しました。乗車用のQRコードを発行しました。');
    }
    showToast('予約が確定しました！QRコードをご確認ください。');
  };

  // Step 4 -> Cancel
  const handleCancelReservation = () => {
    setReservation(null);
    setCurrentScreen('home');
    playChime('cancel');
    if (voiceGuideEnabled) {
      speakMessage('予約をキャンセルしました。ホーム画面に戻ります。');
    }
    showToast('予約をキャンセルしました');
  };

  // Navigate back home
  const handleNavigateHome = () => {
    playChime('tap');
    setCurrentScreen('home');
  };

  // Font size scale wrapper
  const getFontSizeClass = () => {
    switch (fontSizeMode) {
      case 'large':
        return 'text-lg';
      case 'xlarge':
        return 'text-xl font-medium';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAF7] text-[#28372D] ${getFontSizeClass()}`}>
      {/* Universal Header */}
      <Header
        currentScreen={currentScreen}
        onNavigateHome={handleNavigateHome}
        fontSizeMode={fontSizeMode}
        onChangeFontSize={setFontSizeMode}
        onOpenAiInfo={() => setIsAiModalOpen(true)}
        voiceGuideEnabled={voiceGuideEnabled}
        onToggleVoiceGuide={handleToggleVoiceGuide}
      />

      {/* Main Screen Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {currentScreen === 'home' && (
          <HomeScreen
            originStop={originStop}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            onProceedToBooking={handleProceedToBooking}
            fontSizeMode={fontSizeMode}
          />
        )}

        {currentScreen === 'select' && (
          <BusSelectionScreen
            originStop={originStop}
            destinationStop={selectedDestination}
            onChangeDestination={handleSelectDestination}
            onSelectTrip={handleSelectTrip}
            onBackToHome={handleNavigateHome}
            fontSizeMode={fontSizeMode}
          />
        )}

        {currentScreen === 'confirm' && (
          <ReservationConfirmScreen
            originStop={originStop}
            destinationStop={selectedDestination}
            selectedTrip={selectedTrip}
            onConfirmReservation={handleConfirmReservation}
            onBackToSelection={() => setCurrentScreen('select')}
            fontSizeMode={fontSizeMode}
          />
        )}

        {currentScreen === 'success' && reservation && (
          <ReservationSuccessScreen
            reservation={reservation}
            onReturnHome={handleNavigateHome}
            onCancelReservation={handleCancelReservation}
            fontSizeMode={fontSizeMode}
          />
        )}
      </main>

      {/* Global Accessibility Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#1E2B22]/95 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 border border-[#4E8863]/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <i className="fa-solid fa-bell text-[#E5B074]"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Intelligence Explanation Modal */}
      <AiExplainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Citizen Universal Footer */}
      <footer className="bg-white border-t border-[#DCE4DC] py-6 px-4 text-xs text-[#637568] mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#21432E] text-[#E5B074] flex items-center justify-center text-xs">
              <i className="fa-solid fa-van-shuttle"></i>
            </div>
            <span className="font-bold text-[#1E2B22]">
              AI時間帯予測ミニバス 運行管理センター
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[#55695B]">
            <span>運行時間：平日 7:00〜21:00 / 休日 8:00〜19:00</span>
            <span>電話予約・案内：0120-000-XXX</span>
          </div>

          <span className="text-[11px] text-[#86978B]">
            © 2026 地域公共交通AI実証実験 All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
