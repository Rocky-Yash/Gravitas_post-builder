import React, { useState } from "react";
import { GeneratedPost } from "../types";
import { 
  Copy, 
  Check, 
  Instagram, 
  Linkedin, 
  Sparkles, 
  Edit3, 
  Hash, 
  Lightbulb, 
  BookOpen, 
  Send 
} from "lucide-react";

interface CaptionPanelProps {
  post: GeneratedPost;
  onUpdatePost: (updated: Partial<GeneratedPost>) => void;
}

export const CaptionPanel: React.FC<CaptionPanelProps> = ({
  post,
  onUpdatePost,
}) => {
  const [activeTab, setActiveTab] = useState<"instagram" | "linkedin" | "split">("instagram");
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const copyToClipboard = async (text: string, platform: "instagram" | "linkedin") => {
    try {
      await navigator.clipboard.writeText(text);
      if (platform === "instagram") {
        setCopiedInsta(true);
        setTimeout(() => setCopiedInsta(false), 2000);
      } else {
        setCopiedLinkedin(true);
        setTimeout(() => setCopiedLinkedin(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy caption:", err);
    }
  };

  const instaCharCount = post.instagramCaption.length;
  const linkedinCharCount = post.linkedinCaption.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-cyan-900/30 p-5 sm:p-6 rounded-none relative">
      {/* HEADER & EDITORIAL PLATFORM TABS */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500 font-mono">
            Editorial Captions
          </h2>
        </div>

        {/* Platform tabs from Design HTML */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("instagram")}
            className={`text-[10px] uppercase font-bold tracking-widest pb-1 transition-all cursor-pointer font-mono border-b-2 ${
              activeTab === "instagram"
                ? "text-cyan-400 border-cyan-400"
                : "text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            Instagram
          </button>

          <button
            onClick={() => setActiveTab("linkedin")}
            className={`text-[10px] uppercase font-bold tracking-widest pb-1 transition-all cursor-pointer font-mono border-b-2 ${
              activeTab === "linkedin"
                ? "text-cyan-400 border-cyan-400"
                : "text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            LinkedIn
          </button>

          <button
            onClick={() => setActiveTab("split")}
            className={`hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest pb-1 transition-all cursor-pointer font-mono border-b-2 ${
              activeTab === "split"
                ? "text-cyan-400 border-cyan-400"
                : "text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* CURIOSITY CALLOUT: Equation & Mind-Bending Fact */}
      <div className="mb-4 p-3 bg-[#03081a] border border-cyan-900/40 rounded-none space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            <span>Chalkboard Equation</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">LaTeX Formatted</span>
        </div>
        <div className="font-mono text-xs text-slate-200 bg-black/40 py-2 px-3 border border-slate-800 rounded-none flex items-center justify-between overflow-x-auto">
          <span>{post.equation}</span>
          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest ml-3 shrink-0">Primary Law</span>
        </div>

        {post.funFact && (
          <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-300 font-mono">
              <strong className="text-amber-300 font-medium">Curiosity Hook:</strong> {post.funFact}
            </p>
          </div>
        )}
      </div>

      {/* CAPTION DISPLAY AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* INSTAGRAM VIEW */}
        {(activeTab === "instagram" || activeTab === "split") && (
          <div className="p-4 bg-[#03081a] border border-slate-800 rounded-none relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Instagram Copy (Hook + CTA + Hashtags)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  {instaCharCount} chars
                </span>
                <button
                  onClick={() => copyToClipboard(post.instagramCaption, "instagram")}
                  className="bg-white/5 hover:bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-white/10 rounded-none text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedInsta ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={post.instagramCaption}
                onChange={(e) => onUpdatePost({ instagramCaption: e.target.value })}
                rows={9}
                className="w-full text-xs font-mono leading-relaxed text-slate-200 bg-black/50 p-3 border border-slate-700 focus:outline-none focus:border-cyan-400 resize-none rounded-none"
              />
            ) : (
              <div className="text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto bg-black/40 p-3 border border-slate-850 rounded-none">
                <span className="text-cyan-400 font-bold">@GRAVITAS: </span>
                {post.instagramCaption}
              </div>
            )}
          </div>
        )}

        {/* LINKEDIN VIEW */}
        {(activeTab === "linkedin" || activeTab === "split") && (
          <div className="p-4 bg-[#03081a] border border-slate-800 rounded-none relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  LinkedIn Post (Intellectual + Career Value + Slogan)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  {linkedinCharCount} chars
                </span>
                <button
                  onClick={() => copyToClipboard(post.linkedinCaption, "linkedin")}
                  className="bg-white/5 hover:bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-white/10 rounded-none text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLinkedin ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={post.linkedinCaption}
                onChange={(e) => onUpdatePost({ linkedinCaption: e.target.value })}
                rows={9}
                className="w-full text-xs font-mono leading-relaxed text-slate-200 bg-black/50 p-3 border border-slate-700 focus:outline-none focus:border-cyan-400 resize-none rounded-none"
              />
            ) : (
              <div className="text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto bg-black/40 p-3 border border-slate-850 rounded-none">
                <span className="text-cyan-400 font-bold">@GRAVITAS: </span>
                {post.linkedinCaption}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition cursor-pointer font-mono text-[10px] uppercase tracking-wider"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? "Finish Editing" : "Direct Editor"}</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
          <span>Official Motto: <strong className="text-cyan-300">Explore. Question. Discover.</strong></span>
        </div>
      </div>
    </div>
  );
};
