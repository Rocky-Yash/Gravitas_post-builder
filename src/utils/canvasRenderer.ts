import { BrandingConfig, DomainKey, PhysicsStyleModifier, VisualContext } from "../types";
import { ACTIVITY_PURPOSE_DEFAULTS } from "../data/presets";

export interface CanvasRenderOptions {
  visualContext?: VisualContext;
  domain?: DomainKey;
  activityType: string;
  styleModifier: PhysicsStyleModifier;
  title: string;
  equation: string;
  purposeTitle?: string;
  purposeMessage?: string;
  branding: BrandingConfig;
  customSeed?: number;
  glowIntensity?: number; // 0 to 1
}

// Preload the official SVG logo for maximum crispness
let cachedLogoImage: HTMLImageElement | null = null;
if (typeof window !== "undefined") {
  cachedLogoImage = new Image();
  cachedLogoImage.src = "/gravitas-logo.svg";
}

// Pseudo-random generator with seed
function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function renderPhysicsArtwork(
  canvas: HTMLCanvasElement,
  options: CanvasRenderOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const rand = createRandom(options.customSeed || 42);

  ctx.clearRect(0, 0, width, height);

  // 1. BASE BACKGROUND: Deep Space Navy Blackboard
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    50,
    width * 0.5,
    height * 0.5,
    width * 0.8
  );
  bgGrad.addColorStop(0, "#080e22");
  bgGrad.addColorStop(0.5, "#050814");
  bgGrad.addColorStop(1, "#02040a");

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 1b. Subtle Coordinate Grid & Texture
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. CHALKBOARD EQUATIONS & DIAGRAMS (Ambient Background Layer)
  ctx.save();
  drawChalkboardFormulas(ctx, width, height, options.domain || "Astrophysics", options.equation);
  ctx.restore();

  // 3. DYNAMIC CONTEXT-AWARE VISUAL ARTWORK
  // (Varied outputs based on context: workshop, recruiting, stargazing, fun fact, hackathon, research)
  // NEVER the same static uploaded silhouette!
  const contextType: VisualContext = options.visualContext || 
    (options.activityType === "Recruitment" ? "recruitment" :
    (options.activityType === "Workshop" ? "workshop" :
    (options.activityType === "Fun Fact" ? "fun_fact" :
    (options.activityType === "Stargazing / Lab Demo" ? "stargazing" :
    (options.activityType === "Physics Hackathon" ? "hackathon" : "research")))));

  drawContextArtwork(ctx, width, height, contextType, rand, options);

  // 4. FLOATING PARTICLES & COSMIC SPARKLES
  drawCosmicParticles(ctx, width, height, rand);

  // 5. PROMINENT PURPOSE SECTION (Clear Purpose & Bold Announcement Message)
  drawProminentPurposeSection(ctx, width, height, options);

  // 6. SINGLE OFFICIAL GRAVITAS LOGO (Incorporate logo in every output, exactly once, transparent/matching bg)
  if (options.branding.showLogo) {
    drawBrandingOverlay(ctx, width, height, options);
  }

  // 7. EVENT BANNER (If enabled)
  if (options.branding.showEventBanner && options.branding.eventBannerText) {
    drawEventBanner(ctx, width, height, options.branding);
  }
}

/**
 * Draws chalk formulas, vector diagrams, and Feynman/polar diagrams on the blackboard
 */
