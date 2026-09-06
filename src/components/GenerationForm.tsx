import React from "react";
import { PhysicsStyleModifier, VisualContext } from "../types";
import { STYLE_MODIFIERS } from "../data/presets";
import { Sparkles, Wand2, Loader2, Compass } from "lucide-react";

interface GenerationFormProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  purposeHeadline: string;
  onChangePurposeHeadline: (headline: string) => void;
  purposeMessage: string;
  onChangePurposeMessage: (msg: string) => void;
  styleModifier: PhysicsStyleModifier;
  onSelectStyleModifier: (style: PhysicsStyleModifier) => void;
  visualContext?: VisualContext;
  onGenerate: () => void;
  isLoading: boolean;
}

const PROMPT_SUGGESTIONS = [
  {
    label: "🚀 Recruitment Drive",
    prompt: "We are recruiting freshers and new members for GRAVITAS physics club! Open to all engineering branches. No prior physics expertise needed—just genuine curiosity to explore the universe.",
    headline: "WE ARE RECRUITING",
    message: "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!"
  },
  {
    label: "🔬 Optics & Laser Workshop",
    prompt: "Hands-on workshop on Laser Optics, diffraction gratings, and Snell's law in Physics Lab 204. Live laser demonstrations and beam alignment techniques.",
    headline: "HANDS-ON WORKSHOP",
    message: "Explore laser refraction, optical interference, and photonics apparatus with hands-on lab equipment."
  },
  {
    label: "🔭 Terrace Stargazing Night",
    prompt: "Join us on the college terrace for an astronomy night with 8-inch Dobsonian telescopes. Observing Jupiter's moons, Saturn's rings, and the Orion nebula.",
    headline: "STARGAZING NIGHT",
    message: "Telescopic deep-sky observation session on the college terrace. Witness planets, star clusters, and cosmic horizons."
  },
  {
    label: "💡 Black Hole Fun Fact",
    prompt: "A mind-bending physics fact about gravitational time dilation near a black hole's event horizon and why time practically halts from an outside observer's frame.",
    headline: "MIND-BENDING FACT",
    message: "Time dilation near a black hole event horizon causes time to freeze from the perspective of an external observer."
  },
  {
    label: "⚡ Physics Hackathon",
    prompt: "Announcing a 24-hour computational physics simulation hackathon. Build N-body gravitational orbit models, quantum circuits, and aerodynamics simulations.",
    headline: "PHYSICS HACKATHON",
    message: "24-hour computational simulation sprint. Code orbital mechanics, quantum algorithms, and win exciting prizes."
  },
  {
    label: "⚛️ Quantum Lab Demo",
    prompt: "Interactive demonstration of quantum wave-particle duality, double-slit interference, and photon entanglement for undergraduate physics students.",
    headline: "RESEARCH & LAB DEMO",
    message: "Unraveling quantum wave functions, superposition, and probability amplitudes in experimental physics."
  }
];

const CONTEXT_LABELS: Record<VisualContext, { name: string; icon: string }> = {
  recruitment: { name: "Recruitment Portal (Gravitational Gateway)", icon: "🚀" },
  workshop: { name: "Laboratory Optics & Laser Apparatus", icon: "🔬" },
  stargazing: { name: "Observatory Telescope & Orbital Sky", icon: "🔭" },
  fun_fact: { name: "Warped Spacetime & Event Horizon", icon: "💡" },
  hackathon: { name: "Cybernetic Physics & Simulation HUD", icon: "⚡" },
  research: { name: "Quantum Wave Interference Lattice", icon: "⚛️" },
  general: { name: "Cosmic Spacetime & Chalkboard", icon: "🪐" }
};

export const GenerationForm: React.FC<GenerationFormProps> = ({
  prompt,
  onChangePrompt,
  purposeHeadline,
  onChangePurposeHeadline,
  purposeMessage,
  onChangePurposeMessage,
  styleModifier,
  onSelectStyleModifier,
  visualContext = "recruitment",
  onGenerate,
  isLoading,
}) => {
  const activeContext = CONTEXT_LABELS[visualContext] || CONTEXT_LABELS.general;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleApplySuggestion = (sug: typeof PROMPT_SUGGESTIONS[0]) => {
    onChangePrompt(sug.prompt);
    onChangePurposeHeadline(sug.headline);
    onChangePurposeMessage(sug.message);
  };

  return (
    <div className="space-y-5">
      {/* 01. NATURAL LANGUAGE PROMPT BOX */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400" />
            01. Describe Your Post (Prompt)
          </label>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
            Natural Language AI
          </span>
        </div>

        <div className="relative">
          <textarea
            id="prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to post... e.g. 'We are recruiting new freshers for GRAVITAS physics club, no experience required' or 'Optics lab workshop on laser diffraction this Wednesday'..."
            className="w-full bg-[#020617] border border-cyan-800/70 focus:border-cyan-400 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono tracking-wide leading-relaxed focus:outline-none rounded-none resize-none shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"
          />
          <div className="flex justify-between items-center px-1 pt-1">
            <span className="text-[9px] text-slate-500 font-mono">
              Press <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 text-[8px]">⌘+Enter</kbd> to generate
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              {prompt.length} chars
            </span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
              Quick Prompt Ideas:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((sug) => (
              <button
                key={sug.label}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="text-[10px] px-2.5 py-1 bg-[#020817] hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-600 rounded-none transition font-mono cursor-pointer flex items-center gap-1"
              >
                <span>{sug.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 02. PROMINENT PURPOSE & HEADLINE ON GRAPHIC */}
      <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400" />
            02. Prominent Purpose Callout
          </h2>
          <span className="text-[9px] text-cyan-300/80 uppercase tracking-widest font-mono">
            Rendered Bold On Graphic
          </span>
        </div>

        {/* Active Context Badge */}
        <div className="mb-2.5 px-2.5 py-1 bg-cyan-900/30 border border-cyan-700/40 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
            Context Artwork:
          </span>
          <span className="text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
            <span>{activeContext.icon}</span>
            <span>{activeContext.name}</span>
          </span>
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Purpose Headline (e.g. WE ARE RECRUITING)
            </label>
            <input
              type="text"
              value={purposeHeadline}
              onChange={(e) => onChangePurposeHeadline(e.target.value)}
              placeholder="e.g. WE ARE RECRUITING"
              className="w-full bg-[#020617] border border-cyan-700/60 px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400 rounded-none text-white font-mono font-bold tracking-wider"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">
              Clear Purpose Message (Unmistakable on canvas)
            </label>
            <textarea
              rows={2}
              value={purposeMessage}
              onChange={(e) => onChangePurposeMessage(e.target.value)}
              placeholder="Clear message explaining the post purpose..."
              className="w-full bg-[#020617] border border-cyan-700/60 px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400 rounded-none text-slate-200 font-mono text-[11px] leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>

      {/* 03. ART STYLE FILTER */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold font-mono">
            03. Art Style
          </h2>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
            Aesthetic Filter
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STYLE_MODIFIERS.map((style) => {
            const isSelected = styleModifier === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => onSelectStyleModifier(style)}
                className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono cursor-pointer transition-colors rounded-none border ${
                  isSelected
                    ? "bg-cyan-900/50 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "bg-[#03081a]/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* 04. GENERATE MASTER BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase py-3.5 sm:py-4 text-xs tracking-[0.25em] transition-all rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.35)] ${
            isLoading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
              : "active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span className="font-mono">Synthesizing Post & Captions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate Post from Prompt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
