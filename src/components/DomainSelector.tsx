import React from "react";
import { DomainKey } from "../types";
import { DOMAINS } from "../data/presets";
import { 
  Compass, 
  Atom, 
  Wind, 
  Flame, 
  Sparkles, 
  Code2, 
  CheckCircle2 
} from "lucide-react";

interface DomainSelectorProps {
  selectedDomain: DomainKey;
  onSelectDomain: (domain: DomainKey) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Atom: <Atom className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
};

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  selectedDomain,
  onSelectDomain,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold font-mono">
          01. Select Domain
        </h2>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          Focus Discipline
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {DOMAINS.map((item) => {
          const isSelected = selectedDomain === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectDomain(item.key)}
              className={`p-2.5 text-left border transition-all duration-150 cursor-pointer rounded-none flex flex-col justify-between ${
                isSelected
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 font-bold uppercase shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "border-slate-800 bg-[#03081a]/60 text-slate-400 font-bold uppercase hover:border-cyan-400 hover:text-cyan-300 hover:bg-[#03081a]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 transition ${isSelected ? "text-cyan-300" : "text-slate-500"}`}>
                  {iconMap[item.iconName] || <Atom className="w-4 h-4" />}
                </div>
                {isSelected ? (
                  <span className="w-1.5 h-1.5 bg-cyan-400" />
                ) : (
                  <span className="w-1 h-1 bg-slate-700" />
                )}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider font-['Space_Grotesk']">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 normal-case font-mono line-clamp-1 mt-0.5 opacity-80">
                  {item.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
