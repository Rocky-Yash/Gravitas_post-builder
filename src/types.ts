export type DomainKey = 
  | "Astrophysics" 
  | "Quantum Physics" 
  | "Aerodynamics" 
  | "Thermal Physics" 
  | "Optics" 
  | "Web Dev"
  | "General Physics";

export type ActivityType = 
  | "Recruitment" 
  | "Workshop" 
  | "Fun Fact" 
  | "Stargazing / Lab Demo" 
  | "Research Teaser" 
  | "Physics Hackathon";

export type VisualContext = 
  | "recruitment" 
  | "workshop" 
  | "fun_fact" 
  | "stargazing" 
  | "hackathon" 
  | "research" 
  | "general";

export type PhysicsStyleModifier =
  | "Double-exposure nebula silhouette & glowing chalkboard equations"
  | "Hubble-quality astrophotography & gravitational lensing"
  | "Neon vector physics diagrams & glowing field lines"
  | "Cinematic lighting & quantum wave interference"
  | "Minimalist cosmic geometry & deep space monochrome";

export type WatermarkPosition = "bottom-right" | "bottom-center" | "bottom-left" | "top-right" | "top-left";
export type WatermarkStyle = "glowing-badge" | "minimalist-bar" | "corner-stamp" | "emblem-clean";

export interface BrandingConfig {
  showLogo: boolean;
  showSlogan: boolean;
  sloganText: string;
  clubName: string;
  position: WatermarkPosition;
  style: WatermarkStyle;
  opacity: number; // 0.2 to 1.0
  showNeonGlow: boolean;
  eventBannerText?: string; // e.g. "NOV 14 • 5:00 PM • AUDITORIUM 3"
  showEventBanner: boolean;
}

export interface GeneratedPost {
  id: string;
  timestamp: number;
  prompt?: string;
  visualContext?: VisualContext;
  domain?: string;
  activityType: ActivityType;
  styleModifier: PhysicsStyleModifier;
  title: string;
  equation: string;
  funFact: string;
  purposeTitle?: string;
  purposeMessage?: string;
  instagramCaption: string;
  linkedinCaption: string;
  imagePrompt: string;
  brandingText: string;
  source?: "gemini_ai" | "curated_fallback" | "curated_fallback_error";
}

export interface DomainInfo {
  key: DomainKey;
  label: string;
  tagline: string;
  iconName: string;
  accentColor: string;
  gradient: string;
  defaultEquation: string;
  sampleTopics: string[];
}
