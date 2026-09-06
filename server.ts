import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Exact physics-art image prompt modifiers as specified in the GRAVITAS master brief
const DOMAIN_IMAGE_PROMPTS: Record<string, string> = {
  "Astrophysics": "A cinematic, high-resolution NASA-style visualization of a black hole's accretion disk, vibrant violets and oranges, 8k resolution, cosmic dust particles.",
  "Quantum Physics": "Abstract neon particle collision, glowing subatomic trails, minimalist dark background, deep blue and electric magenta aesthetic.",
  "Aerodynamics": "Hyper-realistic wind tunnel simulation of a futuristic aircraft, glowing streamlines of air, sleek metallic finish, technical yet beautiful.",
  "Optics": "Macro photography of a laser beam refracting through a crystal prism, rainbow dispersion, dark studio lighting, hyper-detailed glass textures.",
  "Thermal Physics": "Thermodynamic heat entropy visual with glowing temperature gradients from deep space navy to intense thermal cyan, microscopic particle kinetic energy, Boltzmann statistical distribution, 8k resolution.",
  "Web Dev": "Futuristic 3D WebGL physics simulation grid, glowing neon cyan gravitational orbit trails, particle field collision, cybernetic minimalism, 8k resolution."
};

const RECRUITMENT_POST = {
  title: "Join the Cosmos • GRAVITAS",
  equation: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi \\quad | \\quad R_s = \\frac{2GM}{c^2}",
  funFact: "Every atom in your body was forged in the nuclear furnace of an exploding supernova billions of years ago.",
  instagram: "Step into the world where atoms dance and galaxies collide. ⚛️🔭 From the mysteries of Quantum Mechanics to the engineering of Aerodynamics, GRAVITAS is your gateway to the universe. No expertise required—just your curiosity. Are you ready to explore? #JoinGravitas #SpaceClub #PhysicsIsFun",
  linkedin: "Are you ready to explore where atoms dance and galaxies collide?\n\nWhether you are fascinated by the quantum realm or the aerospace engineering behind supersonic flight, GRAVITAS is your gateway to real-world scientific discovery. We bridge curiosity, theoretical physics, and computational tools for ambitious undergraduates.\n\n• No prior expertise required—just genuine curiosity\n• Weekly workshops, telescope observation nights & simulation hackathons\n• Build lasting peer networks and research project portfolios\n\nExplore. Question. Discover.\nJoin GRAVITAS this semester!\n\n#JoinGravitas #PhysicsClub #STEMCareers #CollegeRecruitment #Astrophysics #QuantumPhysics",
  imagePrompt: "A double-exposure image of a human silhouette filled with a swirling nebula, standing in front of a chalkboard of glowing equations, bold minimalism, cosmic futurism, deep space navy, neon cyan, 8k resolution."
};

