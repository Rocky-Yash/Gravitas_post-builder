import React from "react";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  onQuickSample?: () => void;
  onRecruitmentSample?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickSample, onRecruitmentSample }) => {
  return (
    <header className="border-b border-cyan-900/30 bg-[#020617] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-7 pb-5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-5">
        {/* Left Editorial Title & Official Insignia */}
        <div className="flex items-center gap-5 sm:gap-7">
          <img
            src="/gravitas-logo.svg"
            alt="Official GRAVITAS Emblem - K.J Somaiya School of Engineering"
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-white font-['Space_Grotesk']">
                Gravitas
              </h1>
              <div className="w-2 h-2 bg-cyan-400 inline-block mb-1" />
            </div>
            <p className="text-cyan-400 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase mt-2 flex items-center gap-2">
              <span>K.J Somaiya School of Engineering</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">Official Physics Club</span>
            </p>
          </div>
        </div>

        {/* Right Slogan & Editorial Actions */}
        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 sm:gap-6 flex-wrap">
          <div className="text-left md:text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              Slogan / Branding Kit
            </p>
            <p className="text-base sm:text-lg font-serif italic text-cyan-100 font-['Playfair_Display']">
              Explore. Question. Discover.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onRecruitmentSample && (
              <button
                onClick={onRecruitmentSample}
                className="px-3 py-2 text-xs border border-cyan-500/40 bg-[#03081a] hover:bg-cyan-500/20 text-cyan-200 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 rounded-none"
                title="Load official club recruitment campaign"
              >
                <span>Recruitment Mode</span>
              </button>
            )}

            {onQuickSample && (
              <button
                onClick={onQuickSample}
                className="px-3 py-2 text-xs border border-cyan-400/60 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400 hover:text-black font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 rounded-none"
                title="Load inspirational sample post"
              >
                <Sparkles className="w-3 h-3" />
                <span>Inspire Me</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