function drawChalkboardFormulas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  domain: DomainKey,
  primaryEquation: string
) {
  ctx.font = "italic 16px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(220, 235, 255, 0.28)";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 6;

  // Domain specific chalk equations
  const equations: { text: string; x: number; y: number; size?: number }[] = [
    { text: "iℏ ∂ψ/∂t = Ĥψ", x: 70, y: 140, size: 20 },
    { text: "R_{μν} - ½Rg_{μν} + Λg_{μν} = 8πG T_{μν}", x: 70, y: 220 },
    { text: "∇ × B = μ₀J + μ₀ε₀ ∂E/∂t", x: width - 380, y: 150 },
    { text: "S = k_B ln Ω   [dS ≥ 0]", x: width - 340, y: 230 },
    { text: "Δx · Δp ≥ ℏ / 2", x: 80, y: 310 },
    { text: "E² = (pc)² + (m₀c²)²", x: width - 320, y: 320 },
    { text: "P + ½ρv² + ρgh = const", x: 90, y: 780 },
    { text: "n₁ sin θ₁ = n₂ sin θ₂", x: 90, y: 850 },
    { text: "∮ B · dA = 0", x: width - 260, y: 780 },
    { text: "F = G(m₁m₂)/r²", x: width - 290, y: 850 },
  ];

  equations.forEach((eq) => {
    ctx.font = `italic ${eq.size || 16}px 'JetBrains Mono', monospace`;
    ctx.fillText(eq.text, eq.x, eq.y);
  });

  // Main primary equation chalk highlight
  if (primaryEquation) {
    ctx.font = "bold italic 22px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(0, 240, 255, 0.45)";
    ctx.shadowBlur = 10;
    ctx.fillText(`▶ ${primaryEquation}`, 70, 70);
  }

  // Draw physics diagrams on blackboard (orbits, wave-packet, vectors)
  ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
  ctx.lineWidth = 1.5;

  // Light cone / coordinate frame
  ctx.beginPath();
  ctx.moveTo(180, 520);
  ctx.lineTo(260, 440);
  ctx.lineTo(340, 520);
  ctx.lineTo(260, 600);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(260, 400);
  ctx.lineTo(260, 640);
  ctx.moveTo(140, 520);
  ctx.lineTo(380, 520);
  ctx.stroke();

  // Quantum wave packet on right side
  ctx.beginPath();
  const startX = width - 340;
  const centerY = 520;
  for (let i = 0; i < 240; i++) {
    const x = startX + i;
    const envelope = Math.exp(-Math.pow((i - 120) / 45, 2));
    const y = centerY + Math.sin(i * 0.25) * 35 * envelope;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/**
 * DYNAMIC CONTEXT-AWARE VISUAL ARTWORK DISPATCHER
 * Generates rich, distinct visual graphics based on the context (Recruitment, Workshop, Stargazing, Fun Fact, Hackathon, Research)
 * completely avoiding repetitive or static silhouettes.
 */
function drawContextArtwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  contextType: VisualContext,
  rand: () => number,
  options: CanvasRenderOptions
) {
  ctx.save();
  switch (contextType) {
    case "recruitment":
      drawRecruitmentGateway(ctx, width, height, rand);
      break;
    case "workshop":
      drawWorkshopLabApparatus(ctx, width, height, rand);
      break;
    case "stargazing":
      drawStargazingObservatory(ctx, width, height, rand);
      break;
    case "fun_fact":
      drawWarpedSpacetimeCurvature(ctx, width, height, rand);
      break;
    case "hackathon":
      drawHackathonCyberPhysics(ctx, width, height, rand);
      break;
    case "research":
    default:
      drawQuantumInterferenceLattice(ctx, width, height, rand);
      break;
  }
  ctx.restore();
}

/**
 * 1. RECRUITMENT CONTEXT ARTWORK:
 * A celestial cosmic stargate / event-horizon portal with radiant perspective beams expanding outward,
 * invitation to step into the cosmos, glowing accretion ring and telemetry crosshairs.
 */
function drawRecruitmentGateway(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.58;

  // Deep radiant cosmic aura
  const portalGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 320);
  portalGlow.addColorStop(0, "rgba(0, 240, 255, 0.45)");
  portalGlow.addColorStop(0.35, "rgba(147, 51, 234, 0.3)");
  portalGlow.addColorStop(0.7, "rgba(2, 6, 23, 0.5)");
  portalGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
  ctx.fillStyle = portalGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  // Radiant perspective energy beams radiating outward into deep space
  ctx.save();
  const numBeams = 16;
  for (let i = 0; i < numBeams; i++) {
    const angle = (i / numBeams) * Math.PI * 2;
    const len = 220 + rand() * 120;
    ctx.strokeStyle = i % 2 === 0 ? "rgba(0, 240, 255, 0.25)" : "rgba(192, 132, 252, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 75, cy + Math.sin(angle) * 75);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();

  // Concentric Stargate Event-Horizon Rings
  const ringRadii = [80, 115, 155, 195, 235];
  ringRadii.forEach((r, idx) => {
    ctx.strokeStyle = idx % 2 === 0 ? "rgba(0, 240, 255, 0.75)" : "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = idx === 1 ? 3 : 1.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = idx === 1 ? 14 : 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Orbital coordinate ticks & angle calibration
  ctx.font = "bold 10px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  angles.forEach((deg) => {
    const rad = (deg * Math.PI) / 180;
    const px = cx + Math.cos(rad) * 200;
    const py = cy + Math.sin(rad) * 200;
    ctx.fillText(`${deg}°`, px - 10, py + 4);

    ctx.beginPath();
    ctx.arc(cx + Math.cos(rad) * 155, cy + Math.sin(rad) * 155, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  });

  // Gateway Archway Pillars & Telemetry Frame
  ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Left Pillar
  ctx.moveTo(cx - 260, cy - 140);
  ctx.lineTo(cx - 260, cy + 180);
  ctx.lineTo(cx - 240, cy + 180);
  // Right Pillar
  ctx.moveTo(cx + 260, cy - 140);
  ctx.lineTo(cx + 260, cy + 180);
  ctx.lineTo(cx + 240, cy + 180);
  ctx.stroke();

  // Central Singular Glow Point (The Destination)
  const coreSingularity = ctx.createRadialGradient(cx, cy, 2, cx, cy, 50);
  coreSingularity.addColorStop(0, "#ffffff");
  coreSingularity.addColorStop(0.3, "#00f0ff");
  coreSingularity.addColorStop(0.7, "rgba(147, 51, 234, 0.6)");
  coreSingularity.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = coreSingularity;
  ctx.beginPath();
  ctx.arc(cx, cy, 50, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 2. WORKSHOP CONTEXT ARTWORK:
 * Laboratory optics bench: triangular prism dispersing laser ray into spectral colors,
 * oscilloscope sinusoidal telemetry waveform, optical beam-splitters & sensor calibration grid.
 */
function drawWorkshopLabApparatus(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.55;

  // Optical bench base coordinate grid
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
  ctx.lineWidth = 1;
  for (let x = cx - 280; x <= cx + 280; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, cy - 120);
    ctx.lineTo(x, cy + 160);
    ctx.stroke();
  }
  for (let y = cy - 120; y <= cy + 160; y += 40) {
    ctx.beginPath();
    ctx.moveTo(cx - 280, y);
    ctx.lineTo(cx + 280, y);
    ctx.stroke();
  }
  ctx.restore();

  // Precision Prism Dimensions (Equilateral)
  const prismSide = 180;
  const p1 = { x: cx, y: cy - 100 }; // top vertex
  const p2 = { x: cx - prismSide * 0.866, y: cy + 55 }; // bottom-left
  const p3 = { x: cx + prismSide * 0.866, y: cy + 55 }; // bottom-right

  // Incoming Coherent Laser Beam (Left)
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(cx - 280, cy);
  ctx.lineTo(cx - 70, cy - 10);
  ctx.stroke();

  // Laser Source Emitter Box
  ctx.fillStyle = "rgba(3, 7, 24, 0.9)";
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 320, cy - 25, 45, 30);
  ctx.strokeRect(cx - 320, cy - 25, 45, 30);
  ctx.fillStyle = "#00f0ff";
  ctx.font = "bold 9px 'JetBrains Mono', monospace";
  ctx.fillText("LASER", cx - 315, cy - 6);
  ctx.restore();

  // Glass Prism Body with dielectric gradient
  ctx.save();
  const prismGrad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
  prismGrad.addColorStop(0, "rgba(0, 240, 255, 0.2)");
  prismGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
  prismGrad.addColorStop(1, "rgba(168, 85, 247, 0.25)");
  ctx.fillStyle = prismGrad;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Refracted Spectral Dispersion Fan (Right)
  const spectralColors = [
    { color: "#ef4444", angle: -0.22, name: "650nm (Red)" },
    { color: "#f59e0b", angle: -0.12, name: "590nm (Amber)" },
    { color: "#10b981", angle: -0.02, name: "532nm (Green)" },
    { color: "#00f0ff", angle: 0.08, name: "488nm (Cyan)" },
    { color: "#a855f7", angle: 0.20, name: "405nm (Violet)" },
  ];

  ctx.save();
  spectralColors.forEach((spec) => {
    ctx.strokeStyle = spec.color;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = spec.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(cx + 60, cy - 10);
    const endX = cx + 290;
    const endY = cy - 10 + Math.tan(spec.angle) * 230;
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Sensor Target Marker
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Oscilloscope Waveform Display at bottom of lab bench
  const oscY = cy + 120;
  ctx.save();
  ctx.fillStyle = "rgba(2, 6, 23, 0.88)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.fillRect(cx - 240, oscY - 35, 480, 65);
  ctx.strokeRect(cx - 240, oscY - 35, 480, 65);

  // Centerline
  ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx - 240, oscY);
  ctx.lineTo(cx + 240, oscY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sinusoidal Interference Waveform
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  for (let x = 0; x < 460; x++) {
    const px = cx - 230 + x;
    const py = oscY + Math.sin(x * 0.05) * 18 * Math.cos(x * 0.015);
    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * 3. STARGAZING CONTEXT ARTWORK:
 * Concentric long-exposure polar star trails, deep space ring nebula,
 * telescope azimuth aiming reticle crosshair, and labeled constellation vectors.
 */
function drawStargazingObservatory(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.56;

  // Deep space emission nebula cloud
  const nebula = ctx.createRadialGradient(cx + 40, cy - 30, 20, cx, cy, 300);
  nebula.addColorStop(0, "rgba(168, 85, 247, 0.35)");
  nebula.addColorStop(0.4, "rgba(59, 130, 246, 0.25)");
  nebula.addColorStop(0.7, "rgba(0, 240, 255, 0.15)");
  nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = nebula;
  ctx.beginPath();
  ctx.arc(cx, cy, 300, 0, Math.PI * 2);
  ctx.fill();

  // Concentric Long-Exposure Star Trail Arcs
  const poleX = cx - 20;
  const poleY = cy - 20;
  ctx.save();
  const trailRadii = [40, 75, 110, 150, 195, 240, 285];
  trailRadii.forEach((r, idx) => {
    ctx.strokeStyle = idx % 2 === 0 ? "rgba(0, 240, 255, 0.45)" : "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(poleX, poleY, r, 0.2 * Math.PI, 1.4 * Math.PI);
    ctx.stroke();
  });
  ctx.restore();

  // Central Polaris Star
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(poleX, poleY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Telescope Aiming Reticle (HUD crosshair)
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.65)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.arc(cx, cy, 90, 0, Math.PI * 2);
  ctx.stroke();

  // Reticle crosshair spikes
  ctx.beginPath();
  ctx.moveTo(cx - 210, cy);
  ctx.lineTo(cx - 150, cy);
  ctx.moveTo(cx + 150, cy);
  ctx.lineTo(cx + 210, cy);
  ctx.moveTo(cx, cy - 210);
  ctx.lineTo(cx, cy - 150);
  ctx.moveTo(cx, cy + 150);
  ctx.lineTo(cx, cy + 210);
  ctx.stroke();

  // Degree ticks & Celestial coordinates
  ctx.font = "bold 10px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#00f0ff";
  ctx.fillText("AZ: 184° 22'", cx - 170, cy + 200);
  ctx.fillText("ALT: +46° 10'", cx + 80, cy + 200);
  ctx.fillText("FOV: 0.85°", cx - 35, cy - 190);
  ctx.restore();

  // Constellation Asterism (Connected Star Vertices)
  const stars = [
    { x: cx - 110, y: cy - 70, r: 3.5, name: "α Orionis" },
    { x: cx - 40, y: cy - 30, r: 2.5 },
    { x: cx + 10, y: cy - 20, r: 2.5 },
    { x: cx + 60, y: cy - 10, r: 2.5 },
    { x: cx + 120, y: cy + 60, r: 4, name: "β Rigel" },
    { x: cx - 90, y: cy + 50, r: 3 },
  ];

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(stars[0].x, stars[0].y);
  stars.forEach((s) => ctx.lineTo(s.x, s.y));
  ctx.stroke();

  stars.forEach((s) => {
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.name) {
      ctx.font = "italic 9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(220, 235, 255, 0.85)";
      ctx.fillText(s.name, s.x + 8, s.y - 4);
    }
  });
  ctx.restore();
}

/**
 * 4. FUN FACT / ASTROPHYSICS CONTEXT ARTWORK:
 * Einstein-Rosen spacetime curvature: 3D perspective gravity well warping downward into a singularity,
 * photon sphere lensing ring, and curved null geodesic trajectories.
 */
function drawWarpedSpacetimeCurvature(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.58;

  // Accretion Disk & Event Horizon Glow
  const diskGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 260);
  diskGlow.addColorStop(0, "#ffffff");
  diskGlow.addColorStop(0.12, "#00f0ff");
  diskGlow.addColorStop(0.4, "rgba(147, 51, 234, 0.45)");
  diskGlow.addColorStop(0.8, "rgba(2, 6, 23, 0.6)");
  diskGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = diskGlow;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 260, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Perspective Gravitational Metric Mesh (sagging grid)
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
  ctx.lineWidth = 1;

  // Concentric Elliptical Orbit Contours
  for (let r = 30; r <= 240; r += 28) {
    const sag = Math.pow(r / 240, 1.4);
    ctx.beginPath();
    ctx.ellipse(cx, cy + (1 - sag) * 45, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial Geodesic Infall Lines
  for (let a = 0; a < 24; a++) {
    const angle = (a / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 35, cy + Math.sin(angle) * 14);
    ctx.quadraticCurveTo(
      cx + Math.cos(angle) * 140,
      cy + Math.sin(angle) * 55 + 20,
      cx + Math.cos(angle) * 260,
      cy + Math.sin(angle) * 95
    );
    ctx.stroke();
  }
  ctx.restore();

  // Central Black Hole Void (Event Horizon)
  ctx.fillStyle = "#010206";
  ctx.beginPath();
  ctx.arc(cx, cy + 15, 36, 0, Math.PI * 2);
  ctx.fill();

  // Relativistic Photon Ring
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy + 15, 37, 0, Math.PI * 2);
  ctx.stroke();

  // Lensed Null Geodesic Ray Arcs bending around the horizon
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 240, cy - 60);
  ctx.bezierCurveTo(cx - 70, cy - 20, cx + 70, cy - 20, cx + 240, cy - 60);
  ctx.stroke();
  ctx.restore();
}

/**
 * 5. HACKATHON CONTEXT ARTWORK:
 * Cyber-Physics Matrix: Bubble chamber particle collision tracks spiraling outward,
 * digital vector velocity field, shockwave wavefronts, and computational telemetry.
 */
function drawHackathonCyberPhysics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.56;

  // Expanding shockwave rings
  ctx.save();
  for (let r = 50; r <= 240; r += 45) {
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Particle Collision Event (CERN Bubble Chamber Style Spirals)
  const colors = ["#00f0ff", "#ffffff", "#a855f7", "#10b981"];
  for (let t = 0; t < 14; t++) {
    const startAngle = (t / 14) * Math.PI * 2;
    const dir = t % 2 === 0 ? 1 : -1;
    ctx.strokeStyle = colors[t % colors.length];
    ctx.lineWidth = 1.6;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);

    for (let step = 0; step < 70; step++) {
      const radius = step * 3.2;
      const theta = startAngle + dir * Math.log(1 + step * 0.08) * 2.8;
      const px = cx + Math.cos(theta) * radius;
      const py = cy + Math.sin(theta) * radius;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Computational Telemetry HUD Bars (Hackathon / Simulation Theme)
  ctx.save();
  const hudY = cy + 130;
  ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.fillRect(cx - 200, hudY, 400, 32);
  ctx.strokeRect(cx - 200, hudY, 400, 32);

  // Equalizer-like frequency telemetry bars
  for (let b = 0; b < 24; b++) {
    const barH = 6 + (Math.sin(b * 0.6) * 0.5 + 0.5) * 16;
    ctx.fillStyle = b > 18 ? "#a855f7" : "#00f0ff";
    ctx.fillRect(cx - 185 + b * 15, hudY + 24 - barH, 9, barH);
  }

  ctx.font = "bold 9px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("SIMULATION TIME: 24:00:00 // TELEMETRY: OK", cx - 185, hudY - 8);
  ctx.restore();
}

/**
 * 6. RESEARCH & GENERAL PHYSICS CONTEXT ARTWORK:
 * Double-slit quantum wave interference pattern with bright & dark probability fringes,
 * harmonic oscillator potential well curve, and quantized energy levels.
 */
function drawQuantumInterferenceLattice(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const cx = width * 0.5;
  const cy = height * 0.56;

  // Quantum potential well V(x) = k*x^2
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let x = -180; x <= 180; x += 4) {
    const px = cx + x;
    const py = cy + 100 - (Math.pow(x / 180, 2) * 140);
    if (x === -180) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Quantized Eigenstate Energy Levels (Horizontal lines)
  const levels = [
    { y: cy + 70, label: "E₀ = ½ℏω" },
    { y: cy + 30, label: "E₁ = 3/2ℏω" },
    { y: cy - 10, label: "E₂ = 5/2ℏω" },
    { y: cy - 50, label: "E₃ = 7/2ℏω" }
  ];

  levels.forEach((lvl, idx) => {
    ctx.strokeStyle = idx === 0 ? "#ffffff" : "rgba(0, 240, 255, 0.75)";
    ctx.lineWidth = 1.5;
    const halfWidth = 80 + idx * 28;
    ctx.beginPath();
    ctx.moveTo(cx - halfWidth, lvl.y);
    ctx.lineTo(cx + halfWidth, lvl.y);
    ctx.stroke();

    // Wavefunction oscillation at each level
    ctx.strokeStyle = "rgba(168, 85, 247, 0.75)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = -halfWidth; x <= halfWidth; x += 3) {
      const px = cx + x;
      const py = lvl.y - Math.sin((x / halfWidth) * Math.PI * (idx + 1)) * 14;
      if (x === -halfWidth) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.font = "italic 9px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(220, 235, 255, 0.85)";
    ctx.fillText(lvl.label, cx + halfWidth + 8, lvl.y + 3);
  });
  ctx.restore();

  // Double-Slit Coherent Wave Propagation Arcs (Top half)
  ctx.save();
  const slit1X = cx - 35;
  const slit2X = cx + 35;
  const slitY = cy - 110;

  for (let r = 25; r <= 150; r += 22) {
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(slit1X, slitY, r, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(slit2X, slitY, r, 0, Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Background star dust and subtle floating cosmic particles
 */
function drawCosmicParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  ctx.save();
  for (let i = 0; i < 60; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = rand() * 1.8;
    const alpha = rand() * 0.4 + 0.1;

    ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * PROMINENT PURPOSE SECTION:
 * Displays the purpose of the post boldly and clearly with an unmistakable headline and message
 * across all domains (e.g. Recruitment, Workshop, Fun Fact, Hackathon).
 */
function drawProminentPurposeSection(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CanvasRenderOptions
) {
  ctx.save();

  const purposeDefaults = ACTIVITY_PURPOSE_DEFAULTS[options.activityType as keyof typeof ACTIVITY_PURPOSE_DEFAULTS];
  const headline = (options.purposeTitle || purposeDefaults?.headline || options.activityType.toUpperCase()).toUpperCase();
  const message = options.purposeMessage || purposeDefaults?.defaultMessage || options.title;
  const badge = purposeDefaults?.badgeLabel || `✦ ${options.activityType.toUpperCase()} ✦`;

  const leftMargin = 70;
  const maxWidth = width - leftMargin * 2;

  // 1. Top Affiliation Masthead
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(0, 240, 255, 0.85)";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 6;
  ctx.fillText(
    `GRAVITAS • K.J SOMAIYA SCHOOL OF ENGINEERING // ${options.domain.toUpperCase()} DIVISION`,
    leftMargin,
    75
  );

  // 2. High-Visibility Purpose Badge Pill
  const badgeY = 96;
  ctx.font = "700 13px 'JetBrains Mono', monospace";
  const badgeTextWidth = ctx.measureText(badge).width;
  const badgePadX = 14;
  const badgeW = badgeTextWidth + badgePadX * 2;
  const badgeH = 28;

  ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 10;
  ctx.fillRect(leftMargin, badgeY, badgeW, badgeH);
  ctx.strokeRect(leftMargin, badgeY, badgeW, badgeH);

  // Badge text
  ctx.fillStyle = "#00f0ff";
  ctx.fillText(badge, leftMargin + badgePadX, badgeY + 19);

  // 3. Massive Prominent Purpose Headline (Unmistakable announcement)
  const headlineY = 175;
  ctx.font = "900 46px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 16;
  ctx.fillText(headline, leftMargin, headlineY);

  // 4. Purpose Message Box (Clear, prominent message explaining the post purpose)
  const msgBoxY = 205;
  const msgBoxH = 88;
  
  // High-contrast container for legibility over nebula & chalk
  ctx.fillStyle = "rgba(3, 7, 24, 0.82)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.fillRect(leftMargin, msgBoxY, maxWidth, msgBoxH);
  ctx.strokeRect(leftMargin, msgBoxY, maxWidth, msgBoxH);

  // Left neon accent pillar
  ctx.fillStyle = "#00f0ff";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 8;
  ctx.fillRect(leftMargin, msgBoxY, 4, msgBoxH);

  // Wrap message lines
  ctx.font = "500 19px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#e2e8f0";
  ctx.shadowBlur = 0;

  const words = message.split(" ");
  let line1 = "";
  let line2 = "";
  for (const w of words) {
    if ((line1 + " " + w).length < 65 && !line2) {
      line1 += (line1 ? " " : "") + w;
    } else {
      line2 += (line2 ? " " : "") + w;
    }
  }

  ctx.fillText(line1, leftMargin + 20, msgBoxY + 36);
  if (line2) {
    ctx.fillText(line2, leftMargin + 20, msgBoxY + 66);
  }

  // 5. Post Topic Title (Lower region)
  if (options.title) {
    ctx.font = "800 30px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 240, 255, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText(options.title.toUpperCase(), leftMargin, height - 90);
  }

  ctx.restore();
}

/**
 * BRANDING KIT OVERLAY:
 * Renders the Official GRAVITAS Insignia from the uploaded image.
 * Transparent background that adapts seamlessly to the app's dark cosmic canvas.
 */
function drawBrandingOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CanvasRenderOptions
) {
  const branding = options.branding;
  ctx.save();
  ctx.globalAlpha = branding.opacity;

  // Dimensions of the official emblem
  const logoW = 290;
  const logoH = 145;

  let x = width - logoW - 40;
  let y = height - logoH - 45;

  if (branding.position === "bottom-left") {
    x = 40;
    y = height - logoH - 45;
  } else if (branding.position === "bottom-center") {
    x = (width - logoW) / 2;
    y = height - logoH - 45;
  } else if (branding.position === "top-right") {
    x = width - logoW - 40;
    y = 50;
  } else if (branding.position === "top-left") {
    x = 40;
    y = 50;
  }

  // Draw Official Logo
  drawOfficialGravitasLogo(ctx, x, y, logoW, logoH, branding.showNeonGlow);

  ctx.restore();
}

/**
 * Draws the exact Official GRAVITAS Logo from the user's uploaded image:
 * - White dynamic elliptical orbit arcs
 * - 3 input rays with Rocket, Sine Wave, and Atom + Lightning
 * - Bi-convex optical lens with refracted cyan rays converging right
 * - Cyan soundwave frequency spectrum
 * - G.R.A.V.I.T.A.S. and K.J SOMAIYA SCHOOL OF ENGINEERING
 * - Purely transparent background (adapting to app / canvas background)
 */
function drawOfficialGravitasLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  glow: boolean
) {
  // If preloaded SVG image is ready, draw directly
  if (cachedLogoImage && cachedLogoImage.complete && cachedLogoImage.naturalWidth > 0) {
    if (glow) {
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 12;
    }
    ctx.drawImage(cachedLogoImage, x, y, w, h);
    return;
  }

  // Native Vector Drawing Fallback for 100% immediate synchronous rendering
  ctx.save();
  const scaleX = w / 400;
  const scaleY = h / 230;

  ctx.translate(x, y);
  ctx.scale(scaleX, scaleY);

  if (glow) {
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 10;
  }

  // 1. Outer White Orbit Ellipse - Top Arc
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(50, 160);
  ctx.bezierCurveTo(20, 120, 40, 75, 100, 55);
  ctx.bezierCurveTo(160, 30, 270, 35, 350, 60);
  ctx.bezierCurveTo(395, 75, 415, 95, 415, 98);
  ctx.bezierCurveTo(410, 100, 395, 85, 345, 68);
  ctx.bezierCurveTo(265, 42, 160, 40, 105, 62);
  ctx.bezierCurveTo(50, 85, 35, 125, 50, 160);
  ctx.closePath();
  ctx.fill();

  // 2. Outer White Orbit Ellipse - Bottom Arc
  ctx.beginPath();
  ctx.moveTo(375, 75);
  ctx.bezierCurveTo(405, 115, 390, 160, 335, 180);
  ctx.bezierCurveTo(270, 205, 160, 202, 80, 175);
  ctx.bezierCurveTo(35, 160, 15, 138, 15, 135);
  ctx.bezierCurveTo(20, 132, 35, 150, 85, 170);
  ctx.bezierCurveTo(165, 195, 270, 196, 330, 173);
  ctx.bezierCurveTo(385, 150, 395, 110, 375, 75);
  ctx.closePath();
  ctx.fill();

  // 3. Three Input Rays on the Left
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";

  // Ray 1 (Top)
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(130, 100);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(124, 96);
  ctx.lineTo(130, 100);
  ctx.lineTo(124, 104);
  ctx.stroke();

  // Rocket Icon on Ray 1
  ctx.fillStyle = "#00f0ff";
  ctx.beginPath();
  ctx.ellipse(75, 94, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(68, 92);
  ctx.lineTo(64, 88);
  ctx.lineTo(70, 94);
  ctx.lineTo(64, 99);
  ctx.lineTo(68, 96);
  ctx.closePath();
  ctx.fill();

  // Ray 2 (Middle)
  ctx.beginPath();
  ctx.moveTo(40, 118);
  ctx.lineTo(130, 118);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(124, 114);
  ctx.lineTo(130, 118);
  ctx.lineTo(124, 122);
  ctx.stroke();

  // Sine Wave on Ray 2
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 0; i < 40; i++) {
    const px = 55 + i;
    const py = 118 + Math.sin((i / 40) * Math.PI * 4) * 6;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Ray 3 (Bottom)
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(40, 136);
  ctx.lineTo(130, 136);
  ctx.stroke();
  // Arrow head
  ctx.beginPath();
  ctx.moveTo(124, 132);
  ctx.lineTo(130, 136);
  ctx.lineTo(124, 140);
  ctx.stroke();

  // Molecule & Lightning on Ray 3
  ctx.fillStyle = "#00f0ff";
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(68, 142, 3, 0, Math.PI * 2);
  ctx.arc(80, 136, 3, 0, Math.PI * 2);
  ctx.arc(74, 148, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(68, 142);
  ctx.lineTo(80, 136);
  ctx.lineTo(74, 148);
  ctx.closePath();
  ctx.stroke();

  // 4. Center Bi-Convex Optical Lens
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(138, 75);
  ctx.bezierCurveTo(120, 95, 120, 145, 138, 165);
  ctx.bezierCurveTo(156, 145, 156, 95, 138, 75);
  ctx.closePath();
  ctx.stroke();

  // Refracted converging cyan rays emerging from lens
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(142, 100);
  ctx.lineTo(190, 118);
  ctx.moveTo(146, 118);
  ctx.lineTo(190, 118);
  ctx.moveTo(142, 136);
  ctx.lineTo(190, 118);
  ctx.stroke();

  // 5. Right-side Audio Spectrum Waveform
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 1.8;
  const waveHeights = [8, 14, 22, 12, 18, 32, 16, 26, 18, 36, 20, 30, 22, 40, 24, 34, 22, 38, 20, 32, 16, 26, 14, 20, 12, 8];
  const waveStartX = 194;
  waveHeights.forEach((wh, idx) => {
    const wx = waveStartX + idx * 7.5;
    ctx.beginPath();
    ctx.moveTo(wx, 118 - wh / 2);
    ctx.lineTo(wx, 118 + wh / 2);
    ctx.stroke();
  });

  // 6. Text: G.R.A.V.I.T.A.S.
  ctx.font = "900 16px 'Space Grotesk', monospace";
  ctx.fillStyle = "#00f0ff";
  ctx.textAlign = "center";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 8;
  ctx.fillText("G.R.A.V.I.T.A.S.", 288, 122);

  // 7. Subtext: K.J SOMAIYA SCHOOL OF ENGINEERING
  ctx.font = "700 7.5px 'Space Grotesk', sans-serif";
  ctx.fillStyle = "#00f0ff";
  ctx.fillText("K.J SOMAIYA SCHOOL OF ENGINEERING", 288, 138);

  ctx.restore();
}

/**
 * Event Banner overlay (e.g. for Recruitment drives & Workshops)
 */
function drawEventBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  branding: BrandingConfig
) {
  ctx.save();
  const bannerY = height - 40;

  ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.fillRect(0, bannerY, width, 40);
  ctx.beginPath();
  ctx.moveTo(0, bannerY);
  ctx.lineTo(width, bannerY);
  ctx.stroke();

  ctx.font = "700 13px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 8;
  ctx.fillText(branding.eventBannerText || "EXPLORE. QUESTION. DISCOVER. • JOIN GRAVITAS", width / 2, bannerY + 25);

  ctx.restore();
}