// Fallback high-quality curated posts if offline or API unavailable
const FALLBACK_DATA: Record<string, any> = {
  "Astrophysics": {
    title: "Echoes of the Event Horizon",
    equation: "R_s = \\frac{2GM}{c^2}",
    funFact: "Time practically halts near a black hole's event horizon due to gravitational time dilation.",
    instagram: "🌌 What happens when gravity becomes infinite?\n\nInside a singularity, the laws of classical physics unravel. At GRAVITAS, we don't just stare at the cosmos—we dissect the fabric of spacetime, stellar nucleosynthesis, and the echoes of the Big Bang.\n\n✨ Dive into cosmic wonders\n🔭 Stargazing nights & computational relativity sessions\n🚀 Connect with passionate stargazers\n\nDrop a 🪐 if you’ve ever wondered what lies beyond the observable horizon!\n\n👉 DM us or tap the link in bio to join GRAVITAS physics club!\n\n#Astrophysics #GravitasClub #SpaceExploration #CosmicMysteries #PhysicsStudents #BlackHoles #STEM",
    linkedin: "How does calculating spacetime curvature prepare you for modern computational challenges?\n\nAstrophysics is fundamentally the study of extreme systems where general relativity and thermodynamics collide. At GRAVITAS, our Astrophysics division delves into gravitational lensing, orbital mechanics, and stellar evolution.\n\nKey takeaways for members:\n• Hands-on simulation using open-source astrophysical toolkits\n• Deep dives into telescope telemetry and spectroscopic data\n• Collaborative problem solving for research paper presentations\n\nExplore. Question. Discover.\nJoin GRAVITAS to bridge curiosity and scientific rigor.\n\n#Astrophysics #PhysicsResearch #ComputationalScience #STEMCareers #Gravitas #CollegeClubs",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Astrophysics"]
  },
  "Quantum Physics": {
    title: "Superposition & The Quantum Leap",
    equation: "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi",
    funFact: "A particle in superposition traverses all possible trajectories simultaneously until measured.",
    instagram: "⚛️ Both here AND there—until you observe it.\n\nWelcome to Quantum Mechanics, where reality depends on who’s looking. From wave-particle duality to quantum entanglement, GRAVITAS invites you to question everything you took for granted about the physical universe.\n\n💡 Quantum cryptography workshops\n🔬 Thought experiments & Schrödinger paradox debates\n🔮 Hands-on simulation of Qubits\n\nAre you ready to observe the unobservable? Join GRAVITAS today!\n\n#QuantumPhysics #QuantumMechanics #Gravitas #Schrodinger #PhysicsFun #ScienceGeeks #CollegeClub",
    linkedin: "The next technological revolution won't be classical—it will be quantum.\n\nAt GRAVITAS, our Quantum Physics division introduces undergraduate researchers to the fundamentals of wave functions, matrix mechanics, and quantum computing architecture.\n\nWhy join our quantum study tracks?\n1. Demystifying quantum key distribution and quantum algorithms\n2. Peer-reviewed paper discussions on topological insulators and spintronics\n3. Building foundational mathematical physics intuition\n\nStep into the frontier of physical inquiry. Explore. Question. Discover.\n\n#QuantumComputing #QuantumPhysics #AppliedPhysics #STEM #GravitasClub #AcademicExcellence",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Quantum Physics"]
  },
  "Aerodynamics": {
    title: "Mastering the Boundary Layer",
    equation: "P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{const}",
    funFact: "Air acts like a viscous honey at micro scales and supersonic velocities generate shock cones hotter than lava.",
    instagram: "✈️ Taming the invisible fluid around us.\n\nFrom supersonic shockwaves to laminar flow gliders, Aerodynamics is the art of defying gravity with fluid dynamics and wing geometry. At GRAVITAS, we test theories with wind simulations and drone engineering.\n\n💨 Bernoulli vs. Navier-Stokes teardowns\n🎯 DIY airfoil prototyping & lift optimization\n🏎️ Aerodynamic drag minimization projects\n\nThink you can outfly turbulence? Join the GRAVITAS aerodynamic crew!\n\n#Aerodynamics #FluidDynamics #FlightPhysics #Gravitas #Engineering #Aerospace #PhysicsClub",
    linkedin: "Fluid mechanics remains one of the greatest unsolved mathematical challenges in modern engineering.\n\nAt GRAVITAS, our Aerodynamics wing provides practical exposure to computational fluid dynamics (CFD), boundary layer turbulence, and transonic flow analysis.\n\nMembers gain experience in:\n• Numerical simulation of aerodynamic drag and pressure differentials\n• Model wind tunnel demonstrations and telemetry analysis\n• Cross-disciplinary engineering collaboration between physicists and aerospace enthusiasts\n\nBuild the analytical edge that top aerospace and automotive firms seek.\n\n#Aerodynamics #FluidMechanics #AerospaceEngineering #CFD #Gravitas #STEMLeadership",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Aerodynamics"]
  },
  "Thermal Physics": {
    title: "Entropy & The Arrow of Time",
    equation: "dS \\ge \\frac{dQ}{T} \\quad | \\quad S = k_B \\ln \\Omega",
    funFact: "The second law of thermodynamics is the only fundamental law of physics that distinguishes past from future.",
    instagram: "🔥 You can't un-break an egg. Why?\n\nEntropy. The universe has a relentless forward direction, and it’s dictated by statistical mechanics and heat flow. Dive deep into the thermodynamics of black holes, cryogenics, and perpetual motion fallacies with GRAVITAS.\n\n🌡️ Statistical mechanics made intuitive\n❄️ Cryogenic principles & extreme phase transitions\n☕ The physics of daily thermodynamics\n\nCome break down the heat death of the universe with fellow physics buffs! Tap bio to join.\n\n#Thermodynamics #ThermalPhysics #Entropy #ArrowOfTime #Gravitas #PhysicsFacts #CollegeLife",
    linkedin: "From heat engines to quantum thermodynamics, energy dissipation drives all technological systems.\n\nGRAVITAS Thermal Physics division explores the intersection of statistical mechanics, non-equilibrium thermodynamics, and modern renewable energy conversion efficiency.\n\nFocus domains:\n• Carnot efficiency limits in modern thermal power and thermoelectric materials\n• Microscopic states (Boltzmann's entropy formulation)\n• Sustainable energy physics and heat dissipation in microprocessors\n\nCultivate true first-principles thinking with GRAVITAS.\n\n#Thermodynamics #EnergySystems #StatisticalMechanics #Physics #Engineering #Gravitas",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Thermal Physics"]
  },
  "Optics": {
    title: "Coherence, Photons & Spectral Illusions",
    equation: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad | \\quad E = h\\nu",
    funFact: "Lasers work via stimulated emission—photons marching in absolute unison with identical phase and wavelength.",
    instagram: "🌈 Bending light to reveal the hidden universe.\n\nLight is both wave and particle, a messenger from the edge of time. In the GRAVITAS Optics lab, we play with lasers, diffraction gratings, holography, and metamaterials that can bend light backwards!\n\n✨ Laser interferometry & holograms\n🔍 Total internal reflection & optical fibers\n🔭 Spectroscopy: Decoding star chemistry through light\n\nReady to see the world in a whole new spectrum? Join GRAVITAS!\n\n#Optics #Photonics #LaserPhysics #Spectroscopy #Gravitas #STEM #LightPhysics",
    linkedin: "Photonics is rapidly replacing electronics as the backbone of ultra-fast computing and communications.\n\nAt GRAVITAS, our Optics study track bridges classical wave optics with modern photonics and optical computation.\n\nHighlights of our program:\n• Interferometry experiments and precise laser wavelength calibration\n• Fiber-optic signal transmission physics\n• Optical cloaking and metamaterial research discussions\n\nDevelop insights into one of the most critical hardware sectors of the coming decade.\n\n#Optics #Photonics #Telecommunications #LaserPhysics #GRAVITAS #PhysicsInnovation",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Optics"]
  },
  "Web Dev": {
    title: "Simulating Spacetime on the Web",
    equation: "\\mathbf{F}_{net} = m\\mathbf{a} \\implies \\vec{r}_{t+\\Delta t} = \\vec{r}_t + \\vec{v}\\Delta t",
    funFact: "Physics simulation in WebGL/WebGPU lets you simulate thousands of gravitational N-body interactions in real-time right inside your browser.",
    instagram: "💻 Code meets the Cosmos.\n\nWho says physics belongs only in textbooks? At GRAVITAS Web Dev wing, we build interactive WebGL gravitational simulators, particle colliders on canvas, and real-time astrophysics visualizers!\n\n🚀 Three.js & WebGL 3D physics rendering\n⚡ N-Body gravitational orbit simulations\n🌐 Building cutting-edge tools for our scientific community\n\nCombine your love for coding with cosmic wonder. Join GRAVITAS Web Dev team today!\n\n#WebDev #CreativeCoding #PhysicsSimulation #Threejs #WebGL #Gravitas #CodingCommunity",
    linkedin: "Interactive scientific computing is transforming how complex physics is communicated and researched.\n\nGRAVITAS Web Development division is dedicated to engineering high-performance scientific simulations, interactive data dashboards, and 3D web visualizations using modern web technologies.\n\nWhat our web team builds:\n• Real-time N-body gravitational trajectory simulators\n• Custom visualization platforms for research data and club initiatives\n• Interactive physics tools using WebGL and TypeScript\n\nLooking to develop production-grade engineering skills while tackling physics challenges? Join GRAVITAS.\n\n#ScientificComputing #SoftwareEngineering #CreativeCoding #WebGL #TypeScript #Gravitas",
    imagePrompt: DOMAIN_IMAGE_PROMPTS["Web Dev"]
  }
};

