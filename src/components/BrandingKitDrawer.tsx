import React from "react";
import { BrandingConfig, WatermarkPosition, WatermarkStyle } from "../types";
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Sliders, 
  Calendar, 
  Check 
} from "lucide-react";

interface BrandingKitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onChangeBranding: (updated: Partial<BrandingConfig>) => void;
}

export const BrandingKitDrawer: React.FC<BrandingKitDrawerProps> = ({
  isOpen,
  onClose,
  branding,
  onChangeBranding,
}) => {
  if (!isOpen) return null;

  const positions: { key: WatermarkPosition; label: string }[] = [
    { key: "bottom-right", label: "Bottom Right" },
    { key: "bottom-center", label: "Bottom Center" },
    { key: "bottom-left", label: "Bottom Left" },
    { key: "top-right", label: "Top Right" },
  ];

  const styles: { key: WatermarkStyle; label: string }[] = [
    { key: "glowing-badge", label: "Glowing Cyber Badge" },
    { key: "minimalist-bar", label: "Minimalist Stamp" },
    { key: "emblem-clean", label: "Clean Emblem" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#020617] border border-cyan-900/50 rounded-none max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-cyan-400" />
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-cyan-400 font-mono">
                Branding Kit Configuration
              </h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Watermark overlay & club insignia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-slate-500 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Official Logo Preview Card */}
        <div className="bg-[#03081a] border border-cyan-900/50 p-3.5 flex items-center gap-3.5">
          <div className="w-12 h-12 bg-[#020617] border border-cyan-500/30 flex items-center justify-center shrink-0 p-1.5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <img
              src="/gravitas-logo.svg"
              alt="GRAVITAS Official Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-cyan-300 font-mono">
                GRAVITAS EMBLEM
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-cyan-400/20 text-cyan-300 font-mono uppercase">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-tight">
              Official physics club insignia with adaptive dark background, embedded on every generated post.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4 text-xs">
          {/* Slogan Toggle & Club Name */}
          <div className="space-y-1.5 bg-[#03081a] p-3 border border-slate-800 rounded-none">
            <label className="font-semibold text-slate-200 flex items-center justify-between">
              <span className="font-mono text-xs">Club Slogan ("Explore. Question. Discover.")</span>
              <button
                type="button"
                onClick={() => onChangeBranding({ showSlogan: !branding.showSlogan })}
                className={`w-9 h-5 rounded-none transition-colors relative cursor-pointer border ${
                  branding.showSlogan ? "bg-cyan-500 border-cyan-400" : "bg-slate-800 border-slate-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 bg-black absolute top-0.5 transition-all ${
                    branding.showSlogan ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </label>
            <p className="text-[10px] text-slate-500 font-mono">
              Appends the official physics club motto under the GRAVITAS logo.
            </p>
          </div>

          {/* Neon Glow Toggle */}
          <div className="space-y-1.5 bg-[#03081a] p-3 border border-slate-800 rounded-none">
            <label className="font-semibold text-slate-200 flex items-center justify-between">
              <span className="font-mono text-xs">Neon Cyan Aura & Shadow</span>
              <button
                type="button"
                onClick={() => onChangeBranding({ showNeonGlow: !branding.showNeonGlow })}
                className={`w-9 h-5 rounded-none transition-colors relative cursor-pointer border ${
                  branding.showNeonGlow ? "bg-cyan-500 border-cyan-400" : "bg-slate-800 border-slate-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 bg-black absolute top-0.5 transition-all ${
                    branding.showNeonGlow ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Watermark Position */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Badge Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.key}
                  type="button"
                  onClick={() => onChangeBranding({ position: pos.key })}
                  className={`p-2 rounded-none border text-left transition cursor-pointer flex items-center justify-between font-mono text-[11px] uppercase tracking-wider ${
                    branding.position === pos.key
                      ? "bg-cyan-400/10 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-[#03081a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span>{pos.label}</span>
                  {branding.position === pos.key && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Opacity */}
          <div className="space-y-1.5 bg-[#03081a] p-3 border border-slate-800 rounded-none">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Watermark Opacity
              </label>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(branding.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={branding.opacity}
              onChange={(e) => onChangeBranding({ opacity: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Event Announcement Banner */}
          <div className="p-3 bg-[#03081a] border border-slate-800 rounded-none space-y-2">
            <label className="font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Event Hall / Date Strip</span>
              </span>
              <button
                type="button"
                onClick={() => onChangeBranding({ showEventBanner: !branding.showEventBanner })}
                className={`w-9 h-5 rounded-none transition-colors relative cursor-pointer border ${
                  branding.showEventBanner ? "bg-cyan-500 border-cyan-400" : "bg-slate-800 border-slate-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 bg-black absolute top-0.5 transition-all ${
                    branding.showEventBanner ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </label>

            {branding.showEventBanner && (
              <input
                type="text"
                value={branding.eventBannerText || ""}
                onChange={(e) => onChangeBranding({ eventBannerText: e.target.value })}
                placeholder="e.g. WORKSHOP: FRI 5:00 PM • AUDITORIUM 1"
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-widest font-mono transition cursor-pointer rounded-none"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
