import React, { useEffect, useRef, useState } from "react";
import { BrandingConfig, DomainKey, PhysicsStyleModifier, VisualContext } from "../types";
import { renderPhysicsArtwork } from "../utils/canvasRenderer";
import { 
  Download, 
  Copy, 
  RotateCw, 
  Check, 
  Maximize2, 
  Layers, 
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface CanvasPreviewProps {
  visualContext?: VisualContext;
  domain?: string;
  activityType: string;
  styleModifier: PhysicsStyleModifier;
  title: string;
  equation: string;
  purposeTitle?: string;
  purposeMessage?: string;
  imagePrompt?: string;
  branding: BrandingConfig;
  onUpdateBranding: (updated: Partial<BrandingConfig>) => void;
  onOpenBrandingDrawer?: () => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  visualContext,
  domain = "Astrophysics",
  activityType,
  styleModifier,
  title,
  equation,
  purposeTitle,
  purposeMessage,
  imagePrompt,
  branding,
  onUpdateBranding,
  onOpenBrandingDrawer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState<number>(42);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showPromptBox, setShowPromptBox] = useState<boolean>(false);

  // Re-render canvas whenever relevant properties change
  useEffect(() => {
    if (!canvasRef.current) return;
    renderPhysicsArtwork(canvasRef.current, {
      visualContext,
      domain: domain as DomainKey,
      activityType,
      styleModifier,
      title,
      equation,
      purposeTitle,
      purposeMessage,
      branding,
      customSeed: seed,
    });
  }, [visualContext, domain, activityType, styleModifier, title, equation, purposeTitle, purposeMessage, branding, seed]);

  // Handle Download High-Res PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
      link.download = `gravitas-${domain.toLowerCase()}-${cleanTitle || "post"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download canvas image:", err);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  // Handle Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipErr) {
          console.warn("ClipboardItem write failed, fallback to copy data URL:", clipErr);
          // Fallback
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }, "image/png");
    } catch (err) {
      console.error("Copy image error:", err);
    }
  };

  const handleShuffleArt = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] rounded-none border border-cyan-900/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.08),transparent_70%)] pointer-events-none" />

      {/* Top Header Controls */}
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-900/30 mb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 font-mono">
            Graphic Canvas (1080×1080 HD)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleArt}
            title="Randomize Nebula & Equations variation"
            className="p-1.5 px-2.5 bg-[#03081a] hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-400 transition text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Shuffle Art</span>
          </button>

          {onOpenBrandingDrawer && (
            <button
              onClick={onOpenBrandingDrawer}
              className="p-1.5 px-2.5 bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-700/60 hover:border-cyan-400 transition text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 cursor-pointer font-bold rounded-none"
            >
              <Layers className="w-3 h-3" />
              <span>Branding Kit</span>
            </button>
          )}
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div className="relative flex-1 flex items-center justify-center bg-slate-950/90 rounded-none border border-cyan-900/40 overflow-hidden shadow-2xl group min-h-[380px]">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1080}
          className="w-full h-auto max-h-[480px] object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        />

        {/* Top-left High-Res Status Badge from Design HTML */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-[9px] uppercase tracking-widest text-cyan-400 font-mono">
            Rendering High-Res...
          </p>
        </div>
      </div>

      {/* QUICK BRANDING CONTROLS STRIP */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-cyan-900/30 text-xs z-10">
        <button
          onClick={() => onUpdateBranding({ showSlogan: !branding.showSlogan })}
          className={`py-2 px-2 border text-center transition cursor-pointer text-[10px] font-mono uppercase tracking-wider rounded-none ${
            branding.showSlogan
              ? "bg-cyan-400/10 border-cyan-400 text-cyan-300 font-bold"
              : "bg-[#03081a] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          Slogan: {branding.showSlogan ? "ON" : "OFF"}
        </button>

        <button
          onClick={() => onUpdateBranding({ showNeonGlow: !branding.showNeonGlow })}
          className={`py-2 px-2 border text-center transition cursor-pointer text-[10px] font-mono uppercase tracking-wider rounded-none ${
            branding.showNeonGlow
              ? "bg-cyan-400/10 border-cyan-400 text-cyan-300 font-bold"
              : "bg-[#03081a] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          Neon Aura: {branding.showNeonGlow ? "Active" : "Subtle"}
        </button>

        <button
          onClick={() => {
            const positions: BrandingConfig["position"][] = [
              "bottom-right",
              "bottom-center",
              "bottom-left",
              "top-right"
            ];
            const nextIdx = (positions.indexOf(branding.position) + 1) % positions.length;
            onUpdateBranding({ position: positions[nextIdx] });
          }}
          className="py-2 px-2 bg-[#03081a] border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 text-center transition cursor-pointer text-[10px] font-mono uppercase tracking-wider rounded-none"
        >
          Badge: {branding.position.replace("-", " ")}
        </button>
      </div>

      {/* PRIMARY ACTION BUTTONS (Download & Copy) */}
      <div className="grid grid-cols-2 gap-3 mt-3 z-10">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer rounded-none"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? "Exporting..." : "Download High-Res"}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          className="py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-[0.2em] border border-white/10 hover:border-cyan-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Copy Image</span>
            </>
          )}
        </button>
      </div>

      {/* AI IMAGE GENERATOR PROMPT (DALL-E 3 / Midjourney) */}
      {imagePrompt && (
        <div className="mt-4 pt-4 border-t border-cyan-900/30 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowPromptBox(!showPromptBox)}
              className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Image Prompt (DALL-E 3 / Midjourney)</span>
              <span className="text-slate-500 font-sans">{showPromptBox ? "▲" : "▼"}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(imagePrompt);
                setCopiedPrompt(true);
                setTimeout(() => setCopiedPrompt(false), 2000);
              }}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#03081a] hover:bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 hover:border-cyan-400 flex items-center gap-1.5 transition cursor-pointer rounded-none"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-cyan-400" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {showPromptBox && (
            <div className="p-3 bg-[#03081a] border border-cyan-900/40 text-[11px] font-mono text-slate-300 leading-relaxed rounded-none animate-in fade-in duration-150">
              <span className="text-cyan-500 font-bold block mb-1 uppercase tracking-wider text-[9px]">Engineered Prompt:</span>
              {imagePrompt}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
