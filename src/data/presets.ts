import { DomainInfo, DomainKey, ActivityType, PhysicsStyleModifier, BrandingConfig } from "../types";

export const DOMAINS: DomainInfo[] = [
  {
    key: "Astrophysics",
    label: "Astrophysics",
    tagline: "Cosmic expansion, black holes & relativistic stellar bodies",
    iconName: "Compass",
    accentColor: "#38bdf8",
    gradient: "from-sky-500/20 to-indigo-900/40",
    defaultEquation: "R_s = 2GM / c^2  •  G_{μν} + Λg_{μν} = 8πG T_{μν}",
    sampleTopics: ["Black Hole Event Horizon", "Gravitational Waves", "James Webb Deep Field", "Stellar Nucleosynthesis", "Dark Matter Halos"]
  },
  {
    key: "Quantum Physics",
    label: "Quantum Physics",
    tagline: "Wave-particle duality, superposition & quantum computing",
    iconName: "Atom",
    accentColor: "#00f0ff",
    gradient: "from-cyan-500/20 to-blue-900/40",
    defaultEquation: "iℏ ∂ψ/∂t = Ĥψ  •  [x̂, p̂] = iℏ  •  |Ψ⟩ = α|0⟩ + β|1⟩",
    sampleTopics: ["Quantum Superposition", "Schrödinger's Cat Paradox", "Quantum Entanglement", "Qubit Logic Gates", "Tunneling Effect"]
  },
  {
    key: "Aerodynamics",
    label: "Aerodynamics",
    tagline: "Fluid dynamics, supersonic shockwaves & lift physics",
    iconName: "Wind",
    accentColor: "#2dd4bf",
    gradient: "from-teal-500/20 to-slate-900/40",
    defaultEquation: "P + 1/2ρv^2 + ρgh = C  •  ρ(∂u/∂t + u·∇u) = -∇p + μ∇^2u",
    sampleTopics: ["Supersonic Shockwaves", "Vortex Generation", "Airfoil Boundary Layer", "Wind Tunnel Testing", "Hypersonic Glide"]
  },
  {
    key: "Thermal Physics",
    label: "Thermal Physics",
    tagline: "Statistical mechanics, entropy & arrow of time",
    iconName: "Flame",
    accentColor: "#f97316",
    gradient: "from-orange-500/20 to-rose-900/40",
    defaultEquation: "dS ≥ dQ/T  •  S = k_B ln Ω  •  dU = TdS - PdV",
    sampleTopics: ["The Arrow of Time & Entropy", "Carnot Efficiency Limits", "Cryogenics & Superconductivity", "Maxwell's Demon Paradox", "Cosmic Heat Death"]
  },
  {
    key: "Optics",
    label: "Optics",
    tagline: "Laser coherence, wave interference & photonics",
    iconName: "Sparkles",
    accentColor: "#a855f7",
    gradient: "from-purple-500/20 to-indigo-900/40",
    defaultEquation: "n₁ sin θ₁ = n₂ sin θ₂  •  E = hν  •  I(θ) = I₀ sinc²(β)",
    sampleTopics: ["Laser Interferometry", "Total Internal Reflection", "Metamaterial Invisibility Cloaks", "Diffraction Grating Patterns", "Photon Entanglement"]
  },
  {
    key: "Web Dev",
    label: "Web Dev",
    tagline: "Interactive 3D WebGL physics, simulations & club platforms",
    iconName: "Code2",
    accentColor: "#06b6d4",
    gradient: "from-cyan-500/20 to-emerald-900/40",
    defaultEquation: "vec3 pos += vel * dt;  •  F = G·(m₁m₂)/r²  •  WebGL Shader",
    sampleTopics: ["WebGL Gravity Simulators", "Three.js Solar System Models", "Interactive Collision Canvases", "Real-Time Telemetry Dashboards", "Physics Engine Architecture"]
  }
];

export const ACTIVITY_TYPES: ActivityType[] = [
  "Workshop",
  "Fun Fact",
  "Recruitment",
  "Stargazing / Lab Demo",
  "Research Teaser",
  "Physics Hackathon"
];

export const STYLE_MODIFIERS: PhysicsStyleModifier[] = [
  "Double-exposure nebula silhouette & glowing chalkboard equations",
  "Hubble-quality astrophotography & gravitational lensing",
  "Neon vector physics diagrams & glowing field lines",
  "Cinematic lighting & quantum wave interference",
  "Minimalist cosmic geometry & deep space monochrome"
];

export const DEFAULT_BRANDING: BrandingConfig = {
  showLogo: true,
  showSlogan: true,
  sloganText: "Explore. Question. Discover.",
  clubName: "GRAVITAS",
  position: "top-right",
  style: "glowing-badge",
  opacity: 0.95,
  showNeonGlow: true,
  eventBannerText: "FALL ORIENTATION • WED 6:00 PM • AUDITORIUM A",
  showEventBanner: false
};

export const CHALKBOARD_EQUATIONS = [
  "iℏ ∂ψ/∂t = Ĥψ",
  "R_{μν} - ½ R g_{μν} + Λg_{μν} = 8πG T_{μν}",
  "∇ · E = ρ / ε₀",
  "∇ × B = μ₀J + μ₀ε₀ ∂E/∂t",
  "S = k_B \\ln \\Omega",
  "\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",
  "E = mc^2",
  "F_{net} = \\frac{dp}{dt}",
  "P + ½ ρ v^2 = \\text{const}",
  "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2"
];

export interface ActivityPurposeInfo {
  headline: string;
  defaultMessage: string;
  badgeLabel: string;
}

export const ACTIVITY_PURPOSE_DEFAULTS: Record<ActivityType, ActivityPurposeInfo> = {
  "Recruitment": {
    headline: "WE ARE RECRUITING",
    defaultMessage: "Step into the world where atoms dance & galaxies collide. Join GRAVITAS — all domains & freshers welcome!",
    badgeLabel: "✦ CLUB RECRUITMENT • ALL BRANCHES WELCOME ✦"
  },
  "Workshop": {
    headline: "HANDS-ON WORKSHOP",
    defaultMessage: "Deep-dive into computational simulations, telemetry & experimental laboratory physics.",
    badgeLabel: "✦ TECHNICAL WORKSHOP • HANDS-ON SIMULATION ✦"
  },
  "Fun Fact": {
    headline: "MIND-BENDING FACT",
    defaultMessage: "Inside a singularity, the laws of classical spacetime cease to exist as gravity diverges to infinity.",
    badgeLabel: "✦ COSMIC CURIOSITY • BOLD INQUIRY ✦"
  },
  "Stargazing / Lab Demo": {
    headline: "LAB DEMO & STARGAZING",
    defaultMessage: "Witness optical spectroscopy, laser diffraction & real-time deep-sky celestial observation.",
    badgeLabel: "✦ LIVE LAB DEMONSTRATION & OBSERVATION NIGHT ✦"
  },
  "Research Teaser": {
    headline: "RESEARCH SPOTLIGHT",
    defaultMessage: "Demystifying non-linear wave mechanics, relativistic frames & modern computational physics.",
    badgeLabel: "✦ ACADEMIC RESEARCH • THEORETICAL FRONTIERS ✦"
  },
  "Physics Hackathon": {
    headline: "PHYSICS HACKATHON",
    defaultMessage: "24 Hours to build, compute, and simulate real astrophysical and quantum phenomena.",
    badgeLabel: "✦ 24-HOUR PHYSICS HACKATHON • BUILD & COMPUTE ✦"
  }
};
