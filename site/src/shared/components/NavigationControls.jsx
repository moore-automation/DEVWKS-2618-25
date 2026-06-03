import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const NavigationControls = ({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onReset,
  currentStep,
  totalSteps,
  sticky = true,
  showHint = true,
  variant = 'default',
}) => {
  const isFooter = variant === 'footer';

  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-2 px-4 py-2.5 backdrop-blur-md md:gap-4 md:py-3 ${
        isFooter
          ? 'border-b border-slate-700/80 bg-[#070b14]'
          : sticky
            ? 'sticky top-0 z-30 border-y border-slate-700/80 bg-[#0b1120]/95'
            : 'border-t border-slate-700/80 bg-[#0b1120]/95'
      }`}
    >
      <button
        onClick={onReset}
        disabled={currentStep === 0}
        className="p-1.5 hover:bg-slate-800/80 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Reset to start (Home)"
      >
        <Home className="w-4 h-4 text-[#94a3b8]" />
      </button>

      <div className="w-px h-6 bg-slate-700" />

      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="p-1.5 md:p-2 hover:bg-sky-500/15 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        title="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
      </button>

      <div className="flex items-center gap-1.5 min-w-[70px] justify-center">
        <span className="text-white font-semibold text-sm md:text-base">{currentStep + 1}</span>
        <span className="text-slate-500 text-sm">/</span>
        <span className="text-[#94a3b8] text-sm">{totalSteps}</span>
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-1.5 md:p-2 hover:bg-sky-500/15 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        title="Next"
      >
        <ChevronRight className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
      </button>

      <div className="w-px h-6 bg-slate-700" />

      {showHint ? (
        <span className="hidden text-xs text-slate-500 lg:inline">↑ ↓ = workshop steps</span>
      ) : null}
    </div>
  );
};

export default NavigationControls;
