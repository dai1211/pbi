import React from 'react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigateHome: () => void;
  fontSizeMode: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (mode: 'normal' | 'large' | 'xlarge') => void;
  onOpenAiInfo: () => void;
  voiceGuideEnabled: boolean;
  onToggleVoiceGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  fontSizeMode,
  onChangeFontSize,
  onOpenAiInfo,
  voiceGuideEnabled,
  onToggleVoiceGuide,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#21432E] via-[#2A5239] to-[#21432E] text-white shadow-[0_2px_12px_rgba(24,52,36,0.18)] sticky top-0 z-30">
      {/* Top Utility Bar: Accessibility & Senior Support */}
      <div className="bg-[#183424] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-[#D6E6DA]">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#6EB582] animate-pulse" />
          <span className="font-medium">地域公共交通・AI需要予測運行中</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Guidance Toggle */}
          <button
            id="voice-guidance-btn"
            type="button"
            onClick={onToggleVoiceGuide}
            className={`px-2 py-0.5 rounded text-[12px] flex items-center gap-1.5 transition-colors ${
              voiceGuideEnabled ? 'bg-[#D97736] text-white font-bold' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
            title="音声案内（オン/オフ）"
            aria-label="音声案内切り替え"
          >
            <i className={`fa-solid ${voiceGuideEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            <span>音声案内{voiceGuideEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded">
            <span className="text-[#D6E6DA] text-[11px] px-1 hidden sm:inline">文字:</span>
            <button
              id="font-size-normal"
              type="button"
              onClick={() => onChangeFontSize('normal')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                fontSizeMode === 'normal' ? 'bg-white text-[#21432E]' : 'text-white/80 hover:text-white'
              }`}
            >
              標準
            </button>
            <button
              id="font-size-large"
              type="button"
              onClick={() => onChangeFontSize('large')}
              className={`px-2 py-0.5 rounded text-[12px] font-bold ${
                fontSizeMode === 'large' ? 'bg-white text-[#21432E]' : 'text-white/80 hover:text-white'
              }`}
            >
              大
            </button>
            <button
              id="font-size-xlarge"
              type="button"
              onClick={() => onChangeFontSize('xlarge')}
              className={`px-2 py-0.5 rounded text-[13px] font-extrabold ${
                fontSizeMode === 'xlarge' ? 'bg-[#D97736] text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              特大
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          id="brand-header-btn"
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-[#D97736] rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-[#E5B074] text-xl shadow-inner border border-white/20 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-van-shuttle"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white font-['Zen_Maru_Gothic',sans-serif]">
                AI時間帯予測ミニバス
              </h1>
              <span className="hidden sm:inline-block bg-[#D97736] text-white text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                市民用
              </span>
            </div>
            <p className="text-xs text-[#D6E6DA] flex items-center gap-1 font-medium">
              <i className="fa-solid fa-location-dot text-[#E5B074] text-xs"></i>
              <span>現在地: <strong>中央公園前 のりば</strong></span>
            </p>
          </div>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            id="ai-info-trigger-btn"
            type="button"
            onClick={onOpenAiInfo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-[#EDF3EE] transition-all active:scale-95"
            title="AI時間帯予測の仕組み"
          >
            <i className="fa-solid fa-brain text-[#E5B074]"></i>
            <span className="hidden sm:inline">AI予測について</span>
          </button>

          {currentScreen !== 'home' && (
            <button
              id="return-home-header-btn"
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-2 rounded-xl bg-[#D97736] hover:bg-[#C56525] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <i className="fa-solid fa-house"></i>
              <span>ホーム</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
