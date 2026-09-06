/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  PhysicsStyleModifier, 
  BrandingConfig, 
  GeneratedPost,
  VisualContext
} from "./types";
import { DEFAULT_BRANDING, STYLE_MODIFIERS, ACTIVITY_PURPOSE_DEFAULTS } from "./data/presets";
import { Header } from "./components/Header";
import { GenerationForm } from "./components/GenerationForm";
import { CanvasPreview } from "./components/CanvasPreview";
import { CaptionPanel } from "./components/CaptionPanel";
import { BrandingKitDrawer } from "./components/BrandingKitDrawer";
import { Sparkles } from "lucide-react";

export default function App() {
  const [prompt, setPrompt] = useState<string>(
    "We are recruiting new freshers and members for GRAVITAS physics club! Open to all engineering branches. No prior physics expertise needed—just your curiosity to explore the universe."
  );
  const [purposeTitle, setPurposeTitle] = useState<string>("WE ARE RECRUITING");
  const [purposeMessage, setPurposeMessage] = useState<string>(
    "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!"
  );
  const [styleModifier, setStyleModifier] = useState<PhysicsStyleModifier>(STYLE_MODIFIERS[0]);
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [isBrandingOpen, setIsBrandingOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial starter post configured with prominent purpose and recruitment context
  const [currentPost, setCurrentPost] = useState<GeneratedPost>({
    id: "init-post-1",
    timestamp: Date.now(),
    prompt: "We are recruiting new freshers and members for GRAVITAS physics club! Open to all engineering branches. No prior physics expertise needed—just your curiosity to explore the universe.",
    visualContext: "recruitment",
    domain: "Quantum Physics",
    activityType: "Recruitment",
    styleModifier: STYLE_MODIFIERS[0],
    title: "Join The Cosmos",
    purposeTitle: "WE ARE RECRUITING",
    purposeMessage: "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!",
    equation: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi \\quad | \\quad R_s = \\frac{2GM}{c^2}",
    funFact: "Every atom in your body was forged in the nuclear furnace of an exploding supernova billions of years ago.",
    instagramCaption: "Step into the world where atoms dance and galaxies collide. ⚛️🔭 From the mysteries of Quantum Mechanics to the engineering of Aerodynamics, GRAVITAS is your gateway to the universe. No expertise required—just your curiosity. Are you ready to explore?\n\n✨ Dive into cosmic wonders\n🔭 Stargazing nights & computational relativity sessions\n🚀 Connect with passionate peers across all branches\n\nDrop a 🪐 if you’ve ever wondered what lies beyond the observable horizon!\n\n👉 DM us or tap the link in bio to join GRAVITAS physics club!\n\n#JoinGravitas #SpaceClub #PhysicsIsFun #Gravitas #STEM #Somaiya",
    linkedinCaption: "Are you ready to explore where atoms dance and galaxies collide?\n\nWhether you are fascinated by the quantum realm or the aerospace engineering behind supersonic flight, GRAVITAS is your gateway to real-world scientific discovery. We bridge curiosity, theoretical physics, and computational tools for ambitious undergraduates.\n\n• No prior expertise required—just genuine curiosity\n• Weekly workshops, telescope observation nights & simulation hackathons\n• Build lasting peer networks and research project portfolios\n\nExplore. Question. Discover.\nJoin GRAVITAS this semester!\n\n#JoinGravitas #PhysicsClub #STEMCareers #CollegeRecruitment #Astrophysics #QuantumPhysics",
    imagePrompt: "A futuristic recruitment gateway portal connecting human curiosity to the cosmos, neon cyan rings, deep space navy, mathematical chalkboard field lines, 8k resolution.",
    brandingText: "GRAVITAS • Explore. Question. Discover.",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          styleModifier,
          activityType: currentPost.activityType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const generatedHeadline = data.purposeTitle || purposeTitle;
      const generatedMessage = data.purposeMessage || purposeMessage;

      setPurposeTitle(generatedHeadline);
      setPurposeMessage(generatedMessage);

      setCurrentPost({
        id: `post-${Date.now()}`,
        timestamp: Date.now(),
        prompt,
        visualContext: (data.visualContext as VisualContext) || "general",
        domain: data.domain || "Physics",
        activityType: data.activityType || "Workshop",
        styleModifier,
        title: data.title || "GRAVITAS Exploration",
        purposeTitle: generatedHeadline,
        purposeMessage: generatedMessage,
        equation: data.equation || "E = mc^2",
        funFact: data.funFact || "The universe expands at an accelerating rate governed by dark energy.",
        instagramCaption: data.instagramCaption,
        linkedinCaption: data.linkedinCaption,
        imagePrompt: data.imagePrompt,
        brandingText: data.brandingText || "GRAVITAS • Explore. Question. Discover.",
        source: data.source,
      });

      showToast("✨ Post Generated! Context Artwork & Captions Synced.");
    } catch (err: any) {
      console.error("Generation error:", err);
      showToast("Generated with curated physics assets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspireMe = () => {
    const samplePrompts = [
      {
        prompt: "Hands-on workshop on Laser Optics, diffraction gratings, and Snell's law in Physics Lab 204. Live laser demonstrations and beam alignment techniques.",
        headline: "HANDS-ON WORKSHOP",
        message: "Explore laser refraction, optical interference, and photonics apparatus with hands-on lab equipment.",
        context: "workshop" as VisualContext
      },
      {
        prompt: "Join us on the college terrace for an astronomy night with 8-inch Dobsonian telescopes. Observing Jupiter's moons, Saturn's rings, and the Orion nebula.",
        headline: "STARGAZING NIGHT",
        message: "Telescopic deep-sky observation session on the college terrace. Witness planets, star clusters, and cosmic horizons.",
        context: "stargazing" as VisualContext
      },
      {
        prompt: "A mind-bending physics fact about gravitational time dilation near a black hole's event horizon and why time practically halts from an outside observer's frame.",
        headline: "MIND-BENDING FACT",
        message: "Time dilation near a black hole event horizon causes time to freeze from the perspective of an external observer.",
        context: "fun_fact" as VisualContext
      },
      {
        prompt: "Announcing a 24-hour computational physics simulation hackathon. Build N-body gravitational orbit models, quantum circuits, and aerodynamics simulations.",
        headline: "PHYSICS HACKATHON",
        message: "24-hour computational simulation sprint. Code orbital mechanics, quantum algorithms, and win exciting prizes.",
        context: "hackathon" as VisualContext
      }
    ];

    const pick = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(pick.prompt);
    setPurposeTitle(pick.headline);
    setPurposeMessage(pick.message);
    showToast(`Inspiring idea loaded: ${pick.headline}`);
  };

  const handleRecruitmentMode = () => {
    const recruitmentPrompt = "We are recruiting freshers and new members for GRAVITAS physics club! Open to all engineering branches. No prior physics expertise needed—just genuine curiosity to explore the universe.";
    const headline = "WE ARE RECRUITING";
    const message = "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!";
    
    setPrompt(recruitmentPrompt);
    setPurposeTitle(headline);
    setPurposeMessage(message);
    
    setCurrentPost((prev) => ({
      ...prev,
      prompt: recruitmentPrompt,
      visualContext: "recruitment",
      activityType: "Recruitment",
      purposeTitle: headline,
      purposeMessage: message,
      title: "Join The Cosmos",
      equation: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi \\quad | \\quad R_s = \\frac{2GM}{c^2}"
    }));
    
    showToast("🚀 Recruitment Campaign Loaded!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <Header onQuickSample={handleInspireMe} onRecruitmentSample={handleRecruitmentMode} />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 py-2.5 px-4 bg-cyan-400 text-black font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center gap-2 rounded-none animate-in fade-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Prompt Input & Purpose Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-[#03081a]/70 p-5 sm:p-6 rounded-none border border-cyan-900/30 shadow-2xl backdrop-blur-sm">
            <GenerationForm
              prompt={prompt}
              onChangePrompt={setPrompt}
              purposeHeadline={purposeTitle}
              onChangePurposeHeadline={(val) => {
                setPurposeTitle(val);
                setCurrentPost((p) => ({ ...p, purposeTitle: val }));
              }}
              purposeMessage={purposeMessage}
              onChangePurposeMessage={(val) => {
                setPurposeMessage(val);
                setCurrentPost((p) => ({ ...p, purposeMessage: val }));
              }}
              styleModifier={styleModifier}
              onSelectStyleModifier={setStyleModifier}
              visualContext={currentPost.visualContext}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* RIGHT COLUMN: Canvas Artwork & Caption Engine (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top: Dynamic Physics Artwork Graphic Canvas */}
            <CanvasPreview
              visualContext={currentPost.visualContext}
              domain={currentPost.domain}
              activityType={currentPost.activityType}
              styleModifier={currentPost.styleModifier}
              title={currentPost.title}
              purposeTitle={currentPost.purposeTitle || purposeTitle}
              purposeMessage={currentPost.purposeMessage || purposeMessage}
              equation={currentPost.equation}
              imagePrompt={currentPost.imagePrompt}
              branding={branding}
              onUpdateBranding={(updated) => setBranding((prev) => ({ ...prev, ...updated }))}
              onOpenBrandingDrawer={() => setIsBrandingOpen(true)}
            />

            {/* Bottom: Instagram & LinkedIn Caption Engine */}
            <CaptionPanel
              post={currentPost}
              onUpdatePost={(updated) => setCurrentPost((prev) => ({ ...prev, ...updated }))}
            />
          </div>
        </div>
      </main>

      {/* Branding Kit Customizer Drawer / Modal */}
      <BrandingKitDrawer
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        branding={branding}
        onChangeBranding={(updated) => setBranding((prev) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