// API route for generating content using Gemini
app.post("/api/generate-content", async (req, res) => {
  try {
    const {
      prompt: userPrompt = "",
      activityType = "Workshop",
      styleModifier = "Cosmic Futurism & Neon Vector Physics"
    } = req.body;

    const lowerText = `${userPrompt} ${activityType}`.toLowerCase();

    // Auto-detect context archetype
    let detectedContext = "general";
    if (lowerText.includes("recruit") || lowerText.includes("join") || lowerText.includes("fresher") || lowerText.includes("orientation") || lowerText.includes("member")) {
      detectedContext = "recruitment";
    } else if (lowerText.includes("workshop") || lowerText.includes("hands-on") || lowerText.includes("optics") || lowerText.includes("laser") || lowerText.includes("spectroscopy") || lowerText.includes("circuit") || lowerText.includes("lab")) {
      detectedContext = "workshop";
    } else if (lowerText.includes("star") || lowerText.includes("telescope") || lowerText.includes("astro") || lowerText.includes("night") || lowerText.includes("observation") || lowerText.includes("sky")) {
      detectedContext = "stargazing";
    } else if (lowerText.includes("fact") || lowerText.includes("curiosity") || lowerText.includes("did you know") || lowerText.includes("paradox") || lowerText.includes("wormhole") || lowerText.includes("black hole")) {
      detectedContext = "fun_fact";
    } else if (lowerText.includes("hack") || lowerText.includes("competition") || lowerText.includes("code") || lowerText.includes("simulat") || lowerText.includes("challenge")) {
      detectedContext = "hackathon";
    } else if (lowerText.includes("research") || lowerText.includes("paper") || lowerText.includes("seminar") || lowerText.includes("colloquium") || lowerText.includes("quantum")) {
      detectedContext = "research";
    }

    const ai = getGenAI();

    // Fallback data if offline
    const isRecruitment = detectedContext === "recruitment";
    const defaultPurposeTitle = isRecruitment ? "WE ARE RECRUITING" : (detectedContext === "workshop" ? "HANDS-ON WORKSHOP" : (detectedContext === "stargazing" ? "STARGAZING NIGHT" : (detectedContext === "hackathon" ? "PHYSICS HACKATHON" : (detectedContext === "fun_fact" ? "MIND-BENDING FACT" : "EXPLORE GRAVITAS"))));
    const defaultPurposeMessage = isRecruitment
      ? "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!"
      : (detectedContext === "workshop"
        ? "Hands-on masterclass simulating laboratory physics, optical apparatus & telemetry toolkits."
        : (detectedContext === "stargazing"
          ? "Join us on the college terrace for high-powered telescopic observation of the moon, planets & distant nebulae."
          : (detectedContext === "hackathon"
            ? "24 hours to simulate astrophysical telemetry and solve real computational physics challenges."
            : "Explore the fundamental symmetries of our universe with K.J Somaiya's premier physics society.")));

    if (!ai) {
      // Return structured fallback based on prompt
      return res.json({
        success: true,
        source: "curated_fallback",
        visualContext: detectedContext,
        activityType: isRecruitment ? "Recruitment" : (activityType || "Workshop"),
        title: userPrompt ? userPrompt.slice(0, 32) : "Symmetries of the Cosmos",
        purposeTitle: defaultPurposeTitle,
        purposeMessage: defaultPurposeMessage,
        equation: isRecruitment ? "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi \\quad | \\quad R_s = \\frac{2GM}{c^2}" : "E = mc^2 \\quad | \\quad \\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",
        funFact: "Time dilation near a high gravitational field causes clocks to tick measurably slower than in deep space.",
        instagramCaption: isRecruitment ? RECRUITMENT_POST.instagram : `🌌 ${defaultPurposeTitle} with GRAVITAS!\n\n${defaultPurposeMessage}\n\n✨ Explore experimental and computational physics\n🚀 Connect with curious peers across all engineering disciplines\n🔭 Build simulations, observe the night sky, and participate in projects\n\n👉 DM us or tap the link in bio to join GRAVITAS physics club!\n\n#JoinGravitas #SpaceClub #PhysicsIsFun #Gravitas #STEM #Somaiya`,
        linkedinCaption: `How does scientific curiosity translate into engineering excellence?\n\nAt GRAVITAS (K.J Somaiya School of Engineering), we cultivate rigorous inquiry, mathematical modeling, and experimental exploration.\n\nKey Highlights:\n• ${defaultPurposeMessage}\n• Collaborative problem solving and telemetry simulation\n• Hands-on peer learning for undergraduate students\n\nExplore. Question. Discover.\nJoin GRAVITAS to bridge curiosity and scientific rigor.\n\n#PhysicsClub #Engineering #Science #Research #Gravitas`,
        imagePrompt: `A high-contrast physics graphic: ${userPrompt || 'Cosmic exploration'}, ${styleModifier}, neon cyan accents #00f0ff, deep space navy #050814, crisp 8k composition.`,
        brandingText: "GRAVITAS • Explore. Question. Discover."
      });
    }

    const systemPrompt = `
You are the Chief Social Media Director and Physics Communicator for "GRAVITAS", the official physics & scientific exploration club at K.J Somaiya School of Engineering. Slogan: "Explore. Question. Discover."
Aesthetic: Bold Minimalism meets Cosmic Futurism. Colors: Deep space navy (#050814), neon cyan (#00f0ff), crisp white (#ffffff).
Tone: Intellectual yet welcoming, energetic, inspiring college freshers and engineering students to participate.

The user described the post they want to create in natural language:
"""${userPrompt || "General physics club showcase and recruitment for freshers"}"""

User Selected Settings:
- Activity Context: ${activityType}
- Visual Style Modifier: ${styleModifier}

TASK:
Analyze the user's description.
1. Deduce the primary "visualContext" from this list:
   - "recruitment" (if recruiting members, freshers, joining club)
   - "workshop" (if lab, optics, laser, hands-on demonstration, tutorial)
   - "stargazing" (if telescope, night sky observation, astronomy, deep sky)
   - "fun_fact" (if curiosity, mind-bending fact, paradox, black hole trivia)
   - "hackathon" (if competition, 24h build, coding simulation, challenge)
   - "research" (if seminar, paper presentation, theory, quantum mechanics)
   - "general" (otherwise)

2. Create a punchy, short graphic title (3-5 words, e.g., "The Quantum Horizon", "Laser Diffraction Lab", "Stargazing Terrace Night", "Join The Cosmos").

3. Create a bold, prominent purpose headline banner (e.g., "WE ARE RECRUITING", "HANDS-ON WORKSHOP", "DID YOU KNOW?", "STARGAZING NIGHT", "PHYSICS HACKATHON").

4. Create a punchy, crystal-clear 1-2 sentence purpose message stating the exact purpose clearly so anyone viewing the post instantly understands what this is about (e.g., if recruitment: "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!").

5. Provide a famous, relevant physics/math equation in clean LaTeX format.

6. Provide one curiosity-provoking fact relevant to this post.

7. Write a high-converting Instagram caption:
   - Catchy opening hook line
   - Engaging body explaining the context
   - 3 bullet points with relevant emojis
   - An interactive engagement question
   - Strong Call To Action mentioning GRAVITAS club (DM or link in bio)
   - 6-8 relevant hashtags including #JoinGravitas #SpaceClub #PhysicsIsFun #Gravitas #STEM #Somaiya.

8. Write a sophisticated LinkedIn caption highlighting student development, technical skills, and research inquiry with the club slogan "Explore. Question. Discover."

9. Write a text-to-image prompt tailored for DALL-E 3 / Midjourney.

Output MUST be valid JSON with this exact structure:
{
  "visualContext": "recruitment | workshop | stargazing | fun_fact | hackathon | research | general",
  "title": "Short graphic title",
  "purposeTitle": "BOLD PURPOSE HEADLINE",
  "purposeMessage": "Clear 1-2 sentence purpose callout message",
  "equation": "LaTeX formula",
  "funFact": "One-liner mind bending fact",
  "instagramCaption": "Full Instagram post with emojis, hooks, and hashtags",
  "linkedinCaption": "Full LinkedIn post with bullet points and hashtags",
  "imagePrompt": "Detailed AI art prompt"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      source: "gemini_ai",
      visualContext: parsed.visualContext || detectedContext,
      activityType: (parsed.visualContext === "recruitment" || isRecruitment) ? "Recruitment" : (activityType || "Workshop"),
      title: parsed.title || "Cosmic Inquiry",
      purposeTitle: parsed.purposeTitle || defaultPurposeTitle,
      purposeMessage: parsed.purposeMessage || defaultPurposeMessage,
      equation: parsed.equation || "E = mc^2",
      funFact: parsed.funFact || "The universe expands at an accelerating rate governed by dark energy.",
      instagramCaption: parsed.instagramCaption || defaultPurposeMessage,
      linkedinCaption: parsed.linkedinCaption || defaultPurposeMessage,
      imagePrompt: parsed.imagePrompt || `High-energy physics visual: ${userPrompt}, 8k neon cyan and deep space navy.`,
      brandingText: "GRAVITAS • Explore. Question. Discover."
    });
  } catch (error: any) {
    console.error("Gemini content generation error:", error);
    const userPrompt = req.body?.prompt || "";
    const lowerText = userPrompt.toLowerCase();
    const isRecruitment = lowerText.includes("recruit") || lowerText.includes("join");
    return res.json({
      success: true,
      source: "curated_fallback_error",
      error: error?.message,
      visualContext: isRecruitment ? "recruitment" : "workshop",
      activityType: isRecruitment ? "Recruitment" : "Workshop",
      title: isRecruitment ? "Join The Cosmos" : "Experimental Physics Workshop",
      purposeTitle: isRecruitment ? "WE ARE RECRUITING" : "HANDS-ON WORKSHOP",
      purposeMessage: isRecruitment 
        ? "Step into the world where atoms dance and galaxies collide. No prior expertise required—just your curiosity. Open for all branches & freshers!"
        : "Hands-on masterclass simulating laboratory physics, optical apparatus & telemetry toolkits.",
      equation: isRecruitment ? "i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi" : "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
      funFact: "Every atom in your body was forged inside an exploding star billions of years ago.",
      instagramCaption: isRecruitment ? RECRUITMENT_POST.instagram : "🔬 Step into hands-on laboratory physics with GRAVITAS!\n\nJoin our technical workshop to simulate real physical phenomena.\n\n✨ Optical spectrometry\n🔭 Telemetry and modeling\n🚀 Connect with fellow student researchers\n\n👉 DM us or tap link in bio to join!\n\n#JoinGravitas #PhysicsClub #STEM #Somaiya",
      linkedinCaption: "Academic inquiry and hands-on laboratory simulation at GRAVITAS (K.J Somaiya School of Engineering). Explore. Question. Discover.\n\n#Physics #Engineering #Gravitas",
      imagePrompt: `Cosmic physics exploration: ${userPrompt}, neon cyan accents, deep space navy, 8k resolution.`,
      brandingText: "GRAVITAS • Explore. Question. Discover."
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GRAVITAS Social Media Generator", timestamp: Date.now() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GRAVITAS Social Media Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
