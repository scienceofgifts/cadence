import React from 'react';
import { useTask } from '../context/TaskContext';

export const BackgroundLayer: React.FC = () => {
  const { settings } = useTask();
  const bg = settings.background;

  if (bg.preset === 'clean') return null;

  let bgStyle: React.CSSProperties = {
    opacity: bg.opacity,
    filter: bg.blurPx > 0 ? `blur(${bg.blurPx}px)` : undefined,
  };

  let presetClass = '';

  if (bg.preset === 'paper') {
    presetClass = 'bg-[#FAF6F0] dark:bg-[#121A24] bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e2b38_1px,transparent_1px)] [background-size:16px_16px]';
  } else if (bg.preset === 'soft-blue') {
    presetClass = 'bg-gradient-to-br from-[#EBF3FC] via-[#F4F8FE] to-[#E2EEFA] dark:from-[#0E1C2B] dark:to-[#16273B]';
  } else if (bg.preset === 'soft-mint') {
    presetClass = 'bg-gradient-to-br from-[#EEFAF5] via-[#F5FCF8] to-[#E3F6EE] dark:from-[#0B1E19] dark:to-[#132A23]';
  } else if (bg.preset === 'blue-mint') {
    presetClass = 'bg-gradient-to-br from-[#99BFF9]/25 via-[#FAF9F6] to-[#C3F3DF]/30 dark:from-[#112438] dark:to-[#0D241D]';
  } else if (bg.preset === 'dark-navy') {
    presetClass = 'bg-gradient-to-b from-[#0B1522] via-[#0F1E2F] to-[#122438] text-slate-100';
  } else if (bg.preset === 'neutral-gradient') {
    presetClass = 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FAF6F0] via-[#FAF9F6] to-[#EDE9E3] dark:from-[#132030] dark:to-[#0A121E]';
  } else if (bg.preset === 'misty-lake') {
    presetClass = 'bg-gradient-to-b from-[#E2EAF4] via-[#EEF3FA] to-[#FAF9F6] dark:from-[#0D1928] dark:to-[#132235]';
  } else if (bg.preset === 'sunlit-desk') {
    presetClass = 'bg-gradient-to-tr from-[#F7F3EB] via-[#FAF8F2] to-[#EEF5FA] dark:from-[#121E2C] dark:to-[#18283A]';
  } else if (bg.preset === 'nordic-forest') {
    presetClass = 'bg-gradient-to-b from-[#E4F2EC] via-[#F0F8F3] to-[#FAF9F6] dark:from-[#0A1A16] dark:to-[#0F2620]';
  } else if (bg.preset === 'custom' && bg.customImageUrl) {
    bgStyle.backgroundImage = `url("${bg.customImageUrl}")`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-500 overflow-hidden">
      {/* Base Preset Layer */}
      <div className={`absolute inset-0 ${presetClass}`} style={bgStyle} />

      {/* Overlay Dimmer / Readability tint */}
      {bg.overlayStrength > 0 && (
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: bg.overlayStrength }}
        />
      )}
    </div>
  );
};
