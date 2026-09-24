import React from 'react';

interface AiExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiExplainerModal: React.FC<AiExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="ai-explainer-modal"
      className="fixed inset-0 z-50 bg-[#1E2B22]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#DCE4DC] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEFEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4EE] text-[#21432E] flex items-center justify-center text-lg shadow-xs border border-[#CCD8CE]">
              <i className="fa-solid fa-brain"></i>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1E2B22] font-['Zen_Maru_Gothic',sans-serif]">
                AI時間帯予測ミニバスの仕組み
              </h3>
              <span className="text-[11px] text-[#637568] font-medium">
                地域にやさしいスマート公共交通
              </span>
            </div>
          </div>
          <button
            id="close-ai-modal-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F4F1] hover:bg-[#E3EEE5] text-[#4F6354] flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* 3 Pillars of AI Prediction */}
        <div className="space-y-3 text-xs text-[#334437]">
          <div className="p-3.5 rounded-2xl bg-[#F4F7F3] border border-[#D4DFD6] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#21432E] text-[#E5B074] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <h4 className="font-extrabold text-[#21432E] text-sm mb-1">
                1. 人流ビッグデータと時間帯分析
              </h4>
              <p className="leading-relaxed text-[#4F6354]">
                駅の改札利用データ、地域の病院・学校・スーパーの開館スケジュール、過去の乗降実績を学習し、「今どの停留所に人が集中するか」をリアルタイムに事前予測します。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7F3] border border-[#D4DFD6] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#21432E] text-[#E5B074] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <i className="fa-solid fa-cloud-sun-rain"></i>
            </div>
            <div>
              <h4 className="font-extrabold text-[#21432E] text-sm mb-1">
                2. 気象・道路混雑の即時反映
              </h4>
              <p className="leading-relaxed text-[#4F6354]">
                雨天時の移動需要増や、道路の工事・信号待ちの遅延をAIが先読み。バスの到着所要時間カウントダウンを常に高精度に維持します。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7F3] border border-[#D4DFD6] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#21432E] text-[#E5B074] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <div>
              <h4 className="font-extrabold text-[#21432E] text-sm mb-1">
                3. シニア・市民の快適乗車サポート
              </h4>
              <p className="leading-relaxed text-[#4F6354]">
                混雑ピークを避けた「おすすめ便」を提示することで、車いすの方やお子様連れでも安心して座れる時間帯の移動を応援します。
              </p>
            </div>
          </div>
        </div>

        {/* Safe Dismiss button */}
        <div className="pt-2">
          <button
            id="acknowledge-ai-info-btn"
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#3B6C4D] hover:bg-[#2F573E] text-white font-bold text-sm shadow-md transition-colors"
          >
            理解しました（閉じる）
          </button>
        </div>
      </div>
    </div>
  );
};
