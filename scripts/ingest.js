/**
 * Ingest knowledge-base documents into Supabase.
 *
 * Usage:
 *   node scripts/ingest.js
 *
 * Edit the `documents` array below to match your actual products,
 * policies, and FAQs. Each entry becomes a searchable chunk.
 */
import 'dotenv/config';
import { ingest } from '../src/core/rag.js';

const documents = [
  // ── About the workshop ────────────────────────────────────────────────────
  {
    content: `About Berry PC:
We specialize in the sale of high-quality PC components and custom computer assembly services.
Customers can purchase individual parts such as CPUs, GPUs, motherboards, RAM, storage devices,
power supplies, peripherals, monitors, and accessories, or have our experienced technicians build
a fully customized PC tailored to their needs and budget.
Every assembled computer is professionally tested to ensure reliability and optimal performance
before delivery. We serve gamers, professionals, students, and everyday home users.`,
    metadata: { category: 'about', topic: 'overview' },
  },

  // ── Assembly service & discount ───────────────────────────────────────────
  {
    content: `Custom PC assembly service:
Our experienced technicians will build a fully customized computer based on the customer's
specific needs and budget. We offer expert component selection guidance if the customer is unsure
what to choose. We build gaming PCs, workstation PCs, home/office PCs, and budget builds.

10% discount offer:
Customers who purchase ALL the components for a complete PC from our shop AND choose our
assembly service receive a 10% discount on their total order. This applies to the entire order
(components + assembly fee). To qualify, every component in the build must be purchased from us.

Every assembled PC is professionally tested before delivery to ensure reliability and
optimal performance.`,
    metadata: { category: 'service', topic: 'assembly-and-discount' },
  },

  // ── Products: CPUs (Gaming & High Performance) ────────────────────────────
  {
    content: `CPUs (Processors) — Gaming & High Performance:

AMD Ryzen 9000 series (Zen 5, AM5 socket) — latest generation:
- AMD Ryzen 5 9600X — excellent mid-range gaming CPU, 6 cores / 12 threads
- AMD Ryzen 7 9700X — high-performance 8-core CPU, great for gaming + streaming
- AMD Ryzen 9 9900X — 12-core powerhouse for heavy multitasking and content creation
- AMD Ryzen 9 9950X — flagship 16-core CPU for professional and creative workloads

Intel Core Ultra 200 series (Arrow Lake, LGA1851 socket) — latest generation:
- Intel Core Ultra 5 245K — strong mid-range gaming performance
- Intel Core Ultra 7 265K — excellent all-rounder for gaming and creative work
- Intel Core Ultra 9 285K — Intel's top-of-the-line consumer CPU

Previous generation (available at reduced prices):
- AMD Ryzen 7000 series (AM5), Intel 13th and 14th gen Core (LGA1700)

All CPUs come with manufacturer warranty.`,
    metadata: { category: 'products', topic: 'cpus-gaming' },
  },

  // ── Products: CPUs (Budget & Office) ─────────────────────────────────────
  {
    content: `CPUs (Processors) — Budget & Office/Everyday Use:
We also carry affordable processors for home, office, and everyday computing builds.

Budget AMD options:
- AMD Ryzen 3 series — ideal for basic tasks, light gaming, and student builds
- AMD Ryzen 5 (non-X models) — great value for everyday computing and light multitasking

Budget Intel options:
- Intel Core i3 (12th/13th gen) — reliable office and everyday use processor
- Intel Core i5 non-K models — solid all-rounder for home and work builds without overclocking
- Intel Core Ultra 5 non-K — efficient everyday performance on the latest platform

These processors are perfect for home office PCs, school/student builds, media center PCs,
and budget-friendly custom builds. We can help pair them with the right motherboard and RAM.`,
    metadata: { category: 'products', topic: 'cpus-budget-office' },
  },

  // ── Products: GPUs (Gaming) ───────────────────────────────────────────────
  {
    content: `GPUs (Graphics Cards) — Gaming:
We carry the latest NVIDIA RTX 50 series and AMD RX 9000 series, as well as previous-gen cards.

NVIDIA GeForce RTX 50 series (Blackwell) — latest generation:
- NVIDIA GeForce RTX 5060 Ti — great budget-friendly 1080p/1440p gaming card
- NVIDIA GeForce RTX 5070 — excellent 1440p gaming with DLSS 4 support
- NVIDIA GeForce RTX 5070 Ti — high-end 1440p/4K gaming
- NVIDIA GeForce RTX 5080 — near-flagship performance for 4K gaming
- NVIDIA GeForce RTX 5090 — the most powerful consumer GPU ever made, 32GB GDDR7, ideal for 4K gaming, AI, and professional creative work

AMD Radeon RX 9000 series (RDNA 4) — latest generation:
- AMD Radeon RX 9070 — strong 1440p gaming, excellent price-to-performance
- AMD Radeon RX 9070 XT — high-end 1440p and capable 4K gaming

Previous generation (still available at lower prices):
- NVIDIA RTX 4060, RTX 4070, RTX 4080, RTX 4090
- AMD RX 7600, RX 7800 XT, RX 7900 XTX`,
    metadata: { category: 'products', topic: 'gpus-gaming' },
  },

  // ── Products: GPUs (Budget, Office & Workstation) ────────────────────────
  {
    content: `GPUs (Graphics Cards) — Budget, Office & Workstation:
Not everyone needs a high-end gaming GPU. We carry options for everyday and professional use.

Budget & everyday GPUs:
- NVIDIA GeForce GTX 1650 / GTX 1660 Super — affordable cards for light gaming and everyday tasks
- NVIDIA GeForce RTX 4060 — excellent budget-friendly card for 1080p gaming and productivity
- AMD Radeon RX 7600 — great value for 1080p gaming and everyday creative tasks
- Intel Arc B580 — a solid budget option for 1080p gaming and content creation

Workstation / professional GPUs:
- NVIDIA RTX A2000 — entry-level professional GPU for CAD, 3D rendering, and data work
- NVIDIA RTX A4000 — mid-range workstation GPU for professional creative applications
These cards offer ECC memory, certified drivers for professional software (AutoCAD, SolidWorks, etc.)

For office PCs with no GPU needed, we also recommend CPUs with integrated graphics
(AMD Ryzen with Radeon Graphics, or Intel with Intel UHD/Arc graphics).`,
    metadata: { category: 'products', topic: 'gpus-budget-workstation' },
  },

  // ── Products: RAM & Storage ───────────────────────────────────────────────
  {
    content: `RAM (Memory) we carry:
- DDR4: 16GB kits (2x8GB) and 32GB kits (2x16GB) — compatible with older LGA1700 platforms
- DDR5: 16GB, 32GB, and 64GB kits — required for AM5 (Ryzen 7000/9000) and LGA1851 (Core Ultra 200)
- Brands: Corsair, G.Skill, Kingston, Crucial

Storage devices we carry:
- NVMe SSDs (PCIe 4.0 and 5.0): 500GB, 1TB, 2TB, 4TB options — fastest available
- SATA SSDs: budget-friendly 2.5" drives for secondary storage or budget builds
- HDDs: 1TB to 8TB for mass storage, backup drives, or NAS use
- Brands: Samsung, WD, Seagate, Kingston, Crucial`,
    metadata: { category: 'products', topic: 'ram-and-storage' },
  },

  // ── Products: Motherboards ────────────────────────────────────────────────
  {
    content: `Motherboards we carry:
We stock motherboards for gaming, workstation, and everyday builds across all current platforms.

AMD AM5 socket (Ryzen 7000 / 9000 series):
- B650 chipset — great value mid-range boards for gaming and everyday builds
- X670 chipset — higher-end boards with more PCIe lanes and overclocking support
- B850 / X870 chipset — latest generation AM5 boards with USB4 and PCIe 5.0

Intel LGA1851 socket (Core Ultra 200 / Arrow Lake):
- B860 chipset — solid mid-range option for the latest Intel platform
- Z890 chipset — enthusiast board for overclocking and high-end builds

Intel LGA1700 socket (12th / 13th / 14th gen Core):
- B660, H670, Z690, Z790 chipsets — still available at reduced prices

Brands: ASUS (ROG, TUF, Prime), MSI (MEG, MAG, PRO), Gigabyte (AORUS, Gaming), ASRock
We can help you match the right board to your CPU, RAM, and build goals.`,
    metadata: { category: 'products', topic: 'motherboards' },
  },

  // ── Products: PSUs ────────────────────────────────────────────────────────
  {
    content: `Power Supplies (PSUs) we carry:
We carry PSUs for all build types — from budget office builds to high-end gaming rigs.

- 500W–650W: suitable for budget and mid-range builds without a discrete GPU or with a budget GPU
- 750W–850W: recommended for mid to high-end gaming builds (RTX 5070, RX 9070 XT and similar)
- 1000W–1200W: required for flagship builds with RTX 5080/5090 or dual-GPU workstation setups

Efficiency ratings:
- 80+ Bronze — budget-friendly, good efficiency
- 80+ Gold — best balance of price and efficiency, recommended for most builds
- 80+ Platinum / Titanium — premium efficiency, ideal for always-on workstations

Brands: Corsair, Seasonic, be quiet!, EVGA, Thermaltake
All PSUs come with full warranty. We recommend going slightly above your estimated wattage for headroom.`,
    metadata: { category: 'products', topic: 'psus' },
  },

  // ── Products: Cases ───────────────────────────────────────────────────────
  {
    content: `PC Cases we carry:
We stock cases for every type of build — from compact desktop builds to full gaming towers.

Gaming Cases (Mid-Tower & Full-Tower):
- High airflow designs with tempered glass side panels to show off your build
- RGB lighting support and cable management features
- Brands: NZXT (H series), Corsair (4000D, 5000X), Lian Li (Lancool), Phanteks (Eclipse)
- Fit: supports ATX, E-ATX motherboards and high-end GPU lengths up to 420mm+

Workstation / Professional Cases:
- Clean, quiet designs focused on sound dampening and airflow efficiency
- Usually no RGB, more drive bays, better cable management
- Brands: Fractal Design (Define series), be quiet! (Silent Base), Antec (P series)
- Ideal for content creators, video editors, and office power users

Standard / Everyday Cases:
- Simple and functional mid-tower cases for home and office builds
- Budget-friendly, decent airflow, no frills
- Brands: Cooler Master (MasterBox), Antec, Deepcool, Thermaltake (Versa series)

Compact / On-Desk Cases (Mini-ITX & Micro-ATX):
- Small form factor cases that sit on your desk and save space
- Mini-ITX: very compact, great for living room PCs or minimalist builds
- Micro-ATX: slightly larger, more expansion slots while still compact
- Brands: Fractal Design (Node, Era), Lian Li (A4, TU150), NZXT (H1), Cooler Master (NR200)
- Note: compact cases require careful component selection (smaller coolers, shorter GPUs)`,
    metadata: { category: 'products', topic: 'cases' },
  },

  // ── Products: CPU Cooling ─────────────────────────────────────────────────
  {
    content: `CPU Cooling — AIO Liquid Coolers & Air Coolers:
We carry a wide range of cooling solutions for both gaming and everyday builds.

AIO Liquid Coolers (All-In-One):
- 120mm / 240mm AIO — suitable for mid-range CPUs and compact cases
- 280mm AIO — great balance of performance and noise for gaming builds
- 360mm AIO — high-performance cooling for flagship CPUs (Ryzen 9, Core Ultra 9), ideal for overclocking
- Brands: Corsair (iCUE series), NZXT (Kraken), Arctic (Liquid Freezer), be quiet! (Silent Loop), DeepCool

Air Coolers:
- Budget / Stock-style coolers — suitable for non-overclocked office and everyday CPUs
- Mid-range tower coolers — excellent performance for gaming builds, quieter than stock
  (e.g. DeepCool AK400, Scythe Fuma, Arctic Freezer series)
- High-end dual-tower coolers — top-tier air cooling performance, rivaling 360mm AIOs
  (e.g. Noctua NH-D15, be quiet! Dark Rock Pro, Thermalright Peerless Assassin)
- Brands: Noctua, be quiet!, DeepCool, Scythe, Arctic, Thermalright, Cooler Master

Choosing between AIO and Air:
- Air coolers: simpler, no pump to fail, often quieter, great long-term reliability
- AIOs: better aesthetics, great for hot CPUs in tight cases, easier RAM clearance
We can help you pick the right cooler based on your CPU, case, and budget.`,
    metadata: { category: 'products', topic: 'cpu-cooling' },
  },

  // ── Products: Monitors ────────────────────────────────────────────────────
  {
    content: `Monitors we carry:
We stock monitors for gaming, professional work, and everyday use in various sizes and resolutions.

Gaming Monitors:
- 1080p @ 144Hz / 165Hz — budget-friendly gaming monitors, great for competitive gaming
- 1440p @ 144Hz / 165Hz / 240Hz — the sweet spot for gaming: sharp visuals + smooth gameplay
- 4K @ 60Hz / 144Hz — stunning visuals for high-end gaming rigs
- Ultra-wide (21:9) monitors — immersive gaming and productivity experience
- Refresh rates up to 360Hz available for competitive/esports players
- Panel types: IPS (best colors), TN (fastest response), VA (best contrast)
- Brands: LG, Samsung, ASUS (ROG/TUF), MSI, Acer (Predator/Nitro), BenQ (ZOWIE)

Normal / Office / Work Monitors:
- 1080p @ 60Hz / 75Hz IPS — clean and color-accurate for everyday tasks and office work
- 1440p IPS — sharp and comfortable for content creation, coding, and design work
- 4K IPS — professional-grade clarity for photo/video editing and design
- Brands: LG, Dell (UltraSharp), ASUS (ProArt), BenQ, AOC, Philips

Multi-Monitor Bundles:
- Dual monitor bundle (2 monitors): discounted price compared to buying 2 separately
- Triple monitor bundle (3 monitors): even greater savings for multi-screen setups
- Available in matched pairs/trios (same model) for a consistent look
- Bundle deals available for both gaming and office monitor setups
- Ask us about current bundle pricing — we always offer a better deal than buying individually`,
    metadata: { category: 'products', topic: 'monitors' },
  },

  // ── Products: Mice ────────────────────────────────────────────────────────
  {
    content: `Mice we carry — Gaming & Normal:

Gaming Mice:
- Lightweight wired gaming mice — under 60g, ideal for fast-paced FPS games
- Wireless gaming mice — low-latency 2.4GHz wireless, long battery life
- High-DPI sensors (up to 25,600+ DPI) for precise tracking at any sensitivity
- Programmable buttons, RGB lighting, adjustable weight systems
- Brands: Logitech (G Pro, G502), Razer (DeathAdder, Viper), SteelSeries (Rival, Aerox),
  Zowie (EC, FK, S series — no RGB, pure performance), HyperX, Corsair

Normal / Office Mice:
- Comfortable ergonomic designs for long work sessions
- Reliable wireless (Bluetooth or USB dongle) for a clean desk setup
- Simple plug-and-play, no software required
- Budget-friendly options for everyday computing
- Brands: Logitech (M series, MX Master), Microsoft, HP, Trust

We carry both right-handed and ambidextrous designs across all categories.`,
    metadata: { category: 'products', topic: 'mice' },
  },

  // ── Products: Keyboards & Mouse Pads ─────────────────────────────────────
  {
    content: `Keyboards we carry — Gaming & Normal:

Gaming Keyboards:
- Mechanical keyboards with various switch types:
  - Linear switches (e.g. Red) — smooth and quiet, great for gaming
  - Clicky switches (e.g. Blue) — tactile and audible feedback
  - Tactile switches (e.g. Brown) — tactile bump without the loud click, good for gaming + typing
- Full-size (with numpad), TKL (tenkeyless), and 60%/65% compact layouts
- RGB backlighting, per-key customization, macro support
- Brands: Logitech (G series), Razer (BlackWidow, Huntsman), Corsair (K series),
  SteelSeries (Apex), HyperX (Alloy), Ducky, Keychron

Normal / Office Keyboards:
- Membrane keyboards — quiet, budget-friendly, soft keystroke feel
- Low-profile slim keyboards — sleek design for minimal desk setups
- Wireless keyboards (Bluetooth or USB) for a cable-free workspace
- Full-size layouts with numpad for data entry and productivity
- Brands: Logitech (MK series, K series), Microsoft, HP, Trust

Mouse Pads:
- Small (25x21cm) — minimal desk footprint, for standard mouse usage
- Medium (35x25cm) — most popular size, fits most setups
- Large / Extended (80x30cm and above) — covers the full desk, fits both mouse and keyboard
- Gaming mouse pads: low-friction surface for precise gliding, stitched edges for durability
- Normal mouse pads: soft surface, non-slip base, comfortable for everyday office use
- Brands: SteelSeries (QcK), Corsair (MM series), Logitech, HyperX (Fury S), Razer (Gigantus)`,
    metadata: { category: 'products', topic: 'keyboards-and-mousepads' },
  },

  // ── Compatibility guidance ────────────────────────────────────────────────
  {
    content: `Component compatibility guidance:
Our team can help you select components that are fully compatible with each other.
Key compatibility considerations:
- CPU socket must match motherboard socket:
  - AMD Ryzen 7000 / 9000 series → AM5 socket
  - Intel Core Ultra 200 (Arrow Lake) → LGA1851 socket
  - Intel 12th / 13th / 14th gen → LGA1700 socket
- All current platforms (AM5, LGA1851) require DDR5 RAM
- LGA1700 platforms support DDR4 or DDR5 depending on the motherboard
- GPU power requirements must be met by the PSU — the RTX 5090 can draw up to 575W alone, so a 1000W+ PSU is recommended for flagship builds
- Case must fit the GPU length and CPU cooler height — compact cases (Mini-ITX) have stricter limits
- Mini-ITX and Micro-ATX cases require smaller coolers and shorter GPU cards — always check dimensions
- AIO cooler radiator size must fit your case (check front/top mounting support)
- NVMe slots: check how many M.2 slots the motherboard has and which PCIe generations they support
- Monitor resolution should match your GPU — a 4K monitor paired with an RTX 5060 Ti may bottleneck
Contact us for a free compatibility check before purchasing.`,
    metadata: { category: 'support', topic: 'compatibility' },
  },

  // ── Customer service & contact ─────────────────────────────────────────────
  {
    content: `Customer service and contact:
Our team is available to help you choose the right components or plan your custom build.
You can reach us by:
- Visiting our physical shop (ask staff for current hours)
- Using the live chat on this website
- Messaging us on Telegram
- Requesting a callback by leaving your name and email

For order support (tracking, delivery updates), please provide your order ID (e.g. ORD-1001)
and we can check the status instantly.

We offer:
- Free compatibility advice before purchase
- Dual and triple monitor bundle deals at discounted prices
- Post-build support and warranty service
- Upgrade consultations for existing systems
- Build recommendations for any budget — gaming, workstation, office, or everyday use`,
    metadata: { category: 'support', topic: 'contact-and-service' },
  },

  // ── Webcams: Buying Guide ─────────────────────────────────────────────────
  {
    content: `Webcam Buying Guide for Streaming, Video Calls, and Content Creation:

Resolution and frame rate — what actually matters:
- 1080p at 30fps is the practical baseline for acceptable streaming/call quality.
- 1080p at 60fps is noticeably smoother for talking-head content and is generally worth choosing over 4K at a lower frame rate, since most viewers watch at 1080p or lower anyway.
- 4K webcams can deliver sharper oversampled 1080p output via digital crop/zoom, but require more USB bandwidth and many cap 4K capture at 15–24fps, which is too low for smooth streaming.
- Resolution marketed on the box is less important than sensor quality, autofocus, and lighting.

Sensor size and low-light performance:
- Webcam image quality is driven far more by sensor size and lens quality than megapixel count. A larger sensor gathers more light and produces cleaner images in dim rooms.
- Buyers in dim or inconsistently lit rooms should prioritize webcams with larger sensors and good low-light processing over ones simply advertising a higher resolution number.
- Adding a dedicated key light or ring light in front of you (not just overhead room lighting) dramatically improves most webcams' image quality — a mid-range webcam with a key light often beats an enthusiast webcam without one.

Autofocus vs. fixed focus:
- Fixed-focus webcams are pre-set to a typical desk distance. They look soft if you sit closer or farther, or move during a call. Common on budget models to cut costs.
- Autofocus webcams continuously adjust focus as you move — valuable for anyone who shifts position, leans in, or holds objects up to the camera. One of the most noticeable upgrades between Budget and Mid-Range tiers.

Field of view — wide vs. narrow:
- Wide FOV (90–120°): shows more of the room/desk. Useful for desk tours or multi-person setups. Can make a solo talking-head appear small or introduce edge distortion.
- Narrow FOV (65–78°): crops in tighter and is more flattering for close-up solo talking-head streaming.
- Some webcams offer adjustable FOV (via software); AI auto-framing models automatically pan/zoom to keep a subject centered.

AI auto-framing webcams:
- Two types: physical gimbal (camera physically moves/tilts/zooms — Insta360 Link, OBSBOT Tiny 2) and digital PTZ (camera crops a high-resolution sensor digitally — Anker C302). Physical gimbals are smoother; digital PTZ is simpler with no moving parts.
- Most useful for solo creators who move around without a camera operator.

Built-in microphones:
- Nearly all webcams include a built-in mic, but even flagship webcam microphones are outperformed by a dedicated USB microphone. For serious streaming or recording, plan to use a separate microphone.

Privacy shutters and companion software:
- A physical privacy shutter (sliding lens cover) fully blocks the lens without software reliance — a meaningful security feature, present on most mid-range and above models.
- Companion software (Logitech Logi Tune, Elgato Camera Hub, Razer Synapse, Insta360 Controller, AnkerWork) is needed to access advanced features like AI framing, background effects, and manual exposure controls, even though the basic video feed works plug-and-play without it.

Common mistakes:
- Prioritizing a higher advertised resolution over frame rate, sensor quality, and autofocus
- Assuming poor image quality is unfixable when better frontal lighting would meaningfully improve it
- Relying on a webcam's built-in mic for serious streaming instead of a dedicated microphone
- Buying a wide-FOV webcam for solo talking-head content, resulting in unflattering framing
- Overlooking mount compatibility with an ultrawide, curved, or unusually thick monitor`,
    metadata: { category: 'products', topic: 'webcams-buying-guide' },
  },

  // ── Webcams: Entry ────────────────────────────────────────────────────────
  {
    content: `Webcams — Entry Tier (Basic 720p–1080p, Fixed Focus, Video Calls):
Entry webcams are a meaningful step up from a laptop's built-in camera for video calls and casual use. All are fixed-focus and plug-and-play with no software required.

Anker PowerConf C200 ⭐⭐ — 1080p / 30fps / Autofocus / Adjustable FOV 65/78/95° / USB-A / Dual mics / Privacy shutter / AnkerWork app optional
- Standout at this tier: includes autofocus (usually a Budget-tier feature) and software-adjustable field of view. From a Sony sensor with digital crop.
- Best for: Entry buyers specifically wanting autofocus without paying mid-range prices; the strongest value-for-features pick at this tier

NexiGo N930E ⭐ — 1080p / 30fps / Fixed focus / 80° FOV / USB-A / Built-in adjustable ring light / Dual noise-reduction mics / Privacy shutter
- A built-in adjustable ring light is the distinctive feature — eliminates the need for a separate light at a budget price. Privacy shutter included.
- Best for: Budget buyers wanting built-in supplemental lighting without a separate purchase; good for dim rooms

Logitech C270 ⭐ — 720p / 30fps / Fixed focus / 55° FOV / USB-A / Mono mic / No privacy shutter
- One of the most widely sold webcams ever. Extremely low cost, long reliability track record, automatic light correction. Limited to 720p.
- Best for: Absolute minimum-budget video calls; proven reliability for decades

Logitech C310 — 720p / 30fps / Fixed focus / 60° FOV / USB-A / Noise-reduction mono mic / No privacy shutter
- A small step up from the C270 with slightly improved low-light correction and noise-reduction mic. Still 720p with no autofocus.
- Best for: Basic video calls wanting marginally better low-light performance than the C270

Microsoft Modern Webcam — 1080p / 30fps / Fixed focus / 78° FOV / USB-A / Mono mic / Privacy shutter
- Simple, reliable plug-and-play 1080p for video conferencing. Includes a privacy shutter. No streaming-oriented features.
- Best for: Basic remote work and video conferencing; Microsoft Teams-optimized environments`,
    metadata: { category: 'products', topic: 'webcams-entry' },
  },

  // ── Webcams: Budget ───────────────────────────────────────────────────────
  {
    content: `Webcams — Budget Tier (Autofocus, 1080p, 60fps Options, Streaming Basics):
Budget webcams are where autofocus, 60fps, and streaming-focused features appear at accessible prices.

Logitech C920 ⭐⭐ — 1080p / 30fps / Autofocus / 78° FOV (fixed) / USB-A / Stereo mics / No privacy shutter
- One of the most widely used and recommended webcams in history. Default community recommendation for over a decade. Reliable autofocus, solid image quality, vast software and compatibility documentation. Aging sensor vs. newer competitors.
- Best for: Budget buyers wanting the most widely supported, documented, and community-tested webcam ever made; the safe default pick

Logitech C922 Pro Stream ⭐⭐ — 1080p / 60fps / Autofocus / 78° FOV (fixed) / USB-A / Stereo mics / No privacy shutter / Software background removal / Includes mini tripod
- The streaming-evolved C920: adds 60fps and software background removal via Logitech Capture. Comes with a bundled mini tripod.
- Best for: Budget streamers wanting autofocus, 60fps, and software background removal in one package; a step up from the C920 for streaming

Razer Kiyo X ⭐ — 1080p / 60fps / Fixed focus / 82° FOV / USB-A / No built-in mic / No privacy shutter / Razer Synapse controls
- Streaming-focused: 60fps at 1080p is the main draw. Razer Synapse adds manual exposure/contrast/saturation controls. No autofocus, no built-in microphone.
- Best for: Budget streamers prioritizing smooth 60fps over autofocus; requires a separate microphone

NexiGo N60 ⭐ — 1080p / 30fps / Autofocus / 70° FOV / USB-A / Dual noise-canceling mics / Privacy shutter / No companion app required
- Well-rounded complete package: autofocus, privacy shutter, and dual mics all in one, plug-and-play without software.
- Best for: Budget buyers wanting a complete feature set without needing a companion app

AVerMedia Live Streamer CAM 313 (PW313) — 1080p / 30fps / Fixed focus / 95° FOV / USB-A / Stereo mics / No privacy shutter
- Wide 95° FOV is useful for desk-tour or multi-person content; less flattering for close-up solo framing. From a capture-card-focused brand.
- Best for: Budget streamers wanting a wide field of view for desk-tour or group setups

Logitech Brio 100 — 1080p / 30fps / Fixed focus / 70° FOV / USB-C / Noise-reduction mono mic / Privacy shutter
- Modern USB-C connector, privacy shutter, and automatic light correction in a compact Brio-line design at a budget price. No autofocus.
- Best for: Budget buyers wanting a compact, modern USB-C webcam with a privacy shutter`,
    metadata: { category: 'products', topic: 'webcams-budget' },
  },

  // ── Webcams: Mid-Range ────────────────────────────────────────────────────
  {
    content: `Webcams — Mid-Range Tier (Better Sensors, HDR, 4K Options, Vertical Content):
Mid-range webcams add HDR processing, better low-light sensors, 4K capture options, and streaming-oriented features.

Razer Kiyo Pro ⭐⭐ — 1080p / 60fps / Autofocus / Adjustable FOV 80/90/103° / Large 1/2.8-inch high-sensitivity sensor / Adaptive HDR / USB-A / No built-in mic / No privacy shutter
- Adaptive light sensor delivers genuinely strong HDR performance in mixed or backlit lighting — one of the most important differentiators in this tier. Adjustable field of view. No microphone.
- Best for: Mid-range buyers in challenging backlit or mixed-lighting rooms wanting the best dynamic range at this tier; a top community pick

Logitech StreamCam ⭐⭐ — 1080p / 60fps / Facial-recognition-priority autofocus / 78° FOV / USB-C / Stereo mics / No privacy shutter / Rotating mount (horizontal + vertical)
- Facial-recognition autofocus keeps subjects sharp reliably. Rotating mount enables vertical content for mobile-format creators. USB-C with fast data transfer.
- Best for: Content creators wanting reliable facial-tracking autofocus and vertical content support

Logitech Brio 500 ⭐ — 1080p / 30fps / Autofocus / 90° FOV / Sony sensor with HDR / USB-C / Dual noise-reduction mics / Privacy shutter / Show mode feature / Automatic real-time light correction
- Real-time automatic light correction adapts to changing room lighting. Includes privacy shutter and a distinctive show-mode for demonstrating physical objects. Capped at 30fps.
- Best for: Mid-range buyers in rooms with inconsistent lighting wanting automatic adaptation; buyers wanting a privacy shutter

Razer Kiyo ⭐ — 1080p / 30fps / Autofocus / 81.6° FOV / Built-in adjustable ring light / USB-A / No built-in mic / No privacy shutter
- The iconic ring-light webcam. Built-in adjustable ring light eliminates the need for a separate key light in many setups. No microphone. Capped at 30fps.
- Best for: Mid-range streamers wanting a built-in ring light without buying a separate light; an iconic streaming setup choice

AVerMedia Live Streamer CAM 513 (PW513) — 4K / 30fps (15fps native 4K) / Autofocus / 95° FOV / Sony STARVIS sensor / USB-A / Stereo mics / Privacy shutter
- Sony STARVIS sensor gives it meaningfully better low-light performance than typical mid-range webcams. 4K sensor enables sharper oversampled 1080p. Native 4K is limited to 15fps.
- Best for: Mid-range buyers wanting Sony STARVIS low-light performance and oversampled 1080p sharpness

NexiGo N960E 4K ⭐ — 4K / 30fps at both 1080p and 4K / Autofocus / 80° FOV / Sony sensor / USB-A / Dual noise-canceling mics / Privacy shutter / No software required
- 30fps full-frame-rate 4K capture is uncommon at this price. Plug-and-play without companion software.
- Best for: Mid-range buyers wanting accessible full-frame-rate 4K without premium pricing

Dell UltraSharp Webcam WB5023 — 4K / 30fps / Autofocus / Adjustable FOV 65/78/90° / Sony sensor / USB-C / Dual mics / No privacy shutter / Magnetic mount
- Accurate color reproduction tuning uncommon at this tier. Premium compact metal build. Adjustable FOV. Magnetic mount.
- Best for: Mid-range buyers wanting accurate color reproduction and premium build in a compact form factor`,
    metadata: { category: 'products', topic: 'webcams-midrange' },
  },

  // ── Webcams: Enthusiast ───────────────────────────────────────────────────
  {
    content: `Webcams — Enthusiast Tier (Larger Sensors, AI Tracking, Manual Control, 4K HDR):
Enthusiast webcams step up to professional-grade sensor sizes, true AI auto-framing with physical gimbals, and extensive manual controls built for serious streaming setups.

Elgato Facecam MK.2 ⭐⭐ — 1080p / 60fps / Fixed manual focus (no autofocus hunting) / 82° FOV / Large Sony STARVIS sensor / USB-C / No built-in mic / No privacy shutter / Elgato Camera Hub (extensive manual controls)
- Designed specifically for streaming: fixed manual focus (set once in software) avoids distracting autofocus hunting during motion. Large Sony STARVIS sensor is excellent in low light. Elgato Camera Hub provides DSLR-style manual exposure, white balance, and color control.
- Best for: Enthusiast streamers wanting DSLR-like manual control and consistent framing without autofocus hunting; the top pick for streaming-built design

Insta360 Link ⭐⭐ — 4K / 30fps (1080p60) / Autofocus with AI subject tracking / Variable FOV (physical gimbal pan/tilt/zoom) / 1/2-inch sensor / USB-C / No built-in mic / Physical gimbal privacy (auto-parks lens)
- Mounts on a physical 3-axis motorized gimbal that actively follows the subject like an automated camera operator. Gesture controls for hands-free zoom/framing adjustments. No separate mic.
- Best for: Enthusiast solo creators who move around during streams or presentations without a camera operator

Logitech MX Brio ⭐ — 4K / 30fps / Autofocus / Adjustable FOV 65/78/90° / Sony sensor with HDR + infrared / USB-C / Dual noise-reduction mics / Privacy shutter / Windows Hello support / Logi Tune
- Logitech's most refined webcam. Windows Hello facial login support (infrared sensor). Excellent automatic light adaptation. Privacy shutter included.
- Best for: Enthusiast professionals and creators wanting Logitech's most refined webcam with Windows Hello; best on Windows

Dell UltraSharp Webcam WB7022 ⭐ — 4K / 30fps / Autofocus / Adjustable FOV 65/78/90° / Large 1/2.8-inch Sony sensor with wide dynamic range / USB-C / Dual noise-reduction mics / No privacy shutter / Magnetic mount
- Large 1/2.8-inch Sony sensor handles mixed and backlit lighting well. Professional-grade image quality in a premium compact all-metal build.
- Best for: Enthusiast buyers wanting professional-grade image quality for both calls and content creation

AVerMedia Live Streamer CAM 540 ⭐ — 4K / 30fps / Autofocus / 95° FOV / Sony STARVIS 2 sensor with HDR / USB-C / Stereo mics / Privacy shutter
- Sony STARVIS 2 sensor with HDR delivers strong dynamic range and excellent low-light performance at 4K. Privacy shutter included.
- Best for: Enthusiast streamers wanting strong HDR and low-light 4K performance

Anker PowerConf C302 — 4K / 30fps / Autofocus + AI auto-framing (digital PTZ) / Very wide 122° FOV / Large 1/2-inch Sony sensor / USB-C / Dual noise-reduction mics / Privacy shutter
- AI auto-framing via digital crop of its wide 122° sensor. 4K resolution provides real headroom for digital zoom without major quality loss. No physical gimbal — simpler and quieter than gimbal-based alternatives.
- Best for: Enthusiast buyers wanting AI auto-framing without the cost and moving parts of a physical gimbal webcam`,
    metadata: { category: 'products', topic: 'webcams-enthusiast' },
  },

  // ── Webcams: Flagship ─────────────────────────────────────────────────────
  {
    content: `Webcams — Flagship Tier (4K60, Largest Sensors, Most Advanced AI Tracking, Interchangeable Lenses):
Flagship webcams target professional streamers and content creators wanting the absolute best image quality, AI camera-operator tracking, or unique capabilities unavailable at lower tiers.

Elgato Facecam Pro ⭐⭐ — 4K / 60fps (true 4K60) / Fixed manual focus / 84° FOV / Large 1/1.2-inch Sony sensor / USB-C (USB 3.0 required) / No built-in mic / No privacy shutter / Elgato Camera Hub
- One of the very few webcams capable of genuine smooth 4K at 60fps. Largest Sony sensor in its category — excellent low-light and dynamic range. Extensive manual controls. Requires USB 3.0 for full 4K60 bandwidth. Streaming-built design, no mic.
- Best for: Flagship streamers wanting the smoothest, sharpest possible 4K60 streaming video with full DSLR-style manual control; the benchmark flagship streaming webcam

OBSBOT Tiny 2 ⭐⭐ — 4K / 30fps (1080p60) / Autofocus + AI subject tracking / Physical pan-tilt-zoom gimbal / 1/1.5-inch sensor / 4x digital zoom / Gesture controls / USB-C / Dual mics
- Most feature-complete AI PTZ webcam available. Physical gimbal with 4x digital zoom combined covers a very wide framing range. Extensive gesture control library for hands-free zoom, framing, and mode switching. Well-regarded AI tracking accuracy.
- Best for: Flagship buyers wanting the most capable AI-tracking camera-operator experience with gesture control

Insta360 Link 2 ⭐⭐ — 4K / 30fps (1080p60) / Autofocus + AI subject tracking / Physical 3-axis gimbal / Large 1/1.28-inch sensor / Gesture controls / USB-C / Built-in dual mics (added vs. original Link)
- Successor to the original Link with a significantly larger sensor for improved low-light and dynamic range. Now includes a built-in microphone. Physical gimbal-based AI tracking remains the most convincing automated camera-operator experience.
- Best for: Flagship buyers wanting the most refined AI-tracking camera-operator experience with improved sensor quality over the original Link

Razer Kiyo Pro Ultra ⭐ — 4K / 30fps / Autofocus / Adjustable FOV 80/90/103° / Very large 1/1.2-inch sensor (DSLR/compact-camera scale) / Adaptive HDR / USB-C / No built-in mic / No privacy shutter
- Unusually large 1/1.2-inch sensor — closer in size to a compact camera than a typical webcam — delivers image quality that stands out among webcams at any price. Adjustable FOV. No microphone.
- Best for: Flagship buyers prioritizing the largest available webcam sensor for maximum image quality; buyers who already have a dedicated microphone

Logitech Brio 4K Ultra HD Pro ⭐ — 4K / 30fps (1080p60 in reduced FOV mode) / Autofocus / Adjustable FOV 65/78/90° / Sony sensor with RightLight 3 HDR + infrared / USB-C / Dual omni mics / No privacy shutter / Windows Hello support
- Logitech's original flagship webcam with years of proven reliability. RightLight 3 HDR, Windows Hello infrared, and adjustable FOV. No privacy shutter. 60fps only available at a reduced field of view.
- Best for: Flagship buyers wanting Logitech's longest-proven-track-record 4K HDR webcam with Windows Hello

AVerMedia Live Streamer CAM 543 — 4K / 30fps / Autofocus / Detachable upgradeable lens mount / Large Sony sensor with HDR / USB-C / Stereo mics / Privacy shutter
- Distinctive flagship feature: detachable, upgradeable lens mount allows pairing the sensor with different optical options. Large Sony sensor with HDR. Privacy shutter included.
- Best for: Flagship buyers who specifically value a future-upgradeable lens system in a webcam form factor`,
    metadata: { category: 'products', topic: 'webcams-flagship' },
  },

  // ── Vertical GPU Mounts: Buying Guide ────────────────────────────────────
  {
    content: `Vertical GPU Mount / PCIe Riser Cable Buying Guide:

What is a vertical GPU mount?
A vertical GPU mount (also called a vertical GPU bracket or GPU riser kit) turns a graphics card 90 degrees so it faces outward through the case's tempered-glass side panel, showcasing the card's cooler shroud and RGB lighting. This is a purely aesthetic modification — it provides no performance or cooling benefit and can actually worsen GPU temperatures in cases where the side panel clearance is narrow and restricts the card's intake airflow.

Why the PCIe riser cable generation matters:
A vertical mount routes the GPU's PCIe connection through a ribbon-style riser cable instead of a direct motherboard slot connection. That cable's PCIe generation (3.0, 4.0, or 5.0) caps the maximum bandwidth available to the GPU regardless of what the motherboard and GPU themselves support. Using a PCIe 3.0 riser with a PCIe 4.0 or 5.0 GPU can bottleneck high-end card performance in bandwidth-sensitive scenarios. Always match or exceed the riser cable's generation to your GPU/motherboard's capability — especially important for flagship-tier GPUs.

Case-specific vs. universal kits:
- Case-specific kits (Lian Li for the O11 series, Corsair for 4000D/5000D, NZXT for H-series, etc.) are pre-sized and pre-matched to that exact case family's PCIe slot spacing, mounting points, and riser cable length. They offer the most reliable fit for supported cases.
- Universal / semi-universal kits (e.g., Cooler Master Vertical GPU Holder V3, CableMod Vertical GPU Holder) use adjustable brackets designed to fit a broader range of cases, but buyers must still verify side panel clearance manually.
- Not all cases support vertical GPU mounting at all — the case needs dedicated rear bracket cutouts and adequate side panel clearance. Check compatibility with your exact case before purchase.

GPU weight and bracket sag:
Modern flagship GPUs can weigh 1.5–2kg or more. Mounting one vertically via a riser cable and a single-point bracket (rather than a horizontal slot with multiple support points plus a PCIe backplate) creates sag risk over time. Higher-quality brackets use more rigid materials and sometimes additional support arms. Very heavy GPUs may still show visible sag regardless of bracket quality.

Riser cable length:
The cable's length must match the specific distance in your case between the motherboard's PCIe slot and the vertical bracket location. Case-specific kits include a pre-matched cable; universal kits often offer multiple lengths. A cable that's too short won't reach; one that's too long is difficult to route cleanly.

Common mistakes:
- Expecting vertical mounting to improve GPU cooling (it often does the opposite if clearance is tight)
- Using a PCIe 3.0 riser with a flagship PCIe 4.0/5.0 GPU
- Buying a case-specific kit intended for a different case model
- Not verifying side panel clearance with the GPU's actual thickness before purchasing
- Underestimating GPU sag risk on a single-point vertical bracket with a heavy card`,
    metadata: { category: 'products', topic: 'vertical-gpu-mounts-buying-guide' },
  },

  // ── Vertical GPU Mounts: Products ─────────────────────────────────────────
  {
    content: `Vertical GPU Mounts and PCIe Riser Cable Kits — All Products:
This is a niche, highly case-specific accessory category. Most kits are designed for particular case families, not universally compatible. Only a small number of brands sell standalone retail kits.

─── Entry / Bare Cable ───

LINKUP AVA PCIe 4.0 Riser Cable ⭐ — PCIe 4.0 / Cable only (no bracket) / Available 200mm–400mm lengths / From a manufacturer specializing in riser cables
- A standalone riser cable without a bracket, for buyers who already have a compatible bracket (case-integrated or separate) and need a reliable, properly shielded PCIe 4.0 cable.
- Best for: Buyers who already have a bracket and need a quality PCIe 4.0 cable; replacing a lower-generation or damaged cable in an existing setup

─── Budget / Complete Kit ───

Cooler Master Vertical GPU Holder Kit V3 ⭐ — PCIe 4.0 / Includes cable + adjustable steel bracket / Semi-universal (most cases with standard rear PCIe cutouts)
- The most accessible complete vertical mount kit with a broad semi-universal bracket design. The community's top budget recommendation for complete kits.
- Compatibility: Most cases with standard rear PCIe bracket cutouts and adequate side panel clearance
- Best for: Budget buyers wanting a complete, broadly compatible kit without a case-specific option; the default first recommendation

Phanteks Vertical GPU Mounting Bracket Kit ⭐ — PCIe 4.0 / Includes cable + steel bracket pre-matched to Phanteks cases / Case-specific
- Pre-matched for compatible Phanteks Enthoo and Eclipse series cases. Guarantees fit within those case families.
- Compatibility: Compatible Phanteks Enthoo and Eclipse series cases only
- Best for: Budget buyers with a compatible Phanteks case wanting a guaranteed-fit kit

─── Mid-Range / Case-Specific ───

Lian Li O11D Vertical GPU Bracket Kit ⭐⭐ — PCIe 4.0 / Includes cable + aluminum+steel bracket pre-matched to O11 / Case-specific
- The official kit for one of the most popular showcase case families ever made. Precisely matched fit, well-regarded build quality. The default recommendation for O11 Dynamic/O11 Air owners.
- Compatibility: Lian Li O11 Dynamic and O11 Air series cases only
- Best for: O11 Dynamic or O11 Air owners wanting the perfectly matched official vertical mount kit; a community top pick

NZXT Vertical GPU Mounting Kit ⭐ — PCIe 4.0 / Includes cable + steel bracket pre-matched to NZXT cases / Case-specific
- NZXT's official kit for compatible H-series cases with clean cable routing integration that suits NZXT's design language.
- Compatibility: Compatible NZXT H-series cases only
- Best for: NZXT H-series case owners wanting a guaranteed-fit vertical mount kit

─── Enthusiast / Case-Specific ───

Corsair Vertical GPU Mounting Bracket ⭐ — PCIe 4.0 / Includes cable + reinforced steel bracket / Case-specific
- Features a reinforced bracket design specifically engineered to reduce sag with heavy modern GPUs — an important consideration for large flagship cards.
- Compatibility: Compatible Corsair 4000D/5000D series cases only
- Best for: Corsair 4000D/5000D owners with a heavy flagship GPU wanting sag-resistant, officially matched vertical mounting

Thermaltake Vertical GPU Kit — PCIe 4.0 / Includes cable + steel bracket pre-matched to View series / Case-specific
- Pre-matched kit for Thermaltake's larger View series showcase cases.
- Compatibility: Compatible Thermaltake View 71 and View 91 series cases only
- Best for: View 71 or View 91 owners wanting a guaranteed-fit kit

─── Flagship / Premium Universal ───

CableMod Vertical Graphics Card Holder ⭐⭐ — PCIe 4.0 / Includes cable + rigid anti-sag bracket / Semi-universal / Individually sleeved cable in numerous colors
- The premium choice for showcase builds. From cable specialist CableMod. Individually sleeved riser cable available in many colors for build-matching customization. Rigid anti-sag bracket. The top pick for aesthetics-focused builders.
- Compatibility: Semi-universal (most cases with standard rear PCIe cutouts and adequate side panel clearance)
- Best for: Flagship/showcase build buyers wanting the highest-quality aesthetic customization and sag resistance regardless of price

Summary of key compatibility rules:
- Case-specific kits (Lian Li, Corsair, NZXT, Phanteks, Thermaltake branded): only usable with the specific supported case family — do not buy without owning the matched case
- Semi-universal kits (Cooler Master V3, CableMod): work in many cases but require manual clearance verification
- Bare riser cables (LINKUP): require a separately sourced bracket
- All kits: verify side panel clearance with your GPU's actual width before mounting vertically`,
    metadata: { category: 'products', topic: 'vertical-gpu-mounts-products' },
  },

  // ── SSDs: Buying Guide ────────────────────────────────────────────────────
  {
    content: `SSD Buying Guide for Gaming PC Builds:

Does SSD speed improve FPS?
No. Once a game is loaded into RAM, storage speed has zero effect on frame rate. SSD speed matters for game/level load times, texture streaming in open-world games (reducing pop-in), and general system responsiveness (installs, patches, file transfers). A budget SATA SSD and a flagship PCIe 5.0 drive produce identical FPS during gameplay — the difference is only how fast the game loads.

Interface tiers and what they mean for gaming:
- SATA SSD (~550 MB/s): Dramatically faster than any HDD; still the slowest SSD tier. Fine for bulk game library storage or budget boot drives where speed matters less.
- PCIe 3.0 NVMe (~3,500 MB/s): Noticeably faster load times than SATA. A solid budget option when PCIe 4.0 slots are unavailable or the price difference matters.
- PCIe 4.0 NVMe (~5,000–7,500 MB/s): The current sweet spot — fast load times with future headroom at a reasonable price. The recommended interface tier for any modern gaming build.
- PCIe 5.0 NVMe (~10,000–14,800 MB/s): Minimal real-world gaming benefit over PCIe 4.0 today. Almost no current game can utilize this bandwidth — it matters for professional workloads (video editing, large data processing). The premium is not justified for gaming-only builds.

DRAM vs DRAM-less (HMB) SSDs:
- DRAM-equipped: Onboard DRAM chip caches the drive's mapping table for more consistent sustained performance, especially under heavy multitasking or large writes.
- DRAM-less (HMB): Uses a small slice of system RAM as a cache substitute. Works well for typical gaming (loading levels, installing games). May show more inconsistency under sustained heavy writes.
- For gaming builds: A well-reviewed DRAM-less drive (e.g., WD Black SN770, Lexar NM790) is perfectly adequate. DRAM matters more for content creation or server-like workloads.

TLC vs QLC NAND:
- TLC (Triple-Level Cell, 3 bits/cell): Better sustained write performance and endurance. Preferred for primary OS/boot drives or heavier write workloads.
- QLC (Quad-Level Cell, 4 bits/cell): Higher storage density at lower cost, but weaker sustained write performance once the drive's SLC write cache is exhausted. Fine for gaming (read-heavy workloads with occasional large installs).

Heatsinks for M.2 drives:
- SATA / PCIe 3.0: No heatsink needed in normal use.
- PCIe 4.0: Helpful under sustained load; often unnecessary for typical gaming if the motherboard has built-in airflow or an M.2 shield.
- PCIe 5.0: Strongly recommended — these drives run notably hot under sustained transfers. Many PCIe 5.0 drives ship with substantial heatsinks.

Capacity recommendations for gaming in 2026:
- 1TB: Comfortable minimum; many modern AAA titles exceed 100–150GB installed.
- 2TB: Increasingly the recommended size for a library of several large titles without constant uninstall/reinstall cycles.

PS5 NVMe expansion requirements:
- Requires PCIe 4.0 NVMe, minimum 5,500 MB/s sequential read speed, and a heatsink installed. Not all PC-focused PCIe 4.0 drives meet this threshold — verify before purchasing for console use.

Common mistakes to avoid:
- Buying a PCIe 5.0 SSD expecting faster gaming over PCIe 4.0 (no current game utilizes the speed difference)
- Filling an SSD near 100% capacity (sustained write performance degrades; keep ~10–20% free)
- Installing a fast PCIe 4.0/5.0 drive in a secondary M.2 slot that only runs at PCIe 3.0 or slower (check the board manual)
- Choosing solely on advertised sequential read/write numbers (random and sustained performance are more representative of real-world responsiveness)`,
    metadata: { category: 'products', topic: 'ssds-buying-guide' },
  },

  // ── SSDs: SATA / Entry ────────────────────────────────────────────────────
  {
    content: `SSDs — SATA / Entry Tier (2.5-inch SATA III, ~550 MB/s Max, Universal Compatibility):
SATA SSDs are the oldest SSD interface. They're dramatically faster than any HDD but are now the slowest SSD tier. Recommended only when no M.2 slot is available, or as cost-effective bulk secondary storage.

Samsung 870 EVO ⭐⭐ — SATA III / 2.5-inch / Samsung MKX controller / TLC V-NAND / DRAM: Yes (LPDDR4) / Up to 560/530 MB/s / Up to 2,400 TBW (4TB)
- The most trusted SATA SSD. Samsung's own controller, NAND, and DRAM deliver the best combination of reliability and sustained performance in the SATA category. Long track record in enthusiast and enterprise builds.
- Available: 250GB, 500GB, 1TB, 2TB, 4TB
- Best for: Builds without M.2 slots; secondary bulk game library storage; anyone specifically needing SATA with maximum reliability confidence

Kingston A400 ⭐ — SATA III / 2.5-inch / Phison or SMI controller (varies by batch) / TLC or QLC NAND (varies) / DRAM: No / Up to 500/450 MB/s / 80–300 TBW depending on capacity
- One of the highest-volume SATA SSDs ever sold. Extremely low cost. Controller and NAND sourcing varies by production batch, causing some unit-to-unit inconsistency.
- Available: 120GB, 240GB, 480GB, 960GB
- Best for: The lowest-budget HDD-to-SSD upgrade; ultra-cost-sensitive builds

Crucial BX500 — SATA III / 2.5-inch / SM2259XT controller / Micron QLC NAND / DRAM: No / Up to 540/500 MB/s / Up to 360 TBW (2TB)
- Crucial's budget SATA line. Built on Micron's own QLC NAND — more predictable sourcing than some competitors. QLC NAND weakens under heavy sustained writes.
- Available: 120GB, 240GB, 480GB, 1TB, 2TB
- Best for: Budget HDD-to-SSD upgrades; an alternative to the Kingston A400

WD Green SATA SSD — SATA III / 2.5-inch / QLC NAND / DRAM: No / Up to 545/465 MB/s
- Western Digital's budget SATA line. Low cost with WD's manufacturing reputation. Similar QLC-based limitations as the BX500.
- Available: 240GB, 480GB, 960GB, 2TB
- Best for: Budget HDD-to-SSD upgrades from buyers preferring WD's brand

Seagate Barracuda Q1 SSD — SATA III / 2.5-inch / QLC NAND / DRAM: No / Up to 550/500 MB/s
- Seagate's budget SATA entry. Functional and affordable; less community presence than Samsung/WD/Crucial alternatives.
- Available: 480GB, 960GB, 2TB
- Best for: Budget HDD-to-SSD upgrades from buyers already invested in Seagate's ecosystem

NOTE: If your motherboard has a free M.2 slot, any budget NVMe drive (e.g., Crucial P3, WD Blue SN570) offers meaningfully faster load times than any SATA SSD for a similar or lower price per GB at current pricing.`,
    metadata: { category: 'products', topic: 'ssds-sata-entry' },
  },

  // ── SSDs: Budget NVMe (PCIe 3.0 + Budget PCIe 4.0) ───────────────────────
  {
    content: `SSDs — Budget NVMe Tier (PCIe 3.0 and Entry PCIe 4.0, DRAM-less, ~$40–80 for 1TB):
Budget NVMe drives deliver meaningfully faster load times than any SATA SSD. All of these are DRAM-less (using HMB), which is fine for gaming workloads.

SK hynix Gold P31 ⭐⭐ — PCIe 3.0 / M.2 2280 / SK hynix in-house controller / 128L TLC NAND / DRAM: No (HMB) / Up to 3,500/3,200 MB/s / Up to 750 TBW (2TB)
- Renowned for exceptional power efficiency — a standout trait for laptops and SFF builds — combined with unusually consistent real-world performance for a DRAM-less drive. One of the most respected budget NVMe recommendations ever.
- Available: 500GB, 1TB, 2TB
- Best for: Budget-to-mid gaming builds; laptops and SFF builds where power efficiency matters most

WD Blue SN570 ⭐⭐ — PCIe 3.0 / M.2 2280 / WD in-house controller / WD/Kioxia BiCS TLC NAND / DRAM: No (HMB) / Up to 3,500/3,000 MB/s / Up to 900 TBW (2TB)
- Widely recommended by the community. TLC NAND gives it better sustained performance than QLC-based budget competitors. Strong endurance for its tier and price.
- Available: 250GB, 500GB, 1TB, 2TB
- Best for: Budget gaming builds wanting a dependable, community-trusted NVMe boot/game drive; a top pick at this tier

Crucial P3 ⭐ — PCIe 3.0 / M.2 2280 / SM2267XT controller / Micron QLC NAND / DRAM: No (HMB) / Up to 3,500/3,000 MB/s / Up to 440 TBW (2TB)
- Excellent price-per-GB built on Micron's own NAND. QLC means weaker sustained write performance once cache is exhausted, but fine for game installs and everyday use.
- Available: 500GB, 1TB, 2TB, 4TB
- Best for: Budget gaming builds wanting large capacity at low cost-per-GB; available in 4TB for a bulk game library

Samsung 980 — PCIe 3.0 / M.2 2280 / Samsung Pablo controller / Samsung TLC V-NAND / DRAM: No (HMB) / Up to 3,500/3,000 MB/s / Up to 600 TBW (1TB)
- Samsung's budget NVMe. Solid performance from trusted Samsung engineering. Maximum capacity is 1TB — a notable limitation at this tier.
- Available: 250GB, 500GB, 1TB
- Best for: Budget gaming builds specifically wanting Samsung's brand reliability and firmware quality

Lexar NM620 — PCIe 3.0 / M.2 2280 / SMI or Maxio controller (varies by batch) / TLC NAND / DRAM: No (HMB) / Up to 3,300/3,000 MB/s / Up to 400 TBW (2TB)
- Competitive TLC-based pricing from Lexar. Good value; smaller community track record than Samsung/WD/Crucial.
- Available: 256GB, 512GB, 1TB, 2TB
- Best for: Budget buyers wanting TLC NAND performance at an aggressive price

Seagate Barracuda Q5 — PCIe 3.0 / M.2 2280 / Phison E13T or similar / QLC NAND / DRAM: No (HMB) / Up to 2,400/1,700 MB/s / modest TBW
- Seagate's budget NVMe entry. Notably slower peak speeds than competing PCIe 3.0 drives — the SN570 and P31 Gold are faster for similar pricing.
- Available: 500GB, 1TB, 2TB
- Best for: The tightest-budget NVMe upgrade specifically from Seagate; otherwise the WD Blue SN570 or Crucial P3 are better choices

Kingston NV2 — PCIe 4.0 (performs at PCIe 3.0-class speeds) / M.2 2280 / SMI or Maxio controller (varies) / TLC or QLC (varies by batch) / DRAM: No (HMB) / Up to 3,500/2,800 MB/s
- Uses a PCIe 4.0 interface but doesn't achieve true PCIe 4.0-class speeds in practice — performs similarly to a good PCIe 3.0 drive. Component sourcing varies.
- Available: 250GB, 500GB, 1TB, 2TB
- Best for: The tightest-budget NVMe upgrade; note the PCIe 4.0 label doesn't reflect full Gen4 speed

Solidigm P41 Plus ⭐ — PCIe 4.0 / M.2 2280 / Solidigm in-house controller / 144L QLC NAND / DRAM: No (HMB) / Up to 4,125/3,325 MB/s / Up to 400 TBW (2TB)
- Unlike the Kingston NV2, delivers genuine PCIe 4.0-class sequential speeds. From Solidigm (the former Intel NAND/SSD division). Community-recommended for budget Gen4 performance.
- Available: 512GB, 1TB, 2TB
- Best for: Budget builds wanting genuine PCIe 4.0 speed at an entry price; a top budget PCIe 4.0 pick

Corsair MP600 CORE — PCIe 4.0 / M.2 2280 / Phison E19T or similar / QLC NAND / DRAM: No (HMB) / Up to 5,000/3,700 MB/s / up to 4TB
- Strong PCIe 4.0 speeds with excellent capacity options (up to 4TB) at a budget-friendly price. QLC limitations apply under heavy sustained writes.
- Available: 1TB, 2TB, 4TB
- Best for: Budget gaming builds wanting a large single game library drive on PCIe 4.0; good cost-per-GB at higher capacities`,
    metadata: { category: 'products', topic: 'ssds-budget-nvme' },
  },

  // ── SSDs: Mid-Range NVMe PCIe 4.0 ────────────────────────────────────────
  {
    content: `SSDs — Mid-Range NVMe PCIe 4.0 (The Gaming Sweet Spot, DRAM-less & DRAM-equipped):
Mid-range PCIe 4.0 drives offer excellent real-world gaming performance. The WD Black SN770 and Lexar NM790 are among the most recommended gaming SSDs in any budget category.

WD Black SN770 ⭐⭐ — PCIe 4.0 / M.2 2280 / WD in-house controller / WD/Kioxia BiCS5 TLC NAND / DRAM: No (HMB) / Up to 5,150/4,900 MB/s / Up to 1,200 TBW (2TB)
- One of the most recommended gaming SSDs available at any price. Punches far above its DRAM-less design due to WD's highly efficient HMB implementation. The community's default "just get this" recommendation for a gaming boot/game drive.
- Available: 250GB, 500GB, 1TB, 2TB
- Best for: The default recommendation for any gaming build; outstanding value-to-performance; the pick if you want one drive and want to stop thinking about it

Lexar NM790 ⭐⭐ — PCIe 4.0 / M.2 2280 / Maxio MAP1602 controller / YMTC 232L TLC NAND / DRAM: No (HMB) / Up to 7,400/6,500 MB/s / Up to 1,600 TBW (2TB)
- A breakout value hit — near-flagship PCIe 4.0 sequential speeds from a DRAM-less drive at an aggressively competitive price. Runs warm under sustained load; benefits from a heatsink.
- Available: 500GB, 1TB, 2TB, 4TB
- Best for: Value-focused enthusiasts wanting near-flagship speed at a mid-range price; arguably the best price-per-performance M.2 on the market

Solidigm P44 Pro ⭐ — PCIe 4.0 / M.2 2280 / Solidigm/InnoGrit IG5236 / 144L TLC NAND / DRAM: Yes / Up to 7,000/6,500 MB/s / Up to 1,400 TBW (2TB)
- DRAM-equipped near-flagship speeds with excellent endurance. Strong choice for buyers wanting sustained write consistency alongside high sequential performance.
- Available: 512GB, 1TB, 2TB
- Best for: Mid-range-to-enthusiast builds wanting near-flagship performance and high endurance; a community-praised pick from Solidigm's SSD heritage

Kingston KC3000 ⭐ — PCIe 4.0 / M.2 2280 / Phison E18 / Micron 176L TLC NAND / DRAM: Yes / Up to 7,000/7,000 MB/s / Up to 1,600 TBW (2TB)
- Uses the proven, high-performance Phison E18 controller to deliver near-flagship speeds. Available up to 4TB. Runs warm under sustained load; benefits from a heatsink.
- Available: 512GB, 1TB, 2TB, 4TB
- Best for: Mid-range-to-enthusiast builds wanting near-flagship Phison E18 performance at a lower price than flagship-branded alternatives

Crucial P5 Plus ⭐ — PCIe 4.0 / M.2 2280 / SM2267 controller / Micron 176L TLC NAND / DRAM: Yes / Up to 6,600/5,000 MB/s / Up to 600 TBW (2TB)
- DRAM-equipped PCIe 4.0 drive built on Micron's own NAND. Consistent sustained performance. Runs warm under sustained load.
- Available: 500GB, 1TB, 2TB
- Best for: Mid-range builds wanting a DRAM-equipped drive without flagship pricing; strong value from Crucial's own NAND

WD Blue SN580 — PCIe 4.0 / M.2 2280 / WD in-house controller / WD/Kioxia BiCS6 TLC NAND / DRAM: No (HMB) / Up to 4,150/4,150 MB/s / Up to 900 TBW (2TB)
- The PCIe 4.0 successor to the popular SN570. Meaningful upgrade in speed at a similar budget price. Slightly lower peak than the SN770 for a modest price difference.
- Available: 250GB, 500GB, 1TB, 2TB
- Best for: Budget-to-mid builds wanting a genuine PCIe 4.0 upgrade from the SN570 lineage at an accessible price

Samsung 970 EVO Plus ⭐ [Legacy] — PCIe 3.0 / M.2 2280 / Samsung Phoenix / Samsung TLC V-NAND / DRAM: Yes (LPDDR4) / Up to 3,500/3,300 MB/s / Up to 1,200 TBW (2TB)
- A legendary PCIe 3.0 drive — one of the most trusted SSDs of its generation. Still an excellent drive for PCIe 3.0-limited systems or those wanting Samsung's proven reliability. Superseded by PCIe 4.0 options at similar prices today.
- Available: 250GB, 500GB, 1TB, 2TB
- Best for: PCIe 3.0-limited systems; buyers specifically wanting Samsung reliability in a mature, extensively tested drive

Corsair MP600 GS — PCIe 4.0 / M.2 2280 / Phison E19T / TLC NAND / DRAM: No (HMB) / Up to 5,000/4,400 MB/s / Up to 900 TBW (2TB)
- Corsair's mid-tier PCIe 4.0 drive. TLC NAND. Backed by Corsair's brand and ecosystem. Sits in a competitive segment where the SN770 and Lexar NM790 often offer better value.
- Available: 500GB, 1TB, 2TB
- Best for: Mid-range builds wanting a Corsair-branded drive with ecosystem integration

Seagate FireCuda 520 [Legacy] — PCIe 4.0 / M.2 2280 / Phison E16 or E18 / TLC NAND / DRAM: Yes / Up to 5,000/4,400 MB/s / Up to 1,275 TBW (2TB)
- Seagate's mid-tier PCIe 4.0 gaming drive. DRAM-equipped with solid endurance. Superseded by the newer FireCuda 530 and similarly-priced competing drives.
- Available: 500GB, 1TB, 2TB
- Best for: Mid-range gaming builds wanting Seagate's gaming brand with DRAM consistency; often discounted as the 530 becomes the primary recommendation`,
    metadata: { category: 'products', topic: 'ssds-midrange-nvme-pcie4' },
  },

  // ── SSDs: Enthusiast NVMe PCIe 4.0 ───────────────────────────────────────
  {
    content: `SSDs — Enthusiast NVMe PCIe 4.0 (Flagship Performance, PS5 Compatible, DRAM-equipped):
Enthusiast PCIe 4.0 drives represent the peak of practical gaming storage performance. All have DRAM caches. Real-world gaming load time differences vs mid-range drives are modest — these are for buyers wanting the absolute best PCIe 4.0 has to offer or PS5 storage expansion.

Samsung 990 Pro ⭐⭐ — PCIe 4.0 / M.2 2280 / Samsung Pascal controller / Samsung TLC V-NAND / DRAM: Yes (LPDDR4) / Up to 7,450/6,900 MB/s / Up to 1,200 TBW (2TB)
- Samsung's current PCIe 4.0 flagship. Class-leading efficiency alongside top sequential speeds. Widely trusted for PS5 expansion (heatsink model recommended). The benchmark enthusiast PCIe 4.0 recommendation.
- Available: 1TB, 2TB, 4TB. PS5 compatible (heatsink model)
- Best for: Enthusiast builds wanting the best PCIe 4.0 drive; PS5 storage expansion; the default "enthusiast" recommendation

WD Black SN850X ⭐⭐ — PCIe 4.0 / M.2 2280 / WD in-house controller / WD/Kioxia BiCS5 TLC NAND / DRAM: Yes / Up to 7,300/6,600 MB/s / Up to 1,200 TBW (2TB)
- One of the most popular enthusiast SSDs ever made. WD's in-house controller and NAND. Available with a factory heatsink (ideal for PS5 and PC alike). Consistently recommended alongside the Samsung 990 Pro.
- Available: 1TB, 2TB, 4TB. PS5 compatible (heatsink model)
- Best for: Enthusiast gaming builds; PS5 storage expansion; pairs with WD's broader ecosystem

Seagate FireCuda 530 ⭐ — PCIe 4.0 / M.2 2280 / Phison E18 / Micron 176L TLC NAND / DRAM: Yes / Up to 7,300/6,900 MB/s / Up to 2,550 TBW (4TB)
- Phison E18-powered enthusiast drive with the highest endurance ratings in its category, especially at higher capacities. Officially validated for PS5 expansion. Available up to 4TB.
- Available: 500GB, 1TB, 2TB, 4TB. PS5 compatible (heatsink model officially validated)
- Best for: Enthusiast builds wanting flagship speeds and exceptional endurance; PS5 storage expansion with official validation

Kingston FURY Renegade ⭐ — PCIe 4.0 / M.2 2280 / Phison E18 / Micron 176L TLC NAND / DRAM: Yes / Up to 7,300/7,000 MB/s / Up to 2,000 TBW (2TB)
- Phison E18-powered with strong endurance and Kingston's manufacturing reputation. A consistent enthusiast recommendation alongside the Samsung 990 Pro and WD SN850X.
- Available: 500GB, 1TB, 2TB, 4TB. PS5 compatible (heatsink model)
- Best for: Enthusiast gaming builds; PS5 expansion; buyers wanting Kingston's warranty and support track record

SK hynix Platinum P41 ⭐ — PCIe 4.0 / M.2 2280 / SK hynix Aries controller / 176L TLC NAND / DRAM: Yes (LPDDR4) / Up to 7,000/6,500 MB/s / Up to 1,200 TBW (2TB)
- Exceptional power efficiency at flagship performance levels — a top pick for laptops and SFF builds alongside enthusiast desktops. Strong reviewer consensus.
- Available: 500GB, 1TB, 2TB
- Best for: Enthusiast gaming builds and laptops valuing efficiency at flagship performance; one of the most respected SSDs for thermal-constrained systems

Samsung 980 Pro [Legacy] ⭐ — PCIe 4.0 / M.2 2280 / Samsung Elpis / Samsung TLC V-NAND / DRAM: Yes (LPDDR4) / Up to 7,000/5,100 MB/s / Up to 1,200 TBW (2TB)
- Samsung's first PCIe 4.0 flagship — landmark product, PS5-popular, now often available at a discount. Superseded in performance by the 990 Pro; still an excellent drive when discounted.
- Available: 250GB, 500GB, 1TB, 2TB. PS5 compatible (heatsink-equipped models)
- Best for: Enthusiast builds when found at a meaningful discount versus the 990 Pro; PS5 expansion

Crucial T500 ⭐ — PCIe 4.0 / M.2 2280 / Micron/Phison-derived controller / Micron 232L TLC NAND / DRAM: Yes / Up to 7,400/7,000 MB/s / Up to 1,200 TBW (2TB)
- Crucial's enthusiast-tier PCIe 4.0 drive. Strong power efficiency built on Micron's own 232L NAND. Heatsink model available for PS5 use.
- Available: 1TB, 2TB, 4TB. PS5 compatible (heatsink model)
- Best for: Enthusiast builds wanting Crucial/Micron's engineering with flagship efficiency and performance

Corsair MP600 Pro XT — PCIe 4.0 / M.2 2280 / Phison E18 / TLC NAND / DRAM: Yes / Up to 7,100/6,800 MB/s / Up to 1,400 TBW (2TB)
- Corsair's flagship PCIe 4.0 gaming drive using the proven Phison E18 controller. Heatsink model available. A strong alternative to the Samsung/WD flagship picks.
- Available: 1TB, 2TB, 4TB. PS5 compatible (heatsink model)
- Best for: Enthusiast gaming builds wanting Corsair's ecosystem integration at flagship PCIe 4.0 performance`,
    metadata: { category: 'products', topic: 'ssds-enthusiast-nvme-pcie4' },
  },

  // ── SSDs: Flagship NVMe PCIe 5.0 ─────────────────────────────────────────
  {
    content: `SSDs — Flagship NVMe PCIe 5.0 (Maximum Bandwidth, Professional Workloads, PCIe 5.0 Slot Required):
PCIe 5.0 SSDs offer massive sequential bandwidth but deliver minimal real-world gaming benefit over PCIe 4.0 drives. They run significantly hotter and cost considerably more. Recommended primarily for content creators, large dataset workflows, or extreme enthusiasts future-proofing regardless of cost.

IMPORTANT: PCIe 5.0 M.2 slots are available only on specific platforms — AMD AM5 (X870E, select B650E), Intel LGA1851 (Z890, B860). A PCIe 5.0 SSD installed in a PCIe 4.0 slot runs at PCIe 4.0 speeds. A robust heatsink is strongly recommended for all PCIe 5.0 drives.

Samsung 9100 Pro — PCIe 5.0 / M.2 2280 / Samsung in-house PCIe 5.0 controller / Samsung TLC V-NAND / DRAM: Yes (LPDDR4) / Up to 14,800/13,400 MB/s / Up to 2,400 TBW (2TB)
- Samsung's PCIe 5.0 flagship. Class-leading efficiency from Samsung's in-house controller and NAND. Excellent endurance. Requires robust heatsink.
- Available: 1TB, 2TB, 4TB
- Best for: Content creators and extreme enthusiasts on PCIe 5.0-capable platforms wanting Samsung's manufacturing reputation

Crucial T705 — PCIe 5.0 / M.2 2280 / Phison E26 / Micron 232L TLC NAND / DRAM: Yes / Up to 14,500/12,700 MB/s / Up to 1,200 TBW (2TB)
- One of the fastest consumer SSDs available. Phison E26 controller with Micron's own 232L NAND. Some SKUs ship with a substantial heatsink pre-installed. Runs very hot under sustained load.
- Available: 1TB, 2TB, 4TB
- Best for: Content creators wanting maximum sequential bandwidth built on Micron's own NAND; top PCIe 5.0 pick from Crucial

WD Black SN8100 — PCIe 5.0 / M.2 2280 / WD in-house PCIe 5.0 controller / WD/Kioxia TLC NAND / DRAM: Yes / Up to 14,900/14,000 MB/s / Up to 2,400 TBW (2TB)
- WD's PCIe 5.0 flagship with in-house controller and NAND. Highest sustained write endurance in the PCIe 5.0 category. Continuation of the WD_BLACK gaming brand into Gen5.
- Available: 1TB, 2TB, 4TB
- Best for: Extreme enthusiasts wanting WD's manufacturing breadth at the PCIe 5.0 tier; strong endurance ratings

Corsair MP700 Pro — PCIe 5.0 / M.2 2280 / Phison E26 / TLC NAND / DRAM: Yes / Up to 14,000/12,000 MB/s / Up to 1,400 TBW (2TB)
- Corsair's Phison E26-based PCIe 5.0 flagship. Often bundled with a substantial heatsink. Backed by Corsair's broader ecosystem.
- Available: 1TB, 2TB, 4TB
- Best for: Extreme enthusiasts wanting Corsair's ecosystem integration at the PCIe 5.0 tier

Seagate FireCuda 540 — PCIe 5.0 / M.2 2280 / Phison E26 / TLC NAND / DRAM: Yes / Up to 10,000/10,000 MB/s / Up to 1,400 TBW (2TB)
- Seagate's PCIe 5.0 gaming flagship. Lower peak speed than some PCIe 5.0 competitors. Part of Seagate's gaming-focused FireCuda brand; some SKUs include data recovery service.
- Available: 1TB, 2TB
- Best for: Extreme enthusiasts who prefer Seagate's FireCuda branding and service inclusions at the PCIe 5.0 tier

Kingston FURY Renegade G5 — PCIe 5.0 / M.2 2280 / Phison E26 / TLC NAND / DRAM: Yes / Up to 14,800/13,000 MB/s / Up to 1,400 TBW (2TB)
- Kingston's PCIe 5.0 flagship continuing the FURY Renegade line. Class-leading speeds via Phison E26. Often bundled with a heatsink. Kingston's warranty and support.
- Available: 1TB, 2TB, 4TB
- Best for: Extreme enthusiasts wanting Kingston's reputation and warranty at the PCIe 5.0 tier

For all PCIe 5.0 drives: a PCIe 4.0 drive (Samsung 990 Pro, WD Black SN850X) delivers nearly identical real-world gaming load times for significantly less money. Choose PCIe 5.0 for professional/content creation workloads or future-proofing, not for gaming performance gains.`,
    metadata: { category: 'products', topic: 'ssds-flagship-nvme-pcie5' },
  },

  // ── Speakers: Buying Guide ────────────────────────────────────────────────
  {
    content: `Desktop / Gaming Speaker Buying Guide:

2.0 vs. 2.1 vs. 5.1:
- 2.0 (stereo, no subwoofer): Compact, simple, works on small desks. Well-suited to near-field desktop listening. Fine for most gaming; may sound thin in games with heavy bass effects.
- 2.1 (stereo + subwoofer): Meaningfully deeper bass extension for games, movies, and music. Subwoofer needs floor or under-desk space. The most popular system type for gaming setups.
- 5.1 (surround): Rare in desktop products; adds rear surround speakers for genuine surround. Requires space for rear speaker placement — not practical for typical desk setups.

Near-field desktop listening — what it means for buying:
- Desktop speakers are designed for listening from a few feet away, angled toward the listener. This means smaller drivers can be effective, and accurate close-range imaging matters more than projecting sound across a room.
- Optimal placement: angle both speakers toward the listening position to form a roughly equilateral triangle with your head. This improves stereo imaging.

Connectivity guide:
- 3.5mm analog: universal, zero latency, plug-and-play. The default for a dedicated PC speaker setup.
- USB: some speakers include a built-in DAC that bypasses PC onboard audio for potentially cleaner sound.
- Bluetooth: convenient for switching between PC and phone/tablet, but introduces minor latency — usually not noticeable for gaming, but worth knowing.
- Optical digital (TOSLINK): allows connecting a TV or console alongside a PC without re-plugging cables. A useful feature on mid-range to flagship 2.1 systems.

Wattage — don't trust the numbers:
- "Peak" and "PMPO" wattage figures are marketing numbers and mean almost nothing. RMS (continuous) power is more useful for comparison, but even RMS is secondary to driver quality, cabinet design, and tuning. A well-engineered lower-wattage system routinely sounds better than a poorly designed high-wattage one.

"Gaming" branding vs. audio quality:
- "Gaming" branding on speakers primarily means RGB lighting and gaming-themed aesthetics — not better sound quality. A well-reviewed mid-range multimedia or music-focused system will frequently outperform a more expensive "gaming" speaker with comparable specs.

Placement and bass boominess:
- Subwoofers and speakers placed directly against walls or in room corners build up bass frequencies unevenly, causing boominess. Moving speakers a few inches away from walls helps.
- Wood cabinet construction (vs. plastic) generally reduces unwanted resonance, especially in subwoofer enclosures.`,
    metadata: { category: 'products', topic: 'speakers-buying-guide' },
  },

  // ── Speakers: Entry ───────────────────────────────────────────────────────
  {
    content: `Desktop Speakers — Entry Tier (Compact 2.0, Basic Stereo, Under $30):
Entry speakers are a minimal step up from built-in laptop or monitor speakers. All are 2.0 (no subwoofer) and plug-and-play.

Creative Pebble 2.0 ⭐⭐ — 2.0 / 4.4W RMS / 2-inch drivers / 3.5mm + USB power / No separate power brick
- The most popular entry desktop speaker. Distinctive spherical design with 45-degree upward-angled drivers improves near-field stereo imaging. USB-powered — no separate power adapter needed. Iconic look widely recognized in desk setup photos.
- Best for: Entry buyers wanting a distinctive, well-regarded design without a power brick; community favorite

Logitech Z150 — 2.0 / 3W RMS / 3.5mm wired / Front-panel volume knob + headphone jack
- Simple, cheap, reliable. Front-panel headphone jack is a convenient touch at this price. Compact footprint.
- Best for: The absolute lowest-cost step up from built-in laptop speakers; headphone jack is a useful bonus

Razer Nommo — 2.0 / ~12W RMS / 3-inch drivers with rear bass ports / 3.5mm wired / Front volume + bass dial
- Gaming-branded entry speaker; rear bass ports improve low-end vs typical entry 2.0; front bass dial. No RGB or software despite gaming branding.
- Best for: Entry gamers wanting a gaming aesthetic with slightly improved bass without a subwoofer

Edifier R19U — 2.0 / 2×2W RMS / 3.5mm + USB power / Very compact
- Very low cost USB-powered option; minimal power output and bass; most basic option from a mid-tier brand
- Best for: The absolute tightest budget with only basic sound quality needs

Logitech Z120 — 2.0 / 2.4W RMS / 3.5mm + USB power / Ultra-compact footprint
- The smallest desk footprint in the category; minimal power output; lowest price point; USB-powered
- Best for: Buyers with extremely limited desk space wanting the smallest possible speaker footprint`,
    metadata: { category: 'products', topic: 'speakers-entry' },
  },

  // ── Speakers: Budget ──────────────────────────────────────────────────────
  {
    content: `Desktop Speakers — Budget Tier (First Subwoofers, Studio-Monitor Style, Wood Cabinets):
Budget speakers offer a meaningful quality jump — first 2.1 systems with subwoofers, wood cabinet builds, and studio-monitor-derived tuning.

Edifier R980T ⭐⭐ — 2.0 / 24W RMS / 3-inch woofers + 13mm tweeters / MDF wood cabinet / 3.5mm + RCA / Rear bass + treble tone controls
- Wood cabinet reduces resonance vs plastic competitors. Separate bass and treble controls add real tuning flexibility. Clear, well-regarded sound for the price. Controls are rear-mounted (less convenient).
- Best for: Budget buyers wanting hi-fi-adjacent desktop sound without a subwoofer; community top pick for budget 2.0

Mackie CR3-X ⭐ — 2.0 / 25W RMS / 3-inch woofers + 0.75-inch silk dome tweeters / 3.5mm + RCA + 1/4-inch TRS / Front headphone jack
- Studio-monitor-derived tuning (Mackie is a professional audio brand) for more accurate, less colored sound vs consumer-tuned speakers. Multiple input types. Less bass emphasis than consumer-tuned competitors.
- Best for: Budget buyers wanting more accurate, studio-monitor-style sound for music or content creation

Logitech Z313 — 2.1 / 25W RMS / Compact satellites + down-firing subwoofer / 3.5mm wired / In-line control pod
- Real subwoofer bass extension at a budget price. In-line control pod is convenient for desk use. Long-standing reliable product.
- Best for: Budget buyers wanting a first subwoofer-equipped system; the entry 2.1 default

Creative Pebble Plus 2.1 ⭐ — 2.1 / 8W RMS / Pebble spherical satellites + compact down-firing subwoofer / 3.5mm + USB power
- Adds real bass extension to the popular Pebble design while remaining USB-powered for simple setup. Modest total power limits maximum volume.
- Best for: Budget buyers wanting the Pebble design with added bass extension; a natural Pebble 2.0 upgrade path

Logitech Z323 — 2.1 / 30W RMS / Larger satellites + down-firing subwoofer / 3.5mm wired / In-line control pod
- Step up from the Z313 with more power headroom and larger satellite drivers
- Best for: Budget buyers wanting more volume headroom than the base Z313 at a modest price increase

Razer Nommo V2 — 2.0 / ~12W RMS / 3-inch drivers / 3.5mm wired / Razer Chroma RGB / Razer Synapse required for RGB
- Updated Nommo with Chroma RGB lighting; improved driver tuning over original; no true subwoofer. Gaming aesthetic with RGB coordination.
- Best for: Budget gamers wanting RGB speaker lighting matching their Razer ecosystem`,
    metadata: { category: 'products', topic: 'speakers-budget' },
  },

  // ── Speakers: Mid-Range ───────────────────────────────────────────────────
  {
    content: `Desktop Speakers — Mid-Range Tier (Community Favorites, THX-Certified, Premium 2.0):
Mid-range speakers are where the most widely recommended systems live — community-favorite 2.0 bookshelf speakers, powerful THX 2.1 systems, and modern RGB + Bluetooth combos.

Edifier R1280T ⭐⭐ — 2.0 / 42W RMS / 4-inch woofers + 13mm tweeters / MDF wood cabinet / 3.5mm + RCA / FRONT-panel volume + bass + treble controls
- One of the most consistently recommended desktop speaker systems ever. Larger drivers than most competitors at this price. Front-panel tone controls (unlike the rear-mounted R980T). Strong community consensus on sound quality. The default "just get these" recommendation for mid-range desktop 2.0.
- Best for: Mid-range buyers wanting the community's most recommended desktop speaker; the overwhelming default pick

Klipsch ProMedia 2.1 THX ⭐⭐ — 2.1 / ~56W RMS / 3-inch satellites with horn-loaded tweeters + down-firing subwoofer / 3.5mm + RCA / Wired control pod
- A benchmark recommendation for PC gaming audio for over a decade. Klipsch's horn-loaded tweeters deliver notably detailed, dynamic sound uncommon at this price. Substantial subwoofer output. Has remained the go-to 2.1 recommendation for years.
- Best for: Mid-range buyers wanting a long-proven benchmark 2.1 system for gaming and music; the default 2.1 recommendation

Logitech Z625 ⭐ — 2.1 / 100W RMS / 2.5-inch satellites + front-firing subwoofer / 3.5mm + RCA + Optical digital (TOSLINK) / Wired control pod
- THX-certified substantial power headroom. Optical digital input lets you connect a TV or console alongside a PC without re-plugging. Wood-finished subwoofer enclosure.
- Best for: Mid-range buyers wanting THX certification and the flexibility of an optical digital input for a TV or console alongside a PC

Audioengine A2+ ⭐ — 2.0 / 15W RMS per channel / 2.75-inch aramid fiber woofers + 0.75-inch silk dome tweeters / MDF cabinet / 3.5mm + RCA + USB DAC / Optional Bluetooth variant
- Widely praised for unusually accurate, clean sound from a compact size. Built-in USB DAC option bypasses PC onboard audio. Premium components (custom amp). More expensive per driver size, but praised for quality.
- Best for: Mid-range buyers prioritizing accurate sound and build quality over sheer size; excellent for music listening at the desk

Mackie CR5-X ⭐ — 2.0 / 50W RMS / 5-inch woofers + 1-inch silk dome tweeters / 3.5mm + RCA + 1/4-inch TRS / Front headphone jack
- Larger CR3-X sibling with 5-inch woofers for better bass extension without a subwoofer; studio-monitor accurate tuning
- Best for: Mid-range buyers wanting more bass extension from Mackie's accurate studio-monitor tuning

Creative Pebble X Plus — 2.1 / 40W RMS / 2.75-inch satellites + down-firing subwoofer / 3.5mm + USB-C + Bluetooth 5.3 / Ambient RGB
- Modern Pebble evolution with Bluetooth, subwoofer, and RGB. USB-C power. Convenient multi-device connectivity.
- Best for: Mid-range buyers wanting the Pebble aesthetic with modern connectivity, Bluetooth, and RGB

JBL Quantum Duo — 2.0 / ~30W RMS / 3-inch woofers + passive bass radiators / 3.5mm + USB DAC + Bluetooth / RGB / JBL QuantumENGINE software
- JBL's consumer audio tuning with a built-in USB DAC and passive bass radiators for improved low-end without a subwoofer
- Best for: Mid-range gamers wanting JBL's consumer sound tuning with RGB and flexible connectivity`,
    metadata: { category: 'products', topic: 'speakers-midrange' },
  },

  // ── Speakers: Enthusiast ──────────────────────────────────────────────────
  {
    content: `Desktop Speakers — Enthusiast Tier (Premium Bookshelf, THX Wireless Subwoofer, Soundbar):
Enthusiast speakers step up to audiophile-adjacent driver technology, wireless subwoofers, and extensive connectivity for serious music listening and gaming.

Edifier S1000MKII ⭐⭐ — 2.0 / 120W RMS total / 5.5-inch wool-composite woofers + planar diaphragm tweeters / MDF wood veneer cabinet / 3.5mm + RCA + Optical + Bluetooth aptX / Remote included
- Audiophile-adjacent driver technology (wool-composite woofer + planar tweeter) at an enthusiast price. Real wood veneer cabinet. Bluetooth aptX. Genuinely approaches true bookshelf audio quality without a separate amplifier.
- Best for: Enthusiast buyers wanting audiophile-adjacent active bookshelf sound without a separate amp; the enthusiast 2.0 default

Audioengine A5+ ⭐ — 2.0 / 50W RMS per channel / 5-inch aramid fiber woofers + 0.75-inch silk dome tweeters / MDF cabinet / 3.5mm + RCA + USB DAC / Optional Bluetooth variant
- Larger A2+ sibling with 5-inch woofers and more power; Audioengine's reputation for clean, accurate sound at higher power headroom
- Best for: Enthusiast buyers wanting Audioengine's accurate sound with more bass extension and headroom than the A2+

Razer Nommo Pro ⭐ — 2.1 / 2×39W RMS satellites + 60W RMS wireless subwoofer / 3-inch satellites + 6-inch wireless subwoofer / 3.5mm + USB + Optical + Bluetooth / Dolby Virtual Surround + DTS / THX certified
- THX-certified satellites with a wireless down-firing subwoofer that avoids running a cable to the floor. Extensive connectivity including optical. Dolby/DTS virtual surround support.
- Best for: Enthusiast gamers wanting a THX-certified 2.1 system with a wireless subwoofer and virtual surround processing

SteelSeries Arena 7 — 2.1 / 100W RMS / 3-inch satellites + down-firing subwoofer / 3.5mm + USB + Optical + Bluetooth / RGB / SteelSeries GG software
- Integrates with the broader SteelSeries GG software ecosystem (RGB sync with headset, mouse, keyboard, etc.); wood-finished subwoofer enclosure; extensive connectivity
- Best for: Enthusiast gamers already invested in the SteelSeries ecosystem wanting matching desktop speakers with ecosystem-wide RGB sync

Creative Sound BlasterX Katana V2 — 2.1 soundbar style / 75W RMS total / Soundbar with built-in drivers + wireless down-firing subwoofer / 3.5mm + USB + Optical + HDMI ARC + Bluetooth / Dolby Atmos / RGB / Super X-Fi processing
- Soundbar form factor sits under the monitor, saving desk space vs separate satellites. HDMI ARC enables clean TV/console integration. Super X-Fi personalized audio processing. Narrower stereo image than widely-spaced satellites.
- Best for: Enthusiast buyers wanting a space-saving soundbar-style system with TV/console flexibility via HDMI ARC

Mackie CR8-XBT — 2.0 / 130W RMS / 8-inch woofers + 1-inch silk dome tweeters / 3.5mm + RCA + 1/4-inch TRS + Bluetooth / Front headphone jack
- Largest Mackie CR-X series model; 8-inch woofers deliver substantial bass extension without a subwoofer; Bluetooth added; studio-monitor accurate tuning at larger scale. Requires significant desk space.
- Best for: Enthusiast buyers with adequate desk space wanting maximum bass extension from Mackie's accurate tuning`,
    metadata: { category: 'products', topic: 'speakers-enthusiast' },
  },

  // ── Speakers: Flagship ────────────────────────────────────────────────────
  {
    content: `Desktop Speakers — Flagship Tier (Audiophile-Grade, 5.1 Surround, Premium Powered Bookshelf):
Flagship desktop speakers target buyers who want genuine audiophile-grade sound, all-in-one premium powered bookshelf systems, or true desktop 5.1 surround.

Klipsch The Fives ⭐⭐ — 2.0 / 160W RMS total / 4.5-inch woofers + horn-loaded tweeters / MDF wood veneer / 3.5mm + RCA (phono) + Optical + HDMI ARC + USB + Bluetooth aptX HD / Remote included
- Klipsch's signature horn-loaded tweeter technology in a self-contained, no-separate-amp package. Uniquely complete input selection: built-in phono preamp for turntables, HDMI ARC for TVs. A genuine all-in-one speaker system for PC, TV, and turntable from one pair.
- Best for: Flagship buyers wanting a premium all-in-one powered system spanning PC, TV, and turntable use; a community top pick

Edifier S3000 Pro ⭐ — 2.0 / 200W RMS total / 5.5-inch composite woofers + beryllium-composite dome tweeters / MDF premium finish / 3.5mm + RCA + Optical + Coaxial + USB + Bluetooth aptX HD / App-based parametric EQ + remote
- Hi-Res Audio certified; beryllium tweeter for extended high-frequency detail; app-based parametric EQ (rare at this category); both optical and coaxial digital inputs. Edifier's flagship bookshelf system.
- Best for: Flagship buyers wanting Hi-Res certified active bookshelf sound with precise app-based EQ; the audiophile-focused flagship pick

Audioengine HD6 ⭐ — 2.0 / 50W RMS per channel / Class A/B amplification / 5.5-inch Kevlar woofers + 1-inch silk dome tweeters / Real hardwood veneer cabinet / 3.5mm + RCA + Optical + USB DAC + Bluetooth aptX / Remote included
- Class A/B amplification (rather than Class D common in this category) is valued by audiophiles for warm, low-distortion character. Real hardwood veneer. Kevlar woofers and silk tweeters. Audioengine's most refined sound signature.
- Best for: Flagship buyers wanting Audioengine's most refined, audiophile-favored amplification and premium cabinet construction

JBL 305P MkII ⭐ — 2.0 / Professional studio monitors (sold individually, purchased as a pair) / 82W per monitor / 5-inch woofer + 1-inch waveguide-loaded tweeter / Image Control Waveguide / 1/4-inch TRS + RCA inputs (may require adapter from 3.5mm PC output)
- Professional studio monitors widely adopted for high-end desktop use. JBL's patented Image Control Waveguide delivers precise, accurate imaging. Rear boundary EQ compensates for desk/wall placement. Requires a 1/4-inch TRS adapter or audio interface from a standard PC audio output.
- Best for: Flagship buyers wanting genuine professional studio monitor accuracy for critical listening, mixing, or content creation

SteelSeries Arena 9 ⭐ — 5.1 / 160W RMS total / Front satellites + wireless rear surrounds + center channel + dedicated subwoofer / USB + Optical + Bluetooth + wireless rear-surround link / RGB / SteelSeries GG / Dolby Atmos virtualization
- The rare genuine desktop 5.1 system. Wireless rear surround speakers avoid running cables across the room. Extensive connectivity. Requires room space for rear speaker placement — not practical for small desk-only setups.
- Best for: Flagship buyers wanting genuine surround sound at a desk and having the room layout for rear speaker placement

KEF LSX II ⭐ — 2.0 / 140W RMS total / 4.5-inch Uni-Q coaxial driver (tweeter at center of woofer) / Optical + USB-C + Wi-Fi + Bluetooth aptX HD + AirPlay 2 + Chromecast / KEF Connect app with EQ
- From a highly respected British audiophile audio brand. Uni-Q coaxial driver delivers exceptionally precise, consistent stereo imaging. Extensive wireless streaming (Wi-Fi, AirPlay 2, Chromecast built-in). More oriented toward premium general home audio than dedicated gaming/PC use.
- Best for: Flagship buyers wanting audiophile-grade imaging and build quality that also serves as a premium home audio system; highest-end option in the category`,
    metadata: { category: 'products', topic: 'speakers-flagship' },
  },

  // ── Sleeved Cables: Buying Guide ──────────────────────────────────────────
  {
    content: `Custom Sleeved PSU Cable Buying Guide:

Extension kits vs. direct-replacement cable sets — the key distinction:
- Extension kits: plug into your PSU's existing stock cables and extend them with a sleeved section. Universally compatible with ANY PSU since they don't touch the proprietary connector. Add a small amount of cable length. The most common and accessible option.
- Direct-replacement sets: connect straight to the PSU itself, replacing the stock cables entirely for the cleanest possible look with no extension-point bulk. Only compatible with specific PSU models they're designed for — always verify exact PSU brand/model connector pinout before buying. Using the wrong direct-replacement cable can cause serious damage.

Sleeve material types:
- Single-sleeve (budget): the entire cable bundle wrapped in one sleeve — simple, inexpensive, but doesn't separate individual wires. Less refined look.
- Individually sleeved paracord: each wire within the cable bundle gets its own thin, flexible nylon sleeve — cleaner, more uniform look; easier to route in tight spaces.
- Mesh/ModMesh: thicker, wider-diameter individually sleeved nylon with a bolder weave pattern — high visual contrast, popular in showcase builds, but slightly harder to route through tight cable-management areas.

Cable combs — make a big visual difference:
- Plastic accessories with teeth that separate and align individual sleeved wires into neat, evenly spaced parallel rows — the key to the clean, flat cable runs seen in showcase build photos.
- Many premium kits include combs; many budget kits don't — check before buying. Combs are inexpensive to purchase separately if not included.

Digital RGB power cables — a fundamentally different category:
- Products like the Lian Li Strimer and CableMod RGB Combo Kit embed an addressable RGB LED strip inside a translucent 24-pin or PCIe power cable.
- The result is an animated lighting effect that can react to real-time power draw — a showpiece feature very different from static color-matched sleeving.
- These cost significantly more than standard sleeved cables and require a motherboard ARGB header or separate controller for lighting.

Safety — wire gauge matters here more than in most accessories:
- Reputable brands use properly rated wire gauge capable of handling the same current as stock PSU cables.
- Very cheap, unbranded kits have occasionally used undersized wire gauge — a real risk especially for high-current GPU power connections (12V-2x6/12VHPWR on flagship GPUs).
- Stick to established, reviewed brands (CableMod, Corsair, Lian Li, Thermaltake) — the modest price premium is worth it here.`,
    metadata: { category: 'products', topic: 'sleeved-cables-buying-guide' },
  },

  // ── Sleeved Cables: Entry, Budget & Mid-Range ─────────────────────────────
  {
    content: `Custom Sleeved PSU Cables — Entry, Budget, and Mid-Range (Extension Kits, Universal Compatibility):
All products below are extension kits (universally compatible with any PSU). They connect to existing stock cable connectors and extend with a sleeved section.

── Entry Tier (Single-sleeve, lowest cost) ──

EZDIY-FAB Sleeved Extension Kit ⭐ — Single-sleeve nylon / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe included / No comb / Universal PSU
- Most popular budget entry point into cable sleeving; very low cost; available in many colors; universally compatible
- Best for: Entry buyers wanting the lowest-cost way to add color-matching cable aesthetics; community favorite for value

1stPlayer Sleeve Extension Kit — Single-sleeve nylon / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe included / No comb / Universal PSU
- A functional minimal-cost alternative to EZDIY-FAB; smaller brand with less established reputation
- Best for: The tightest-budget builders wanting a basic color-matching cable upgrade

── Budget Tier (Individually sleeved, cleaner look) ──

CableMod ModFlex Extension Kit ⭐ — Individually sleeved paracord-style nylon / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe / No comb / Universal PSU
- CableMod's entry-level individually sleeved option; each wire gets its own sleeve for a cleaner look than single-sleeve competitors; from an established, well-reviewed brand with a strong safety reputation
- Best for: Budget buyers wanting CableMod's quality reputation with individually sleeved wires at an accessible price

Thermaltake TtMod Extension Kit — Individually sleeved nylon braid / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe / No comb / Universal PSU
- Individually sleeved budget option from Thermaltake; colors matched to Thermaltake's broader component lineup
- Best for: Budget buyers in a Thermaltake-themed build wanting matching individually sleeved cables

── Mid-Range Tier (Mesh sleeving + combs, showcase-build look) ──

CableMod ModMesh Extension Kit ⭐⭐ — Individually sleeved mesh-style nylon (bold, high-contrast weave) / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe / Cable combs included ✓ / Universal PSU
- One of the most popular showcase-build cable kits. Mesh-style sleeving is thicker and bolder than paracord; combs included for a clean, flat professional finish; wide range of colors available. Note: thicker sleeving can be harder to route through very tight cable-management areas.
- Best for: Mid-range builders wanting a bold, high-contrast cable look with combs for a polished showcase-build finish; community top pick

CableMod Pro ModMesh Extension Kit ⭐ — Individually sleeved mesh-style nylon (refined weave) / 24-pin ATX + 4+4-pin EPS + 6+2-pin PCIe / Cable combs included ✓ / Universal PSU
- Upgraded evolution of the standard ModMesh with refined connector housings and improved sleeving consistency; CableMod's most polished universal extension kit
- Best for: Mid-range buyers wanting the most refined universal extension kit available before stepping to direct-replacement sets`,
    metadata: { category: 'products', topic: 'sleeved-cables-entry-midrange' },
  },

  // ── Sleeved Cables: Enthusiast & Flagship ─────────────────────────────────
  {
    content: `Custom Sleeved PSU Cables — Enthusiast and Flagship (Direct-Replacement Sets and Digital RGB):

── Enthusiast Tier (Direct-Replacement Cable Sets — PSU-specific, cleanest connection) ──
Direct-replacement cables connect straight to the PSU, eliminating extension-point bulk entirely. PSU compatibility must be verified before buying — pinouts are proprietary.

Corsair Premium Individually Sleeved PSU Cable Pro Kit, Type 5 ⭐ — Individually sleeved premium nylon / 24-pin ATX + 4+4-pin EPS + multiple 6+2-pin PCIe / Cable combs included ✓ / CORSAIR TYPE 5 (GEN 5) PSUS ONLY
- Corsair's official direct-replacement set for compatible PSUs (RMx/HXi/AXi Gen 5 series and similar); direct PSU connection eliminates any extension bulk for the cleanest possible cable run; officially made and warrantied by the PSU manufacturer
- Compatible PSUs: Corsair Type 5 (Gen 5) connector PSUs only — verify your specific model before buying
- Best for: Enthusiast buyers with a compatible Corsair Type 5 PSU wanting the cleanest possible direct-replacement cable appearance

CableMod C-Series PRO ModMesh Cable Kit ⭐ — Individually sleeved mesh-style nylon / 24-pin ATX + 4+4-pin EPS + multiple 6+2-pin PCIe / Cable combs included ✓ / PSU-MODEL-SPECIFIC (Corsair, EVGA, Seasonic, and others — select matching variant)
- CableMod's direct-replacement line sold in PSU-model-specific variants; covers many popular Corsair, EVGA, Seasonic, and other PSU connector standards; ModMesh aesthetic at the PSU connector itself with no extension bulk
- CRITICAL: Must select the exact correct PSU brand/model variant — connector pinouts are proprietary and incompatible across models. Connecting a wrong cable can cause serious damage.
- Best for: Enthusiast buyers whose specific PSU model has an available CableMod C-Series variant wanting a clean direct-replacement mesh-sleeved look

── Flagship Tier (Digital RGB Power Display Cables — Animated Lighting Showpieces) ──
These are fundamentally different products: translucent cables with embedded ARGB LED strips that create animated lighting effects. Require a motherboard ARGB header or dedicated controller.

Lian Li Strimer Plus V2 ⭐⭐ — Translucent housing with internal ARGB LED strip / 24-pin ATX (8-pin PCIe/EPS sold separately) / Universal PSU extension / Motherboard ARGB header or L-Connect controller required
- The original and most popular animated power cable. Embedded RGB LEDs create a lighting effect that can optionally react to real-time system power draw. Widely featured in showcase builds. Note: 8-pin EPS and PCIe variants are separate additional purchases.
- Best for: Flagship buyers wanting a genuinely animated lighting centerpiece in their build rather than a static color-matched cable; community top pick for this category

CableMod RGB Combo Kit ⭐ — Translucent housing with internal ARGB LED strip / 24-pin ATX / Universal PSU extension / Motherboard ARGB header required (Aura Sync/Mystic Light/RGB Fusion/iCUE compatible)
- CableMod's answer to the Strimer; broad RGB ecosystem compatibility including Corsair iCUE synchronization; from an established, well-reviewed cable manufacturer
- Best for: Flagship buyers wanting an animated RGB power cable with broad ecosystem sync (especially Corsair iCUE); strong alternative to the Strimer

Summary — Which Tier for Your Build:
- Just want color-matched cables: Entry/Budget extension kit (EZDIY-FAB, CableMod ModFlex)
- Want the showcase-build look with combs: Mid-Range CableMod ModMesh
- Want the cleanest possible look (no extension bulk): Enthusiast direct-replacement set (verify PSU compatibility)
- Want an animated lighting showpiece: Flagship Lian Li Strimer Plus V2 or CableMod RGB Combo`,
    metadata: { category: 'products', topic: 'sleeved-cables-enthusiast-flagship' },
  },

  // ── RGB Controllers: Buying Guide ────────────────────────────────────────
  {
    content: `RGB / ARGB Controller and Hub Buying Guide:

Why you might need a standalone RGB controller:
- Motherboards typically have only 2–4 ARGB/RGB headers. A build with 6+ RGB fans, LED strips, and accessories quickly exhausts these.
- A standalone hub adds more headers, drawing power from a SATA connector rather than the motherboard, and connecting back to the motherboard via a single USB or ARGB header for software sync.

ARGB (5V) vs. RGB (12V) — the most critical compatibility distinction:
- ARGB (addressable, 5V, 3-pin): Each LED can be individually controlled for color chase and per-LED effects. The current standard for nearly all modern RGB fans and strips.
- RGB (non-addressable, 12V, 4-pin): The entire strip/fan changes as one uniform color. An older standard, still found on some budget products.
- NEVER mix them: Connecting a 5V ARGB device to a 12V RGB header (or vice versa) will permanently damage the device. Always verify the header standard matches your devices before wiring.

Software ecosystems and cross-brand sync:
- RGB controllers work best within their manufacturer's ecosystem: Corsair iCUE, NZXT CAM, ASUS Aura Sync, Lian Li L-Connect, Thermaltake TT RGB PLUS.
- Cross-brand basic sync is possible (most hubs support generic 3-pin ARGB sync with any ARGB-compatible motherboard software), but advanced per-LED effects, color matching, and system event reactions require staying within one ecosystem.
- Recommendation: Match your controller brand to your other RGB components (case fans, case, cooler) for the best sync experience.

Channels, capacity, and daisy-chaining:
- Controllers range from 2 to 10+ channels. More channels = more independent groups of devices.
- Daisy-chaining lets you connect multiple fans in series from a single channel, reducing cable count. Each channel has a power limit — don't overload a single chain with too many high-draw devices.

Combo fan hub + RGB controller vs. pure RGB controller:
- Many products manage both PWM fan speed and ARGB lighting from one device — one SATA power connection, one USB header, handles everything. Simplifies cabling significantly in fan-heavy builds.
- Pure RGB-only controllers are for lighting expansion when fan speed is already managed separately.

Physical remote vs. software-only:
- Software-only controllers require the manufacturer's app to change settings, but offer full granular control.
- Controllers with a physical remote allow basic color/effect changes without software — useful for HTPC setups or systems that don't always have the app running.`,
    metadata: { category: 'products', topic: 'rgb-controllers-buying-guide' },
  },

  // ── RGB Controllers: Entry & Budget ───────────────────────────────────────
  {
    content: `RGB / ARGB Controllers — Entry and Budget Tiers (Basic Expansion, 2–4 Channels):
Entry controllers add just a couple of extra ARGB headers for small lighting expansions. Budget tier steps up to more channels, combo hubs, or higher per-channel capacity.

── Entry Tier (2 channels, basic expansion) ──

Corsair iCUE Lighting Node CORE ⭐ — 5V ARGB / 2 channels / SATA power / USB 2.0 header / iCUE software
- Cheapest entry into iCUE-controlled ARGB lighting; simple 2-channel expansion; daisy-chain support; compact form factor
- Best for: Entry iCUE builds needing just 1–2 extra ARGB headers; the lowest-cost Corsair option

NZXT HUE 2 ⭐ — 5V ARGB / 2 channels / SATA power / USB 2.0 header / NZXT CAM software
- Reliable NZXT ecosystem entry; commonly sold bundled with LED strips as a starter kit; 2-channel expansion
- Best for: Entry NZXT CAM builds wanting a first RGB expansion; often better value when bundled with LED strips

Cooler Master ARGB LED Controller — 5V ARGB / 2 channels / SATA power / USB 2.0 header / MasterPlus+
- Simple 2-channel ARGB controller for basic MasterPlus+ controlled expansion; very low cost
- Best for: Entry Cooler Master ecosystem builds needing basic ARGB expansion

DeepCool RGB Convertor — Supports BOTH 5V ARGB (3-pin) and 12V RGB (4-pin) on separate ports / 1 channel / SATA power / Motherboard sync passthrough
- Not a standalone controller — it's a signal converter. Routes non-native ARGB/RGB fans through to motherboard software (Aura Sync, Mystic Light, RGB Fusion) for basic sync; no standalone software
- Best for: The specific situation where you have a non-native RGB/ARGB device that won't sync with your motherboard — this makes it compatible; a niche purpose-built tool

── Budget Tier (4–6 channels, higher capacity or combo fan+RGB) ──

Corsair iCUE Lighting Node PRO ⭐ — 5V ARGB / 2 channels / Up to 204 LEDs per channel / SATA power / USB 2.0 header / iCUE
- Long-standing, widely used Corsair hub with dramatically higher per-channel LED capacity than the entry Lighting Node CORE; 2 channels at high capacity
- Best for: Budget iCUE builds needing higher per-channel ARGB capacity rather than more channels

Phanteks D-RGB Controller ⭐ — 5V ARGB / 4 channels / SATA power / USB 2.0 or motherboard ARGB header / Physical remote ✓ / Phanteks software or generic ARGB sync
- Four channels; includes a physical remote for software-free adjustments; compatible with generic motherboard ARGB sync standards (Aura Sync/Mystic Light/RGB Fusion)
- Best for: Budget buyers with Phanteks cases/fans wanting a multi-channel controller with a physical remote

Cooler Master ARGB & PWM Hub ⭐ — 5V ARGB + 4-pin PWM / 6 channels / SATA power / USB 2.0 header + 1 motherboard PWM header / MasterPlus+
- Combination fan speed + lighting hub from one device; 6 channels for moderate builds; simplifies cabling vs. separate fan + RGB controllers
- Best for: Budget builds with several Cooler Master fans needing combined fan speed and lighting control in one device

NZXT RGB & Fan Controller ⭐ — 5V ARGB + 4-pin PWM / 6 channels / SATA power / USB 2.0 header / NZXT CAM
- NZXT's combination fan + lighting hub; 6 channels; clean CAM integration; daisy-chain support; best value for NZXT fan-heavy builds
- Best for: Budget NZXT ecosystem builds wanting combined fan speed and lighting control`,
    metadata: { category: 'products', topic: 'rgb-controllers-entry-budget' },
  },

  // ── RGB Controllers: Mid-Range & Enthusiast ────────────────────────────────
  {
    content: `RGB / ARGB Controllers — Mid-Range and Enthusiast Tiers (More Channels, Temperature Monitoring, Deep Ecosystem Integration):

── Mid-Range Tier ──

Corsair iCUE Commander CORE ⭐⭐ — 5V ARGB + 4-pin PWM / 6 fan channels + 2 RGB lighting channels + temperature sensor support / SATA power / USB 2.0 header / iCUE
- Commonly bundled with iCUE fan kits; combines fan speed, lighting, and basic temperature monitoring in one device; deep iCUE software integration; step up from the Lighting Node line
- Best for: Mid-range iCUE builds wanting combined fan, lighting, and temperature monitoring from one hub; the default mid-range Corsair hub

NZXT Internal USB Hub — USB expansion device (not a lighting controller itself) / Expands one motherboard USB 2.0 header into 5 USB 2.0 connections / SATA power
- Solves the problem of running out of internal USB 2.0 headers when connecting multiple NZXT controllers (HUE 2, RGB & Fan Controller, etc.) simultaneously; essential infrastructure for large multi-controller NZXT builds
- Best for: Multi-controller NZXT builds that have run out of motherboard USB 2.0 headers; a utility device, not a lighting hub itself

ASUS Aura Terminal — 5V ARGB / 5 channels / Motherboard ARGB Gen 2 header / Onboard display for effect preview / Aura Sync
- Unique: includes a small onboard display to preview lighting effects without opening software; deep Aura Sync integration with other ASUS components; requires a compatible ASUS motherboard Aura Sync header for full function
- Best for: Mid-range ASUS ecosystem builders wanting onboard effect preview alongside Aura Sync integration

Phanteks D-RGB Combo Controller ⭐ — 5V ARGB + 4-pin PWM / 8 channels / SATA power / USB 2.0 or motherboard ARGB header / Physical remote ✓
- Higher channel count than the budget D-RGB Controller (8 vs 4 channels); bundled physical remote controls both fan speed presets and lighting; generic ARGB sync compatible
- Best for: Mid-range Phanteks ecosystem builders wanting combined fan + lighting control across more channels with a physical remote

── Enthusiast Tier ──

Corsair Commander PRO ⭐⭐ — 5V ARGB + 12V RGB (both supported) / 6 fan channels + 2 RGB lighting channels + 4 temperature sensor inputs / SATA power / USB 2.0 header / iCUE
- A long-standing enthusiast benchmark hub. Six fan channels, four temperature sensor inputs, and supports BOTH 5V ARGB and 12V RGB standards via included adapters. Extensively used in enthusiast builds for deep monitoring and control. Note: only 2 RGB lighting channels despite the extensive fan/sensor capability.
- Best for: Enthusiast builds wanting maximum fan + temperature monitoring alongside RGB control; the enthusiast Corsair hub default

Lian Li Uni Hub SL ⭐ — 5V ARGB (Uni Fan proprietary connector) + 4-pin PWM / 4 channels (4 daisy-chained Uni Fan SL units per channel max) / SATA power / USB 2.0 header / L-Connect
- The dedicated controller hub for Lian Li's popular Uni Fan SL infinity-mirror series. Simplified daisy-chain cabling — multiple SL fans chain together from one hub port. Deep L-Connect integration.
- Best for: Enthusiast builders using Lian Li Uni Fan SL series fans wanting the essential matching hub; not useful without SL fans

NZXT HUE 2 Ambient ⭐ — 5V ARGB / 2 channels / SATA power / USB 2.0 header / NZXT CAM (including screen color-matching ambient mode)
- Bundled with wide ambient lighting strips designed for behind-monitor placement; CAM's screen color-matching mode dynamically shifts LED colors to match on-screen content for immersive ambient lighting
- Best for: Enthusiast buyers specifically wanting screen-matching ambient lighting behind a monitor or desk setup; a distinctive feature not offered by competitors

ASUS Addressable Gen 2 Extension Card — 5V ARGB Gen 2 / 3 channels / PCIe bracket-mounted (occupies a rear slot, uses no PCIe lane) / No separate SATA power needed / Aura Sync
- Directly extends a compatible ASUS motherboard's native Aura Sync ARGB Gen 2 header rather than acting as an independent device — ensures full software feature parity at the hardware level. Requires a specifically compatible ASUS motherboard.
- Best for: ASUS motherboard owners who have simply run out of onboard ARGB Gen 2 headers and want a clean native-extension solution`,
    metadata: { category: 'products', topic: 'rgb-controllers-midrange-enthusiast' },
  },

  // ── RGB Controllers: Flagship ─────────────────────────────────────────────
  {
    content: `RGB / ARGB Controllers — Flagship Tier (Maximum Channels, Unified Cabling, Large Build Management):
Flagship controllers handle large builds with many fans and complex lighting setups — 8+ devices, pump control, or simplified unified cabling architectures.

Corsair iCUE LINK System Hub ⭐⭐ — iCUE LINK proprietary connector (combined power + data) / Up to 14 daisy-chained iCUE LINK devices across 2 hub ports / SATA power / USB 2.0 header / iCUE
- Corsair's current-generation flagship hub architecture. Single-cable daisy-chain carries both power and data to each device, dramatically simplifying cabling vs. traditional ARGB+PWM wiring (no separate fan power, RGB, and PWM cables per device — one cable per fan in a chain).
- IMPORTANT: Requires specifically iCUE LINK-compatible fans/coolers. Not compatible with standard 3-pin ARGB fans without a separate adapter. This is a new proprietary ecosystem requiring full buy-in.
- Best for: Flagship buyers building a new Corsair-centric system who want the simplest possible cabling architecture for many devices

Corsair iCUE Commander Core XT ⭐ — 5V ARGB + 4-pin PWM / 6 fan channels + 2 RGB lighting channels / SATA power / USB 2.0 header / iCUE
- An updated, higher-channel-count evolution of the Commander CORE for traditional (non-LINK) ARGB fan setups; remains compatible with standard 3-pin ARGB fans; deep iCUE feature integration
- Best for: Flagship builders with large traditional (non-LINK) ARGB fan setups wanting maximum iCUE channel count without switching to the new proprietary LINK standard

Lian Li Uni Hub TR ⭐ — 5V ARGB (Uni Fan proprietary connector) + 4-pin PWM / 6 channels (4 daisy-chained Uni Fan TL units per channel max) / SATA power / USB 2.0 header / L-Connect
- Top-tier controller for Lian Li's Uni Fan TL reverse-blade series; highest channel count in the Uni Hub lineup (6 vs 4 on the SL version) for the largest Lian Li builds; deep L-Connect integration
- Best for: Flagship builders running large Lian Li Uni Fan TL installations wanting the highest-capacity dedicated hub

Thermaltake Commander FP ⭐ — 5V ARGB + 4-pin PWM (fans AND pump) / 10 fan/pump channels + 5 RGB lighting channels / SATA power / USB 2.0 header / TT RGB PLUS software / Physical remote ✓
- Highest combined channel count in this database: 10 fan/pump channels and 5 lighting channels from one controller. Manages liquid cooling pump speed alongside fans and lighting. Includes a physical remote alongside full TT RGB PLUS software control (including voice and app control).
- Best for: Flagship builders with large multi-fan, pump-equipped liquid-cooled systems wanting maximum channel count and pump speed control in a single device

RGB Controller Key Concepts Summary:
- 5V ARGB (3-pin) = per-LED addressable, modern standard; 12V RGB (4-pin) = uniform color, legacy standard — NEVER mix them
- Match controller brand to your fans/case brand for best ecosystem sync
- Combo fan+RGB hubs simplify cabling significantly vs separate fan and lighting controllers
- For Corsair builds: Entry → Lighting Node CORE → Commander CORE → Commander Core XT → iCUE LINK System Hub
- For NZXT builds: HUE 2 → RGB & Fan Controller → Internal USB Hub (expansion) → HUE 2 Ambient
- For Lian Li Uni Fan builds: Uni Hub SL (SL fans) or Uni Hub TR (TL fans)`,
    metadata: { category: 'products', topic: 'rgb-controllers-flagship' },
  },

  // ── PSUs: Buying Guide ────────────────────────────────────────────────────
  {
    content: `Gaming PC Power Supply (PSU) Buying Guide:

How to size a PSU for a gaming build:
- Add up: CPU TDP + GPU recommended PSU wattage + ~100–150W for the rest of the system (motherboard, RAM, storage, fans) + 20–30% headroom for transient spikes and future upgrades.
- Most mid-range gaming builds (Ryzen 5/Core i5 + RTX 4070-class GPU) → 650–750W is comfortable.
- High-end builds with flagship GPUs (RTX 4090/5090, RX 7900 XTX) → 850–1000W+ needed.
- Bigger is not always better: PSUs run least efficiently at very low load percentages, so a massively oversized PSU can be slightly less efficient at idle than a well-matched one. Size for actual needs + reasonable headroom.

80+ efficiency ratings:
- White (80%), Bronze (82–85%), Silver (85–88%), Gold (87–90%), Platinum (89–92%), Titanium (90–94%)
- Higher tiers = less power wasted as heat, cooler and quieter operation, and typically better-quality internal components.
- Practical rule: Bronze for budget builds, Gold for mid-to-high-end builds, Platinum/Titanium only if you specifically want maximum efficiency, minimum fan noise, or highest-tier build quality.

Modular vs semi-modular vs non-modular:
- Fully modular: attach only cables you need → cleanest cable management → price premium.
- Semi-modular: 24-pin and CPU power permanently attached, rest modular → a good middle ground.
- Non-modular: all cables permanently attached → cheapest, but cable clutter is the tradeoff.
- Recommendation: semi-modular or fully modular is worth the modest premium for better airflow and cleaner builds.

ATX 3.0/3.1 and the 12V-2x6 (12VHPWR) connector:
- ATX 3.0/3.1 is designed around modern GPUs' power transient spike behavior (especially NVIDIA RTX 40/50-series flagship cards).
- Includes a native 12V-2x6 connector for high-end GPUs instead of requiring an adapter from multiple 8-pin PCIe cables.
- If pairing with a flagship GPU (RTX 4080/4090/5080/5090, RX 7900 XTX), prefer a PSU with a native 12V-2x6 connector — adapters work when properly seated, but native connections eliminate a point of user error linked to rare connector overheating incidents.
- Budget/mid-range GPUs (RTX 4060 Ti and below, RX 7700 and below) still use standard 8-pin PCIe connectors — ATX 3.0 is not required.

Why PSU brand matters more than most components:
- A failing or poor-quality PSU can damage every component it powers. This is unlike most other failures, which are self-contained.
- Stick to established brands with verified internal quality. The 80+ certification measures efficiency only — not build quality, ripple suppression, or protection circuitry. Two Gold-rated PSUs can differ dramatically in real reliability.
- Never mix modular cables between different PSU units — even visually identical connectors can have different pinouts and cause electrical damage.

Reputable PSU brands: Seasonic, Corsair (RM/HX/AX lines), be quiet!, Super Flower, Fractal Design, EVGA (GT/G6 lines). FSP and DeepCool are rising; avoid unknown brands entirely.`,
    metadata: { category: 'products', topic: 'psus-buying-guide' },
  },

  // ── PSUs: Entry ───────────────────────────────────────────────────────────
  {
    content: `Gaming PSUs — Entry Tier (550–600W, 80+ Bronze, Non-Modular):
Entry PSUs are for budget gaming builds with entry-to-budget tier GPUs (roughly RTX 4060-class and below). All are non-modular with standard 80+ Bronze or basic certification. None have ATX 3.0/12V-2x6 connectors.

Corsair CV550 ⭐ — 550W / 80+ Bronze / Non-modular / 3-year warranty
- Trusted brand at an entry price; reliable for basic builds; standard 80+ Bronze efficiency; adequate for entry-to-budget tier GPU builds
- Best for: Budget gaming builds wanting a trusted brand at the lowest possible price from Corsair

Seasonic S12III 550 ⭐⭐ — 550W / 80+ Bronze / Non-modular / 5-year warranty
- Seasonic's respected engineering reputation at a budget price; longer 5-year warranty than most entry-tier competitors; one of the most consistently recommended entry-tier PSUs
- Best for: Budget gaming builds wanting Seasonic's reliability reputation and a longer warranty; the top entry-tier recommendation

EVGA 500 BR — 500W / 80+ Bronze / Non-modular / 3-year warranty
- EVGA's entry line at an aggressive price; 500W ceiling limits future upgrade headroom; slightly lower wattage than the Corsair CV550 or Seasonic S12III
- Best for: The tightest-budget gaming builds with entry-tier GPUs (integrated graphics or basic dGPU); avoid if any meaningful GPU upgrade is planned

be quiet! System Power 10 550W — 550W / 80+ Bronze / Non-modular / 3-year warranty
- Quieter operation than typical entry-tier competitors; be quiet!'s reputation for acoustic engineering; modest price premium over the cheapest entry-tier units
- Best for: Budget gaming builds prioritizing quiet operation even at the entry tier

Thermaltake Smart 600W — 600W / 80+ White / Non-modular / 3-year warranty
- Slightly higher 600W ceiling than typical entry-tier competitors; 80+ White only (below Bronze-rated competitors); widely available
- Note: 80+ White is a lower certification tier than Bronze — the Corsair CV550 and Seasonic S12III offer 80+ Bronze at a similar or lower price, making them the stronger recommendations
- Best for: Builders specifically needing slightly more than 550W at the tightest possible budget; otherwise prefer Bronze-rated alternatives`,
    metadata: { category: 'products', topic: 'psus-entry' },
  },

  // ── PSUs: Budget ──────────────────────────────────────────────────────────
  {
    content: `Gaming PSUs — Budget Tier (650–700W, Mix of Bronze and Gold, Semi/Fully Modular):
Budget PSUs step up to better cable management (semi/fully modular) and occasionally Gold efficiency, suited to budget-to-mid gaming builds. None have ATX 3.0/12V-2x6 connectors.

Corsair CX650M ⭐⭐ — 650W / 80+ Bronze / Semi-modular / 5-year warranty
- Long-running, well-regarded semi-modular budget PSU; semi-modular cabling improves build cleanliness over non-modular entry units; 5-year warranty; long track record of reliability
- Best for: Budget-to-mid gaming builds wanting semi-modular cable management from a trusted brand; the default budget semi-modular recommendation

Cooler Master MWE Bronze V2 650 ⭐ — 650W / 80+ Bronze / Semi-modular / 5-year warranty
- Semi-modular step up from fully non-modular entry units; competitive price; 5-year warranty; solid for budget-to-mid builds
- Best for: Budget-to-mid gaming builds wanting semi-modular convenience at a competitive price

EVGA SuperNOVA 650 GT ⭐ — 650W / 80+ Gold / Fully modular / 7-year warranty
- Unusually, offers 80+ Gold efficiency and full modularity at a near-budget price; long 7-year warranty; one of the best value steps from budget to Gold territory
- Best for: Budget-to-mid gaming builds wanting Gold efficiency and full modularity; strong value pick

NZXT C650 ⭐ — 650W / 80+ Gold / Fully modular / 10-year warranty
- 80+ Gold + fully modular + 10-year warranty at a budget-adjacent price; fanless mode at low loads on some revisions; clean styling matches NZXT cases
- Best for: Budget-to-mid gaming builds in an NZXT-cased system wanting Gold efficiency and a long warranty

MSI MAG A650BN — 650W / 80+ Bronze / Non-modular / 3-year warranty
- Competitive budget pricing from a trusted PC component brand; non-modular; adequate for budget-to-mid builds
- Best for: Budget builds in an MSI-branded system wanting a basic 650W unit; otherwise CX650M is the better semi-modular pick

FSP Hyper K Pro 700 — 700W / 80+ Bronze / Non-modular / 3-year warranty
- Slightly higher 700W ceiling than the typical 650W budget competitors; backed by FSP's long OEM manufacturing history; smaller consumer brand recognition
- Best for: Budget-to-mid builds wanting slightly more wattage headroom without paying mid-range prices`,
    metadata: { category: 'products', topic: 'psus-budget' },
  },

  // ── PSUs: Mid-Range ───────────────────────────────────────────────────────
  {
    content: `Gaming PSUs — Mid-Range Tier (750W, 80+ Gold, Fully Modular):
Mid-range PSUs are the most recommended tier for mainstream to high-end gaming builds. 80+ Gold efficiency, full (or semi) modularity, and long warranties are standard. Most lack native ATX 3.0/12V-2x6 connectors — fine for GPUs up to RTX 4070 Ti / RX 7900 XT class.

Corsair RM750e ⭐⭐ — 750W / 80+ Gold / Fully modular / 10-year warranty / ATX 2.4 (12V-2x6 adapter included)
- One of the most consistently recommended mid-range PSUs available. Near-silent Zero RPM fan mode at low-to-moderate loads. Ships with a 12V-2x6 adapter cable for compatible GPUs (not native ATX 3.0 but covers most needs). Outstanding price-to-performance for a Gold fully modular unit.
- Best for: The default recommendation for mid-range to high-end gaming builds; the community consensus top pick in this tier

Seasonic Focus GX-750 ⭐⭐ — 750W / 80+ Gold / Fully modular / 10-year warranty / ATX 2.4
- Widely respected for Seasonic's build quality reputation; fanless mode at low-to-moderate loads; 10-year warranty; strong alternative to the RM750e if you prefer Seasonic's track record
- Best for: Mid-range to high-end gaming builds wanting Seasonic's build quality and engineering reputation

be quiet! Pure Power 12 M 750W ⭐ — 750W / 80+ Gold / Semi-modular / 5-year warranty / ATX 3.0 native 12V-2x6 ✓
- Notable for including native ATX 3.0 12V-2x6 connector at a mid-range price; be quiet!'s reputation for quiet operation; semi-modular rather than fully modular
- Best for: Mid-range builds pairing with a modern GPU that benefits from native ATX 3.0 connector support, with quiet operation as a priority

Super Flower Leadex III Gold 750W ⭐ — 750W / 80+ Gold / Fully modular / 10-year warranty / ATX 2.4
- Highly praised by independent PSU reviewers for excellent voltage regulation and internal build quality; Super Flower is an OEM manufacturer for other brands; smaller consumer brand recognition despite top-tier internal engineering
- Best for: Enthusiasts who follow independent PSU reviews and want top-tier internal quality at a mid-range price

ASUS ROG Strix 750G — 750W / 80+ Gold / Fully modular / 10-year warranty / ATX 2.4
- Styled to match ROG-branded cases and motherboards; 80+ Gold fully modular with a 10-year warranty; price premium partly reflects ROG branding
- Best for: Mid-range to high-end gaming builds wanting a cohesive ROG aesthetic; otherwise comparable spec units cost less

Cooler Master MWE Gold V2 750 — 750W / 80+ Gold / Fully modular / 5-year warranty / ATX 2.4
- Competitive pricing for Gold fully modular; slightly shorter warranty than Corsair/Seasonic/ASUS competitors
- Best for: Mid-range gaming builds wanting Gold efficiency at a competitive price; RM750e is usually the better value pick

DeepCool PK750D — 750W / 80+ Gold / Fully modular / 5-year warranty / ATX 2.4
- Competitive value from DeepCool's expanding PSU lineup (brand better known for cooling); growing reputation
- Best for: Mid-range gaming builds wanting Gold efficiency at a competitive price from a cooling-focused brand`,
    metadata: { category: 'products', topic: 'psus-midrange' },
  },

  // ── PSUs: Enthusiast ──────────────────────────────────────────────────────
  {
    content: `Gaming PSUs — Enthusiast Tier (850W–1000W, ATX 3.0, Gold/Platinum):
Enthusiast PSUs are for high-end gaming builds pairing with flagship-adjacent GPUs (RTX 4080/5080-class and above). Most include native ATX 3.0/12V-2x6 connectors.

── 850W Class ──

Corsair RM850x ⭐⭐ — 850W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- The current RM850x revision adds native ATX 3.0 support to Corsair's well-regarded RM-x line. Near-silent Zero RPM fan mode. One of the most recommended enthusiast-tier PSUs. The default recommendation for pairing with high-end GPUs.
- Best for: High-end gaming builds pairing with RTX 4080/5080-class GPUs; the community consensus top pick for this tier

Seasonic Vertex GX-850 ⭐ — 850W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- Brings Seasonic's respected build quality reputation to ATX 3.0 connector support; strong alternative to the RM850x if you prefer Seasonic's track record
- Best for: High-end gaming builds wanting Seasonic's build quality with modern connector support

be quiet! Straight Power 12 850W ⭐ — 850W / 80+ Platinum / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- Steps up to 80+ Platinum efficiency; be quiet!'s reputation for near-silent operation; premium over Gold-rated competitors at the same wattage
- Best for: High-end gaming builds prioritizing quiet operation and higher efficiency; the go-to if fan noise at high loads matters

FSP Hydro PTM Pro 850W ⭐ — 850W / 80+ Platinum / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- 80+ Platinum + native ATX 3.0 at a competitive price vs. more marketed Platinum competitors; backed by FSP's long OEM manufacturing history
- Best for: High-end gaming builds wanting Platinum efficiency and ATX 3.0 at a competitive price

MSI MPG A850G PCIE5 — 850W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- Solid ATX 3.0 Gold unit from MSI's component ecosystem; 10-year warranty
- Best for: High-end gaming builds wanting ATX 3.0 support within an MSI-branded system

Thermaltake Toughpower GF3 850W — 850W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- ATX 3.0 Gold unit with a 10-year warranty from Thermaltake's broader ecosystem
- Best for: High-end gaming builds wanting ATX 3.0 support within a Thermaltake-cased build

── 1000W Class ──

EVGA SuperNOVA 1000 G6 ⭐ — 1000W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓ / Compact 130mm depth
- More compact chassis than typical 1000W units (130mm depth), easing case clearance in tighter builds; high wattage headroom for flagship GPUs or future upgrades
- Best for: High-end gaming builds wanting extra wattage headroom in a more compact form factor

NZXT C1000 Gold — 1000W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓ / Fanless low-load mode
- Matches NZXT's clean case aesthetic; fanless mode at low loads; 10-year warranty; 1000W headroom for flagship GPU builds
- Best for: High-end gaming builds in an NZXT-cased system wanting ATX 3.0 support and matching aesthetics

DeepCool PX1000G — 1000W / 80+ Gold / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- Competitive pricing for a 1000W ATX 3.0 unit; 10-year warranty; expanding brand reputation
- Best for: High-end gaming builds wanting ATX 3.0 1000W headroom at a competitive price`,
    metadata: { category: 'products', topic: 'psus-enthusiast' },
  },

  // ── PSUs: Flagship ────────────────────────────────────────────────────────
  {
    content: `Gaming PSUs — Flagship Tier (1000W+, Platinum/Titanium, Digital Monitoring):
Flagship PSUs target builds with RTX 4090/5090-class GPUs, extreme overclocking setups, or buyers wanting maximum efficiency, the longest warranties, and premium features like real-time power monitoring.

Corsair HX1000i ⭐⭐ — 1000W / 80+ Platinum / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓ / iCUE digital monitoring
- Near-silent Zero RPM fan mode; real-time digital power draw monitoring via Corsair iCUE; strong reliability reputation; one of the most recommended flagship PSUs. The default recommendation for RTX 4090/5090-class GPU pairings.
- Best for: Flagship gaming builds wanting maximum headroom, Platinum efficiency, and digital power monitoring

Seasonic Prime TX-1000 ⭐ — 1000W / 80+ Titanium / Fully modular / 12-year warranty / ATX 3.0 native 12V-2x6 ✓ / Fanless at low-to-moderate loads
- The highest efficiency certification tier (Titanium); Seasonic's respected build quality; exceptionally long 12-year warranty; fanless at low-to-moderate loads — the quietest operation at any load
- Best for: Flagship gaming builds wanting the highest available efficiency and Seasonic's build quality; the top pick for maximum quality

be quiet! Dark Power Pro 13 1000W ⭐ — 1000W / 80+ Titanium / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓
- Titanium efficiency + be quiet!'s reputation for near-silent operation even at sustained high wattage; premium price
- Best for: Flagship gaming builds prioritizing quiet operation alongside Titanium efficiency

ASUS ROG Thor 1000P2 ⭐ — 1000W / 80+ Platinum / Fully modular / 10-year warranty / ATX 3.0 native 12V-2x6 ✓ / Built-in OLED display
- Unique feature: built-in OLED display shows real-time wattage draw without any software; ROG branding and styling; Platinum efficiency
- Best for: Flagship gaming builds wanting a distinctive feature set (visible wattage display) alongside top-tier specs in a ROG-themed build

── Extreme Wattage (1600W) — Niche ──

Corsair AX1600i — 1600W / 80+ Titanium / Fully modular / 10-year warranty / ATX 3.0-compliant / iCUE digital monitoring
- One of the highest-wattage consumer PSUs available; Titanium efficiency; iCUE monitoring; genuinely overkill for any single-GPU gaming build (typical flagship GPU systems rarely exceed 700–900W total draw)
- Best for: Extreme multi-GPU workstations or heavily overclocked systems needing sustained very high wattage; niche use case

EVGA SuperNOVA 1600 T2 — 1600W / 80+ Titanium / Fully modular / 10-year warranty / ATX 2.4 (no native 12V-2x6, adapter required)
- Same niche as the AX1600i; no native 12V-2x6 connector (requires adapter for modern high-end GPUs); Titanium efficiency
- Best for: Same extreme workstation/overclocking niche; requires adapter for modern flagship GPUs

PSU Wattage Quick Reference:
- Budget gaming (RTX 4060/RX 7600): 550–650W
- Mid-range gaming (RTX 4070/RX 7700 XT): 650–750W
- High-end gaming (RTX 4080/5080/RX 7900 XT): 850W
- Flagship gaming (RTX 4090/5090/RX 7900 XTX): 1000W+`,
    metadata: { category: 'products', topic: 'psus-flagship' },
  },

  // ── Mousepads: Buying Guide ───────────────────────────────────────────────
  {
    content: `Gaming Mousepad Buying Guide:

Surface types — cloth vs. hard vs. glass:
- Cloth (fabric): Most popular by far. Higher friction = more controlled glide, quieter operation, consistent feel. Can fray at edges (look for stitched edges). The default recommendation for most gamers.
- Hard (polymer/plastic): Faster, lower-friction glide. Stays completely flat forever (no fraying or curling). Noisier under some mouse feet. Less tactile feedback for fine adjustments.
- Glass: The fastest and most consistent surface available, and the only one that truly never wears or changes feel over its lifetime. Verify mouse sensor compatibility before buying — some sensors track inconsistently on glass/transparent surfaces.

Speed vs. control — the core surface tradeoff:
- Control surface: Higher friction — the mouse decelerates quickly and holds position precisely. Favored for tactical shooters (CS2, Valorant) where precise crosshair placement matters most.
- Speed surface: Lower friction — the mouse glides further with the same physical movement. Favored for fast flick-style aiming and higher sensitivity play.
- Neither is objectively better — it's a playstyle match. Most pads market themselves toward one end or the other.

Size guide — choosing the right footprint:
- Compact (under 350mm wide): Fine for high-sensitivity players making small swipe distances. Bad for low-sensitivity players who make large physical swipes.
- Standard (350–480mm): Covers most gaming setups. The default for general use.
- Extended/desk mat (900mm+): Covers both keyboard and mouse. Removes any concern about running off the pad's edge at any sensitivity. Popular for unified desk aesthetics.
- Rule: Size to your sensitivity. A low-sensitivity player benefits far more from an extended pad than from any premium surface coating.

Stitched edges:
- Unstitched pads can fray at the edges over time with daily use. Stitched (bound) edges significantly extend lifespan.
- Most Mid-Range and above pads include stitching. Some budget pads also include stitching (e.g. Glorious Standard) — a notable value advantage.

RGB and wireless charging — functional vs. cosmetic:
- RGB edge lighting: purely cosmetic. Zero effect on surface friction, glide consistency, or sensor tracking.
- Wireless charging: genuinely functional only if you own a specifically compatible wireless mouse (e.g. Logitech Powerplay ecosystem). Verify compatibility before relying on this feature.

Rubber base quality:
- A non-slip rubber base keeps the pad stable during aggressive movements. Cheaper pads can have thin bases that slide. If a pad slides during play, base quality is the usual culprit.`,
    metadata: { category: 'products', topic: 'mousepads-buying-guide' },
  },

  // ── Mousepads: Entry ──────────────────────────────────────────────────────
  {
    content: `Gaming Mousepads — Entry Tier (Compact, No-Frills Cloth Pads):
Entry pads are inexpensive cloth pads for buyers wanting any improvement over a bare desk surface. Typically no stitched edges and compact sizes.

Logitech G240 — Cloth / 340×280mm / 1mm thick / No stitched edges / No RGB / Control-oriented
- Very low-profile (1mm); control-oriented surface aids precise tracking; one of the cheapest entry options
- Best for: Budget buyers wanting a simple control-oriented compact cloth pad

Razer Goliathus Mobile — Cloth / 215×265mm / 1mm thick / Foldable / No stitched edges / No RGB / Balanced
- Foldable, travel-friendly design for LAN events or multiple locations; balanced surface
- Best for: Buyers wanting a portable, foldable entry-level pad for travel; not a fixed desk setup pick

SteelSeries QcK Mini ⭐ — Cloth / 250×210mm / 2mm thick / No stitched edges / No RGB / Balanced
- Compact version of the legendary QcK; same balanced, proven woven surface in a smaller footprint; long track record since 2010; community favorite
- Best for: Buyers with limited desk space wanting the trusted QcK surface feel

HyperX Fury S Speed Edition (S) — Cloth / 270×210mm / 3mm thick / No stitched edges / No RGB / Speed-oriented
- Speed-tuned surface for fast, low-friction glide in a compact size
- Best for: Entry buyers preferring a fast, low-friction glide in a small footprint

Corsair MM100 — Cloth / 360×300mm / 3mm thick / No stitched edges / No RGB / Balanced
- Notably larger footprint than the other entry pads; balanced surface; Corsair brand
- Best for: Budget buyers wanting a larger-than-compact entry pad from a trusted brand`,
    metadata: { category: 'products', topic: 'mousepads-entry' },
  },

  // ── Mousepads: Budget ─────────────────────────────────────────────────────
  {
    content: `Gaming Mousepads — Budget Tier (Standard Size, Proven Community Favorites):
Budget pads offer reliable, proven surfaces at accessible prices. Many have been community-recommended for years; some include stitched edges.

SteelSeries QcK ⭐⭐ — Cloth / 320×270mm / 2mm thick / No stitched edges / No RGB / Balanced
- Arguably the best-selling gaming mousepad ever made. Proven for nearly two decades. Balanced surface suits any playstyle. Consistently affordable.
- Best for: Budget buyers wanting the most proven, widely trusted cloth mousepad ever made; the default budget recommendation

BenQ Zowie G-SR ⭐⭐ — Cloth / 480×400mm / 3mm thick / No stitched edges / No RGB / Control-oriented
- Widely used at professional esports levels. Firm, densely woven control surface. Larger footprint than typical budget pads. Trusted by pro FPS players.
- Best for: Budget buyers wanting a professionally trusted control surface; the top pick for tactical FPS (CS2, Valorant) competitive play

Glorious Standard ⭐ — Cloth / 355×279mm / 3mm thick / Stitched edges ✓ / No RGB / Balanced
- Stitched edges at a budget price — uncommon in this tier. Balanced surface suits any playstyle. Community favorite.
- Best for: Budget buyers wanting stitched-edge durability without paying mid-range prices

Corsair MM300 — Cloth / 360×300mm / 3mm thick / Stitched edges ✓ / No RGB / Balanced
- Anti-fray stitched edges + densely woven surface + larger footprint vs. MM100
- Best for: Budget buyers wanting stitched-edge durability and a slightly larger size from a trusted brand

Razer Goliathus Speed — Cloth / 355×254mm / 3mm thick / No stitched edges / No RGB / Speed-oriented
- Speed-tuned standard-size pad; smooth low-friction surface from Razer's long-running Goliathus line
- Best for: Budget buyers preferring a fast, low-friction glide in a standard size

Logitech G440 — Hard (polymer) / 340×280mm / 3.5mm thick / No RGB / Speed-oriented
- Hard surface stays completely flat forever; easy to clean; consistent fast glide; good if you specifically want a non-cloth surface
- Best for: Budget buyers wanting a durable hard-surface alternative to cloth with consistent fast glide`,
    metadata: { category: 'products', topic: 'mousepads-budget' },
  },

  // ── Mousepads: Mid-Range ──────────────────────────────────────────────────
  {
    content: `Gaming Mousepads — Mid-Range Tier (Extended Sizes, RGB Options, Enhanced Control):
Mid-range pads step up to larger formats, spill resistance, RGB edge lighting, or refined surface textures, typically with stitched edges as standard.

SteelSeries QcK Heavy ⭐ — Cloth / 320×270mm / 6mm thick / No stitched edges / No RGB / Control-oriented
- Extra-thick (6mm) rubber base virtually eliminates any pad movement during aggressive play; firmer control-oriented surface; trusted QcK surface feel
- Best for: Mid-range buyers wanting maximum stability and a firm control-oriented feel; the go-to for players who hate any pad movement

Razer Goliathus Extended Chroma ⭐ — Cloth / 920×294mm / 3mm thick / Stitched edges ✓ / RGB (Chroma) / Balanced
- Extended size covers keyboard and mouse; Chroma RGB integrates with other Razer peripherals; USB power required
- Best for: Mid-range buyers wanting extended coverage with coordinated Razer Chroma RGB

Glorious XXL Extended ⭐ — Cloth / 910×460mm / 3mm thick / Stitched edges ✓ / No RGB / Balanced
- One of the widest mid-range pads; proven Glorious balanced surface; stitched edges; no USB power dependency
- Best for: Mid-range buyers wanting extended desk coverage without RGB; community favorite

Logitech G840 XL — Cloth / 900×400mm / 3mm thick / Stitched edges ✓ / No RGB / Control-oriented
- Large format + stitched edges + control-oriented surface; no USB power needed; well-regarded for Logitech ecosystem users
- Best for: Mid-range low-sensitivity players wanting ample swipe room in a control-oriented surface

Corsair MM350 Premium XL — Cloth (spill-resistant treated) / 930×300mm / 5mm thick / Stitched edges ✓ / No RGB / Balanced
- Spill-resistant surface treatment is a practical bonus; reinforced stitching; extended size; thicker profile
- Best for: Mid-range buyers wanting spill resistance and extended coverage

HyperX Fury S Pro XL — Cloth / 900×420mm / 4mm thick / Stitched edges ✓ / No RGB / Balanced
- Balanced surface + stitched edges + large format; straightforward large cloth pad at a competitive price
- Best for: Mid-range buyers wanting a large balanced-surface pad without extra features

Pulsar ParaControl — Cloth / 460×400mm / 4mm thick / Stitched edges ✓ / No RGB / Control-oriented (high-friction)
- FPS-specialist brand; denser weave delivers high-friction precise control favored by tactical shooter players
- Best for: Mid-range tactical FPS players wanting a precise, high-friction control surface from an FPS-specialist brand`,
    metadata: { category: 'products', topic: 'mousepads-midrange' },
  },

  // ── Mousepads: Enthusiast ─────────────────────────────────────────────────
  {
    content: `Gaming Mousepads — Enthusiast Tier (Japanese Precision, RGB Ecosystems, Cordura Durability):
Enthusiast pads refine surface consistency, introduce premium materials, and integrate deeply with peripheral ecosystems.

Artisan Zero ⭐⭐ — Cloth / 400×450mm / 4mm thick / Stitched edges ✓ / No RGB / Control-oriented (high consistency) / Japanese-made
- Among the most recommended competitive mousepads in the world. Exceptionally consistent, precise control surface. Used at top esports events globally. Standard reference for players prioritizing tracking accuracy.
- Best for: Enthusiast and competitive players prioritizing surface consistency and tracking precision; the enthusiast control pad default

Vaxee PA-M ⭐ — Cloth / 450×400mm / 4mm thick / Stitched edges ✓ / No RGB / Control-oriented
- Dense, tightly woven surface delivers precise, low-drift tracking; trusted within the competitive esports peripheral community; boutique brand
- Best for: Enthusiast competitive FPS players wanting a boutique esports-grade control surface

Endgame Gear MPC890 — Cloth (Cordura fabric) / 450×400mm / 3mm thick / Stitched edges ✓ / No RGB / Balanced
- Cordura fabric surface (same rugged material used in outdoor gear) offers unusually high wear resistance vs standard cloth weaves; balanced friction
- Best for: Enthusiast buyers prioritizing long-term surface durability above all else

SteelSeries QcK Prism XL ⭐ — Cloth / 900×300mm / 2mm thick / Stitched edges ✓ / RGB (PrismSync) / Balanced
- Large format; PrismSync RGB integrates with SteelSeries ecosystem; retains trusted QcK balanced surface feel; USB power required
- Best for: Enthusiast buyers wanting the trusted QcK feel with RGB and SteelSeries ecosystem integration

Razer Firefly V2 Pro — Hard (micro-textured polymer) / 355×255mm / 6mm thick / RGB (Chroma) / Balanced hard pad
- Micro-textured coating adds control feel missing on glossy hard surfaces; full Chroma RGB; permanently flat; USB power required; compact size
- Best for: Enthusiast buyers specifically wanting a hard pad with more control texture and full RGB

Corsair MM700 RGB Extended — Cloth / 930×300mm / 4mm thick / Stitched edges ✓ / RGB (iCUE) / Balanced
- Extended size; iCUE integration synchronizes RGB with all Corsair peripherals; USB power required
- Best for: Enthusiast buyers invested in the Corsair iCUE ecosystem wanting synchronized extended RGB lighting`,
    metadata: { category: 'products', topic: 'mousepads-enthusiast' },
  },

  // ── Mousepads: Flagship ───────────────────────────────────────────────────
  {
    content: `Gaming Mousepads — Flagship Tier (Glass Surfaces, Wireless Charging, Japanese Speed Pads):
Flagship pads offer genuinely unique features: wireless mouse charging, glass surfaces that never degrade, or the highest-consistency surface textures from specialist manufacturers.

Logitech G Powerplay ⭐⭐ — Swappable cloth or hard surface (both included) / Wireless charging / No RGB
- Unique flagship system: continuously wirelessly charges a Powerplay-compatible Logitech wireless mouse during normal play — eliminates battery management forever. Includes both cloth and hard swappable surfaces.
- CRITICAL: only charges specifically Powerplay-compatible mice (G502 X Plus, G Pro X Superlight 2, G303, G903, etc.) — verify compatibility. Works as a normal mousepad with any mouse otherwise.
- Best for: Flagship buyers using a Powerplay-compatible Logitech wireless mouse who want to eliminate charging entirely

Artisan Hayate Otsu ⭐ — Cloth / 400×450mm / 4mm thick / Stitched edges ✓ / No RGB / Speed-oriented (high consistency) / Japanese-made
- Speed-oriented counterpart to the Artisan Zero from the same respected Japanese manufacturer. Exceptionally smooth, fast, and consistent surface prized by high-sensitivity and flick-aim competitive players.
- Best for: Flagship buyers prioritizing a fast, exceptionally consistent glide for flick-aim playstyles; the flagship speed pad default

Skypad 3.0 XL ⭐ — Tempered glass / 460×400mm / 4mm thick / No RGB / Speed-oriented (zero surface wear ever)
- The only mousepad surface that truly never wears, changes feel, or degrades over its lifetime. Fastest possible glide. Easy to clean.
- CRITICAL: verify mouse sensor tracking compatibility with glass/transparent surfaces before purchasing — some sensors perform inconsistently.
- Best for: Flagship buyers and aim-training enthusiasts wanting a permanently unchanging, maximum-speed glass surface

Corsair MM800 RGB Polaris — Hard (glossy micro-textured) / 350×262mm / 6mm thick / 15-zone RGB (iCUE) / Speed-oriented + USB passthrough port
- 15-zone RGB with full iCUE integration; built-in USB passthrough port; permanently flat hard surface; verify sensor compatibility with glossy surfaces
- Best for: Flagship buyers wanting a fast hard-surface pad with extensive RGB and a USB passthrough convenience port

Xtrfy GP4 Large — Cloth / 460×400mm / 4mm thick / Stitched edges ✓ / No RGB / Balanced (tuned for competitive esports)
- Scandinavian esports peripheral brand; well-regarded competitive surface tuning; generous swipe area; no USB dependency
- Best for: Flagship buyers wanting a large, competitively tuned cloth surface from an esports-specialist brand

Pulsar ParaSpeed V2 ⭐ — Cloth / 460×400mm / 4mm thick / Stitched edges ✓ / No RGB / Speed-oriented
- Refined second-generation weave from FPS-specialist brand Pulsar; improved surface consistency; fast, low-friction glide
- Best for: Flagship buyers preferring a fast, low-friction glide from a respected FPS-focused boutique brand`,
    metadata: { category: 'products', topic: 'mousepads-flagship' },
  },

  // ── Motherboards: Buying Guide ────────────────────────────────────────────
  {
    content: `Gaming Motherboard Buying Guide:

How to choose a chipset:
- AM5 (AMD current): A620 = budget, no CPU overclocking. B650/B650E = mainstream (E suffix guarantees PCIe 5.0 to GPU slot). X670/X670E and X870/X870E = high-end tiers with more PCIe lanes, USB ports, and better VRMs. X-series and E-variants unlock richer overclocking.
- LGA1700 (Intel 12th–14th gen): H610 = budget, no OC. B660/B760 = mainstream, no CPU OC. Z690/Z790 = unlock full CPU overclocking and offer the most connectivity.
- LGA1851 (Intel Core Ultra 200, Arrow Lake): B860 = mainstream, no OC. Z890 = full overclocking + top connectivity.
- Rule of thumb: non-K Intel CPUs and stock-clock AMD builds don't need a Z/X board — a B-series board is sufficient and cheaper.

VRM quality matters more with higher-TDP CPUs:
- The VRM delivers clean power to the CPU. A weak VRM paired with a high-power CPU (Ryzen 9 9950X, Core i9-14900K) can thermally throttle under sustained load, silently capping performance.
- Match VRM tier to CPU tier: budget/entry boards suit 6-core budget CPUs; enthusiast/flagship CPUs deserve at minimum a solid mid-range board with a robust VRM.

WiFi: built-in vs add-on:
- Most chipsets offer WiFi and non-WiFi variants. If close to a router or already using a USB/PCIe adapter, a non-WiFi board saves money.
- On current platforms (AM5, LGA1851), look for WiFi 6E or WiFi 7. On LGA1700 budget boards, WiFi 6 is common.

Memory speed matters for gaming — especially on AM5:
- On AM5, run RAM at EXPO-rated speed, ideally DDR5-6000 (aligns well with AMD's Infinity Fabric ratio). Running at JEDEC default speeds leaves measurable gaming performance on the table.
- On AM4/LGA1700 DDR4 platforms, DDR4-3600 CL16 is the sweet spot for gaming.
- Important: running all 4 DIMM slots populated often reduces max stable memory speed vs 2 DIMMs — check the board's QVL and spec sheet.

DDR4 vs DDR5 on LGA1700 — board-specific:
- Uniquely, LGA1700 boards shipped in both DDR4 and DDR5 variants under the same chipset name. A "Z690 DDR4" board cannot use DDR5 and vice versa. Always confirm the exact board's memory type before buying RAM.

PCIe 5.0 — how much does it matter today:
- PCIe 5.0 GPU slots (B650E, X670E, Z790, Z890) exist, but no current consumer GPU saturates PCIe 4.0 x16 bandwidth in games — practical gaming benefit is zero today.
- PCIe 5.0 matters for the fastest Gen5 M.2 SSDs (10,000+ MB/s), which benefit storage-heavy workloads but rarely impact gaming load times.

Form factor:
- ATX: standard full-size, most expansion slots and connectivity
- Micro-ATX (mATX): slightly smaller, fewer slots, lower price, suits most gaming builds
- Mini-ITX: compact, single PCIe slot, 1–2 M.2 slots, price premium for miniaturization; more attention needed for VRM and case airflow`,
    metadata: { category: 'products', topic: 'motherboards-buying-guide' },
  },

  // ── Motherboards: AMD AM4 (Legacy) ────────────────────────────────────────
  {
    content: `Gaming Motherboards — AMD AM4 Platform (Legacy, End-of-Life for New CPUs):
AM4 uses DDR4 exclusively. Platform is at end-of-life for new CPU releases — Ryzen 5000 series (including 5800X3D) is the final generation. Still a solid platform for existing builds.

── B550 Chipset (mainstream AM4, no OC limitations on Ryzen) ──

MSI MAG B550 Tomahawk ⭐⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 (1x PCIe 4.0) / 6x SATA / 2.5GbE / No WiFi on base SKU
- One of the most consistently recommended B550 boards ever; excellent price-to-performance for its VRM quality; durable component selection; community staple
- Best for: value-focused AM4 builds with Ryzen 5000-series CPUs; the default B550 recommendation

ASUS ROG Strix B550-F Gaming ⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 (x4 elec) / 2x M.2 (1x PCIe 4.0) / 6x SATA / 2.5GbE / No WiFi on base SKU (WiFi II variant adds WiFi 6)
- Strong VRM for B550; good Aura Sync ecosystem; BIOS FlashBack; no WiFi on standard SKU — check "WiFi II" variant if needed
- Best for: AM4 builds pairing with Ryzen 5000-series including the 5800X3D; solid alternative to the Tomahawk

Gigabyte B550 Aorus Elite AX — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 2x PCIe 3.0 x16 / 2x M.2 (1x PCIe 4.0) / 6x SATA / Gigabit LAN / WiFi 6 included ⭐
- WiFi 6 included at a budget price (rare at entry B550 pricing); adequate VRM for Ryzen 5/7 CPUs; less robust for sustained Ryzen 9 loads
- Best for: budget AM4 builds wanting WiFi included without an add-in card; best suited to Ryzen 5/7

── X570 Chipset (high-end AM4, dual PCIe 4.0 x16, active chipset fan) ──

ASUS ROG Strix X570-E Gaming ⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 2x PCIe 4.0 x16 / 2x M.2 (both PCIe 4.0) / 8x SATA / 2.5GbE / WiFi 6 included
- Robust 14+2 power stage VRM suitable for Ryzen 9 5950X; dual full-speed PCIe 4.0 x16 slots; WiFi 6; active chipset fan (minor noise trade-off vs B550)
- Best for: enthusiast AM4 builds wanting maximum PCIe bandwidth and a top-tier VRM

Gigabyte X570 Aorus Elite — ATX / DDR4 / 2x PCIe 4.0 x16 / 2x M.2 (both PCIe 4.0) / 6x SATA / Gigabit LAN / No WiFi on base SKU (WiFi variant exists)
- Solid VRM suitable for Ryzen 7/9 including 5900X; dual PCIe 4.0 x16; no WiFi on base SKU
- Best for: mid-range to enthusiast AM4 builds not needing built-in WiFi

MSI MPG X570 Gaming Plus — ATX / DDR4 / 2x PCIe 4.0 x16 / 2x M.2 (both PCIe 4.0) / 6x SATA / Gigabit LAN / No WiFi / Budget-tier audio
- Cheapest entry to X570's dual PCIe 4.0 x16 slots; weaker VRM vs premium X570 boards for sustained Ryzen 9 loads; no WiFi or 2.5GbE
- Best for: budget-conscious builds wanting PCIe 4.0 dual-slot flexibility on AM4; best suited to Ryzen 5/7`,
    metadata: { category: 'products', topic: 'motherboards-amd-am4-legacy' },
  },

  // ── Motherboards: AMD AM5 — A620 & B650 ───────────────────────────────────
  {
    content: `Gaming Motherboards — AMD AM5 Platform, Entry & Budget (A620 and B650):
AM5 uses DDR5 exclusively. Socket promised for long-term future CPU upgrade compatibility.

── A620 Chipset (entry AM5, no CPU overclocking) ──

ASRock A620M-HDV — Micro-ATX / DDR5 (2x DIMM, up to 64–96GB) / 1x PCIe 4.0 x16 / 1–2x M.2 / 4x SATA / Gigabit LAN / No WiFi / No RGB / EXPO support
- Cheapest AM5 entry; no CPU overclocking; basic VRM adequate for non-X3D Ryzen 5/7 at stock; minimal features
- Best for: ultra-budget AM5 builds with non-X3D 6-core Ryzen CPUs (Ryzen 5 7600, 9600X)

MSI PRO A620M-E — Micro-ATX / DDR5 (2x DIMM) / Similar spec to A620M-HDV / No WiFi / EXPO support
- Similar entry-level A620 option from MSI; familiar Click BIOS 5 experience; same limitations as A620M-HDV
- Best for: same niche as ASRock A620M-HDV; choose based on local pricing/availability

── B650 Chipset (mainstream AM5, supports CPU overclocking) ──

MSI PRO B650-P WiFi ⭐ — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 (both PCIe 4.0) / 4x SATA / Gigabit LAN / WiFi 6 + BT 5.2
- No-frills but capable; reasonable VRM for Ryzen 5/7 including 7800X3D; WiFi 6 included at a budget price; one of the top AM5 budget board recommendations
- Best for: budget-to-mid AM5 builds, particularly with the Ryzen 7 7800X3D

ASUS TUF Gaming B650-Plus WiFi ⭐⭐ — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 (both PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6 + BT 5.2 / TUF-grade durability
- 2.5GbE + WiFi 6 at a budget price; TUF military-grade component selection; BIOS FlashBack; excellent community reputation
- Best for: budget-to-mid AM5 builds wanting durability-focused components and 2.5GbE; the default B650 recommendation alongside the MSI PRO B650-P WiFi

Biostar B650GTA — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 / 4x SATA / Gigabit LAN / No WiFi
- Very low price for a full-size ATX AM5 board; smaller brand with less community documentation than ASUS/MSI/Gigabyte/ASRock; no WiFi
- Best for: tightest-budget full-ATX AM5 builds where brand support depth is less of a concern

Gigabyte B650 Gaming X AX — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-7200+ OC) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 (both PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6 + BT 5.2
- Enhanced VRM over entry B650 boards; higher DDR5 OC headroom; better suited to Ryzen 7/9 than the budget boards
- Best for: mid-range AM5 builds wanting headroom beyond budget B650 boards without stepping to B650E pricing

NZXT N7 B650 — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 / 2x M.2 (covered by signature metal shroud) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.3 / NZXT CAM ecosystem
- Covered PCB and rear I/O in a clean minimalist metal shroud designed to match NZXT cases; WiFi 6E; premium-priced vs pure-spec competitors; fewer BIOS tuning options
- Best for: builders prioritizing a cohesive all-white/all-black minimalist aesthetic with NZXT cases; not recommended for pure value`,
    metadata: { category: 'products', topic: 'motherboards-amd-am5-a620-b650' },
  },

  // ── Motherboards: AMD AM5 — B650E, X670, X670E ────────────────────────────
  {
    content: `Gaming Motherboards — AMD AM5 Platform, Mid-Range to Enthusiast (B650E, X670, X670E):
B650E guarantees PCIe 5.0 to the GPU slot and primary M.2. X670E adds even more PCIe 5.0 lanes and typically a stronger VRM. Both support full CPU overclocking.

── B650E Chipset (guaranteed PCIe 5.0 GPU + M.2, mid-range to enthusiast) ──

MSI MAG B650E Tomahawk WiFi ⭐⭐ — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 3.0 x16 / 2x M.2 (1x PCIe 5.0 + 1x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.3
- Continues the Tomahawk line's reputation for strong value; guaranteed PCIe 5.0 GPU slot at a mid-range price; dependable VRM for Ryzen 7/9 including 7800X3D and 7900X; WiFi 6E
- Best for: mid-range to enthusiast AM5 builds wanting PCIe 5.0 without flagship prices; the B650E default recommendation

ASUS ROG Strix B650E-F Gaming WiFi ⭐ — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 3.0 x16 / 2x M.2 (1x PCIe 5.0 + 1x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.3 / BIOS FlashBack
- Robust VRM suitable for any current Ryzen CPU including the 9950X3D; ROG ecosystem integration; premium over the Tomahawk B650E
- Best for: enthusiast AM5 builds wanting future-proofed PCIe 5.0 connectivity and a stronger VRM than budget B650 boards

── X670 Chipset (mid-range to enthusiast, more PCIe lanes, no guaranteed PCIe 5.0 GPU) ──

Gigabyte X670 Aorus Elite AX — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 4.0 x16 (chipset) / 3x M.2 (all PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6 + BT 5.2
- Three M.2 slots; enhanced VRM suitable for Ryzen 7/9 including 7950X; PCIe 5.0 not guaranteed to GPU slot
- Best for: mid-range to enthusiast AM5 builds wanting extra M.2 slots and a stronger VRM

ASRock X670 Steel Legend — ATX / DDR5 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 4.0 x16 (chipset) / 2x M.2 (both PCIe 4.0) / 6x SATA / 2.5GbE / WiFi 6 + BT 5.2
- 6 SATA ports (more than most X670 boards); solid VRM; competitive pricing vs the big three; PCIe 5.0 not guaranteed to GPU slot
- Best for: mid-range to enthusiast AM5 builds wanting strong SATA storage connectivity

── X670E Chipset (enthusiast/flagship AM5, dual PCIe 5.0 x16 capability) ──

MSI MPG X670E Carbon WiFi ⭐⭐ — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-8000+) / 2x PCIe 5.0 x16 (x16 or x8/x8) / 4x M.2 (mix PCIe 5.0 + 4.0) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.3
- Very robust VRM for any current Ryzen CPU including 9950X3D; 4 M.2 slots; one of the most community-recommended X670E boards; excellent VRM-to-price ratio in its tier
- Best for: enthusiast AM5 builds wanting flagship-adjacent capability without paying the absolute top price; the default X670E recommendation

Gigabyte X670E Aorus Master ⭐ — ATX / DDR5 / 2x PCIe 5.0 x16 / 4x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 2.5GbE (10GbE on some regional SKUs) / WiFi 6E + BT 5.3 / ESS Sabre DAC audio
- Six SATA ports; premium audio; very robust VRM; strong fan control options; 10GbE on select regional SKUs
- Best for: enthusiast AM5 builds wanting extensive storage connectivity alongside flagship-adjacent performance

ASUS ROG Crosshair X670E Hero — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-8000+) / 2x PCIe 5.0 x16 / 4–5x M.2 / 4x SATA / 5GbE / WiFi 6E + BT 5.3 / Onboard OC buttons / ESS Sabre DAC
- Extremely robust VRM (18+2 class); best-in-class BIOS overclocking options; premium price with diminishing gaming returns vs B650E/X670E boards; overkill for gaming-only builds
- Best for: extreme overclockers running flagship Ryzen 9 CPUs at maximum headroom; poor gaming-only value`,
    metadata: { category: 'products', topic: 'motherboards-amd-am5-b650e-x670-x670e' },
  },

  // ── Motherboards: AMD AM5 — X870 & X870E (2024, newest) ──────────────────
  {
    content: `Gaming Motherboards — AMD AM5 Platform, 2024 Generation (X870 and X870E):
AMD's 800-series chipsets mandate USB4 (40Gbps) and WiFi 7 as standard — a meaningful connectivity step up over 600-series boards. Same AM5 socket, compatible with all AM5 CPUs.

── X870 Chipset (mid-range 2024, USB4 + WiFi 7 standard) ──

MSI MAG X870 Tomahawk WiFi ⭐⭐ — ATX / DDR5 (4x DIMM, up to 256GB) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 4.0 x16 / 3x M.2 (1x PCIe 5.0 + 2x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 7 + BT 5.4 / USB4 (40Gbps) Type-C
- Continues the Tomahawk reputation; USB4 and WiFi 7 as standard; higher max memory capacity (256GB); dependable VRM for Ryzen 7/9 including 9800X3D; the mid-range X870 default recommendation
- Best for: mid-range to enthusiast AM5 builds wanting the latest connectivity standards (USB4, WiFi 7)

ASUS TUF Gaming X870-Plus WiFi — ATX / DDR5 (4x DIMM, up to 256GB) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 4.0 x16 / 3x M.2 (1x PCIe 5.0 + 2x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 7 + BT 5.4 / USB4 (40Gbps) Type-C
- TUF-grade durability; same USB4/WiFi 7 benefits; BIOS FlashBack; budget-tier audio codec at this price point
- Best for: mid-range to enthusiast AM5 builds wanting the newest connectivity from a durability-focused brand

── X870E Chipset (enthusiast/flagship 2024, dual PCIe 5.0 + USB4 + WiFi 7) ──

Gigabyte X870E Aorus Master ⭐ — ATX / DDR5 (4x DIMM, up to 256GB) / 2x PCIe 5.0 x16 / 4x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 5GbE / WiFi 7 + BT 5.4 / USB4 + Thunderbolt 4 / ESS Sabre DAC audio
- Six SATA ports; premium audio; very robust VRM; USB4 and WiFi 7; extensive fan control
- Best for: enthusiast AM5 builds wanting extensive storage connectivity and the newest I/O standards

ASUS ROG Crosshair X870E Hero — ATX / DDR5 (4x DIMM, up to 256GB) / 2x PCIe 5.0 x16 / 4–5x M.2 / 4x SATA / 5GbE / WiFi 7 + BT 5.4 / USB4 (front + rear) / Onboard OC buttons / ESS Sabre DAC
- Extremely robust VRM; best-in-class BIOS overclocking options for the current AM5 generation; USB4 front and rear; premium price with diminishing gaming returns vs X870 boards; overkill for gaming-only builds
- Best for: extreme overclockers running flagship Ryzen 9 9950X/9950X3D at maximum headroom; poor gaming-only value

AM5 Chipset Summary:
Budget/Non-OC: A620 → B650 → B650E (adds PCIe 5.0 GPU) → X870/X870E (adds USB4, WiFi 7)
Recommendation by use case:
- Budget gaming (7800X3D) → ASUS TUF B650-Plus WiFi or MSI PRO B650-P WiFi
- PCIe 5.0 + value → MSI MAG B650E Tomahawk WiFi
- Enthusiast/flagship Ryzen → MSI MPG X670E Carbon WiFi or X870 Tomahawk WiFi`,
    metadata: { category: 'products', topic: 'motherboards-amd-am5-x870-x870e' },
  },

  // ── Motherboards: Intel LGA1700 — Budget (H610, B660, B760) ──────────────
  {
    content: `Gaming Motherboards — Intel LGA1700 Platform, Budget & Non-Overclocking (H610, B660, B760):
LGA1700 supports Intel 12th (Alder Lake), 13th (Raptor Lake), and 14th gen CPUs. Some boards support both DDR4 and DDR5 — always verify the specific board's memory type. B-series and H-series boards cannot overclock the CPU multiplier.

── H610 Chipset (entry LGA1700, no OC, minimal features) ──

ASRock H610M-HDV — Micro-ATX / DDR4 (2x DIMM, up to 64GB) / 1x PCIe 4.0 x16 / 1x M.2 (PCIe 3.0) / 4x SATA / Gigabit LAN / No WiFi / No RGB
- Cheapest LGA1700 entry; only 2 DIMM slots; single M.2; adequate for non-K Core i3/i5 at stock; DDR4 keeps platform cost low
- Best for: ultra-budget LGA1700 builds with non-K Core i3/i5 CPUs (i3-12100F, i5-12400F)

MSI PRO H610M-E — Micro-ATX / DDR4 (2x DIMM, up to 64GB) / 1x PCIe 4.0 x16 / 1x M.2 / 4x SATA / Gigabit LAN / No WiFi
- MSI's equivalent H610 entry; familiar Click BIOS 5; same core limitations as the ASRock H610M-HDV
- Best for: same niche; choose by local pricing

── B660 Chipset (mainstream LGA1700, no CPU OC, better than H610) ──

MSI PRO B660M-A WiFi ⭐ — Micro-ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 (x1 elec) / 2x M.2 / 4x SATA / Gigabit LAN / WiFi 6 + BT 5.2
- Popular budget mATX B660; WiFi 6 included; 4 DIMM slots; solid for non-K Core i5/i7; secondary PCIe slot is x1 electrical only
- Best for: budget-to-mid LGA1700 builds using non-K CPUs like i5-12400F / i5-13400F

ASUS TUF Gaming B660-Plus WiFi D4 ⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 (x4 elec) / 2x M.2 / 6x SATA / Gigabit LAN / WiFi 6 + BT 5.2 / TUF durability / BIOS FlashBack
- Full ATX with 6 SATA ports at a budget price; TUF-grade components; WiFi 6; excellent value for non-K ATX builds
- Best for: budget-to-mid LGA1700 builds wanting full ATX size and strong storage connectivity

── B760 Chipset (mainstream LGA1700 for 13th/14th gen, no CPU OC, improved over B660) ──

MSI PRO B760-P WiFi DDR4 ⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 / 4x SATA / Gigabit LAN / WiFi 6 + BT 5.2
- Budget-friendly DDR4 B760; WiFi 6; solid for non-K 13th/14th gen builds; top budget recommendation for current-gen Intel gaming PCs
- Best for: budget-to-mid LGA1700 builds using non-K CPUs like i5-13400F; DDR4 keeps total cost down

ASUS TUF Gaming B760-Plus WiFi — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-7000+) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 / 4x SATA / 2.5GbE / WiFi 6 + BT 5.2 / TUF durability
- DDR5 + 2.5GbE step up from the DDR4 B760 budget boards; TUF durability; no CPU OC on B760
- Best for: mid-range LGA1700 builds wanting DDR5 support without paying for Z-series overclocking

Gigabyte B760 Gaming X AX — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-7200+) / 1x PCIe 4.0 x16 + 1x PCIe 3.0 x16 / 2x M.2 / 4x SATA / 2.5GbE / WiFi 6 + BT 5.2 / Realtek ALC1200 audio
- Good DDR5 OC headroom; 2.5GbE; solid mid-range connectivity; budget-tier SATA count (4 ports)
- Best for: mid-range LGA1700 builds wanting DDR5 and good connectivity without Z-series pricing`,
    metadata: { category: 'products', topic: 'motherboards-intel-lga1700-budget' },
  },

  // ── Motherboards: Intel LGA1700 — Z690 & Z790 (Overclocking) ─────────────
  {
    content: `Gaming Motherboards — Intel LGA1700 Platform, Z-Series Overclocking (Z690 and Z790):
Z-series boards unlock full CPU multiplier overclocking for K-series CPUs. LGA1700 is at end-of-life for new CPU releases (14th gen = final generation) but remains a strong current platform.
Important: Z690/Z790 boards exist in both DDR4 and DDR5 variants — always verify the exact board's memory type.

── Z690 Chipset (12th–14th gen, overclocking, available in DDR4 and DDR5) ──

Gigabyte Z690 Aorus Elite AX DDR4 ⭐ — ATX / DDR4 (4x DIMM, up to 128GB) / 1x PCIe 5.0 x16 / 2x M.2 (1x PCIe 4.0 + 1x PCIe 3.0) / 6x SATA / Gigabit LAN / WiFi 6 + BT 5.2
- Cost-effective Z690 overclocking entry with DDR4 (saves on platform cost); WiFi 6; adequate VRM for i5/i7 K-series with mild OC; good value gateway into Z-series
- Best for: budget-to-mid enthusiast LGA1700 builds wanting overclocking without a premium price; DDR4 platform keeps costs down

ASUS ROG Strix Z690-A Gaming WiFi D4 ⭐ — ATX / DDR4 (4x DIMM, up to 128GB, DDR4-5333+ OC) / 1x PCIe 5.0 x16 / 3x M.2 (1x PCIe 4.0 via CPU + 2x via chipset) / 6x SATA / 2.5GbE / WiFi 6 + BT 5.2 / BIOS FlashBack
- Three M.2 slots; 2.5GbE; strong ROG VRM for 13700K/14700K with light-to-moderate OC; DDR4 + Z-series sweet spot
- Best for: enthusiast LGA1700 builds wanting to overclock while keeping DDR4 platform costs down

MSI MPG Z690 Carbon WiFi — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-6600+ OC) / 1x PCIe 5.0 x16 / 4x M.2 / 6x SATA / 2.5GbE / WiFi 6E + BT 5.2
- Four M.2 slots; WiFi 6E; strong VRM for K-series; DDR5 support for forward memory compatibility
- Best for: enthusiast LGA1700 builds wanting DDR5 support and strong overclocking headroom

── Z790 Chipset (13th–14th gen, overclocking, improved over Z690) ──

Gigabyte Z790 Aorus Elite AX ⭐ — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-7600+ OC) / 1x PCIe 5.0 x16 / 3x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 2.5GbE / WiFi 6E + BT 5.3
- Cost-effective Z790 entry; WiFi 6E; solid VRM for i5/i7 K-series moderate OC; good value gateway into Z790 overclocking
- Best for: budget-to-mid enthusiast LGA1700 builds wanting Z790 overclocking without a premium price

MSI MPG Z790 Carbon WiFi ⭐⭐ — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-7600+ OC) / 1x PCIe 5.0 x16 / 5x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 2.5GbE / WiFi 6E + BT 5.3
- Five M.2 slots; very robust VRM for 14700K/14900K with strong OC headroom; excellent VRM-to-price ratio in Z790; one of the most recommended Z790 boards
- Best for: enthusiast LGA1700 builds wanting flagship-adjacent capability without paying the absolute top price; the default Z790 recommendation

NZXT N7 Z790 — ATX / DDR5 (4x DIMM) / 1x PCIe 5.0 x16 / 2x M.2 (covered by signature metal shroud) / 4x SATA / 2.5GbE / WiFi 6E / Clean minimalist metal cover design
- NZXT's distinctive metal-shroud aesthetic for NZXT case builds; Z790 with full OC support; premium-priced vs pure-spec competitors; fewer BIOS tuning options; only 4 SATA ports
- Best for: builders prioritizing cohesive all-white/all-black minimalist aesthetic alongside Z790 overclocking; not for pure value

ASUS ROG Maximus Z790 Hero — ATX / DDR5 (4x DIMM, up to 128GB, DDR5-8000+ OC) / 1x PCIe 5.0 x16 / 4–5x M.2 / 6x SATA / 2.5GbE / WiFi 6E + Thunderbolt 4 / Onboard OC buttons / ESS Sabre DAC
- Extremely robust VRM; best-in-class BIOS overclocking for LGA1700; Thunderbolt 4; premium price with diminishing gaming returns vs Z790 mid-range boards; overkill for gaming-only builds
- Best for: extreme overclockers pushing 14900K/14900KS to their limits; poor gaming-only value`,
    metadata: { category: 'products', topic: 'motherboards-intel-lga1700-z-series' },
  },

  // ── Motherboards: Intel LGA1851 (Core Ultra 200 / Arrow Lake) ─────────────
  {
    content: `Gaming Motherboards — Intel LGA1851 Platform (Core Ultra 200 / Arrow Lake, 2024):
Intel's newest desktop platform. DDR5-only. PCIe 5.0 standard on Z890; B860 also offers PCIe 5.0 to the primary GPU slot. New platform — BIOS maturity still developing compared to LGA1700.

── B860 Chipset (mainstream LGA1851, no CPU OC) ──

MSI PRO B860-P WiFi — ATX / DDR5 (4x DIMM, up to 192GB) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 4.0 x16 (chipset) / 2x M.2 (1x PCIe 5.0 + 1x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.4
- Cost-effective entry to LGA1851; WiFi 6E and 2.5GbE included; no CPU OC; adequate VRM for Core Ultra 5/7 at stock
- Best for: budget-to-mid LGA1851 builds using Core Ultra 5/7 CPUs at stock settings

ASUS TUF Gaming B860-Plus WiFi — ATX / DDR5 (4x DIMM, up to 192GB, DDR5-7200+) / 1x PCIe 5.0 x16 (GPU) + 1x PCIe 4.0 x16 / 3x M.2 (1x PCIe 5.0 + 2x PCIe 4.0) / 4x SATA / 2.5GbE / WiFi 6E + BT 5.4 / TUF durability / BIOS FlashBack
- Three M.2 slots at mid-range price; TUF-grade durability; 2.5GbE + WiFi 6E; no CPU OC on B860
- Best for: mid-range LGA1851 builds wanting extra M.2 connectivity without paying for Z890 overclocking

── Z890 Chipset (enthusiast LGA1851, full CPU OC) ──

ASUS ROG Strix Z890-E Gaming WiFi ⭐ — ATX / DDR5 (4x DIMM, up to 192GB, DDR5-8000+) / 1x PCIe 5.0 x16 (GPU) / 4x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 2.5GbE / WiFi 7 + BT 5.4 / Thunderbolt 4 / BIOS FlashBack
- Robust VRM for Core Ultra 9 285K with overclocking; Thunderbolt 4 and WiFi 7; four M.2 slots; strong enthusiast option on the new platform
- Best for: enthusiast LGA1851 builds wanting strong overclocking headroom and premium connectivity on the newest Intel platform

MSI MPG Z890 Carbon WiFi ⭐ — ATX / DDR5 (4x DIMM, up to 192GB, DDR5-8200+) / 1x PCIe 5.0 x16 (GPU) / 5x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 2.5GbE / WiFi 7 + BT 5.4
- Five M.2 slots; very robust VRM for Core Ultra 9 285K; continues Carbon line's reputation for excellent VRM-to-price ratio; WiFi 7 included
- Best for: enthusiast LGA1851 builds wanting flagship-adjacent capability without paying the absolute top price; the default Z890 recommendation

Gigabyte Z890 Aorus Master ⭐ — ATX / DDR5 (4x DIMM, up to 192GB) / 1x PCIe 5.0 x16 (GPU) / 4x M.2 (mix PCIe 5.0 + 4.0) / 6x SATA / 5GbE / WiFi 7 + BT 5.4 / Thunderbolt 4 / ESS Sabre DAC audio
- Six SATA ports; Thunderbolt 4; 5GbE networking; premium audio; very robust VRM
- Best for: enthusiast LGA1851 builds wanting extensive storage connectivity and best-in-class I/O alongside flagship-adjacent performance

LGA1851 Platform Note: Platform is newer (2024) — BIOS maturity and community documentation are still developing relative to the well-established LGA1700 ecosystem. Both B860 and Z890 boards support the same Core Ultra 200 CPUs; Z890 adds overclocking and more PCIe lanes.`,
    metadata: { category: 'products', topic: 'motherboards-intel-lga1851' },
  },

  // ── Monitors: Buying Guide ────────────────────────────────────────────────
  {
    content: `Gaming Monitor Buying Guide:

Resolution vs refresh rate — the core tradeoff:
- 1080p at 144–240Hz: go-to for competitive esports where frame rate matters most; lower GPU demand
- 1440p at 144–165Hz: current sweet spot for most gamers — noticeably sharper than 1080p, still achievable at high refresh rates with a mid-range GPU
- 4K at 144Hz+: requires a flagship-tier GPU (RTX 4080/5080 class or higher) to actually use at high frame rates in demanding titles; wasted if the GPU can't reach those rates

Panel types — what each delivers:
- TN: fastest response, lowest input lag, lowest price — but worst color accuracy and viewing angles; mostly found in esports-focused monitors now
- IPS: best color accuracy and viewing angles with good response times; most popular for general gaming; some ghosting in dark scenes
- VA: higher contrast and deeper blacks than IPS; often lower-priced for curved displays; can show "black smearing" in fast dark scenes (motion artifacts)
- OLED (WOLED, QD-OLED): near-instant response times, perfect per-pixel blacks, exceptional contrast — current visual quality ceiling; price premium; burn-in considerations (see below)
- Mini-LED IPS: IPS panel with Mini-LED backlighting for improved local dimming and HDR performance; no burn-in risk; doesn't match OLED per-pixel contrast

Adaptive sync — G-Sync vs FreeSync vs G-Sync Compatible:
- All three eliminate screen tearing by matching monitor refresh rate to GPU frame rate output
- NVIDIA G-Sync (hardware module): most rigorously validated, primarily for NVIDIA GPUs, carries a price premium
- AMD FreeSync (royalty-free): works with AMD and NVIDIA GPUs; now standard even on budget monitors
- G-Sync Compatible: FreeSync monitor NVIDIA has validated to work well with NVIDIA GPUs — effectively the same practical benefit for most users at no G-Sync module premium

OLED burn-in — reality for gaming use:
- Burn-in risk comes from extended static on-screen elements (HUDs, taskbars) displayed without variation for many hours daily
- Modern gaming OLEDs include burn-in mitigation: pixel shifting, logo dimming, periodic compensation cycles
- For typical mixed gaming usage, real-world risk is low — but users who leave a static desktop or overlay on screen many hours per day face higher risk
- If zero burn-in risk is required, a high-quality IPS or Mini-LED IPS monitor is the safer choice

Response time and input lag — what the box doesn't tell you:
- GtG (gray-to-gray) response specs are frequently optimistic marketing figures; real-world motion clarity can differ
- Total system input lag (monitor processing delay + panel response time) matters more for competitive play than advertised GtG alone
- Independent reviewers' combined input lag measurements are more reliable than box specs for competitive comparisons

Curved vs flat:
- Standard 16:9: flat is the default and more versatile for competitive gaming
- Ultrawide (21:9) and super-ultrawide (32:9): curved designs are common and often preferred to maintain consistent viewing distance across the wider screen
- Curved doesn't benefit from ultrawide advantages on standard aspect ratios and slightly distorts straight lines`,
    metadata: { category: 'products', topic: 'monitors-buying-guide' },
  },

  // ── Monitors: Entry 1080p ─────────────────────────────────────────────────
  {
    content: `Gaming Monitors — Entry Tier (1080p, 144–165Hz):
Budget 1080p displays — the default starting point for gaming monitor recommendations.

AOC 24G2 ⭐⭐ The Default Recommendation — 23.8" / 1080p / IPS / 144Hz / 1ms MPRT / FreeSync Premium + G-Sync Compatible / No HDR / Fully adjustable stand (height, tilt, swivel, pivot)
- Legendary budget gaming monitor; exceptional price-to-performance; solid color accuracy for an IPS panel at this price; full stand adjustability rare at entry pricing
- Best for: the default entry-tier 1080p gaming monitor recommendation; hard to beat as a first gaming display

Acer Nitro VG240Y — 23.8" / 1080p / IPS / 144Hz / 1ms VRB / FreeSync / No HDR / Tilt-only stand (VESA mountable)
- Competitive budget pricing; solid IPS color; widely available; more basic stand than the AOC 24G2
- Best for: budget 1080p gaming builds where the AOC 24G2 is unavailable or priced higher in a given market

ViewSonic VX2418-P-mhd — 23.8" / 1080p / IPS / 165Hz / 1ms MPRT / FreeSync Premium / No HDR / Tilt-only stand (VESA mountable)
- Higher 165Hz vs the 144Hz competitors at a similar entry price; no full stand adjustability
- Best for: budget buyers wanting a slightly higher refresh rate ceiling at entry pricing

MSI Optix G241 — 23.8" / 1080p / IPS / 144Hz / 1ms MPRT / FreeSync Premium / No HDR / Tilt-only stand
- Solid IPS color; competitive budget pricing; backed by MSI ecosystem; basic stand
- Best for: budget 1080p builds in an MSI ecosystem

BenQ Zowie XL2411K ⭐ — 24" / 1080p / TN / 144Hz / 1ms GtG / No adaptive sync / No HDR / Fully adjustable stand + S-Switch external controller
- BenQ's competitive esports lineage; TN panel = fastest response/lowest lag but weakest color and viewing angles; no adaptive sync (prioritizes minimal latency); S-Switch external controller for quick setting changes; right choice only if minimal latency is the absolute priority over color quality
- Best for: budget-conscious competitive esports players where minimal input lag takes priority over color accuracy or adaptive sync

Entry summary:
- Default pick → AOC 24G2
- Higher refresh entry → ViewSonic VX2418-P-mhd (165Hz)
- Competitive esports entry → BenQ Zowie XL2411K (TN, lowest lag)`,
    metadata: { category: 'products', topic: 'monitors-entry-1080p' },
  },

  // ── Monitors: Budget 1080p / 240Hz ────────────────────────────────────────
  {
    content: `Gaming Monitors — Budget Tier (1080p 144–165Hz sweet spot + budget 240Hz options):

ASUS TUF Gaming VG249Q ⭐ — 23.8" / 1080p / IPS / 144Hz / 1ms MPRT / FreeSync Premium + G-Sync Compatible / No HDR / Tilt-only stand (VESA mountable)
- One of the most popular value 1080p gaming monitors; ASUS ELMB motion blur reduction; wide adaptive sync compatibility; basic stand
- Best for: budget-to-mid 1080p gaming builds

Gigabyte G24F ⭐⭐ — 23.8" / 1080p / IPS / 165Hz / 1ms MPRT / FreeSync Premium + G-Sync Compatible / HDR Ready (basic) / Fully adjustable stand (height, tilt, swivel, pivot)
- Outstanding price-to-performance; 165Hz over 144Hz competitors; fully adjustable stand at a budget price; strong color accuracy for its tier; HDR Ready label is marketing — not a true HDR experience
- Best for: best overall value 1080p gaming monitor at this price tier; one of the strongest budget monitor recommendations available

Acer Predator XB253Q — 24.5" / 1080p / IPS / 240Hz / 1ms MPRT / G-Sync Compatible + FreeSync Premium / No HDR / Fully adjustable stand
- Accessible 240Hz entry point from Acer's Predator line; good IPS color for a high-refresh panel; requires a capable GPU to approach 240 FPS in demanding titles
- Best for: budget-to-mid competitive esports builds wanting 240Hz at an accessible price

Dell S2522HG — 24.5" / 1080p / Fast IPS / 240Hz / 1ms GtG / G-Sync Compatible + FreeSync Premium / No HDR / Fully adjustable stand
- Fast IPS panel delivers better color accuracy than typical 240Hz TN alternatives; strong value for IPS quality at 240Hz
- Best for: budget-to-mid competitive esports builds wanting IPS color quality at 240Hz

AOC 25G3ZM — 24.5" / 1080p / VA / 240Hz / 1ms MPRT / FreeSync Premium + G-Sync Compatible / No HDR / Height/tilt/swivel adjustable stand
- Among the most affordable 240Hz monitors available; VA panel gives higher contrast than IPS alternatives; VA panels can show more motion blur in dark scenes than IPS at high refresh rates
- Best for: budget-conscious competitive builds wanting the cheapest possible path to 240Hz

Budget tier summary:
- Best overall value (1080p) → Gigabyte G24F
- Best 240Hz value (IPS) → Dell S2522HG
- Cheapest 240Hz → AOC 25G3ZM (VA panel trade-off)`,
    metadata: { category: 'products', topic: 'monitors-budget-1080p-240hz' },
  },

  // ── Monitors: Mid-Range 1440p ──────────────────────────────────────────────
  {
    content: `Gaming Monitors — Mid-Range (1440p, 144–180Hz):
The current sweet spot for most serious gamers — noticeably sharper than 1080p, attainable at high refresh rates with a mid-range GPU.

ASUS TUF Gaming VG27AQ ⭐ — 27" / 1440p / IPS / 165Hz / 1ms MPRT / G-Sync Compatible + FreeSync Premium / HDR10 / Fully adjustable stand
- One of the most recommended well-rounded 1440p monitors; excellent price-to-performance; HDR10 support; solid color accuracy; HDR10 is basic versus true high-brightness displays
- Best for: mid-range to high-end 1440p builds wanting a well-rounded all-around monitor

LG 27GP850-B ⭐ — 27" / 1440p / Nano IPS / 165Hz (OC to 180Hz) / 1ms GtG / G-Sync Compatible + FreeSync Premium / HDR10 / Fully adjustable stand
- Nano IPS panel delivers excellent motion clarity and color accuracy; overclockable to 180Hz; one of the most well-reviewed 1440p monitors of its generation; slightly pricier than the VG27AQ for similar practical performance
- Best for: mid-range to high-end 1440p builds wanting excellent motion clarity and color accuracy

Gigabyte M27Q ⭐⭐ Best Value — 27" / 1440p / IPS / 170Hz / 0.5ms MPRT / FreeSync Premium + G-Sync Compatible / HDR400 / Fully adjustable stand / Built-in KVM switch / USB-C (18W PD)
- Outstanding price-to-performance; built-in KVM switch and USB-C connectivity are unusual at this price; strong color accuracy; USB-C PD (18W) modest for large laptop charging
- Best for: the best overall value 1440p monitor; especially useful for multi-device desk setups wanting a KVM switch

Samsung Odyssey G5 — 27" or 32" / 1440p / VA (1000R curve) / 165Hz / 1ms MPRT / FreeSync Premium / HDR10 / Height + tilt adjustable stand
- High contrast from the VA panel; immersive 1000R curve; competitive pricing for a curved 1440p display; VA panels can show more motion blur in dark scenes than IPS
- Best for: mid-range 1440p builds wanting an immersive curved display with strong contrast

Acer Predator XB273U — 27" / 1440p / IPS / 170Hz / 1ms MPRT / G-Sync Compatible + FreeSync Premium / HDR10 / Fully adjustable stand
- Good color accuracy and motion clarity; solid Predator brand; priced similarly to competitors with comparable or better value (Gigabyte M27Q, LG 27GP850-B)
- Best for: mid-range 1440p gaming builds committed to the Acer Predator line

MSI Optix MAG274QRF — 27" / 1440p / Rapid IPS / 165Hz / 1ms GtG / FreeSync Premium + G-Sync Compatible / HDR Ready / Height + tilt adjustable stand
- Good color accuracy and low input lag; backed by MSI ecosystem; HDR Ready label is marketing; fewer features than the Gigabyte M27Q at a similar price
- Best for: mid-range 1440p gaming builds in an MSI ecosystem

AOC Q27G3XMN — 27" / 1440p / Fast VA / 180Hz / 1ms MPRT / FreeSync Premium + G-Sync Compatible / HDR10 / Height/tilt/swivel adjustable stand
- High 180Hz refresh rate at a competitive price; strong contrast from the fast VA panel; VA panels can show more motion blur in dark scenes than IPS
- Best for: mid-range 1440p builds wanting high refresh rate value at a lower price than IPS competitors

Mid-range summary:
- Best overall value → Gigabyte M27Q
- Best motion clarity → LG 27GP850-B (Nano IPS)
- Best curved 1440p → Samsung Odyssey G5 (VA, high contrast)
- Best high-refresh value → AOC Q27G3XMN (180Hz VA)`,
    metadata: { category: 'products', topic: 'monitors-midrange-1440p' },
  },

  // ── Monitors: Enthusiast OLED ─────────────────────────────────────────────
  {
    content: `Gaming Monitors — Enthusiast Tier (1440p OLED, high-refresh 1080p esports, ultrawide OLED):

LG 27GR95QE-B ⭐⭐ The Benchmark — 26.5" / 1440p / WOLED / 240Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium / DisplayHDR True Black 400 / Fully adjustable stand
- Near-instant response time and exceptional contrast from WOLED; 240Hz for smooth high-performance gaming; widely praised in independent reviews as a benchmark gaming display; OLED burn-in risk mitigation built in
- Best for: enthusiasts wanting the best available 1440p gaming visual quality; widely considered the default enthusiast 1440p monitor recommendation

ASUS ROG Swift PG27AQDM ⭐ — 26.5" / 1440p / QD-OLED / 240Hz / 0.03ms GtG / G-Sync + FreeSync Premium Pro / DisplayHDR True Black 400 / Fully adjustable stand
- Samsung QD-OLED panel delivers vivid, wide color gamut on top of OLED's contrast and response time advantages; premium ASUS ROG build and features; slightly pricier than the LG 27GR95QE-B
- Best for: enthusiasts wanting ASUS's premium take on 1440p QD-OLED gaming with the widest color gamut

Samsung Odyssey OLED G8 — 34" / UWQHD 3440×1440 (21:9) / QD-OLED / 175Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium Pro / DisplayHDR True Black 400 / Curved / Height + tilt stand
- Curved ultrawide QD-OLED for an immersive 21:9 experience; vivid color performance; ultrawide aspect ratio isn't supported by every game natively
- Best for: enthusiasts wanting an immersive curved ultrawide OLED gaming experience; verify game support for 21:9 before purchase

Alienware AW2725DF ⭐ — 27" / 1440p / QD-OLED / 280Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium Pro / DisplayHDR True Black 400 / Fully adjustable stand
- Pushes refresh rate further than earlier OLED competitors at 280Hz; vivid QD-OLED color; requires a very capable GPU to approach 280 FPS; strong Alienware build quality
- Best for: enthusiasts wanting the highest available 1440p OLED refresh rate

ViewSonic XG270QG — 27" / 1440p / Nano IPS / 240Hz / 1ms GtG / G-Sync (with module + Reflex Analyzer) / HDR400 / Fully adjustable stand
- Built-in NVIDIA Reflex Latency Analyzer for precise total system latency measurement; requires NVIDIA GPU and compatible mouse to use Reflex Analyzer; IPS (not OLED) — no burn-in risk
- Best for: serious competitive NVIDIA GPU users who specifically want Reflex Latency Analyzer hardware built into their monitor

Gigabyte AORUS FI27Q — 27" / 1440p / IPS / 165Hz / 1ms MPRT / G-Sync Compatible + FreeSync Premium / HDR400 / Fully adjustable stand / USB-C
- Factory-calibrated color accuracy out of the box; low input lag well-suited to competitive play; traditional IPS (not OLED) — no burn-in risk
- Best for: enthusiasts wanting factory-calibrated color accuracy alongside strong gaming performance without OLED considerations

BenQ Zowie XL2546K ⭐ — 24.5" / 1080p / TN / 240Hz / 1ms GtG + DyAc+ / No adaptive sync / No HDR / Fully adjustable stand + S-Switch controller
- Purpose-built for professional competitive esports; DyAc+ motion clarity technology significantly improves clarity at high refresh rates; widely used at the professional level; TN panel = weaker color/viewing angles; 1080p only; no adaptive sync
- Best for: serious and professional competitive esports players prioritizing absolute minimal latency and motion clarity over resolution or visual quality`,
    metadata: { category: 'products', topic: 'monitors-enthusiast-oled' },
  },

  // ── Monitors: Flagship 4K ─────────────────────────────────────────────────
  {
    content: `Gaming Monitors — Flagship Tier (4K and Super-Ultrawide):
Requires flagship-tier GPUs (RTX 4090/5090, RX 7900 XTX class) to drive at high frame rates in demanding titles.

LG 27GR93U ⭐ — 27" / 4K 3840×2160 / WOLED / 144Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium / DisplayHDR True Black 400 / Fully adjustable stand
- WOLED's perfect blacks and near-instant response time at 4K resolution; 144Hz for high-resolution smooth gaming; widely praised as a benchmark 4K gaming display; OLED burn-in mitigation built in
- Best for: enthusiasts with flagship GPUs wanting the best available 4K gaming visual quality

ASUS ROG Swift PG32UCDM ⭐ — 32" / 4K / QD-OLED / 240Hz / 0.03ms GtG / G-Sync + FreeSync Premium Pro / DisplayHDR True Black 400 / Fully adjustable stand
- Cutting-edge 240Hz at 4K resolution on a large 32" QD-OLED panel; vivid QD-OLED color; requires an extremely powerful GPU to approach 240 FPS at 4K in demanding games
- Best for: extreme enthusiasts with the most powerful GPUs wanting the fastest available 4K OLED gaming experience

Alienware AW3225QF ⭐ — 31.5" / 4K / QD-OLED (curved) / 240Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium Pro / DisplayHDR True Black 400 / Height/tilt/swivel stand
- Curved 4K QD-OLED for added immersion at 32" size; vivid color; 240Hz at 4K is a strong technical achievement; gentle curve adds immersion without the extreme footprint of a super-ultrawide
- Best for: extreme enthusiasts wanting an immersive curved 4K OLED experience

Gigabyte AORUS FO32U2 ⭐ — 31.5" / 4K / QD-OLED / 240Hz / 0.03ms GtG / G-Sync Compatible + FreeSync Premium Pro / DisplayHDR True Black 400 / Fully adjustable stand
- Vivid QD-OLED quality at large 32" 4K size; 240Hz; competitively priced versus ASUS/Alienware equivalents in the 4K OLED category
- Best for: extreme enthusiasts wanting flagship 4K OLED performance at the most competitive price within this category

Acer Predator X32 FP — 32" / 4K / IPS with Mini-LED backlighting / 160Hz / 1ms GtG / G-Sync Ultimate / VESA DisplayHDR 1400 / Fully adjustable stand
- Mini-LED IPS delivers flagship-tier HDR performance without OLED burn-in risk; G-Sync Ultimate certification; IPS can't match OLED's per-pixel contrast or response time; lower 160Hz refresh vs OLED competitors
- Best for: enthusiasts wanting flagship 4K visual quality and strong HDR with zero burn-in risk; the top IPS alternative to OLED flagships

Samsung Odyssey Neo G9 ⭐ — 49" / 5120×1440 Dual QHD (32:9 super ultrawide) / VA + Mini-LED / 240Hz / 1ms GtG / G-Sync Compatible + FreeSync Premium Pro / VESA DisplayHDR 2000 / Height + tilt stand
- Extreme 32:9 aspect ratio offers unmatched immersion and desktop real estate; Mini-LED backlighting delivers excellent HDR (DisplayHDR 2000); massive desk footprint; limited native super-ultrawide game support vs standard aspect ratios
- Best for: enthusiasts wanting the most immersive possible gaming and desktop experience; verify game support for 32:9 before purchase

Flagship summary:
- Best 4K OLED (27") → LG 27GR93U (WOLED, 144Hz)
- Best 4K OLED (32", fastest) → ASUS ROG Swift PG32UCDM or Gigabyte AORUS FO32U2 (QD-OLED, 240Hz)
- Best curved 4K OLED → Alienware AW3225QF
- Best 4K without burn-in risk → Acer Predator X32 FP (Mini-LED IPS)
- Best super-ultrawide → Samsung Odyssey Neo G9 (49", 32:9, Mini-LED)`,
    metadata: { category: 'products', topic: 'monitors-flagship-4k' },
  },

  // ── Microphones: Buying Guide ─────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphone Buying Guide:

USB vs. XLR — the most important decision first:
- USB microphones plug directly into a PC/Mac and work with zero additional hardware (plug-and-play). Best starting point for almost everyone.
- XLR microphones require an audio interface or mixer ($50–200+ additional purchase) to convert the analog signal for a computer. Better upgrade paths, professional broadcast compatibility, often superior capsule quality at a given price point — once interface cost is factored in.
- Recommendation: start with USB unless building a longer-term multi-input audio setup.

Polar patterns — what they are and why they matter:
- Cardioid: picks up sound primarily from the front, rejects from the rear. Standard choice for solo gaming/streaming — minimizes background noise, PC fans, and keyboard sounds.
- Supercardioid: even tighter/more directional than cardioid. More background rejection in noisy rooms; requires more precise mic positioning.
- Omnidirectional: picks up equally from all directions. Useful for group recordings or podcast setups with multiple people around one mic.
- Bidirectional (figure-8): picks up front and back, rejects the sides. Useful for face-to-face interviews.
- Multi-pattern mics let users switch between these patterns depending on the recording scenario.

Condenser vs. dynamic capsules:
- Condenser: more sensitive, captures more detail and high frequencies. Great for quiet/treated rooms and content creation. Picks up more room noise, echo, and background sound — problematic in untreated streaming rooms.
- Dynamic: less sensitive, naturally rejects more ambient noise and room echo. Popular for untreated home streaming setups and gaming rooms with PC fan noise. Needs more amplification (gain), especially XLR dynamic mics which often require a high-gain interface or inline gain booster (Cloudlifter, FetHead).

Sample rate and bit depth — less important than marketed:
- USB mic marketing highlights sample rate (44.1kHz–192kHz) and bit depth (16–24-bit), but for voice recording/streaming, capsule quality, polar pattern accuracy, and preamp/ADC quality make a far larger perceptible difference than sample rates beyond standard 48kHz/16-bit.
- Prioritize real-world review impressions, capsule quality, and included software features over headline sample rate numbers.

Physical features worth having:
- Mute button (tap-to-mute): highly practical for live streaming — avoids hunting through software during a stream
- Gain/volume knob: adjust input sensitivity without opening software
- Zero-latency headphone monitoring (3.5mm jack on the mic): hear your own voice in real time without PC routing delay — valuable for checking levels live
- Built-in shock mount: isolates the capsule from desk vibrations (typing, desk bumps) transmitted through the stand. Many mid-range+ mics include one; aftermarket shock mounts are inexpensive for those that don't
- Pop filter/windscreen: reduces plosive sounds ('p' and 'b' air puffs) hitting the capsule
- RGB: purely cosmetic, no effect on audio quality`,
    metadata: { category: 'products', topic: 'microphones-buying-guide' },
  },

  // ── Microphones: Entry ────────────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphones — Entry Tier (USB, Plug-and-Play):
Step up from a headset or webcam mic without a significant investment. All plug-and-play, no drivers required.

FIFINE K669B — USB / Condenser / Cardioid / Metal body / Physical gain knob / No mute, no monitoring / Desk tripod stand included
- Very low cost entry; metal body feels sturdier than the price suggests; basic capsule quality
- Best for: first-time buyers on the absolute tightest budget

Blue Snowball iCE ⭐ Community Staple — USB / Condenser / Cardioid / Iconic round design / Fixed gain / No mute, no monitoring / Adjustable desk stand
- One of the most recognizable entry mics; extremely simple plug-and-play; long track record and broad compatibility; no adjustable gain or multiple patterns
- Best for: absolute beginners wanting the simplest possible USB setup; the default long-standing entry recommendation

Razer Seiren Mini — USB-C / Condenser / Supercardioid / All-metal compact body / Fixed gain / No mute, no monitoring / Internal shock mount / Compact tripod
- Lightweight and compact; supercardioid pattern helps reject background/fan noise; internal shock-resistant mounting reduces desk vibration; small capsule limits low-end warmth
- Best for: buyers with limited desk space wanting a compact, durable entry mic with better background rejection

Samson Go Mic — USB / Condenser / Switchable cardioid/omnidirectional / Clip-style portable body (folds flat) / No mute, no monitoring
- Most portable entry mic — clips onto a laptop screen or stands on a desk; folds flat for travel; switchable patterns unusual at this size and price; small capsule limits quality vs desk-mounted competitors
- Best for: buyers wanting a portable, travel-friendly mic for laptops

Tonor TC30 — USB / Condenser / Cardioid / Physical gain knob / Mute button ✓ / No monitoring / Boom arm + shock mount + pop filter included in box
- Rare bundle including boom arm, shock mount, and pop filter at a very low combined price; mute button is uncommon at entry tier; accessory build quality reflects the price
- Best for: buyers wanting a complete out-of-box recording setup without assembling separate accessories

Entry tier summary:
- Default recommendation → Blue Snowball iCE
- Most compact → Razer Seiren Mini
- Most portable → Samson Go Mic
- Best accessory bundle → Tonor TC30
- Mute button at entry → Tonor TC30`,
    metadata: { category: 'products', topic: 'microphones-entry' },
  },

  // ── Microphones: Budget ───────────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphones — Budget Tier:
Meaningful step up in features and capsule quality; first appearance of hybrid USB/XLR dynamic mics.

HyperX SoloCast ⭐ — USB / Condenser / Cardioid / Tap-to-mute sensor / Physical gain dial / No monitoring / Detachable stand (standard boom arm thread) / PlayStation compatible
- Tap-to-mute sensor is genuinely convenient for streaming; detachable stand works with standard boom arm threads; no headphone monitoring jack
- Best for: budget buyers wanting simple, convenient tap-to-mute for gaming and casual streaming

Blue Snowball (original) ⭐ — USB / Condenser / Switchable cardioid + omnidirectional / Dual capsule design / No mute, no monitoring / Adjustable desk stand
- Dual capsules add a genuinely useful omnidirectional mode over the single-pattern Snowball iCE; no gain control or mute button; aging capsule tech vs newer competitors
- Best for: budget buyers wanting polar pattern flexibility for solo or small-group recording

Razer Seiren X — USB-C / Condenser / Supercardioid / Built-in internal shock mount / Fixed gain / No mute / Zero-latency headphone monitoring ✓ / Compact stand
- Built-in shock mount reduces desk vibration without a separate purchase; headphone monitoring at a budget price is notable; no physical gain control or mute button
- Best for: budget streamers wanting headphone monitoring without stepping to mid-range

FIFINE K678 — USB-C + XLR / Dynamic / Cardioid / Physical gain knob / Mute button ✓ / Headphone monitoring ✓ / Desk stand + mic clip included
- Dual USB/XLR output offers a genuine upgrade path to a full XLR setup later; dynamic capsule naturally rejects more room/fan noise; mute + monitoring at a budget hybrid price
- Best for: budget buyers wanting broadcast-style dynamic mic form factor with future XLR upgrade flexibility

Samson Q2U ⭐ — USB + XLR / Dynamic / Cardioid / Handheld form factor / Physical gain knob / No mute / Headphone monitoring ✓ / Stand, cable, windscreen included
- Long-running trusted budget hybrid dynamic; handheld-style body versatile for desk or handheld use; genuine XLR upgrade path; no mute button; handheld shape less common on modern desk setups
- Best for: budget podcasters and streamers wanting a proven hybrid USB/XLR dynamic mic

Audio-Technica ATR2100x-USB ⭐⭐ — USB-C + XLR / Dynamic / Cardioid / Physical gain knob / No mute / Headphone monitoring ✓
- One of the most consistently recommended budget hybrid dynamic mics; AT's reliable dynamic capsule tuning; genuine XLR upgrade path; no mute button
- Best for: budget podcasters wanting the most widely recommended hybrid dynamic mic; a go-to recommendation for new podcasters

Budget tier summary:
- Best convenience (mute) → HyperX SoloCast
- Best pattern flexibility → Blue Snowball
- Best for noisy rooms (USB-only) → Razer Seiren X
- Best hybrid dynamic (budget) → FIFINE K678
- Most recommended hybrid → Audio-Technica ATR2100x-USB`,
    metadata: { category: 'products', topic: 'microphones-budget' },
  },

  // ── Microphones: Mid-Range ────────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphones — Mid-Range:

Elgato Wave:1 ⭐ — USB-C / Condenser / Cardioid / Clipless Gain Technology (auto-limits distortion) / Capacitive touch-mute / Headphone monitoring ✓ / Wave Link mixing software / 48kHz/24-bit
- Clipless Gain Technology meaningfully reduces distorted audio risk for beginners; Wave Link enables sophisticated per-app audio mixing; elegant touch-mute; single pattern only
- Best for: mid-range streamers wanting beginner-friendly premium mic with strong software mixing

HyperX QuadCast S ⭐ — USB-C / Condenser / 4 selectable patterns (cardioid, omni, bidirectional, stereo) / Built-in shock mount / Tap-to-mute / Headphone monitoring ✓ / Customizable RGB / 48kHz/16-bit
- Four polar patterns is rare flexibility at this tier; built-in shock mount included; RGB + tap-to-mute; bulkier than single-pattern competitors
- Best for: mid-range buyers wanting maximum polar pattern flexibility for varied recording scenarios

Blue Yeti ⭐⭐ Most Popular — USB / Condenser / 4 selectable patterns (tri-capsule design) / Physical gain + mute + headphone volume all on-device / 48kHz/16-bit / Heavy desk stand
- Best-selling USB mic ever made; vast community support and troubleshooting resources; all physical controls on-device; large/heavy footprint; included stand has no shock mount
- Best for: mid-range buyers wanting the most widely supported and documented USB mic

Razer Seiren V2 X — USB-C / Dynamic / Cardioid / Built-in shock mount / Physical gain dial / Mute button ✓ / Headphone monitoring ✓ / 48kHz/16-bit
- Dynamic capsule naturally rejects more room/fan noise than condenser competitors at this tier; built-in shock mount + monitoring; less sensitive than condensers
- Best for: mid-range streamers in noisy or untreated rooms wanting dynamic capsule noise rejection

RØDE NT-USB Mini ⭐ — USB-C / Condenser / Cardioid / Built-in pop filter + shock mount / Fixed gain / No mute / Headphone monitoring ✓ / 48kHz/24-bit / Compact body
- RØDE's studio audio heritage brings clean, professional capsule tuning in a compact package; built-in pop filter and shock mount; no physical gain control or mute button
- Best for: mid-range buyers wanting RØDE's studio-grade sound signature in a compact desk mic

Audio-Technica AT2020USB+ ⭐ — USB-B / Condenser / Cardioid / Analog mix-blend knob (real-time monitoring balance) / No mute / Headphone monitoring ✓ / 44.1kHz/16-bit
- Carries acclaimed AT2020 XLR studio capsule tuning into USB form; mix-blend knob for live monitoring balance without software; older USB-B connector
- Best for: mid-range buyers wanting proven studio-grade capsule tuning in USB form

Maono PD200X — USB-C + XLR / Dynamic / Cardioid / OLED display / Physical gain knob / Mute button ✓ / Headphone monitoring ✓ / 192kHz/24-bit (USB) / Broadcast-style yoke mount
- OLED display and mix-blend knob are unusual conveniences at this tier; broadcast-style yoke mount pairs naturally with a boom arm; smaller brand with less established support network
- Best for: mid-range buyers wanting a broadcast-style form factor with modern conveniences at an accessible price`,
    metadata: { category: 'products', topic: 'microphones-midrange' },
  },

  // ── Microphones: Enthusiast ───────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphones — Enthusiast Tier:

Shure MV7 ⭐⭐ — USB-C + XLR / Dynamic / Cardioid / SM7B-derived design and sound signature / Touch panel gain + ShurePlus MOTIV app auto-level / Mute ✓ / Headphone monitoring ✓ / 48kHz/24-bit
- Carries Shure's broadcast-legendary SM7B capsule tuning into a far more accessible USB-capable hybrid package; MOTIV app auto-leveling helps beginners get clean levels quickly; genuine XLR upgrade path
- Best for: enthusiast podcasters and streamers wanting broadcast-legendary Shure sound with USB convenience; the standout enthusiast hybrid dynamic

Elgato Wave:3 ⭐ — USB-C / Condenser / Cardioid / Clipless Gain Technology / Capacitive touch-mute / Headphone monitoring ✓ / Wave Link deep mixing software / 96kHz/24-bit
- Higher tier sibling to the Wave:1; higher sample rate ceiling; Wave Link enables advanced multi-source/multi-app stream audio mixing; single pattern only
- Best for: enthusiast streamers building a polished multi-source broadcast audio setup

RØDE PodMic USB ⭐ — USB-C + XLR / Dynamic / Cardioid / Onboard APHEX noise gate + compressor + limiter / Physical gain knob / No mute / Headphone monitoring ✓ / Internal pop filter / Broadcast yoke mount / 48kHz/24-bit
- Onboard APHEX processing cleans up audio before it reaches software; internal pop filter reduces plosives; broadcast-style yoke mount effectively requires a boom arm; no mute button
- Best for: enthusiast podcasters and streamers wanting broadcast-style build quality with onboard audio processing

Audio-Technica AT2035 — XLR ONLY / Condenser / Cardioid / Large-diaphragm / Onboard high-pass filter + -10dB pad / Requires interface with 48V phantom power / Includes shock mount
- Large-diaphragm capsule delivers detailed professional-grade voice capture; onboard filter and pad add real-world flexibility; requires a full XLR signal chain — not plug-and-play
- Best for: enthusiasts already invested in an XLR interface wanting a detailed professional-grade condenser capsule

HyperX Procast — XLR ONLY / Condenser / Cardioid / Large-diaphragm / Rugged all-metal body / Requires interface with 48V phantom power / Includes shock mount
- Rugged all-metal broadcast-style build; large-diaphragm capsule; newer to market with less long-term track record vs established competitors; XLR interface required
- Best for: enthusiasts with an existing XLR interface wanting HyperX's microphone lineup in professional XLR format

Razer Seiren V2 Pro — USB-C / Condenser / Cardioid / Larger 25mm capsule (vs lower Seiren tiers) / Physical gain dial + onboard high-pass filter / Mute ✓ / Dedicated headphone amp / 48kHz/24-bit
- Larger 25mm capsule improves detail and warmth over Razer's lower-tier mics; onboard high-pass filter reduces low-frequency rumble without software; single pattern
- Best for: enthusiasts wanting Razer's top-tier USB condenser offering`,
    metadata: { category: 'products', topic: 'microphones-enthusiast' },
  },

  // ── Microphones: Flagship ─────────────────────────────────────────────────
  {
    content: `Gaming & Streaming Microphones — Flagship Tier:

Shure SM7B ⭐⭐ The Benchmark — XLR ONLY / Dynamic / Cardioid / Broadcast-legendary since 1976 / Requires high-gain interface (often needs inline gain booster: Cloudlifter, FetHead) / Yoke mount / Internal shock mount + hum rejection
- Widely regarded as one of the best-sounding broadcast/podcast mics ever made; exceptional rejection of electrical hum and ambient noise; nearly 5 decades of professional broadcast use; needs substantially more clean gain than most basic interfaces provide — budget for a gain booster
- Best for: flagship buyers with a complete XLR signal chain (including adequate gain) wanting the most respected broadcast dynamic mic

Electro-Voice RE20 ⭐ — XLR ONLY / Dynamic / Cardioid / Variable-D technology (minimizes proximity effect) / Broadcast staple since 1968 / Requires adequate gain interface / Internal shock mount
- Variable-D technology maintains consistent natural sound whether a speaker is close to or slightly off the capsule — unique and practically valuable; large heavy body needs a sturdy boom arm; proven decades-long broadcast track record
- Best for: flagship buyers wanting a broadcast-proven SM7B alternative with different tonal characteristics and proximity-effect control

RØDE NT1 5th Generation ⭐ — USB-C + XLR simultaneous / Condenser / Cardioid / Large-diaphragm / 32-bit float USB recording / Up to 192kHz/24-bit / Includes shock mount
- Studio-grade NT1 capsule in a rare simultaneous USB+XLR hybrid; 32-bit float recording via USB virtually eliminates clipping risk; maximum connectivity flexibility; condenser sensitivity benefits from a treated room
- Best for: flagship buyers wanting studio-grade condenser sound with maximum connectivity and recording-format flexibility

Neumann TLM 102 — XLR ONLY / Condenser / Cardioid / Large-diaphragm / Neumann German studio engineering / Exceptionally low self-noise / Requires 48V phantom power interface / Shock mount sold separately
- The most accessible entry into Neumann's legendary studio microphone lineup; best-in-class capsule engineering by many audio professionals' standards; premium price even at Neumann's most affordable model; requires a treated room for best results
- Best for: flagship buyers with a complete studio-grade XLR signal chain seeking best-in-class capsule engineering

Shure MV7+ ⭐ — USB-C + XLR / Dynamic / Cardioid / Updated MV7 with onboard real-time denoiser + auto-level (works without a PC connected) / Capacitive touch panel / Mute ✓ / Headphone monitoring ✓ / ShurePlus MOTIV app / 48kHz/24-bit
- Carries forward MV7's SM7B-derived sound signature with refinements; onboard denoiser + auto-level works even standalone without a computer; most feature-complete version of Shure's broadcast hybrid formula; highest price in the MV7 lineup
- Best for: flagship buyers wanting the most feature-complete version of Shure's broadcast-derived hybrid mic

RØDE Procaster — XLR ONLY / Dynamic / Cardioid / Purpose-built for spoken word / Internal pop filter / Tight cardioid rejection / Requires high-gain interface (gain booster recommended) / Rugged all-metal body
- Purpose-built for spoken word with internal pop filter and tight cardioid rejection; more affordable than SM7B and RE20 while sharing a similar broadcast dynamic philosophy; needs substantial clean gain like its competitors
- Best for: flagship buyers wanting SM7B-style broadcast dynamic performance at a somewhat lower price

Flagship summary:
- The benchmark broadcast dynamic → Shure SM7B (requires gain booster)
- Proximity-effect-free alternative → Electro-Voice RE20
- Best hybrid condenser (USB + XLR) → RØDE NT1 5th Generation
- Best-in-class studio capsule → Neumann TLM 102
- Most feature-complete hybrid → Shure MV7+
- Most accessible flagship dynamic → RØDE Procaster`,
    metadata: { category: 'products', topic: 'microphones-flagship' },
  },

  // ── Full Build Guide: Example Builds (Entry & Budget) ────────────────────
  {
    content: `Berry PC Example Gaming PC Builds — Entry and Budget Tier:

These are complete, compatible example builds assembled from components sold at Berry PC. All components are cross-verified for socket, chipset, memory type, and wattage compatibility.

──────────────────────────────────────────
Entry 1080p Esports Build — ~lowest viable gaming tier
Target: 1080p esports titles (Valorant, CS2, League of Legends, Fortnite) at high frame rates

Components:
- CPU: Intel Core i3-12100F (LGA1700, quad-core, no integrated graphics, locked multiplier)
- Motherboard: ASRock H610M HDV (LGA1700, DDR4, H-chipset, no overclocking)
- RAM: Crucial DDR4 16GB 2666 CL19 (minimum recommended; upgrading to 3200MHz kit is worthwhile)
- GPU: NVIDIA RTX 3050 (1080p esports-capable, sufficient for esports frame rates)
- Storage: Kingston A400 (SATA SSD; good for OS and most games at this budget)
- PSU: Corsair CV550 (550W; comfortable headroom for this low-draw CPU/GPU combo)
- Case: Montech Air 100 (compact airflow case; fits micro-ATX)
- Cooling: Stock cooler included with CPU (i3-12100F runs cool enough at stock clocks)

Platform notes: LGA1700 + DDR4 + H610 (non-overclockable platform); i3-12100F has no integrated graphics so the GPU is required.

Strengths: very strong 1080p esports frame rates for the money; low total power draw; straightforward build.
Weaknesses: limited headroom for AAA titles at high settings; 16GB DDR4-2666 is minimum — stepping up to 3200MHz improves performance noticeably.
Best for: competitive esports players on the tightest reasonable budget.
Main upgrade path: GPU (highest single-component impact upgrade from this configuration).

──────────────────────────────────────────
Budget 1080p High-Refresh Build — best-value all-rounder at 1080p
Target: smooth 1080p at high refresh rates across most current titles at high settings

Components:
- CPU: Intel Core i5-12400F (LGA1700, 6-core, locked, excellent budget/mid gaming CPU)
- Motherboard: ASUS TUF Gaming B660-Plus WiFi D4 (LGA1700, DDR4, B660 chipset with WiFi)
- RAM: Corsair Vengeance LPX 16GB DDR4-3200 CL16 (solid 3200MHz kit, well-matched to i5-12400F)
- GPU: NVIDIA GTX 1660 Super (strong 1080p performance; no ray tracing hardware)
- Storage: Crucial P3 NVMe SSD (PCIe 3.0 NVMe; meaningfully faster than SATA SSDs)
- PSU: Cooler Master MWE Bronze V2 650W (650W; headroom for a GPU upgrade later)
- Case: Corsair 4000D Airflow (excellent mesh-front ATX airflow case)
- Cooling: Thermalright Peerless Assassin 120 SE (excellent budget-to-mid air cooler; handles i5-12400F easily)

Platform notes: LGA1700 + DDR4 via B660 D4 variant; i5-12400F is a locked CPU so the B660 chipset's lack of OC support is no loss.

Strengths: well-balanced CPU/GPU pairing; NVMe storage improves load times; good airflow case + aftermarket cooler for comfortable thermals.
Weaknesses: GTX 1660 Super lacks ray tracing hardware; 650W headroom but not for a simultaneous CPU+GPU upgrade.
Best for: buyers wanting solid all-around 1080p performance below mid-range pricing.
Main upgrade path: GPU (i5-12400F has headroom for a meaningfully stronger card before becoming the bottleneck).`,
    metadata: { category: 'products', topic: 'knowledge-example-builds-entry-budget' },
  },

  // ── Full Build Guide: Example Builds (Mid-Range, Enthusiast, Flagship) ───
  {
    content: `Berry PC Example Gaming PC Builds — Mid-Range, Enthusiast, and Flagship:

──────────────────────────────────────────
Mid-Range 1440p High-Refresh Build
Target: strong 1440p at high refresh rates across current and near-future titles; overclocking flexibility

Components:
- CPU: Intel Core i5-13600K (LGA1700, 14-core hybrid, unlocked K-series)
- Motherboard: Gigabyte Z690 Aorus Elite AX DDR4 (Z-chipset, DDR4 variant, full overclocking support, WiFi)
- RAM: Corsair Vengeance LPX 32GB DDR4-3200 CL16 (32GB provides comfortable modern gaming headroom)
- GPU: NVIDIA RTX 3060 Ti (strong 1440p; ray tracing support; excellent for the build tier)
- Storage: WD Black SN770 NVMe SSD (PCIe 4.0 NVMe; fast and reliable)
- PSU: Corsair RM750e (750W, 80+ Gold, fully modular)
- Case: Corsair 5000D Airflow (excellent large ATX airflow case)
- Cooling: Noctua NH-U12S (proven single-tower air cooler; handles i5-13600K well)

Platform notes: LGA1700 + DDR4 on Z690 (chose DDR4 variant for cost savings while keeping Z-chipset OC support); K-series CPU can be overclocked if desired.
Strengths: Z690 + K-series for overclocking flexibility; 32GB RAM; RTX 3060 Ti handles 1440p with ray tracing.
Weaknesses: DDR4 on Z690 leaves memory bandwidth vs a DDR5 config; 750W leaves less future GPU upgrade headroom than the Enthusiast build.
Best for: buyers wanting strong 1440p with overclocking option at a moderate budget.

──────────────────────────────────────────
Enthusiast 1440p/4K High-Refresh Build
Target: excellent 1440p high-refresh; capable 4K; current DDR5 platform

Components:
- CPU: Intel Core i7-13700K (LGA1700, 16-core hybrid, unlocked K-series)
- Motherboard: MSI MPG Z790 Carbon WiFi (Z790, DDR5, PCIe 5.0 M.2, WiFi 6E)
- RAM: G.Skill Trident Z5 RGB 32GB DDR5-6400 CL32 (takes full advantage of Z790 DDR5 bandwidth)
- GPU: NVIDIA RTX 4070 Ti Super (handles 1440p ultra + capable 4K with ray tracing)
- Storage: Samsung 990 Pro NVMe SSD (PCIe 4.0 flagship SSD)
- PSU: Corsair RM850x (850W, 80+ Gold, fully modular; solid headroom)
- Case: Lian Li O11 Dynamic (dual-chamber showcase case; excellent for custom cooling layouts)
- Cooling: Arctic Liquid Freezer II 360mm AIO (strong 360mm AIO for the i7-13700K's power)

Platform notes: LGA1700 + DDR5 on Z790 (current-generation standard); i7-13700K + Z790 + DDR5-6400 is a well-matched high-bandwidth config.
Strengths: DDR5-6400 at full bandwidth; RTX 4070 Ti Super excellent for 1440p/4K; 850W + 360mm AIO for comfortable headroom.
Best for: enthusiasts wanting excellent 1440p and capable 4K performance on the current DDR5 platform.
Upgrade path: GPU-only upgrade to RTX 5090 is compatible with this platform without changing motherboard, RAM, or PSU.

──────────────────────────────────────────
Flagship No-Compromise 4K Build
Target: maximum available consumer gaming performance; 4K + high-refresh 1440p

Components:
- CPU: Intel Core i9-13900KS (LGA1700, factory-binned top silicon, highest single-thread performance)
- Motherboard: ASUS ROG Maximus Z790 Hero (Z790 flagship, DDR5, PCIe 5.0, extreme VRM quality)
- RAM: G.Skill Trident Z5 RGB 32GB DDR5-8000 CL38 (extreme-frequency DDR5; requires careful BIOS setup)
- GPU: NVIDIA RTX 5090 (fastest available consumer GPU)
- Storage: Crucial T705 NVMe SSD (PCIe 5.0 SSD; removes storage as any bottleneck)
- PSU: Corsair HX1000i (1000W, fully modular, ATX 3.0 compatible; needed for RTX 5090 power demands)
- Case: Lian Li O11 Dynamic EVO (larger O11 Dynamic variant; better radiator options)
- Cooling: Arctic Liquid Freezer II 420mm AIO (maximum radiator size for i9-13900KS heat output)

Platform notes: LGA1700 + DDR5-8000 on premium Z790; DDR5-8000 requires BIOS tuning to run at rated speed reliably.
Strengths: RTX 5090 delivers highest available consumer 4K performance; PCIe 5.0 SSD eliminates storage bottleneck; 1000W headroom for the flagship combo.
Weaknesses: extreme cost with pronounced diminishing returns vs Enthusiast build; DDR5-8000 needs careful tuning; substantial heat requires the 420mm AIO.
Best for: buyers wanting absolute maximum gaming performance without budget constraints.`,
    metadata: { category: 'products', topic: 'knowledge-example-builds-midrange-enthusiast-flagship' },
  },

  // ── Full Build Guide: Buying Guide Principles ─────────────────────────────
  {
    content: `Gaming PC Buying Guide — Core Principles for Building or Recommending a System:

1. Balance, not maximizing any single component
The most common mistake: overspending on one component (usually the GPU) while under-provisioning others. A well-balanced build matches CPU and GPU tiers to the same resolution/refresh rate target, provisions adequate RAM and fast storage, and leaves reasonable PSU headroom — rather than maximizing any single spec in isolation.

2. Decide resolution and refresh rate first — let it drive component selection
Target resolution (1080p / 1440p / 4K) and refresh rate (60Hz / 144Hz / 240Hz+) should be decided before selecting components. A flagship GPU paired with a 1080p 60Hz monitor wastes most of its capability; a budget GPU paired with a 4K 144Hz monitor bottlenecks badly. This decision should come before shopping, not after.

3. Platform choice: AM4 vs AM5 vs LGA1700 vs LGA1851
- AM4 (AMD): mature, cost-effective, great value CPUs, but end-of-life for new CPU releases
- AM5 (AMD, current): supports latest Ryzen CPUs + DDR5; motherboard socket promised for long-term future CPU upgrades — best AMD platform for future upgradability
- LGA1700 (Intel 12th-14th gen): mature, still-current, supports either DDR4 or DDR5 depending on motherboard
- LGA1851 (Intel Core Ultra 200 series, current): Intel's newest platform, DDR5-only
Buyers planning future CPU-only upgrades should prioritize AM5 or LGA1851 over AM4 or LGA1700, since older platforms have received their final CPU generations.

4. Budget allocation for gaming-focused builds
GPU: typically the largest single share (~30-40% of total budget for balanced gaming builds)
CPU: ~15-25%
Remaining split between motherboard, RAM, storage, PSU, case, cooling based on specific needs.
Streaming/content creation alongside gaming → shift some budget from GPU toward CPU core count and RAM capacity, since those workloads benefit more from multi-core performance and memory headroom.

5. Storage strategy: capacity, speed tiers, and multiple drives
A fast NVMe SSD (PCIe 4.0 or better) for OS and frequently-played games meaningfully improves load times over SATA SSDs. A secondary SATA SSD or HDD for larger game library and file storage balances cost vs capacity. Modern AAA game installs are frequently 50-150GB+ — underestimating storage needs is a common oversight.

6. Case airflow and component clearance planning — always verify before purchase
Before finalizing a case choice:
- GPU length: flagship GPUs can exceed 340mm — check case clearance
- CPU cooler height: tall air coolers can exceed 165-170mm — check max cooler height
- Radiator mounting: 240/280/360/420mm AIOs need case support at the specific mounting location
- PSU length: some smaller cases restrict PSU depth
Mesh-front cases generally deliver better airflow and lower temperatures than solid-front cases with the same fan configuration, at minor cost to noise/dust filtering.`,
    metadata: { category: 'products', topic: 'knowledge-buying-guide-principles' },
  },

  // ── Full Build Guide: Compatibility & FAQs ────────────────────────────────
  {
    content: `Gaming PC Compatibility Reference and Frequently Asked Questions:

COMPATIBILITY MATRIX

CPU ↔ Motherboard:
CPU socket (AM4 / AM5 / LGA1700 / LGA1851) must exactly match the motherboard socket. Chipset (e.g. B650 vs X670E, B760 vs Z790) determines overclocking support and I/O features but not basic CPU compatibility within the same socket family. Note: BIOS updates are sometimes required for newer CPUs on older motherboard revisions.

Motherboard ↔ RAM:
Motherboards support either DDR4 or DDR5 exclusively — never both. Always verify the specific motherboard's memory type before selecting RAM. Especially important: Intel B660/B760/Z690/Z790 motherboards are sold in both DDR4 and DDR5 variants under similar model names — double-check the exact variant purchased.

GPU ↔ Case ↔ PSU:
GPU length must be checked against case clearance specs (measure rear PCIe brackets to front-mounted fans/radiator/drive cages). PSU wattage should provide ~20-30% headroom above combined CPU+GPU peak power draw for stability margin, transient spike tolerance, and future upgrade room.

Cooler ↔ Case:
Air coolers: check max CPU cooler height spec of the case.
AIO liquid coolers: check radiator size compatibility (240/280/360/420mm) at the desired mounting location (top/front/side) — not all cases support all radiator sizes at all positions.

PCIe Generations (3.0 / 4.0 / 5.0):
Fully backward-compatible in both directions — a PCIe 4.0 GPU works in a PCIe 3.0 slot (at reduced bandwidth), and vice versa. Achieving a component's full rated bandwidth requires both the motherboard slot and the component to support the same PCIe generation.

──────────────────────────────────────────
FREQUENTLY ASKED QUESTIONS

Q: Should I spend more on the CPU or the GPU for gaming?
A: For pure gaming at 1440p and above, the GPU generally has a larger impact on frame rates, so allocating more budget toward the GPU is usually the better call once a reasonably capable mid-range CPU is in place. At 1080p, especially at high refresh rates, CPU performance becomes more influential and the balance shifts somewhat toward CPU.

Q: Is it worth building on an older platform (AM4 / LGA1700) for the lower cost?
A: Yes, if immediate budget savings matter more than future CPU-only upgrade flexibility — both platforms remain fully capable for current games. The tradeoff: both AM4 and LGA1700 have received their final CPU generations, so a future CPU upgrade will require a full motherboard (and possibly RAM) change rather than a simple CPU swap.

Q: How much PSU headroom do I actually need?
A: Roughly 20-30% above your combined CPU+GPU peak power draw provides a stability margin, accounts for transient power spikes (especially with modern flagship GPUs), and leaves room for future component upgrades without replacing the PSU.

Q: Do I need liquid cooling, or is air cooling enough?
A: For the vast majority of builds — including many enthusiast-tier CPUs — a quality air cooler is entirely sufficient, often with better long-term reliability and no risk of coolant leak. AIO liquid cooling becomes more clearly worthwhile with very high-TDP flagship CPUs, in cases with poor airflow paths to the CPU, or for the aesthetic of a front/top-mounted radiator in a showcase build.

Q: How do I know if my build has a bottleneck?
A: A CPU bottleneck shows up as GPU utilization consistently well below 95-99% while frame rates remain capped below what the GPU should achieve. A GPU bottleneck shows up as GPU utilization at or near 100% with the CPU comfortably underutilized. Some mismatch across different games and settings is normal — the goal is avoiding a severe, consistent mismatch across most target games, not eliminating all variance.`,
    metadata: { category: 'products', topic: 'knowledge-compatibility-faqs' },
  },

  // ── Full Build Guide: Glossary, Mistakes & Upgrade Advice ─────────────────
  {
    content: `Gaming PC Glossary, Common Mistakes, and Upgrade Advice:

GLOSSARY

Bottleneck: When one component (often CPU or GPU) limits overall system performance because a paired component is significantly more capable, preventing the more capable component from being fully utilized.

TDP (Thermal Design Power): Manufacturer's rating (in watts) indicating roughly how much heat a CPU or GPU is designed to dissipate under sustained load. Used as a rough guide for cooler and PSU sizing, though actual power draw can exceed TDP under boost conditions.

PCIe Lanes: Individual data pathways in a PCIe connection. More lanes (x4, x8, x16) or a higher PCIe generation (3.0/4.0/5.0) both increase available bandwidth for GPUs, SSDs, and expansion cards.

VRM (Voltage Regulator Module): Motherboard circuitry that converts and regulates power to the CPU. Higher-quality VRMs support higher CPU power draw and overclocking more reliably — particularly relevant for unlocked K-series/X-series CPUs.

XMP / EXPO: Intel XMP (Extreme Memory Profile) and AMD EXPO are one-click BIOS profiles that run RAM at its rated marketed speed rather than a conservative default. Enabling one of these is necessary to get a memory kit's advertised speed — RAM ships running at lower default speeds until this profile is activated.

Chipset: The motherboard controller chip determining features like overclocking support, USB/SATA/M.2 port count, and PCIe lane allocation. Distinct from but paired with a specific CPU socket.

──────────────────────────────────────────
COMMON PC BUILDING MISTAKES

1. Pairing a flagship GPU with a budget CPU (or vice versa) — creates a severe bottleneck that wastes the more expensive component's potential.
2. Underestimating PSU wattage needs — especially with modern flagship GPUs that have high transient power spikes beyond their listed average draw.
3. Buying DDR4 RAM for a DDR5-only motherboard (or vice versa) without verifying the specific board's memory type.
4. Forgetting to check GPU length, cooler height, and radiator mounting clearance against the case's specifications before purchase.
5. Building on an end-of-life platform (AM4/LGA1700) without understanding that a future CPU-only upgrade will require a full motherboard change.
6. Underestimating modern game storage requirements and running out of fast NVMe space sooner than expected.

──────────────────────────────────────────
UPGRADE ADVICE BY STAGE

Entry → Budget: GPU is almost always the highest-impact single upgrade at this stage, since entry-tier platforms typically have CPU/RAM headroom that isn't yet the limiting factor.

Budget → Mid-Range: Consider whether a GPU-only upgrade suffices or whether the CPU has also become a bottleneck for your target resolution/refresh rate. Check GPU utilization during gameplay as a rough diagnostic before deciding.

Mid-Range → Enthusiast: Often the point where a full platform change (newer socket + DDR5) makes more sense than another CPU-only swap on an aging platform, especially if the current platform is AM4 or older LGA1700.

Enthusiast → Flagship: Diminishing returns become pronounced here. Carefully consider whether the actual target resolution, refresh rate, and game library will meaningfully benefit before spending at the flagship tier — many enthusiast builds already deliver excellent results for the vast majority of games.

General principle: Avoid upgrading a single component so far beyond the rest of the system that it becomes severely bottlenecked. Incremental, balanced upgrades generally deliver better real-world results than concentrating budget in one component.`,
    metadata: { category: 'products', topic: 'knowledge-glossary-mistakes-upgrades' },
  },

  // ── Mice: Buying Guide ────────────────────────────────────────────────────
  {
    content: `Gaming Mouse Buying Guide:

Sensor technology and DPI — what actually matters:
- Modern gaming mice use optical sensors (not laser); track more accurately and consistently
- DPI (dots per inch / CPI): determines cursor speed per inch of physical movement; higher isn't inherently better
- Most competitive players use 400-1600 DPI with lower in-game sensitivity for precise, controlled aim
- Max DPI numbers in marketing (20,000+, 36,000+) go far beyond practical use; sensor accuracy and consistency at your actual DPI range matters more
- What to look for: smooth tracking, no acceleration artifacts, reliable lift-off distance

The ultralight mouse trend:
- Gaming mice have dropped from typical 100g+ (a decade ago) to sub-60g and even sub-50g boutique options today
- Weight reduction achieved via honeycomb/perforated shells, smaller batteries, minimalist internals
- Lighter mice enable faster, more effortless movements; preferred by most competitive FPS players
- Heavier mice aren't inherently worse — some players prefer added weight/stability for control

Shape: ergonomic vs symmetrical vs ambidextrous:
- Ergonomic (right-hand-specific): contoured hump fits hand naturally; favored for palm grip and relaxed claw grip; right-hand only
- Symmetrical/ambidextrous: works for both hands; dominant shape among top competitive esports mice; suits claw and fingertip grips well
- Flat ambidextrous (BenQ Zowie FK style): low-profile, preferred by many competitive fingertip/claw players
- Shape fit matters more than brand — check dimensions and reviews for your hand size

Grip styles — shapes to look for:
- Palm grip: whole hand rests on mouse; suits larger ergonomic mice with pronounced hump
- Claw grip: fingers bent, palm partially raised; broad compatibility; slightly smaller or symmetrical shapes work well
- Fingertip grip: only fingertips touch mouse; palm fully raised; common in competitive FPS; favors lightweight, lower-profile symmetrical mice

Wired vs wireless (2026):
- Modern gaming wireless (2.4GHz proprietary dongles: Logitech Lightspeed, Razer HyperSpeed, SteelSeries Quantum, Corsair SLIPSTREAM) matches wired latency and reliability — professional esports players now predominantly use wireless
- Bluetooth mode: higher latency; not suitable for competitive gaming; reserve for secondary/mobile use
- Always use the 2.4GHz dongle for gaming, not Bluetooth mode on dual-mode mice
- Main remaining wireless considerations: battery management, and marginal added weight vs equivalent wired mouse

Mouse switches:
- Traditional mechanical microswitches (Omron, Huano, house-brand): standard and reliable; can develop double-click issues over years of wear
- Optical mouse switches (Razer, SteelSeries magnetic-optical): register via light beam; no physical contact wear; eliminate debounce delay and double-click aging; practical competitive advantage debated but switch longevity advantage is real`,
    metadata: { category: 'products', topic: 'mice-buying-guide' },
  },

  // ── Mice: Entry Wired ─────────────────────────────────────────────────────
  {
    content: `Gaming Mice — Entry Tier (Wired):
Reliable optical sensors, 1000Hz polling, basic RGB. Excellent starting point; no wireless.

Logitech G203 Lightsync ⭐⭐ — ~85g / Symmetrical small-to-medium / Logitech optical sensor / 8000 DPI / 6 buttons / Mechanical switches (10M click rated) / Logitech G HUB
- One of the most consistently recommended entry mice ever; proven reliability; RGB included; broad grip compatibility
- Best for: the default budget wired gaming mouse recommendation; hard to go wrong here

Razer Cobra — ~72g / Symmetrical small-to-medium / Razer optical sensor / 8500 DPI / 6 buttons / USB-C / Razer Synapse
- Lightweight for an entry tier mouse (~72g); RGB underglow; competent sensor
- Best for: budget buyers wanting a lighter entry-tier option or Razer ecosystem integration

Corsair Katar Pro — ~69g / Symmetrical small-to-medium / PixArt-based sensor / 12400 DPI / 6 buttons / Mechanical switches (20M click rated) / Corsair iCUE
- One of the lighter entry mice available at ~69g; switches rated for 20M clicks; Corsair iCUE ecosystem
- Best for: budget buyers wanting a very lightweight entry mouse in the Corsair ecosystem

HyperX Pulsefire Core — ~87g / Symmetrical medium / HyperX optical sensor / 6200 DPI / 6 buttons / HyperX NGENUITY
- Slightly heavier entry option; straightforward no-fuss design; basic RGB
- Best for: budget buyers who simply need a reliable entry mouse for HyperX ecosystem builds

SteelSeries Rival 3 ⭐ — ~77g / Symmetrical medium / TrueMove Core sensor / 8500 DPI / 6 buttons / Mechanical switches (60M click rated) / SteelSeries GG
- Switches rated for an impressive 60M clicks at the entry tier; competent sensor; good durability for the price
- Best for: budget buyers who want the most durable/long-lasting entry-tier switch rating

Entry tier summary:
- Default recommendation → Logitech G203
- Lightest body → Corsair Katar Pro (~69g)
- Most durable switches → SteelSeries Rival 3 (60M click rated)`,
    metadata: { category: 'products', topic: 'mice-entry-wired' },
  },

  // ── Mice: Budget ──────────────────────────────────────────────────────────
  {
    content: `Gaming Mice — Budget Tier (Mix of Wired Upgrades + First Wireless):

Logitech G305 Lightspeed ⭐⭐ Community Favorite — ~99g (with AA battery) / Symmetrical medium / HERO 12K sensor / 12000 DPI / Wireless 2.4GHz Lightspeed / 6 buttons / Up to 250 hours battery / Logitech G HUB
- One of the most recommended wireless gaming mice ever; HERO sensor; reliable Lightspeed wireless; extraordinary 250-hour battery life on a single AA battery
- The AA battery adds some weight vs. rechargeable competitors; still widely regarded as outstanding value
- Best for: the default budget wireless gaming mouse recommendation; exceptional value

Razer DeathAdder V2 ⭐⭐ — ~82g / Ergonomic right-hand medium-to-large / Focus+ 20K sensor / 20000 DPI / Wired USB / 8 buttons / Optical switches (70M click rated, no double-click issues) / Razer Synapse
- One of the best-selling gaming mice of all time; iconic well-refined ergonomic shape; optical switches eliminate double-click wear aging; right-hand only
- Best for: palm grip gamers wanting a proven ergonomic shape; one of the top ergonomic wired recommendations

Corsair Sabre RGB Pro — ~74g / Symmetrical medium / PixArt-based sensor / 18000 DPI / Wired USB / 6 buttons / Mechanical switches (50M click rated) / Corsair iCUE
- Lightweight competitive design from Corsair; good sensor; 50M click rated switches; wired only
- Best for: budget-to-mid competitive buyers wanting a lightweight wired symmetrical mouse in the Corsair ecosystem

Glorious Model D ⭐ — ~68g / Ergonomic medium (honeycomb shell) / BAMF sensor (PMW3360-based) / 19000 DPI / Wired USB paracord cable / 6 buttons / Omron switches (50M click rated) / Glorious Core
- Honeycomb perforated shell reduces weight while keeping solid ergonomic feel; well-regarded BAMF sensor; paracord cable; collects dust in honeycomb cutouts
- Best for: budget-to-mid buyers wanting a lightweight ergonomic wired mouse; a community favorite

BenQ Zowie FK2 ⭐ — ~87g / Flat ambidextrous medium / PixArt 3360 / 3200 DPI max / Wired USB / 5 buttons / Huano mechanical switches / No software required (plug-and-play)
- A classic among competitive esports players; low DPI ceiling reflects its professional target audience (who use low DPI); zero RGB, no software, pure function; flat ambidextrous profile suits fingertip/claw grip
- Best for: purist competitive players wanting a no-frills ambidextrous esports mouse with a long track record

HyperX Pulsefire Haste 2 — ~53-61g (variant dependent) / Symmetrical medium / HyperX 26K sensor / Wired USB-C or Wireless 2.4GHz (variant dependent) / 6 buttons / Mechanical switches (80M click rated) / HyperX NGENUITY
- Very light for the price tier; available in both wired and wireless variants; 80M click rated switches
- Best for: budget buyers wanting a very lightweight mouse with wireless flexibility at a competitive price`,
    metadata: { category: 'products', topic: 'mice-budget' },
  },

  // ── Mice: Mid-Range ───────────────────────────────────────────────────────
  {
    content: `Gaming Mice — Mid-Range:

Logitech G502 X ⭐ — ~89g / Ergonomic right-hand medium-to-large / HERO 25K sensor / 25600 DPI / Wired or Wireless 2.4GHz Lightspeed (variant) / 13 buttons / Hybrid optical-mechanical (LIGHTFORCE on wireless) / Logitech G HUB
- Refined evolution of the iconic G502; significantly lighter than original G502 (was 121g); extensive 13-button layout for MMO/productivity alongside gaming; right-hand only; wireless variant is more expensive
- Best for: palm grip gamers wanting extensive buttons alongside strong sensor performance

Razer Basilisk V3 — ~101g / Ergonomic right-hand medium-to-large / Focus+ 26K sensor / 26000 DPI / Wired USB / 11 buttons / Adjustable scroll wheel resistance / Razer Synapse
- Adjustable scroll wheel resistance (tactile or free-spin scrolling) is the standout feature; 11 programmable buttons; right-hand only
- Best for: mid-range buyers wanting extensive customization and adjustable scroll wheel alongside strong sensor performance

Corsair M65 RGB Ultra — ~96-98g / Ergonomic right-hand medium / Marksman 26K sensor / 26000 DPI / Wired or Wireless 2.4GHz SLIPSTREAM (variant) / 8 buttons / Aluminum unibody frame / Dedicated Sniper button / Corsair iCUE
- Aluminum unibody frame; dedicated Sniper button for instant DPI reduction (precision aiming toggle); right-hand only
- Best for: FPS-focused mid-range buyers wanting a durable metal frame and a Sniper button

SteelSeries Aerox 3 Wireless ⭐ — ~68g / Symmetrical medium (honeycomb shell) / TrueMove Air sensor / 18000 DPI / Wireless 2.4GHz Quantum + Bluetooth / Up to 200h battery / IP54 water/dust resistant / SteelSeries GG
- Unique combination of ultralight honeycomb shell + IP54 water resistance; strong battery life; good sensor
- Best for: mid-range buyers wanting lightweight wireless durability with water resistance

Glorious Model O Wireless ⭐ — ~69-79g / Symmetrical medium (honeycomb shell) / BAMF sensor / 19000 DPI / Wireless 2.4GHz / Up to 71h battery / Glorious Core
- The wireless version of the beloved Model O; same distinctive honeycomb design; shorter battery life than the Aerox 3
- Best for: Model O fans wanting wireless freedom in the same lightweight honeycomb design

BenQ Zowie EC2 ⭐ — ~90g / Ergonomic right-hand medium-to-large / PixArt 3389 / 3200 DPI max / Wired USB / 5 buttons / Huano mechanical switches / No software (plug-and-play)
- Long-standing professional FPS staple, especially in Counter-Strike; refined ergonomic palm grip shape; no RGB, no software; right-hand only; low DPI max reflects pro-player target use
- Best for: competitive FPS players wanting a proven ergonomic shape with a decades-long pro pedigree

ASUS ROG Gladius III — ~79g / Ergonomic right-hand medium / ROG sensor up to 36K DPI / Wired or Wireless 2.4GHz (variant) / 6 buttons / Hot-swappable switch sockets / ASUS Armoury Crate
- Hot-swappable mouse click switch sockets — unique feature allowing switch replacement for repair or feel preference; right-hand only
- Best for: mid-range buyers who value switch longevity and repairability over the long term`,
    metadata: { category: 'products', topic: 'mice-midrange' },
  },

  // ── Mice: Enthusiast ──────────────────────────────────────────────────────
  {
    content: `Gaming Mice — Enthusiast Tier:

Corsair Dark Core RGB Pro — ~133g / Ergonomic right-hand medium-to-large / PixArt-based sensor / 18000 DPI / Wireless 2.4GHz SLIPSTREAM + Bluetooth / 8 buttons / Qi wireless charging compatible / Up to 60h battery (RGB off) / Corsair iCUE
- Heaviest in this tier; Qi wireless charging is the standout feature — compatible with Qi charging pads; comfortable ergonomic shape; right-hand only
- Best for: enthusiast buyers who want the convenience of Qi charging in a wireless mouse and don't mind the weight

SteelSeries Prime Wireless ⭐ — ~80g / Symmetrical medium / TrueMove Pro+ sensor / 18000 DPI / Wireless 2.4GHz Quantum / 6 buttons / Magnetic optical switches (100M click rated, no debounce delay) / Up to 100h battery / SteelSeries GG
- Designed with professional esports input; magnetic optical switches rated for 100M clicks with no debounce delay — the switch tech standout at this tier; good battery life
- Best for: competitive enthusiast buyers wanting cutting-edge switch technology in a wireless symmetrical esports mouse

Glorious Model O 2 ⭐ — ~59-65g / Symmetrical medium / BAMF sensor updated gen / 26000 DPI / Wired USB-C or Wireless 2.4GHz (variant) / 6 buttons / Up to 110h battery (wireless) / Glorious Core
- Refined Model O with an even lighter body; improved sensor and switches; strong wireless battery life; multiple size options
- Best for: enthusiast buyers wanting Glorious's latest lightweight refinement in a symmetrical design

BenQ Zowie S2 ⭐ — ~85g / Ergonomic right-hand small-to-medium / PixArt 3389 / 3200 DPI max / Wired USB / 5 buttons / Huano mechanical switches / No software (plug-and-play)
- Smaller ergonomic shape than the EC2; intended for smaller hands or players preferring a more compact profile; same purist no-frills professional philosophy
- Best for: competitive FPS players with smaller hands who prefer the Zowie ergonomic design

ASUS ROG Keris Wireless AimPoint ⭐ — ~75-79g / Ergonomic right-hand medium / AimPoint 36K sensor / 36000 DPI / Wireless 2.4GHz or Wired USB-C / 6 buttons / Up to 96h battery / ASUS Armoury Crate
- AimPoint sensor is highly regarded for accuracy and consistency; lightweight ergonomic design; strong battery life; right-hand only
- Best for: enthusiast competitive buyers wanting a premium ergonomic wireless mouse with a top-tier sensor

Pulsar Xlite V3 ⭐ — ~49-52g / Ergonomic right-hand small-to-medium (boutique brand) / PAW3395 sensor / 26000 DPI / Wireless 2.4GHz or Wired USB-C / 6 buttons / Kailh GM 8.0 switches / Up to 70h battery / Pulsar Fly software
- Among the lightest ergonomic wireless mice available; PAW3395 is a top-tier sensor; boutique brand with smaller retail footprint than Logitech/Razer/SteelSeries
- Best for: competitive FPS enthusiasts wanting an ultralight ergonomic wireless mouse from a boutique-focused brand`,
    metadata: { category: 'products', topic: 'mice-enthusiast' },
  },

  // ── Mice: Flagship ────────────────────────────────────────────────────────
  {
    content: `Gaming Mice — Flagship Tier:

Logitech G Pro X Superlight 2 ⭐⭐ The Benchmark — ~60g / Symmetrical medium / HERO 32K sensor / 32000 DPI / Wireless 2.4GHz Lightspeed / 5 buttons / Hybrid mechanical switches / Up to 95h battery / Logitech G HUB
- The most widely used mouse among professional esports players; sub-60g wireless with flagship HERO 32K sensor and best-in-class Lightspeed wireless reliability
- Minimalist 5-button layout (no side buttons beyond left/right side buttons)
- Best for: the default flagship wireless esports mouse recommendation; used at the highest competitive levels globally

Razer Viper V2 Pro ⭐ — ~58-59g / Symmetrical medium / Focus Pro 30K sensor / 30000 DPI / Wireless 2.4GHz HyperSpeed / 5 buttons / Razer optical switches (no debounce delay) / Up to 80h battery / Razer Synapse
- Sub-60g wireless flagship competing directly with the Superlight 2; optical switches eliminate debounce delay and aging double-click wear; Focus Pro 30K sensor
- Best for: competitive players wanting a flagship ultralight symmetrical mouse with optical switch advantages; direct Superlight 2 rival

ASUS ROG Harpe Ace Aim Lab Edition ⭐ — ~54g / Symmetrical medium / AimPoint Pro 42K sensor / 42000 DPI / Wireless 2.4GHz or Wired USB-C / 5 buttons / Up to 88h battery / ASUS Armoury Crate
- Developed with Aim Lab; AimPoint Pro 42K sensor is among the most capable sensors available; extremely lightweight at ~54g; strong battery life
- Best for: competitive players wanting ASUS's most cutting-edge sensor technology in an ultralight symmetrical design

Pulsar X2 ⭐ — ~52-56g / Symmetrical multiple sizes (regular, Mini) / PAW3395 sensor / 26000 DPI / Wireless 2.4GHz or Wired USB-C / 6 buttons / Kailh GM 8.0 switches / Up to 70h battery / Pulsar Fly software
- Boutique brand flagship; PAW3395 sensor; ultralight symmetrical design available in multiple sizes including a Mini variant; smaller retail availability than mainstream brands
- Best for: FPS enthusiasts wanting a boutique ultralight symmetrical mouse with strong sensor performance and size options

Finalmouse UltralightX — ~25-30g / Ergonomic right-hand small-to-medium / Wireless 2.4GHz / Limited-drop availability / Magnesium alloy shell
- Among the absolute lightest gaming mice ever produced; magnesium alloy construction; sold in limited-quantity release drops (not continuous retail) — pricing often inflated on secondary market
- Best for: extreme lightweight enthusiasts who can access a release drop; not for buyers wanting guaranteed retail availability

Finalmouse Starlight-12 — ~40-42g / Ergonomic right-hand (small/medium/large sizes) / Wireless 2.4GHz / Limited-drop availability
- Extremely lightweight across multiple size variants; same limited-drop sales model and secondary-market premium pricing as the UltralightX
- Best for: same niche as UltralightX; slightly lighter across more size options

Flagship summary:
- Most trusted competitive benchmark → Logitech G Pro X Superlight 2
- Best optical switches + flagship tier → Razer Viper V2 Pro
- Most advanced sensor (ASUS) → ROG Harpe Ace Aim Lab Edition
- Best boutique symmetrical → Pulsar X2
- Lightest possible (limited availability) → Finalmouse UltralightX`,
    metadata: { category: 'products', topic: 'mice-flagship' },
  },

  // ── Keyboards: Buying Guide ───────────────────────────────────────────────
  {
    content: `Gaming Keyboard Buying Guide:

Switch types:
- Linear (e.g. Cherry MX Red, Gateron Red, HyperX Red): smooth travel, no bump, no click; consistent actuation; favored by many gamers for fast, repeatable keypresses
- Tactile (e.g. Cherry MX Brown, Gateron Brown): noticeable bump midway through travel with no click; useful feedback for both typing and gaming; a middle ground
- Clicky (e.g. Cherry MX Blue, Razer Green): audible click + tactile bump; popular for typing satisfaction, often avoided for gaming/shared spaces due to noise

Switch technologies:
- Membrane: rubber dome under every key; cheapest option; less durable/consistent than mechanical; no hot-swap; fine for casual use
- Mechanical: individual switch mechanism per key; better durability, consistency, and feel; many boards are hot-swappable
- Optical: light beam registers actuation (no physical contact point); very fast, very long lifespan; often non-hot-swappable due to proprietary designs
- Hall-effect (magnetic): magnet position is read continuously; enables adjustable actuation per key and "rapid trigger"; the current competitive precision frontier (SteelSeries Apex Pro, Wooting)

Form factor guide:
- Full-size: includes numpad; best for productivity users who need it; largest desk footprint
- TKL (tenkeyless, ~87%): no numpad; keeps all F-keys and navigation keys; popular gaming balance of compact + functional
- 75%: keeps F-row and nav keys in a tighter cluster; slightly smaller than TKL
- 65%: keeps arrow keys; removes most navigation cluster; further space savings
- 60%: no F-row, no arrows, no nav keys; all via function layers; smallest footprint, maximum mouse room; requires learning layer combinations — a real tradeoff

Hot-swappable switches:
- Allows removing and replacing individual mechanical switches without soldering
- Enables experimenting with switch feel (linear/tactile/clicky), or replacing a worn switch
- Verify 3-pin vs 5-pin socket support before buying replacement switches — they aren't universally interchangeable

Adjustable actuation and rapid trigger (hall-effect boards):
- Adjustable actuation: set exactly how far a key must travel before registering (e.g. 0.4mm for extremely light, 2.0mm for standard)
- Rapid trigger: re-registers press/release based on direction of movement rather than a fixed depth — allows near-instant re-registration for counter-strafing, jump spamming, and rapid repeated inputs
- Offers a measurable competitive edge in CS2, Valorant, fighting games, Rocket League
- Boards: SteelSeries Apex Pro, Wooting 60HE/Two HE, Corsair K65 Plus Wireless

Wired vs wireless:
- Modern 2.4GHz wireless (NOT Bluetooth) gaming keyboards achieve latency effectively indistinguishable from wired for gaming
- Bluetooth mode: higher latency than 2.4GHz; better for non-gaming/secondary device use
- Wired: simplest, universally compatible, slightly lower latency ceiling — still the default for competitive purists
- For wireless gaming: always use the 2.4GHz dongle, not Bluetooth

Common mistakes:
- Choosing a switch type without trying it first (or buying a hot-swap board to experiment)
- Using a wireless keyboard in Bluetooth mode for competitive gaming instead of the 2.4GHz dongle
- Buying a 60% board without understanding function-layer navigation
- Assuming all hot-swap boards support both 3-pin and 5-pin switches`,
    metadata: { category: 'products', topic: 'keyboards-buying-guide' },
  },

  // ── Keyboards: Membrane / Entry ───────────────────────────────────────────
  {
    content: `Gaming Keyboards — Entry Tier (Membrane):
Membrane boards use rubber domes for a cheaper, quieter experience. Fine for casual gaming; lack the durability and consistency of mechanical switches. None are hot-swappable.

Logitech G213 Prodigy — Full-size / Mech-Dome hybrid membrane / Wired USB / Per-zone RGB / Integrated wrist rest / Spill-resistant
- Logitech's G213 uses a slightly better "Mech-Dome" design; integrated wrist rest is a comfort bonus; 1ms polling rate
- Best for: budget gaming setups wanting an all-in-one board with wrist rest at the lowest price

Razer Cynosa V2 — Full-size / Membrane / Wired USB / Per-key RGB / Spill-resistant / Razer Synapse
- Per-key RGB at a budget membrane price; integration with Razer Synapse ecosystem
- Best for: budget buyers wanting per-key RGB within the Razer peripheral ecosystem

Corsair K55 RGB Pro — Full-size / Membrane / Wired USB / Per-zone RGB / Dedicated multimedia keys / Detachable wrist rest / Corsair iCUE
- Includes dedicated multimedia keys and a detachable wrist rest — more included accessories than typical entry boards
- Best for: budget Corsair iCUE ecosystem buyers who want multimedia controls and a wrist rest included

HyperX Alloy Core RGB — Full-size / Membrane / Wired USB / Per-key RGB / Spill-resistant / Media controls / HyperX NGENUITY
- Per-key RGB and dedicated media controls at an entry price; spill-resistant build
- Best for: budget buyers wanting per-key RGB and HyperX ecosystem integration

SteelSeries Apex 3 — Full-size / Whisper-quiet membrane / Wired USB / Per-zone RGB / IP32 water-resistant / Media control wheel / SteelSeries GG
- IP32 water resistance is the standout differentiator vs. competitors; whisper-quiet switch action for quieter environments
- Best for: budget buyers wanting a water-resistant keyboard and quiet operation

Entry membrane summary: all are functional for casual gaming. Cynosa V2 and Alloy Core for per-key RGB. G213 and K55 for included comfort accessories. Apex 3 for water resistance.`,
    metadata: { category: 'products', topic: 'keyboards-membrane-entry' },
  },

  // ── Keyboards: Budget Mechanical ─────────────────────────────────────────
  {
    content: `Gaming Keyboards — Budget Tier (Mechanical):
Budget mechanical boards offer individual switch mechanisms, better durability and consistency than membrane, and increasingly hot-swap capability at an accessible price.

Logitech G413 SE — Full-size / Logitech GX Brown tactile / Wired USB / Single-color white backlighting / Aluminum top plate / No hot-swap
- Aluminum-topped chassis unusual at this price; no RGB (single-color white only); solid tactile feel
- Best for: budget buyers wanting their first mechanical keyboard without caring about RGB

HyperX Alloy Origins Core ⭐ — TKL / HyperX Red linear or Aqua tactile / Wired USB / Per-key RGB / Aluminum body / No hot-swap
- A community favorite; solid aluminum body in a TKL footprint at a budget price; reliable HyperX switches
- Best for: budget buyers wanting a compact TKL mechanical keyboard with aluminum build; a top recommendation at this tier

ASUS ROG Strix Scope — TKL / Cherry MX Red/Brown/Blue / Wired USB / Per-key RGB (Aura Sync) / Dedicated Stealth key / No hot-swap
- Uses genuine Cherry MX switches — proven reliability; includes a "Stealth" key for quick audio/chat muting; Aura Sync RGB ecosystem
- Best for: budget buyers wanting proven Cherry MX switch reliability and ASUS Aura Sync ecosystem

Keychron K8 ⭐⭐ Community Favorite — TKL / Gateron switches (hot-swappable on Pro variant) / Wired USB-C or Bluetooth 5.1 / White or RGB / Double-shot ABS keycaps
- Enormously popular; hot-swappable switches on the Pro variant; wired + Bluetooth multi-device (including Mac); large community following; QMK/VIA on Pro
- Important: verify you're buying the hot-swappable Pro variant — the base K8 is NOT hot-swappable
- Best for: the default budget mechanical keyboard recommendation; especially good for multi-device or Mac/Windows flexibility

Glorious GMMK 2 ⭐ — Full-size/75%/65% / Glorious switches (hot-swappable 5-pin) / Wired USB-C / Per-key RGB / Gasket-mount / Double-shot PBT keycaps
- Gasket-mounted design (better sound/feel than typical tray-mount boards); PBT keycaps included; multiple size variants; wired only
- Best for: budget buyers wanting a premium typing feel and hot-swap flexibility; multiple size options; no wireless

Ducky One 2 Mini ⭐ — 60% / Cherry MX options / Wired detachable USB-C / Per-key RGB / Double-shot PBT keycaps / No hot-swap
- Hugely popular in competitive gaming circles; exceptional build quality; PBT keycaps stock; maximum mouse room; no arrow keys (layer-based)
- Best for: competitive gamers wanting maximum desk/mouse space and proven build quality in a 60% package

Budget mechanical summary:
- Best overall value + hot-swap → Keychron K8 Pro
- Best TKL aluminum build → HyperX Alloy Origins Core
- Best Cherry MX options → ASUS ROG Strix Scope or Ducky One 2 Mini
- Best gasket-mount feel → Glorious GMMK 2`,
    metadata: { category: 'products', topic: 'keyboards-budget-mechanical' },
  },

  // ── Keyboards: Mid-Range Mechanical ──────────────────────────────────────
  {
    content: `Gaming Keyboards — Mid-Range (Mechanical):

Logitech G Pro X TKL ⭐ — TKL / Logitech GX switches (hot-swappable) / Wired USB-C detachable / Per-key RGB / Compact minimalist design / Logitech G HUB
- Designed with pro esports input; hot-swappable GX switches; detachable cable for portability; minimalist competitive aesthetic
- Uses tray-mount construction (not gasket) — adequate for most, but not the premium typing feel of gasket-mount boards
- Best for: mid-range competitive gaming setups wanting a proven esports-tuned hot-swap TKL

Razer BlackWidow V4 — Full-size / Razer Green/Yellow/Orange switches / Wired USB / Per-key RGB / Dedicated macro keys + media dial / Razer Synapse
- Dedicated macro keys and media control dial alongside the standard full-size layout; long-running BlackWidow switch options
- No hot-swap; larger footprint due to macro key column
- Best for: full-size buyers wanting dedicated macro keys and media controls in the Razer ecosystem

Corsair K70 RGB Pro ⭐⭐ Community Favorite — Full-size / Cherry MX Red/Brown/Blue/Speed / Wired USB / Per-key RGB / Aluminum aircraft-grade frame / Double-shot PBT keycaps / Up to 8000Hz polling on some SKUs
- A continuation of one of the most trusted keyboard lineups; genuine Cherry MX switches; aircraft-grade aluminum frame; PBT keycaps stock
- No hot-swap; still the default trusted full-size mid-range recommendation
- Best for: mid-range buyers wanting a proven, durable full-size mechanical keyboard with Cherry MX switches

SteelSeries Apex 7 — Full-size or TKL / SteelSeries QX2 Red/Brown / Wired USB / Per-key RGB / OLED smart display / Adjustable magnetic wrist rest / SteelSeries GG
- OLED display for game info, system stats, or media info; included adjustable magnetic wrist rest; both full-size and TKL available
- No hot-swap; proprietary QX2 switches limit aftermarket options
- Best for: mid-range buyers specifically wanting the OLED smart display feature

ASUS ROG Falchion — 65% / Cherry MX or ROG NX switches / Wired USB-C or 2.4GHz wireless / Per-key RGB / Detachable numpad accessory / ASUS Armoury Crate
- Compact 65% wireless board with a detachable numpad accessory for optional numpad use; 2.4GHz low-latency wireless
- No hot-swap; the detachable numpad must be carried separately
- Best for: mid-range buyers wanting compact wireless flexibility with optional numpad when needed

HyperX Alloy Elite 2 — Full-size / HyperX Red/Aqua/Blue switches / Wired USB / Per-key RGB / Dedicated media controls + volume wheel / Aluminum frame / HyperX NGENUITY
- Dedicated volume wheel and media controls; aluminum frame; multiple switch options
- No hot-swap
- Best for: full-size mid-range buyers wanting dedicated media controls in the HyperX ecosystem

Keychron V3 ⭐ — 80% TKL / Gateron switches (hot-swappable 3+5 pin) / Wired USB-C (wireless on Max variant) / Per-key RGB / Gasket-mount / QMK/VIA / Double-shot PBT keycaps
- Gasket-mount construction for a premium typing feel; full QMK/VIA programmability for deep remapping; hot-swappable; PBT keycaps included
- Base V3 is wired-only; wireless requires the more expensive V3 Max
- Best for: enthusiasts wanting a premium customizable typing experience at a mid-range price; a top recommendation at this tier

Mid-range summary:
- Best trusted full-size Cherry MX → Corsair K70 RGB Pro
- Best hot-swap esports TKL → Logitech G Pro X TKL
- Best customizable gasket-mount → Keychron V3
- Best OLED display feature → SteelSeries Apex 7
- Best compact wireless → ASUS ROG Falchion`,
    metadata: { category: 'products', topic: 'keyboards-midrange-mechanical' },
  },

  // ── Keyboards: Enthusiast / Custom-Style ──────────────────────────────────
  {
    content: `Gaming Keyboards — Enthusiast / Custom-Style Mechanical:
These boards bring custom-keyboard construction (CNC aluminum bodies, gasket mounts, QMK/VIA programmability, PBT keycaps) to accessible pre-built prices — significantly cheaper than assembling individual custom keyboard components.

Keychron Q1 ⭐⭐ Community Favorite — 75% / Gateron Pro switches (hot-swappable 3+5 pin) / Wired USB-C (wireless on Pro variant) / Per-key RGB / Full CNC-machined aluminum body / Gasket-mount / QMK/VIA / Double-shot PBT keycaps
- Pioneered accessible custom-keyboard-style construction; full CNC-machined aluminum body with gasket mount delivers a premium thocky typing sound and feel; full QMK/VIA programmability for deep key remapping; PBT keycaps stock
- Heavier than mainstream gaming keyboards; base Q1 is wired-only (Pro variant adds wireless)
- Best for: enthusiasts wanting a premium custom-keyboard-like typing experience without sourcing individual components; a standout pick at this tier

Ducky One 3 ⭐ — 60%/65%/TKL/Full-size / Cherry MX or Kailh switches (hot-swappable 5-pin) / Wired detachable USB-C / Per-key RGB / Double-shot PBT keycaps / Onboard configuration only
- Widely praised for exceptional stock sound and build quality; available across nearly every popular form factor; hot-swappable; PBT keycaps included; no dedicated software (uses onboard key combinations)
- No dedicated QMK/VIA-style software remapping
- Best for: enthusiasts wanting top-tier stock keyboard quality and sound in whichever form factor they prefer

Ducky Shine 7 — Full-size / Cherry MX options / Wired detachable USB-C / Per-key RGB / Double-shot PBT keycaps / Onboard configuration only / No hot-swap
- Ducky's full-size line for numpad users; excellent stock quality and typing feel; PBT keycaps stock
- Not hot-swappable (unlike the One 3 line) — check One 3 full-size variant if hot-swap matters to you
- Best for: enthusiasts wanting a full-size Ducky keyboard with a numpad and proven build quality

Glorious GMMK Pro ⭐ — 75% / Hot-swappable 5-pin / Wired USB-C / Per-key RGB / CNC-machined aluminum body / Gasket-mount / Rotary volume knob / Double-shot PBT keycaps / Glorious Core
- Pioneered the accessible custom-style keyboard market before Keychron Q; rotary volume knob; gasket mount; premium typing feel
- QMK/VIA support is less extensive than Keychron's implementation; wired only
- Best for: enthusiasts wanting a premium custom-style keyboard with a rotary knob at an accessible price

Custom-style enthusiast summary:
- Deepest QMK/VIA programmability → Keychron Q1
- Best stock sound/quality across form factors → Ducky One 3
- Rotary knob + premium build → Glorious GMMK Pro
- Full-size with numpad → Ducky Shine 7`,
    metadata: { category: 'products', topic: 'keyboards-enthusiast-custom' },
  },

  // ── Keyboards: Hall-Effect / Adjustable Actuation ─────────────────────────
  {
    content: `Gaming Keyboards — Hall-Effect / Adjustable Actuation (Competitive Precision Tier):
Hall-effect keyboards use magnetic sensors to continuously read switch position, enabling adjustable actuation (set how far each key must travel to register) and rapid trigger (re-register based on direction of movement, not a fixed point). These offer a measurable competitive advantage in CS2, Valorant, fighting games, and Rocket League.

SteelSeries Apex Pro ⭐⭐ — Full-size or TKL / Hall-effect OmniPoint switches (adjustable 0.4mm-3.6mm actuation) / Wired USB / Per-key RGB / OLED display / SteelSeries GG
- The keyboard that popularized adjustable-actuation hall-effect gaming keyboards; OLED display included
- Tiers: Enthusiast. Available in full-size and TKL
- No hot-swap (proprietary hall-effect design); no wireless
- Best for: competitive gamers wanting proven adjustable actuation with the Apex Pro's established track record

Wooting 60HE ⭐⭐ Community Favorite — 60% / Hall-effect Lekker switches (adjustable actuation + rapid trigger, hot-swappable) / Wired USB-C / Per-key RGB / PBT keycaps / Wootility software
- 60% compact footprint; rapid trigger enables near-instant re-registration — especially loved for counter-strafing in CS2 and input precision in fighting games and Rocket League
- Hot-swappable Lekker switches (hall-effect); no arrow keys/F-row (function layers required); wired only
- Tier: Enthusiast
- Best for: precision-focused competitive gamers wanting maximum input responsiveness in a compact 60% board

Corsair K65 Plus Wireless — 75% / Hall-effect MGX magnetic switches (adjustable actuation) / Wireless (2.4GHz Slipstream + Bluetooth) or wired USB-C / Per-key RGB / Double-shot PBT keycaps / Up to 8000Hz polling (wired) / Corsair iCUE
- Brings adjustable-actuation hall-effect switches to a wireless 75% board — unique combination in this category; Corsair iCUE integration; PBT keycaps stock
- No hot-swap; premium price for the wireless + hall-effect combination
- Tier: Enthusiast
- Best for: competitive gamers wanting hall-effect precision without giving up wireless convenience

Wooting Two HE ⭐ — 80% TKL / Hall-effect Lekker switches (adjustable actuation + rapid trigger, hot-swappable) / Wired USB-C / Per-key RGB / PBT keycaps / Wootility software
- Brings the 60HE's analog precision and rapid trigger to an 80% layout with dedicated arrow keys and function row
- Hot-swappable Lekker switches; dedicated arrow keys and F-row solve the 60HE's main layout limitation; wired only
- Tier: Flagship
- Best for: competitive precision gamers wanting Wooting's full hall-effect capability in a complete TKL layout

Hall-effect comparison:
- Most compact + rapid trigger → Wooting 60HE
- Complete layout + rapid trigger → Wooting Two HE
- Established brand + OLED → SteelSeries Apex Pro
- Hall-effect + wireless → Corsair K65 Plus Wireless

Rapid trigger note: competitive communities (especially CS2, Valorant, Rocket League) report rapid trigger as one of the more meaningful real-world competitive upgrades available in peripherals. Worth considering if you play at a high level in these titles.`,
    metadata: { category: 'products', topic: 'keyboards-hall-effect' },
  },

  // ── Keyboards: Flagship ───────────────────────────────────────────────────
  {
    content: `Gaming Keyboards — Flagship Tier:

Logitech G915 ⭐ — Full-size or TKL / Low-profile Logitech GL Linear/Tactile/Clicky switches / 2.4GHz Lightspeed wireless + Bluetooth / Per-key RGB / Aircraft-grade aluminum body / Long battery life / Logitech G HUB
- Slim low-profile switch design in a premium aluminum chassis; reliable Lightspeed 2.4GHz wireless; long battery life
- Low-profile keycap feel is different from standard-height mechanical — try before buying if possible; not hot-swappable
- Best for: flagship gaming and productivity buyers wanting a premium slim wireless keyboard

Razer Huntsman V3 Pro ⭐ — Full-size or TKL / Analog Optical switches (adjustable 0.1mm-4.0mm actuation) / Wired USB-C detachable / Per-key RGB / Up to 8000Hz polling (HyperPolling) / Double-shot PBT keycaps / Razer Synapse
- Optical switch technology with adjustable actuation points per key, combining optical speed with hall-effect-like precision; 8000Hz HyperPolling support; PBT keycaps stock
- Wired only; not hot-swappable
- Best for: competitive gamers wanting Razer's flagship optical switch precision and the highest polling rate in the Razer ecosystem

Corsair K100 RGB ⭐ — Full-size / Cherry MX Speed or Corsair OPX Optical-Mechanical / Wired USB / Per-key RGB / iCUE control wheel / Up to 8000Hz polling (AXON) / CNC-machined aluminum body / Double-shot PBT keycaps / Corsair iCUE
- Corsair's most feature-complete keyboard: iCUE control wheel for quick volume/lighting/macro adjustments; 8000Hz polling; premium construction; PBT keycaps; Cherry MX or Optical-Mechanical switch options
- Wired only; not hot-swappable
- Best for: flagship Corsair ecosystem buyers wanting maximum features in a single keyboard

ASUS ROG Azoth ⭐⭐ Community Favorite — 75% / ROG NX switches (hot-swappable 5-pin) / 2.4GHz wireless + Bluetooth + wired USB-C / Per-key RGB / Gasket-mount / OLED display / Double-shot PBT keycaps / Includes switch puller, keycap puller, and lubricant kit / ASUS Armoury Crate
- The most comprehensive premium keyboard package available: gasket-mount typing feel, hot-swappable switches, OLED display, tri-mode wireless/Bluetooth/wired connectivity, and an enthusiast accessory kit included in the box
- Very high price reflects the full feature set
- Best for: enthusiasts wanting the most complete premium custom-style keyboard experience combined with wireless flexibility — essentially a gasket-mount hot-swap board plus wireless in a single package

Flagship summary:
- Best premium slim wireless → Logitech G915
- Most features in one keyboard → ASUS ROG Azoth
- Best Corsair flagship + iCUE wheel → Corsair K100 RGB
- Best Razer optical precision → Razer Huntsman V3 Pro`,
    metadata: { category: 'products', topic: 'keyboards-flagship' },
  },

  // ── Headsets: Buying Guide ────────────────────────────────────────────────
  {
    content: `Gaming Headset Buying Guide:

Wired vs. Wireless:
- Wired: zero latency, no charging, cheaper for the same sound quality, safest for competitive gaming and tight budgets; connects via 3.5mm or USB
- Wireless (2.4GHz): extremely low latency (practically imperceptible for gaming), cable-free freedom, requires charging — costs more for equivalent audio quality; most gaming wireless uses a proprietary 2.4GHz dongle, NOT Bluetooth
- Bluetooth: broad device compatibility but adds noticeable latency (50-200ms); suitable for music/voice calls but NOT recommended for latency-sensitive gaming
- Bottom line: for competitive play, wired or 2.4GHz wireless are both fine; Bluetooth is not

Closed-back vs. Open-back:
- Closed-back: sealed earcups block external noise and contain sound; ideal for shared rooms, streaming with open mics, competitive focus; the vast majority of gaming headsets are closed-back
- Open-back: air (and sound) passes through the earcups; produces a wider, more natural soundstage and reduced ear fatigue; sound leaks out — unsuitable for shared spaces, streaming with sensitive mics nearby; favored by audiophile/immersive-gaming enthusiasts in private spaces

Microphone quality — most overlooked spec:
- Headset mics are secondary in manufacturer engineering priority; even flagship headsets often have mediocre mics versus a dedicated USB microphone
- Detachable/replaceable boom mics generally outperform fixed/retractable designs
- Cardioid/supercardioid pickup patterns reject more background noise than omnidirectional
- If streaming or voice chat quality matters to you: pair a mid-tier headset with a separate USB microphone rather than expecting a headset mic to match a standalone mic

Virtual surround sound reality:
- "7.1 surround" on gaming headsets is virtual DSP — there are no physical 7.1 drivers, just stereo driver pairs with DSP processing
- Quality varies enormously; some implementations improve competitive positional audio (footsteps, gunshots); others muddy the stereo image
- Many competitive players prefer quality stereo + EQ over virtual surround for the most precise cues
- This is a feature worth reading reviews on, not assuming based on marketing channel count

Comfort for long sessions:
- Clamping force and weight distribution matter more than almost any other spec for sessions over an hour
- Memory foam + breathable fabric pads manage heat better than pure leatherette/pleather; pleather isolates sound slightly better
- Headsets marketed toward all-day comfort typically use wider padded headbands and lighter builds
- Comfort is highly individual — try in person or rely on detailed review sources

Platform compatibility:
- Wired 3.5mm TRRS: universal across PC, all consoles, mobile
- USB wired: PC and consoles with USB host support; no mobile without adapters
- 2.4GHz wireless dongles: often platform-specific — a PC-optimized dongle may not work on PlayStation or Xbox; always verify before buying a wireless headset for console use
- Bluetooth: works on everything but not suitable for gaming due to latency`,
    metadata: { category: 'products', topic: 'headsets-buying-guide' },
  },

  // ── Headsets: Entry Wired ─────────────────────────────────────────────────
  {
    content: `Gaming Headsets — Entry Tier (Wired):
All connect via 3.5mm TRRS; universal platform compatibility; budget-friendly sound basics.

HyperX Cloud Stinger 2 — 50mm / ~275g / Wired 3.5mm / Swivel-to-mute boom mic (fixed, non-detachable)
- Lightweight, comfortable build; HyperX's signature padded headband; DTS Headphone:X software on PC
- Mic note: swivel-to-mute is convenient but mic is not detachable
- Best for: first-time headset buyers wanting reliable basics at the lowest practical price

Logitech G335 — 40mm / ~240g / Wired 3.5mm / Detachable flip-to-mute boom mic
- Exceptionally lightweight (~240g); detachable mic is unusual at entry price; balanced sound tuning
- No virtual surround; basic Logitech G HUB support (limited for this model)
- Best for: budget buyers specifically wanting a detachable mic and ultra-light weight

Razer Kraken X — 40mm / ~250g / Wired 3.5mm / Fixed bendable cardioid boom mic (not detachable)
- Ultra-light build; Razer 7.1 virtual surround software available on PC (PC-only feature)
- Mic is not detachable; thin earpads relative to competitors
- Best for: PC gamers wanting virtual surround software + Razer branding on the cheapest budget

Corsair HS55 Stereo — 50mm / ~265g / Wired 3.5mm / Detachable omnidirectional noise-cancelling mic
- Memory foam earpads for comfort; aluminum-reinforced headband more durable than all-plastic alternatives
- No surround sound; stereo only
- Best for: budget buyers prioritizing long-session comfort and a detachable mic over features

JBL Quantum 100 — 40mm / ~220g / Wired 3.5mm / Detachable flip-up boom mic
- Lightest in the entry tier at ~220g; JBL's consumer audio tuning gives an accessible punchy sound signature
- Basic build materials; no software features
- Best for: budget buyers who want a consumer-audio-flavored sound at the lowest price

Entry tier summary: all are valid. G335 and Quantum 100 stand out for detachable mics + lightweight builds. Cloud Stinger 2 and HS55 stand out for comfort. Kraken X is the pick if you want PC virtual surround.`,
    metadata: { category: 'products', topic: 'headsets-entry-wired' },
  },

  // ── Headsets: Budget Wired ────────────────────────────────────────────────
  {
    content: `Gaming Headsets — Budget Tier (Wired):

Razer Kraken V3 — 50mm / ~370g / Wired USB-A / Detachable cardioid boom mic / Razer Chroma RGB
- Built-in THX Spatial Audio via USB DAC (no separate software required to activate); Chroma RGB lighting
- Heavier than most budget headsets; USB-only limits Xbox/Switch compatibility
- Best for: PC and PlayStation buyers wanting RGB and built-in spatial audio processing at a budget price

Corsair HS65 Surround — 50mm / ~290g / Wired 3.5mm or USB / Detachable omnidirectional NC mic / Memory foam pads
- Includes a Dolby Atmos for Headphones license (unusual at this price tier) — activated via USB mode + Corsair iCUE
- Broad platform compatibility via 3.5mm; comfortable memory foam pads
- Best for: budget buyers who want Dolby Atmos support without paying extra for it; particularly good value

Turtle Beach Recon 200 — 50mm / ~280g / Wired 3.5mm / Flip-to-mute non-detachable mic
- Superhuman Hearing EQ preset boosts high-frequency directional cues (footsteps, reloading sounds) — genuinely popular with console shooter players
- Fixed mic; basic plastic build
- Best for: console shooter players wanting enhanced competitive audio cues without spending much

Budget wired tier summary:
- RGB + built-in spatial audio → Kraken V3 (PC/PS only)
- Bundled Dolby Atmos at a low price → HS65 Surround
- Console shooter competitive audio → Recon 200`,
    metadata: { category: 'products', topic: 'headsets-budget-wired' },
  },

  // ── Headsets: Budget Wireless ─────────────────────────────────────────────
  {
    content: `Gaming Headsets — Budget Tier (Wireless):
Budget wireless uses 2.4GHz dongles for low-latency gaming; Bluetooth avoided for gaming due to latency.

HyperX Cloud Stinger Wireless — 50mm / ~290g / 2.4GHz USB-A dongle / Swivel-to-mute fixed boom mic / Up to 17h battery
- Platforms: PC, PlayStation (NOT Xbox — no official dongle support)
- DTS Headphone:X via optional software; comfortable lightweight build
- Best for: budget PC or PlayStation buyers wanting cable-free convenience at the lowest wireless price

Logitech G435 Lightspeed ⭐ — 40mm / ~165g / 2.4GHz Lightspeed + Bluetooth (simultaneous) / Built-in beamforming mic array (no boom) / Up to 18h battery
- Platforms: PC, PlayStation, Nintendo Switch, Mobile via Bluetooth (NOT officially Xbox)
- Exceptionally lightweight (~165g) — lightest wireless gaming headset in its class; partly made from recycled materials
- No boom mic — uses a built-in mic array; lower voice isolation than a boom design
- Dual wireless (Lightspeed + Bluetooth simultaneously) unusual at this price
- Best for: budget buyers wanting the lightest possible wireless headset with phone Bluetooth flexibility

SteelSeries Arctis 1 Wireless ⭐ — 40mm / ~274g / 2.4GHz USB-C dongle / Detachable ClearCast bidirectional boom mic / Up to 20h battery
- Platforms: PC, PlayStation, Nintendo Switch, Android (NOT officially Xbox)
- USB-C dongle works with Switch and Android devices directly — the broadest multiplatform wireless in this tier
- ClearCast bidirectional mic is meaningfully above average for budget wireless
- Best for: multiplatform gamers (PC + PlayStation + Switch) wanting a single wireless headset

Budget wireless tier summary:
- Cheapest wireless (PC/PS) → Cloud Stinger Wireless
- Lightest wireless + Bluetooth → G435 Lightspeed
- Best multiplatform wireless (PC/PS/Switch) → Arctis 1 Wireless`,
    metadata: { category: 'products', topic: 'headsets-budget-wireless' },
  },

  // ── Headsets: Mid-Range Wired ─────────────────────────────────────────────
  {
    content: `Gaming Headsets — Mid-Range (Wired):

SteelSeries Arctis Nova 1 ⭐ — 40mm Hi-Res certified / ~310g / Wired 3.5mm (+USB-C DAC option) / Detachable ClearCast Gen 2 bidirectional mic / AirWeave fabric pads
- Hi-Res Audio certification is uncommon at this price tier; AirWeave pads stay cooler over long sessions
- Sonar software spatial audio unlockable via the USB-C dongle (PC-only)
- Broad platform compatibility via 3.5mm; no wireless on this model
- Best for: mid-range buyers wanting certified Hi-Res sound quality in a wired package

Razer BlackShark V2 ⭐⭐ Community Favorite — 50mm TriForce titanium-coated / ~262g / Wired 3.5mm (+bundled USB-C DAC) / Detachable HyperClear cardioid boom mic
- Widely used and trusted in professional esports; titanium-coated drivers produce crisp, detailed highs
- Bundled USB-C DAC enables THX Spatial Audio on PC; 3.5mm works cross-platform
- Best for: competitive/esports-oriented gamers wanting a proven mid-range wired headset; a top recommendation at this tier

HyperX Cloud Alpha ⭐⭐ Community Favorite — 50mm dual-chamber / ~298g / Wired 3.5mm / Detachable noise-cancelling boom mic / Aluminum frame
- Dual-chamber driver design separates bass from mid/highs for clearer, more separated sound — a design advantage audible vs. single-chamber at this tier
- Long product track record and durable aluminum build; extremely broad platform compatibility
- No surround sound on the base model; wireless version exists (see Enthusiast tier)
- Best for: mid-range buyers wanting proven, durable dual-chamber sound quality across any platform; a long-standing benchmark

EPOS H3 — 40mm neodymium / ~297g / Wired 3.5mm / Detachable unidirectional boom mic / Metal-reinforced build
- Built on Sennheiser audio engineering heritage; praised for accurate, natural sound tuning uncommon in gaming-marketed headsets at this price
- Less bass emphasis than competitors — may underwhelm bass-focused listeners; no virtual surround
- Best for: mid-range buyers who value natural, accurate sound tuning over bass-boosted gaming signatures

Mid-range wired summary:
- Top esports pick → Razer BlackShark V2
- Most natural/accurate tuning → EPOS H3
- Best dual-chamber clarity + durability → HyperX Cloud Alpha
- Best Hi-Res value → SteelSeries Arctis Nova 1`,
    metadata: { category: 'products', topic: 'headsets-midrange-wired' },
  },

  // ── Headsets: Mid-Range Wireless ──────────────────────────────────────────
  {
    content: `Gaming Headsets — Mid-Range (Wireless):

Corsair HS80 RGB Wireless ⭐ — 50mm neodymium / ~368g / 2.4GHz USB-A / Fixed broadcast-quality omnidirectional mic / Up to 20h battery / Dolby Atmos license included
- Platforms: PC, PlayStation (NOT Xbox wirelessly)
- Broadcast-quality fixed microphone is the standout feature at this tier — above average for any gaming headset mic
- Breathable memory foam + fabric pads manage heat well; Dolby Atmos license adds value; Hi-Res capable in wired mode
- Heavier than competitors in this tier
- Best for: mid-range buyers who talk frequently in voice chat and want the strongest built-in mic quality + Dolby Atmos

Logitech G535 Lightspeed — 40mm graphene / ~236g / 2.4GHz Lightspeed USB-A / Detachable flip-to-mute mic with Blue Voice filtering / Up to 33h battery
- Platforms: PC, PlayStation (NOT Xbox wirelessly)
- Very lightweight for a wireless headset with a detachable mic; class-leading 33-hour battery
- Blue Voice software meaningfully improves mic clarity (PC-only); graphene driver tuning favors clarity over deep bass
- Best for: PC or PlayStation mid-range buyers wanting long battery life and Blue Voice mic clarity in a lightweight wireless package

Turtle Beach Stealth 600 Gen 2 — 50mm / ~305g / 2.4GHz USB-A / Flip-to-mute detachable mic / Up to 15h battery (80h on MAX variant with battery pack)
- Platforms: PlayStation, Xbox, PC, Nintendo Switch (platform-specific dongle variants sold separately for console)
- Superhuman Hearing mode popular for competitive console shooting; swappable fabric/leatherette ear cushion styles
- Console-specific variants — Xbox and PlayStation versions are sold as separate SKUs, not a single cross-platform unit
- Best for: console gamers wanting reliable wireless with a competitive-focused EQ preset; a top console wireless pick

Mid-range wireless summary:
- Best mic quality + Dolby Atmos (PC/PS) → Corsair HS80 RGB Wireless
- Longest battery + lightest + Blue Voice (PC/PS) → Logitech G535 Lightspeed
- Best console wireless across PS/Xbox/Switch → Turtle Beach Stealth 600 Gen 2`,
    metadata: { category: 'products', topic: 'headsets-midrange-wireless' },
  },

  // ── Headsets: Enthusiast ──────────────────────────────────────────────────
  {
    content: `Gaming Headsets — Enthusiast Tier:

Razer BlackShark V2 Pro ⭐ — 50mm TriForce titanium / ~320g / 2.4GHz HyperSpeed + Bluetooth / Detachable HyperClear supercardioid mic / Up to 70h battery
- Platforms: PC, PlayStation, Mobile (Bluetooth); NOT officially Xbox wirelessly
- Wireless version of the trusted esports BlackShark V2; dual 2.4GHz + Bluetooth; 70-hour battery is outstanding
- THX Spatial Audio via Razer Synapse on PC
- Best for: competitive players wanting wireless freedom without sacrificing the proven BlackShark sound signature

Logitech G Pro X 2 Lightspeed ⭐ — 40mm graphene / ~320g / 2.4GHz Lightspeed + wired USB-C/3.5mm / Detachable Blue VO!CE mic / Up to 50h battery
- Platforms: PC, PlayStation wirelessly; Xbox/Switch wired only
- Developed with pro esports input; graphene drivers tuned for clarity and low distortion; Blue VO!CE processing is among the best headset mic software available (PC-only)
- Best for: enthusiasts and competitive players wanting a flagship-tier Logitech wireless headset with best-in-class mic processing

Corsair Virtuoso RGB Wireless XT — 50mm high-density neodymium / ~355g / 2.4GHz + Bluetooth + 3.5mm wired (tri-mode) / Detachable broadcast-quality omnidirectional mic / Up to 20h battery / Dolby Atmos license
- Platforms: PC, PlayStation, Mobile (Bluetooth), Xbox (wired); NOT Xbox wirelessly
- Aircraft-grade aluminum frame; Hi-Res certified in wired mode; tri-mode connectivity covers nearly every scenario
- Heaviest in this tier; battery life trails competitors
- Best for: enthusiasts wanting premium build quality and maximum connectivity flexibility in one package

ASTRO A40 TR + MixAmp Pro TR ⭐ — 40mm / ~328g (headset only) / Wired + external MixAmp Pro TR box / Detachable modular boom mic / Dolby Audio via MixAmp
- Platforms: PC, PlayStation, Xbox
- Long-standing esports broadcast standard; fully modular design — individual worn parts can be replaced instead of the whole headset; MixAmp Pro provides precise game/chat mix control via a physical dial
- Requires the external MixAmp box (desk space); no wireless in this configuration
- Best for: enthusiasts and broadcast/production users wanting a modular, highly serviceable headset with external mix control

Audio-Technica ATH-G1WL — 45mm / ~320g / 2.4GHz USB-A / Detachable flexible boom mic / Up to 15h battery
- Platforms: PC, PlayStation (NOT Xbox/Switch)
- Audiophile-grade driver tuning (wide 5Hz-40kHz response); accurate, detailed sound rather than exaggerated bass-heavy signatures; short battery life for the tier
- Best for: enthusiasts prioritizing accurate, audiophile-adjacent sound tuning and low-latency wireless

HyperX Cloud Alpha Wireless ⭐ — 50mm dual-chamber / ~335g / 2.4GHz USB-A / Detachable noise-cancelling boom mic / Up to 300h battery
- Platforms: PC, PlayStation (NOT Xbox wirelessly)
- Brings the acclaimed dual-chamber Cloud Alpha sound signature into wireless; the 300-hour battery life is class-leading by a massive margin — nearly eliminates the need to think about charging
- DTS Headphone:X software on PC
- Best for: enthusiasts who want to almost never think about charging their wireless headset`,
    metadata: { category: 'products', topic: 'headsets-enthusiast' },
  },

  // ── Headsets: Flagship ────────────────────────────────────────────────────
  {
    content: `Gaming Headsets — Flagship Tier:

SteelSeries Arctis Nova Pro Wireless ⭐⭐ Community Benchmark — 40mm Hi-Res certified / ~337g / 2.4GHz via base station + Bluetooth simultaneously / Detachable ClearCast Gen 2 mic + ANC / Up to 44h (dual hot-swap batteries) / Base station with display
- Platforms: PC, PlayStation, Mobile (Bluetooth); separate Xbox SKU sold as the Nova Pro Wireless X
- Dual hot-swappable batteries effectively eliminate charging downtime; base station screen enables on-the-fly mixing; active noise cancellation on headset and mic; Hi-Res Audio certified
- Requires desk space for the base station
- Best for: the most feature-complete flagship wireless headset on the market; the community benchmark at this tier

ASTRO A50 X — 40mm / ~356g / 2.4GHz via base station (dual simultaneous platform connections) / Detachable boom mic / Up to 15h battery / Dolby Atmos via base station
- Platforms: PC, PlayStation, Xbox
- Simultaneous dual-platform wireless connection with instant switching is the standout flagship feature — connects to e.g. PC and Xbox at the same time and switches between them instantly
- Shorter battery life than other flagship competitors; requires desk space for base station
- Best for: flag buyers who regularly switch between PC and console and want seamless dual-platform wireless audio

EPOS GSP 670 ⭐ — Closed acoustic dynamic drivers / ~397g / 2.4GHz + Bluetooth / Flip-to-mute electret condenser boom mic / Up to 20h battery
- Platforms: PC, PlayStation, Mobile (Bluetooth); NOT Xbox wirelessly
- Sennheiser-heritage acoustic tuning; adjustable clamping force dial (a distinctive comfort feature); broadcast-quality condenser mic is among the best built into any gaming headset
- Heaviest flagship option
- Best for: flag buyers prioritizing natural, accurate sound tuning and top-tier built-in microphone quality

Beyerdynamic MMX 300 2nd Gen — Beyerdynamic studio-derived dynamic drivers / ~350g / Wired 3.5mm / Detachable condenser boom mic
- Handcrafted in Germany with replaceable parts; studio-derived drivers from Beyerdynamic's professional headphone line; condenser mic outperforms most dynamic gaming headset mics; no surround by design
- No wireless; the most audiophile-adjacent wired flagship in the lineup
- Best for: audiophile-minded flagship buyers wanting studio-grade clarity in a wired gaming headset

Audio-Technica ATH-ADG1X (Open-Back) — 45mm open-air / ~320g / Wired 3.5mm / Detachable flexible boom mic
- Platforms: PC, PlayStation, Xbox
- Open-back design; one of the widest, most natural soundstages available in any gaming headset; excellent for immersive atmospheric single-player games
- Sound leaks out in both directions — unsuitable for shared spaces, streaming with sensitive mics, or noise isolation needs
- Best for: flagship buyers wanting maximum immersive soundstage for single-player and atmospheric games in a quiet private space

Sennheiser PC38X ⭐ (Open-Back) — 38mm open-back neodymium / ~288g / Wired 3.5mm / Detachable noise-cancelling boom mic
- Platforms: PC, PlayStation, Xbox
- Co-developed with Drop; derived from the acclaimed Sennheiser HD 58X audiophile headphone platform; lightweight (~288g) for a flagship; natural spatial cues from open-back acoustic design
- No wireless; open-back leaks sound
- Widely regarded by enthusiasts as exceptional value within the open-back audiophile-gaming crossover niche
- Best for: flagship buyers wanting audiophile-grade open-back sound at a comparatively accessible flagship price

Flagship summary:
- Best all-around wireless + features → Arctis Nova Pro Wireless
- Multi-platform simultaneous switching → ASTRO A50 X
- Best built-in mic + accurate tuning → EPOS GSP 670
- Best wired audiophile clarity → Beyerdynamic MMX 300
- Best open-back soundstage (immersive) → Audio-Technica ATH-ADG1X or Sennheiser PC38X`,
    metadata: { category: 'products', topic: 'headsets-flagship' },
  },

  // ── HDDs: Buying Guide ────────────────────────────────────────────────────
  {
    content: `HDD Buying Guide for Gaming PCs (2026):

Role of HDDs in a modern gaming build:
HDDs are NOT recommended as a boot/OS drive or primary game install drive — any SSD, even a budget SATA SSD, is dramatically faster for load times and OS responsiveness. HDDs remain useful only as secondary bulk storage:
- Inactive game library (games you don't play often enough to need fast load times)
- Media libraries (videos, photos, music)
- Backups
- Home NAS / media server storage

SSD prices continue to fall, narrowing the cost gap. For builds with limited SATA power ports or case bays, a single larger SSD often makes more sense than adding a secondary HDD.

CMR vs SMR — critical for NAS/RAID use:
- CMR (Conventional Magnetic Recording): writes in non-overlapping tracks; consistent performance; safe for NAS/RAID rebuilds; what you want for any multi-bay or sustained-write workload
- SMR (Shingled Magnetic Recording): overlaps tracks for higher density at lower cost; poor on sustained random writes; can cause RAID array rebuilds to fail or take excessively long
- A 2020 industry controversy: several manufacturers sold SMR drives in NAS-labeled lines without disclosure. Since then, reputable NAS lines (WD Red Plus/Pro, Seagate IronWolf/Pro) explicitly confirm CMR — but always verify the specific capacity/SKU on the manufacturer's site before buying for NAS/RAID use
- Desktop-class drives (WD Blue, Seagate BarraCuda) may use SMR in certain capacities — check before using in a NAS/RAID

Official console "Game Drive" licensing:
Xbox and PlayStation officially license certain external drives (WD_BLACK P10, Seagate Game Drive lines). This primarily reflects marketing partnership and compatibility testing, not meaningful performance differences.
Key technical reality for current-gen consoles:
- Xbox Series X|S: native Xbox Series titles cannot be played directly from an external HDD; they must be transferred to internal or expansion SSD storage to run. External HDDs serve as storage/holding space only for current-gen titles.
- PS5: native PS5 titles cannot be played from an external HDD; only PS4 backward-compatible titles run directly. PS5 games require the internal NVMe slot expansion.
- PC: games can run directly from an external HDD (with slow load times)

NAS drive tiers:
- Desktop-class (WD Blue, Seagate BarraCuda): NOT rated for 24/7 multi-bay operation; avoid in NAS/RAID arrays
- Mainstream NAS (WD Red Plus, Seagate IronWolf): CMR-confirmed, 24/7-rated for up to 8 bays; correct choice for most home NAS builds
- Pro NAS (WD Red Pro, Seagate IronWolf Pro): higher workload rating, 24-bay support, 5-year warranty; for larger multi-bay or business-adjacent builds
- Enterprise (Seagate Exos, WD Gold): highest workload ratings, best cost-per-TB at large capacities; popular among enthusiasts building large home-lab NAS setups; support/RMA channel is enterprise-focused

Common mistakes:
- Using an HDD as a boot drive in 2026 — slow load times, SSDs are affordable
- Buying a desktop-class drive for a NAS/RAID without checking CMR/SMR status
- Expecting to play current-gen Xbox Series X|S or native PS5 titles directly from an external HDD`,
    metadata: { category: 'products', topic: 'hdds-buying-guide' },
  },

  // ── HDDs: Desktop Internal ────────────────────────────────────────────────
  {
    content: `HDDs — Desktop Internal (3.5-inch SATA, Secondary Bulk Storage):

WD Blue ⭐ — 3.5" / SATA III / CMR / 5400-7200 RPM / 64-256MB cache
Capacities: 500GB, 1TB, 2TB, 3TB, 4TB, 6TB / Warranty: 2 years
- Western Digital's mainstream desktop drive; lowest cost-per-GB for internal bulk storage
- The default budget secondary storage recommendation for a gaming PC that already has an SSD as its primary drive
- Rated workload: 55TB/year guideline; NOT for 24/7 NAS/RAID use
- Best for: inactive game library, media collection, backups in a gaming PC

Seagate BarraCuda — 3.5" (2.5" at lower caps) / SATA III / CMR (most capacities; verify SKU) / 5400-7200 RPM / 256MB cache
Capacities: 500GB, 1TB, 2TB, 4TB, 6TB, 8TB / Warranty: 1-2 years
- Seagate's mainstream desktop drive; comparable value to WD Blue
- Some higher-capacity revisions have used SMR — verify the specific capacity/SKU on Seagate's site before buying for NAS/RAID use
- NOT rated for 24/7 NAS/RAID workloads
- Best for: budget secondary bulk storage in a gaming PC

WD_BLACK (Performance HDD) — 3.5" / SATA III / CMR / 7200 RPM (consistent) / 64-256MB cache
Capacities: 500GB, 1TB, 2TB, 4TB, 6TB / Warranty: 5 years
- Western Digital's performance desktop drive; consistent 7200 RPM and a 5-year warranty distinguish it from WD Blue
- Pays a premium for marginal real-world speed improvement over WD Blue — still dramatically slower than any SSD
- Best for: users who specifically want the fastest practical mechanical secondary drive and the longer 5-year warranty
- Skip if budget-constrained — WD Blue offers most of the practical benefit for less

Usage note for all 3.5" desktop HDDs:
- Requires a 3.5-inch drive bay, a SATA data cable, and a SATA power connector from the PSU
- Compact cases (SFF, ITX) may have limited or no 3.5-inch bay support — verify before buying
- None of these are recommended as a boot or primary game drive; add alongside an SSD`,
    metadata: { category: 'products', topic: 'hdds-desktop-internal' },
  },

  // ── HDDs: Portable, External & Console Game Drives ───────────────────────
  {
    content: `HDDs — Portable External & Console Game Drives:

Budget No-Frills Portables (USB 3.0, 2.5-inch, bus-powered):

WD Elements Portable — 1TB-5TB / CMR / USB 3.0 / 2 years
- Cheapest external storage; no bundled software; not officially console-licensed; plain plug-and-play
- Best for: budget external backup or cold storage for a PC game library

Seagate Portable Drive (also called Seagate Expansion Portable) — 1TB-5TB / CMR / USB 3.0 / 1-2 years
- Same tier as WD Elements; equally low cost; no console licensing; minimal software
- Best for: budget external backup or cold storage

WD My Passport — 1TB-5TB / CMR / USB 3.0 / 3 years
- Adds WD Backup software and hardware encryption/password protection over the Elements
- Longer 3-year warranty; no official console licensing
- Best for: users wanting bundled backup software alongside external storage

---
Gaming / Console-Licensed Portable Drives:

WD_BLACK P10 Game Drive ⭐ — 2TB-5TB / CMR / USB 3.2 Gen 1 / 3 years
Platforms: Xbox One, Xbox Series X|S, PS4, PS5, PC
- Top pick for portable gaming external storage; broadest cross-platform compatibility; gaming-oriented design; 3-year warranty
- Xbox Series X|S note: current-gen titles must be transferred to internal/expansion SSD storage to play — the P10 serves as a storage vault
- Best for: expanding a large console or PC game library on a budget

Seagate Game Drive for Xbox — 2TB-5TB / CMR / USB 3.0 / 2 years
Platforms: Xbox One, Xbox Series X|S, PC
- Officially Xbox-licensed with Xbox branding; simple plug-and-play on Xbox; same current-gen limitation applies (next-gen titles can't run directly from it)
- Best for: Xbox owners who specifically want official Xbox branding; similar function to the P10

Seagate Game Drive for PS5/PS4 — 2TB-5TB / CMR / USB 3.0 / 2 years
Platforms: PS4 (direct play), PS5 (PS4 titles playable directly; PS5 titles require transfer to internal SSD to play)
- Officially PlayStation-licensed; can run PS4 backward-compatible titles directly on a PS5
- PS5 native titles: store only — must transfer to internal NVMe expansion to run
- Best for: PlayStation owners expanding their PS4 backward-compatible library; budget PS5 game storage

---
Desktop External Drive (AC-powered, high capacity):

WD_BLACK D10 Game Drive ⭐ — 6TB-12TB / CMR / USB 3.2 Gen 1 / 3 years / 7200 RPM / Built-in cooling fan
Platforms: Xbox One, Xbox Series X|S, PC
- Desktop enclosure with active cooling fan for sustained transfers; 7200 RPM; high capacity up to 12TB
- Requires external power (AC adapter) — not bus-powered
- Xbox Series X|S: same limitation as P10 (next-gen titles must be moved to SSD to play)
- Best for: large PC or Xbox game libraries needing high-capacity external storage

External HDD speed note: all mechanical drives top out around 150-180 MB/s regardless of USB version — USB 3.0 is never the bottleneck for an HDD`,
    metadata: { category: 'products', topic: 'hdds-portable-console-external' },
  },

  // ── HDDs: NAS & Enterprise ────────────────────────────────────────────────
  {
    content: `HDDs — NAS & Enterprise Drives (for Home Servers, RAID, Large Storage):

Mainstream NAS (up to 8-bay, 24/7-rated, CMR, 3-year warranty):

WD Red Plus ⭐ — 1TB-14TB / CMR (explicitly confirmed post-2020) / SATA III / 5400-7200 RPM / 24/7-rated / 8-bay max / 3 years
- Western Digital's mainstream NAS drive; CMR explicitly confirmed after the 2020 undisclosed-SMR industry controversy
- Rated for 24/7 continuous operation and multi-drive NAS enclosures
- Best for: the default mainstream NAS drive recommendation for most home server builds

Seagate IronWolf ⭐ — 1TB-14TB / CMR / SATA III / 5400-7200 RPM / 24/7-rated / 8-bay max / 3 years
Includes: IronWolf Health Management monitoring software
- Seagate's mainstream NAS drive; adds IronWolf Health Management health monitoring via Seagate software
- Best for: home NAS/media server builds; the go-to Seagate NAS recommendation

Choosing between WD Red Plus and Seagate IronWolf: essentially equivalent in reliability tier; IronWolf adds health monitoring software; both explicitly CMR; pick based on price and preference.

---
Pro NAS (up to 24-bay, higher workload, 5-year warranty):

WD Red Pro — 2TB-22TB / CMR / SATA III / 7200 RPM / 24/7-rated / 24-bay max / 5 years
- Higher workload rating and larger bay-count support than WD Red Plus
- Best for: larger multi-bay NAS builds or heavier-workload home-lab systems needing higher endurance; overkill for a simple 2-4 bay home NAS

Seagate IronWolf Pro — 2TB-24TB / CMR / SATA III / 7200 RPM / 24/7-rated / 24-bay max / 5 years + 2-year Rescue Data Recovery Service
- Seagate's equivalent to WD Red Pro; adds a bundled 2-year data recovery service plan
- Available up to 24TB — highest capacity in Seagate's NAS lineup
- Best for: larger multi-bay NAS builds wanting the data recovery service coverage

---
Enterprise Drives (enthusiast home-lab repurposing, highest cost-per-TB value):

Seagate Exos 7E10 ⭐ — 2TB-10TB / CMR / SATA III or SAS / 7200 RPM / 550TB/year workload / 5 years
- Enterprise-grade reliability at often-excellent cost-per-TB; enthusiasts frequently choose these for large home-lab NAS builds
- No consumer health-monitoring software; enterprise/OEM support channel — read warranty terms carefully
- Best for: enthusiasts building large NAS systems prioritizing maximum cost-per-TB value

Seagate Exos X24 — 20TB-24TB / CMR / SATA III or SAS / 7200 RPM / helium-filled / 550TB/year workload / 5 years
- One of the highest-capacity 3.5-inch drives available; helium-filled for reduced internal friction/heat
- Best for: maximum capacity per drive bay in large-scale home-lab or enterprise builds

WD Gold — 1TB-22TB / CMR / SATA III or SAS / 7200 RPM / helium-filled at high capacities / 550TB/year workload / 5 years
- Western Digital's enterprise-grade equivalent to Seagate Exos X lineup
- Best for: large-scale home-lab NAS builds prioritizing enterprise-grade WD reliability

---
NAS drive selection summary:
- Small home NAS (1-8 bays): WD Red Plus or Seagate IronWolf
- Larger multi-bay NAS: WD Red Pro or Seagate IronWolf Pro
- Large home-lab, prioritizing cost-per-TB: Seagate Exos 7E10 or WD Gold
- Maximum capacity per bay: Seagate Exos X24

DO NOT use desktop-class drives (WD Blue, Seagate BarraCuda, WD_BLACK desktop) in multi-bay NAS/RAID arrays — they aren't rated for continuous multi-drive vibration and workload`,
    metadata: { category: 'products', topic: 'hdds-nas-enterprise' },
  },

  // ── GPUs: Buying Guide ────────────────────────────────────────────────────
  {
    content: `GPU Buying Guide:

Match GPU to resolution target:
- 1080p / 60-144Hz: Budget tier — RTX 4060, RX 7600, Arc B580
- 1080p / 144Hz+: Budget-to-Mid — RTX 4060 Ti, RX 7700 XT, Arc B580
- 1440p / 60-144Hz: Mid-Range — RTX 4070, RX 7800 XT
- 1440p / 144Hz+: Mid-to-Enthusiast — RTX 4070 Super, RX 7800 XT, RTX 5070
- 4K / 60Hz: Enthusiast — RTX 4070 Ti Super, RTX 4080 Super, RX 7900 XTX
- 4K / high refresh or path tracing: Flagship — RTX 4090, RTX 5090

VRAM guidance (as of 2026):
- 8GB: fine for 1080p, increasingly tight at 1440p+ in newer AAA titles with ray tracing
- 12GB: comfortable sweet spot for 1440p
- 16GB: recommended for 4K or future-proofing at 1440p
- 24-32GB: only needed for professional workloads or extreme future-proofing

Upscaling technologies:
- DLSS (NVIDIA RTX-only): AI-based, tensor core-accelerated; best image quality, especially at low render scales; DLSS 3+ adds Frame Generation; DLSS 4 adds Multi Frame Generation
- FSR (AMD, open standard, works on ALL GPUs): FSR 2/3 = temporal/spatial; FSR 4 = AI-accelerated (RDNA4 hardware preferred); FSR 3+ adds Frame Generation; usable on NVIDIA/Intel GPUs too
- XeSS (Intel): runs on all GPUs, but best on Intel Arc XMX hardware; XeSS 2 improved quality significantly
- Frame Generation (DLSS 3/4, FSR 3): inserts AI-interpolated frames — boosts displayed FPS but adds latency; works best above 60 base FPS, not a fix for low base frame rates

Ray tracing performance by tier:
- Entry/Budget: light RT effects at 1080p with upscaling enabled; demanding path tracing not viable
- Mid-Range: moderate RT at 1080p-1440p with DLSS/FSR; comfortable for most RT-enabled games
- Enthusiast: strong 1440p-4K RT with DLSS; capable of demanding path tracing scenes
- Flagship (RTX 4090/5090): the only cards for path tracing at 4K without heavy Frame Generation reliance

NVIDIA vs AMD vs Intel:
- NVIDIA: best ray tracing, most mature upscaling (DLSS), strongest software ecosystem (streaming, AI, pro apps), best resale value
- AMD: better raw rasterization value per dollar, often more VRAM at same tier, FSR works cross-platform; RDNA4 finally competitive in RT
- Intel Arc: best budget price-to-performance (B580), AV1 encode, smaller driver history (strong for modern DX12/Vulkan titles)

PSU and case:
- Always add headroom: GPU TDP + CPU + 20-30% buffer; flagship cards spike well beyond average TDP
- Flagship cards (RTX 4090/5090, RX 7900 XTX) use 12VHPWR/12V-2x6 connectors — fully seat them or use an ATX 3.0/3.1 native PSU
- Check case GPU length clearance — many flagship AIB coolers exceed 330-350mm and 3+ slots`,
    metadata: { category: 'products', topic: 'gpus-buying-guide' },
  },

  // ── GPUs: NVIDIA Pascal + Turing Legacy ──────────────────────────────────
  {
    content: `GPUs — NVIDIA Legacy (Pascal GTX 10-series + Turing GTX 16-series + RTX 20-series):

Pascal (16nm, PCIe 3.0, no ray tracing, no DLSS, 6th-gen NVENC H.264 only):
GTX 1050 Ti — 768 CUDA / 4GB GDDR5 / 128-bit / 75W / no power connector
- Entry esports: CS2, Valorant, League at medium-high; struggles with modern AAA; still useful for slot-powered prebuilt upgrades

GTX 1060 6GB ⭐ — 1280 CUDA / 6GB GDDR5 / 192-bit / 120W / 1x 6-pin
- Historically one of the best-selling GPUs ever; excellent budget 1080p rasterization for its era; no longer recommended for new builds

GTX 1070 — 1920 CUDA / 8GB GDDR5 / 256-bit / 150W / 1x 8-pin
- Landmark 1440p-capable card at launch; 8GB VRAM aided longevity; now superseded in value by modern budget cards

GTX 1080 — 2560 CUDA / 8GB GDDR5X / 256-bit / 180W / 1x 8-pin
- Generational performance leap at launch; capable 1440p performer; no RT/DLSS; dated for new purchases

GTX 1080 Ti ⭐ Legendary — 3584 CUDA / 11GB GDDR5X / 352-bit / 250W / 6-pin + 8-pin
- Widely regarded as one of the greatest flagship GPUs ever; 11GB VRAM aided years of relevance; still capable of 1080p/1440p gaming on the used market

Turing GTX 16-series (12nm, PCIe 3.0, no RT/DLSS, 7th-gen NVENC H.264 only):
GTX 1650 — 896 CUDA / 4GB GDDR5 / 128-bit / 75W / typically no connector
- Budget slot-powered option; popular for prebuilt upgrades; no RT or DLSS even though it's Turing architecture (lacks RT/Tensor cores)

GTX 1660 Super ⭐ — 1408 CUDA / 6GB GDDR6 / 192-bit / 125W / 1x 8-pin
- One of the best budget rasterization picks of its era; GDDR6 memory upgrade; no RT/DLSS; the better buy over the 1660 Ti in most situations

GTX 1660 Ti — 1536 CUDA / 6GB GDDR6 / 192-bit / 120W / 1x 8-pin
- Usually priced similarly to the 1660 Super with minimal performance advantage; 1660 Super is typically the smarter buy

Turing RTX 20-series (12nm, PCIe 3.0, 1st-gen RT cores, 1st-gen Tensor/DLSS, 7th-gen NVENC H.264 only):
RTX 2060 — 1920 CUDA / 6GB GDDR6 / 192-bit / 160W / 1x 8-pin
- First affordable RTX card; light 1080p ray tracing; early DLSS (1.x/2.x, no Frame Generation); only 6GB VRAM is limiting now
Note: A 12GB GA104 variant was released in 2021 under the same RTX 2060 name — different specs entirely.

RTX 2070 Super — 2560 CUDA / 8GB GDDR6 / 256-bit / 215W / 8-pin + 6-pin
- Near-2080 performance; solid 1440p RT for its era; 8GB; first-gen RT cores trail current-gen significantly

RTX 2080 Ti — 4352 CUDA / 11GB GDDR6 / 352-bit / 250W / 2x 8-pin
- Pioneered consumer RT + DLSS; strong 1440p/4K for years; first-gen RT now well behind current equivalents; very high launch price

All legacy NVIDIA cards:
- Do NOT support DLSS Frame Generation (requires Ada Lovelace RTX 40-series or newer)
- Do NOT support AV1 encoding (requires Ada or newer)
- Recommended for reusing existing hardware only — not ideal for new builds today`,
    metadata: { category: 'products', topic: 'gpus-nvidia-pascal-turing-legacy' },
  },

  // ── GPUs: NVIDIA Ampere (RTX 30 Series) ──────────────────────────────────
  {
    content: `GPUs — NVIDIA Ampere (RTX 30 Series, Samsung 8nm, PCIe 4.0, 2nd-gen RT, DLSS 2, 7th-gen NVENC H.264 only):
Ampere brought a massive 2x+ performance leap over Turing and introduced DLSS 2 (major quality improvement) and 2nd-gen RT cores. No AV1 encode, no Frame Generation (those require Ada/RTX 40-series).

RTX 3050 — 2560 CUDA / 8GB GDDR6 / 128-bit / 130W / 1x 8-pin
- Cheapest Ampere; entry-level DLSS 2; narrow 128-bit bus limits bandwidth-sensitive performance; often priced close to more capable AMD/Intel alternatives — not always the best value

RTX 3060 ⭐ One of the Most Popular GPUs Ever — 3584 CUDA / 12GB GDDR6 / 192-bit / 170W / 1x 8-pin
- Unusually generous 12GB VRAM for a budget card gave it standout longevity; long Steam survey leader; excellent 1080p, solid 1440p; recommend at a good used price

RTX 3060 Ti ⭐ — 4864 CUDA / 8GB GDDR6 / 256-bit / 200W / 1x 8-pin
- Near-RTX 3070 performance for less; standout Ampere value; 8GB increasingly tight at 1440p in newer titles; strong used-market pick

RTX 3070 — 5888 CUDA / 8GB GDDR6 / 256-bit / 220W / 1x 8-pin
- Matched/beat the RTX 2080 Ti at launch for far less money; excellent 1440p; 8GB VRAM now limiting at 1440p+ in some titles; strong used-market pick

RTX 3080 (10GB) ⭐ — 8704 CUDA / 10GB GDDR6X / 320-bit / 320W / 2x 8-pin (or 12-pin FE)
- Massive generational leap; GDDR6X bandwidth; strong 4K; one of the most celebrated enthusiast GPUs of its era; 10GB VRAM is a ceiling at 4K in some newer titles
Note: A 12GB/384-bit GA102 variant also released under the same RTX 3080 name with different specs.

RTX 3090 — 10496 CUDA / 24GB GDDR6X / 384-bit / 350W / 2x 8-pin (or 12-pin FE)
- Spiritual Titan successor; 24GB VRAM; near-identical gaming performance to the 3080 at significantly higher price; valuable for content creation/AI workloads

All Ampere/RTX 30-series notes:
- DLSS 2 supported (major quality improvement over DLSS 1)
- No Frame Generation support (Ada-exclusive feature)
- No AV1 hardware encoding
- Still strong on the used/discounted market; excellent upgrade from GTX 10-series`,
    metadata: { category: 'products', topic: 'gpus-nvidia-ampere-rtx30' },
  },

  // ── GPUs: NVIDIA Ada Lovelace (RTX 40 Series) ────────────────────────────
  {
    content: `GPUs — NVIDIA Ada Lovelace (RTX 40 Series, TSMC 4N, PCIe 4.0, 3rd-gen RT, DLSS 3, 8th-gen NVENC with AV1):
Ada added DLSS 3 Frame Generation, AV1 hardware encoding, and 3rd-gen RT cores with a large efficiency improvement from the 5nm-class process.

RTX 4060 — 3072 CUDA / 8GB GDDR6 / 128-bit / 115W / 1x 8-pin
- Excellent power efficiency (115W); DLSS 3 Frame Generation at budget price; strong 1080p; narrow 128-bit bus and only 8GB limit 1440p+ headroom
- Best for: budget 1080p builds, small form factor or low-wattage systems

RTX 4060 Ti — 4352 CUDA / 8GB or 16GB GDDR6 / 128-bit / 160W / 1x 8-pin
- 8GB variant: same memory bus problem as the 4060 at 1440p; DLSS 3; 16GB variant has much better VRAM headroom for a budget-tier card
- Best for: budget-to-mid 1080p/1440p; the 16GB variant is a notably better long-term buy

RTX 4070 — 5888 CUDA / 12GB GDDR6X / 192-bit / 200W / 16-pin or 8-pin AIB
- Matches RTX 3080-class rasterization at much lower power; 12GB; DLSS 3; was criticized at launch for pricing but remains a solid efficient 1440p card
- Best for: 1440p builds prioritizing power efficiency (if the 4070 Super is similarly priced, choose that instead)

RTX 4070 Super ⭐ Most Recommended 1440p Card — 7168 CUDA / 12GB GDDR6X / 192-bit / 220W / 16-pin
- Significant core-count boost over the 4070 for a modest price increase; excellent 1440p rasterization and RT; DLSS 3; strong community recommendation
- Best for: the default 1440p GPU recommendation

RTX 4070 Ti Super — 8448 CUDA / 16GB GDDR6X / 256-bit / 285W / 16-pin
- Larger AD103 die with wider bus and 16GB VRAM; approaches the 4080 at a lower price; excellent high-end 1440p and capable 4K; DLSS 3
- Best for: high-end 1440p and entry 4K gaming

RTX 4080 Super — 10240 CUDA / 16GB GDDR6X / 256-bit / 320W / 16-pin
- Near-flagship 4K performance at a more attainable price than the 4090; excellent 4K rasterization + RT; DLSS 3; large physical footprint
- Best for: high-end 4K gaming builds

RTX 4090 ⭐ Fastest Consumer GPU (Gen) — 16384 CUDA / 24GB GDDR6X / 384-bit / 450W / 16-pin
- Undisputed performance king of its generation by a wide margin; 24GB VRAM; handles path tracing at 4K with DLSS; excellent for professional/AI workloads
- PSU: 850W-1000W+ required; physical size: many coolers exceed 330-350mm — verify case clearance
- Best for: no-compromise 4K builds; combined gaming + creative/AI workloads

All Ada notes:
- DLSS 3 Frame Generation on every card in the lineup
- AV1 hardware encoding on every card
- 12VHPWR/16-pin connector on most mid-to-high cards — use ATX 3.0/3.1 PSU or fully seat adapters`,
    metadata: { category: 'products', topic: 'gpus-nvidia-ada-rtx40' },
  },

  // ── GPUs: NVIDIA Blackwell (RTX 50 Series) ───────────────────────────────
  {
    content: `GPUs — NVIDIA Blackwell (RTX 50 Series, TSMC 4N, PCIe 5.0, 4th-gen RT, DLSS 4 with Multi Frame Generation, 9th-gen NVENC):
Blackwell added DLSS 4 Multi Frame Generation (multiple AI-interpolated frames per real frame), GDDR7 memory across most of the lineup, and DisplayPort 2.1 outputs.

RTX 5060 — 3840 CUDA / 8GB GDDR7 / 128-bit / 145W / 1x 8-pin
- GDDR7 improves bandwidth over prior 8GB Ada cards; DLSS 4 Multi Frame Generation; 8GB/128-bit still limiting at 1440p+ long-term
- Best for: budget 1080p builds wanting the latest DLSS features

RTX 5060 Ti — 4608 CUDA / 8GB or 16GB GDDR7 / 128-bit / 180W / 1x 8-pin
- Same dual-VRAM approach as the 4060 Ti; 16GB variant is the meaningfully better long-term buy; DLSS 4 MFG; 128-bit bus unchanged
- Best for: budget-to-mid 1080p/1440p; strongly prefer the 16GB variant

RTX 5070 — 6144 CUDA / 12GB GDDR7 / 192-bit / 250W / 16-pin
- Successor to the well-regarded 4070 Super; GDDR7 bandwidth improvement; DLSS 4 MFG; DP 2.1 outputs
- Best for: high-end 1440p gaming builds

RTX 5070 Ti — 8960 CUDA / 16GB GDDR7 / 256-bit / 300W / 16-pin
- GB203 die (same as 5080, cut down); 16GB GDDR7; strong 1440p and capable 4K; DLSS 4 MFG
- Best for: high-end 1440p and entry 4K gaming

RTX 5080 — 10752 CUDA / 16GB GDDR7 / 256-bit / 360W / 16-pin
- Second-tier Blackwell flagship; excellent 4K performance; DLSS 4 MFG; more attainable than the 5090
- Best for: high-end 4K gaming builds

RTX 5090 ⭐ Fastest Consumer GPU Available — 21760 CUDA / 32GB GDDR7 / 512-bit / 575W / 16-pin
- Massive generational leap over the RTX 4090; 32GB GDDR7; handles path tracing at 4K; extreme price + power
- PSU: 1000W-1200W required; physical size: many coolers exceed 340-360mm, 3.5+ slots
- Best for: no-compromise 4K builds; combined gaming + professional AI/creative workloads

All Blackwell notes:
- DLSS 4 Multi Frame Generation on every card (generates multiple AI frames per rendered frame)
- 9th-gen NVENC with AV1 encoding
- PCIe 5.0 x16 on mid-to-high end; x8 on budget (backward compatible with PCIe 4.0/3.0 slots)
- DisplayPort 2.1 and HDMI 2.1b outputs`,
    metadata: { category: 'products', topic: 'gpus-nvidia-blackwell-rtx50' },
  },

  // ── GPUs: AMD Legacy (Polaris + Vega + RDNA1) ────────────────────────────
  {
    content: `GPUs — AMD Legacy (Polaris RX 400/500 + Vega + RDNA1 RX 5000 Series):
No ray tracing hardware, no DLSS (NVIDIA-only), FSR 1/2 usable on all. AMD Encoder (VCE) H.264 only on Polaris/Vega; no AV1 until RDNA3.

Polaris (14nm GloFo, PCIe 3.0):
RX 480 8GB — 2304 SP / 8GB GDDR5 / 256-bit / 150W / 1x 6-pin
- AMD's Polaris debut; aggressive launch pricing; 8GB VRAM was generous for the era; popular with miners; dated for new builds

RX 580 8GB ⭐ Historic Budget Favorite — 2304 SP / 8GB GDDR5 / 256-bit / 185W / 6-pin + 8-pin
- Higher-clocked Polaris refresh; one of the most popular/long-lived budget GPUs ever; excellent historical value with continuous driver support; still capable at 1080p on the used market; no RT or modern upscaling

Vega (14nm GloFo, PCIe 3.0, HBM2 memory):
RX Vega 56 — 3584 SP / 8GB HBM2 / 2048-bit / 210W / 2x 8-pin
- HBM2 high-bandwidth memory; strong 1440p rasterization; competed with the GTX 1070; ran hot and power-hungry; niche today

RX Vega 64 — 4096 SP / 8GB HBM2 / 2048-bit / 295W / 2x 8-pin
- Vega flagship; competitive with the GTX 1080; very high power draw; reference blower was notoriously loud; Nitro+ AIB variant significantly better; no RT; niche today

RDNA1 (7nm TSMC, PCIe 4.0, no ray tracing, FSR 1/2, VCE H.264):
RX 5600 XT — 2304 SP / 6GB GDDR6 / 192-bit / 150W / 1x 8-pin
- First RDNA architecture; major efficiency improvement over Vega; strong 1080p; only 6GB VRAM; superseded by RDNA2 budget cards

RX 5700 XT ⭐ — 2560 SP / 8GB GDDR6 / 256-bit / 225W / 8-pin + 6-pin
- RDNA1 flagship; major efficiency and performance leap over Vega; traded blows with the RTX 2070 at a lower price; no ray tracing hardware was the main weakness; still a solid used-market 1440p pick; early driver stability issues (long since resolved via updates)

All AMD legacy cards:
- No ray tracing hardware (pre-RDNA2)
- No DLSS (NVIDIA-exclusive always)
- FSR 2/3 usable via game implementation
- Recommended for reusing existing hardware or ultra-budget used market only`,
    metadata: { category: 'products', topic: 'gpus-amd-legacy-polaris-vega-rdna1' },
  },

  // ── GPUs: AMD RDNA2 (RX 6000 Series) ─────────────────────────────────────
  {
    content: `GPUs — AMD RDNA2 (RX 6000 Series, 7nm TSMC, PCIe 4.0, 1st-gen Ray Accelerators, FSR 2/3, AMD Encoder H.264+HEVC):
RDNA2 introduced AMD's first ray tracing hardware (Ray Accelerators) and the Infinity Cache for improving effective bandwidth. Ray tracing is functional but trails NVIDIA's 2nd/3rd-gen RT cores in demanding workloads. No AV1 encoding (added in RDNA3). FSR is open-standard and also works on NVIDIA/Intel GPUs.

RX 6600 ⭐ — 1792 SP / 8GB GDDR6 / 128-bit + 32MB Infinity Cache / 132W / 1x 8-pin
- Excellent power efficiency; strong 1080p rasterization; Infinity Cache compensates for narrow 128-bit bus; light RT at 1080p; top budget recommendation of its era

RX 6600 XT — 2048 SP / 8GB GDDR6 / 128-bit + 32MB Infinity Cache / 160W / 1x 8-pin
- Modest gain over the RX 6600 at a higher price; if priced similarly to the 6600, buy the 6600 instead; good 1080p high-refresh option

RX 6700 XT — 2560 SP / 12GB GDDR6 / 192-bit + 96MB Infinity Cache / 230W / 2x 8-pin
- Well-rounded 1440p card; 12GB VRAM was unusually generous for mid-range; competitive with the RTX 3070 in rasterization; trails NVIDIA in RT

RX 6800 XT ⭐ — 4608 SP / 16GB GDDR6 / 256-bit + 128MB Infinity Cache / 300W / 2x 8-pin
- Traded blows with the RTX 3080 in rasterization at lower power; 16GB VRAM gave it a VRAM advantage at 4K; trails NVIDIA in RT performance; excellent enthusiast rasterization value

RX 6900 XT — 5120 SP / 16GB GDDR6 / 256-bit + 128MB Infinity Cache / 300W / 2x 8-pin
- Same Navi 21 die as the 6800 XT with more CUs enabled; modest gain over the 6800 XT in most titles; close rasterization performance to the RTX 3090 at a much lower price; strong used-market 4K rasterization value

All RDNA2 notes:
- 1st-gen Ray Accelerators: functional for light-to-moderate RT; trails NVIDIA's 2nd/3rd-gen in heavy path tracing
- Infinity Cache: helps narrow buses punch above their measured bandwidth, especially at 1080p-1440p
- FSR 2/3 supported (open standard, also works on NVIDIA/Intel GPUs)
- No DLSS, no AV1 encoding
- AMD Encoder supports H.264 and HEVC`,
    metadata: { category: 'products', topic: 'gpus-amd-rdna2-rx6000' },
  },

  // ── GPUs: AMD RDNA3 + RDNA4 (RX 7000/9000 Series) ───────────────────────
  {
    content: `GPUs — AMD RDNA3 (RX 7000 Series) and RDNA4 (RX 9000 Series):

RDNA3 (RX 7000 Series, 5nm/6nm TSMC chiplet, PCIe 4.0, 2nd-gen Ray Accelerators, FSR 3, AV1 encoding):
RDNA3 added AV1 hardware encoding (a first for AMD's lineup) and improved ray tracing. The 7800 XT and 7900 XTX are standout value picks of their respective tiers.

RX 7600 — 2048 SP / 8GB GDDR6 / 128-bit + 32MB IC / 165W / 1x 8-pin
- AV1 encoding at a budget price; solid 1080p; improved RT over RDNA2; 128-bit bus limits headroom; competitive with the RTX 4060

RX 7700 XT — 3456 SP / 12GB GDDR6 / 192-bit + 48MB IC / 245W / 2x 8-pin
- Solid 1440p; 12GB; AV1; good RT improvement; price-to-performance often overshadowed by the 7800 XT when price gap narrows — buy the 7800 XT if similarly priced

RX 7800 XT ⭐ Outstanding Value — 3840 SP / 16GB GDDR6 / 256-bit + 64MB IC / 263W / 2x 8-pin
- One of the standout picks of RDNA3; 16GB VRAM; consistently outperforms the RTX 4070 in raw rasterization at a lower price; AV1 encoding; trails RTX 4070 in ray tracing/DLSS
- Best for: high-value 1440p gaming; the go-to AMD recommendation at this tier

RX 7900 GRE — 5120 SP / 16GB GDDR6 / 256-bit + 64MB IC / 260W / 2x 8-pin
- Cut-down Navi 31 between the 7800 XT and 7900 XT; originally China-exclusive, later global; strong 1440p/4K value gap-filler; check availability in your region

RX 7900 XT — 5376 SP / 20GB GDDR6 / 320-bit + 80MB IC / 315W / 2x 8-pin
- 20GB VRAM; strong 4K rasterization; was priced too close to the 7900 XTX at launch for best value — check price gap before buying

RX 7900 XTX ⭐ — 6144 SP / 24GB GDDR6 / 384-bit + 96MB IC / 355W / 2x 8-pin
- AMD's RDNA3 flagship; excellent 4K rasterization; 24GB VRAM; notably lower price than the RTX 4080 at equivalent performance; trails NVIDIA in ray tracing and lacks DLSS
- Best for: high-end 4K gaming builds where rasterization value outweighs RT/DLSS preference

---
RDNA4 (RX 9000 Series, 4nm TSMC, PCIe 5.0, 3rd-gen Ray Accelerators, FSR 4 AI upscaling):
RDNA4 is AMD's biggest ray tracing generational leap ever, and FSR 4 introduces AI-accelerated upscaling that substantially narrows the quality gap with DLSS.

RX 9060 XT — 2048 SP / 8GB or 16GB GDDR6 / 128-bit / 150-182W / 1x 8-pin
- Dramatically improved RT vs RDNA3; FSR 4 AI upscaling; 16GB variant recommended for 1440p longevity; 128-bit bus still limits some scenarios
- Best for: budget-to-mid 1080p/1440p; strongly prefer 16GB variant

RX 9070 ⭐ — 3584 SP / 16GB GDDR6 / 256-bit / 220W / 2x 8-pin or 16-pin
- Major RT leap; FSR 4 AI upscaling; 16GB; competitive with NVIDIA's equivalent tier for both rasterization and RT — AMD's best feature-for-feature showing in years
- Best for: high-end 1440p gaming

RX 9070 XT ⭐ AMD's Most Competitive High-End Card in Years — 4096 SP / 16GB GDDR6 / 256-bit / 304W / 2x 8-pin or 16-pin
- RDNA4's flagship-adjacent; strongest AMD RT performance ever; FSR 4 closes most of the upscaling quality gap with DLSS; closely competitive with the RTX 5070 Ti at a compelling price
- Best for: high-end 1440p and capable 4K gaming; AMD's top recommendation at this tier

All RDNA3/4 notes:
- AV1 hardware encoding on all cards
- FSR 3 (RDNA3) / FSR 4 AI upscaling (RDNA4)
- FSR Frame Generation supported via game implementation
- No DLSS (NVIDIA-exclusive always)
- RDNA4 ray tracing: finally competitive with NVIDIA's equivalent tier, a major improvement over RDNA3`,
    metadata: { category: 'products', topic: 'gpus-amd-rdna3-rdna4-rx7000-9000' },
  },

  // ── GPUs: Intel Arc (Alchemist + Battlemage) ──────────────────────────────
  {
    content: `GPUs — Intel Arc (Alchemist A-Series + Battlemage B-Series):

Alchemist (A-Series, TSMC N6 6nm, PCIe 4.0, 1st-gen Xe RT, XeSS, AV1 encoding):
Intel's first serious gaming GPU effort had a rocky software launch but matured significantly through driver updates. Performance is strongest in modern DX12/Vulkan titles; older DX9/DX11 titles historically saw weaker results (much improved, but historical track record still a consideration).

Arc A750 — 28 Xe-cores / 8GB GDDR6 / 256-bit / 512 GB/s / 225W / 8-pin + 6-pin
- After driver maturation, a genuinely strong budget value pick for modern titles; 256-bit bus is unusually wide for its tier; AV1 encoding; XeSS upscaling
- Best for: budget 1080p builds focused on modern DX12/Vulkan games

Arc A770 — 32 Xe-cores / 8GB or 16GB GDDR6 / 256-bit / 225W / 8-pin + 6-pin
- Intel's Alchemist flagship; 16GB variant offers unusually generous VRAM at a budget-adjacent price; same driver caveats as the A750; also good for light AI/creative workloads with 16GB
- Best for: budget builds needing generous VRAM; modern title gaming

---
Battlemage (B-Series, TSMC N5 5nm, PCIe 4.0, 2nd-gen Xe RT, XeSS 2, AV1 encoding):
Battlemage launched with much-improved drivers and a significantly stronger value proposition from day one. The Arc B580 was widely praised as one of the best value GPU launches in years.

Arc B570 — 18 Xe-cores / 10GB GDDR6 / 160-bit / 380 GB/s / 150W / 1x 8-pin
- Solid budget 1080p pick; 10GB VRAM is generous for the price; much improved driver stability versus Alchemist at launch; XeSS 2; AV1
- Best for: budget 1080p gaming builds

Arc B580 ⭐ Outstanding Budget Value — 20 Xe-cores / 12GB GDDR6 / 192-bit / 456 GB/s / 190W / 1x 8-pin
- Widely praised at launch as one of the best-value GPUs in years; 12GB VRAM at a budget price; strong 1080p and surprisingly capable 1440p; good ray tracing for budget tier; AV1 encoding; XeSS 2
- Best for: the top budget 1080p/1440p value recommendation; Intel's most competitive gaming GPU to date

Intel Arc general notes:
- XeSS runs in two modes: XMX (hardware-accelerated, Arc-only, best quality) and DP4a (any GPU, reduced quality)
- AV1 hardware encoding on all Arc cards — a rare feature at budget price points
- No DLSS or FSR native support (though FSR open standard runs on Arc hardware fine)
- Battlemage (B-Series) has substantially better day-one driver quality than Alchemist at launch
- Performance in very old DX9 titles can still be weaker than NVIDIA/AMD equivalents — check for your specific game library
- Primary AIB partners: ASRock, Sparkle (B-Series), Gunnir; ASUS also offers Dual variants`,
    metadata: { category: 'products', topic: 'gpus-intel-arc' },
  },

  // ── Fan Controllers: Buying Guide ────────────────────────────────────────
  {
    content: `Fan Controllers Buying Guide:

Do you need a dedicated fan controller?
- Most builds do NOT need one — motherboard fan headers (typically 4-6 headers on mainstream boards) support automatic temperature-based fan curves via BIOS or software (e.g. Fan Xpert, Argus Monitor) and are sufficient for the majority of gaming PCs
- You need a dedicated fan controller if: you have more fans than available motherboard headers, you want a physical front-panel interface (knobs, touchscreen) independent of software, or you want manual control for silence tuning
- This is distinct from combo RGB hubs (which primarily add LED channels with fan control as a secondary feature)

Bay-mounted (5.25") vs. internal hub:
- Bay-mounted: installs in a front drive bay, gives a visible front-panel interface with knobs/display/touchscreen for direct access — NOTE: many modern cases no longer have 5.25" bays; confirm your case has one before buying
- Internal hub: mounts inside the case (often behind the motherboard tray), controlled via software or a small physical remote; works in cases without drive bays

Manual vs. automatic vs. touchscreen control:
- Manual (knobs/sliders): direct physical speed control, no software needed, doesn't automatically respond to temperature changes — you set it and leave it
- Temperature-curve automatic: uses temperature probes to dynamically adjust fan speed — better balancing silence and cooling without manual intervention
- Touchscreen (bay-mounted): most granular control; combines visual monitoring (temps, RPMs, graphs) with programmable curves — highest price tier

PWM vs. voltage (DC) control:
- PWM: adjusts fan speed via a digital signal at constant 12V; more precise and click-free across the full speed range; requires 4-pin PWM fans
- Voltage (DC): varies actual voltage to the fan; works with older/cheaper 3-pin fans; some fans stall out or behave inconsistently at very low voltages
- Check per-channel power rating (typically 1-3A per channel) — daisy-chaining multiple fans on one channel can exceed the rating

FAQs:
Q: My case has no 5.25" bay — what can I use?
A: An internal hub-style controller (like the Aquacomputer aquaero 6 LT) or a combo RGB hub with fan control outputs. Bay-mounted controllers physically require that drive bay slot.

Q: What's the difference between a fan controller and a fan/RGB combo hub?
A: A dedicated fan controller focuses purely on speed control (and sometimes pump control for custom loops). Combo RGB hubs (e.g. Corsair Commander, NZXT Smart Device) primarily manage RGB lighting and include fan control as a secondary function.

Q: Is an Aquacomputer aquaero overkill for an air-cooled build?
A: For most air-cooled builds, yes — the aquaero line targets custom liquid cooling loop builders needing precise pump control, multiple temperature probe inputs, and deep programmability that air cooling doesn't require. A simple mid-range temperature-curve controller suffices for most air-cooled setups.`,
    metadata: { category: 'products', topic: 'fan-controllers-buying-guide' },
  },

  // ── Fan Controllers: Products ─────────────────────────────────────────────
  {
    content: `Fan Controllers — Product Overview (All Tiers):
Dedicated fan/temperature controllers come mainly from specialist brands: SilverStone, Scythe, Lamptron, Aquacomputer. Most mainstream brands fold fan control into combo RGB hubs instead.

Entry tier:
SilverStone FP62 — 5.25" bay | 6-channel | Manual knobs | Voltage (DC) only | No temp monitoring | No RGB | No software needed
- Very low cost; simple and reliable manual control; backlit indicators only (no numeric readout)
- Best for: entry buyers wanting basic manual knob control without any software

Budget tier:
Lamptron FC-5 V3 — 5.25" bay | 5-channel | Manual knobs | Voltage (DC) only | Digital RPM readout per channel | No software needed
- Higher per-channel power (3A) than entry alternatives; digital RPM display adds useful real-time feedback; specialist fan controller manufacturer
- Best for: budget buyers wanting manual control with digital RPM confirmation

Scythe Kaze Master Ace — 5.25" bay | 5-channel | Manual sliders | Voltage (DC) only | LCD temperature readout per channel | No software needed
- Slider controls feel intuitive; temperature display per channel adds thermal awareness (informational, not automatic); respected Japanese cooling brand
- Best for: budget buyers wanting manual control with basic per-channel temperature visibility

Mid-range tier:
SilverStone FP71 — 5.25" bay | 8-channel | Manual knobs | Voltage (DC) only | Digital temp + RPM readout per channel | No software needed
- More channels (8) covers larger builds; digital temp and RPM monitoring; reliable manual control
- Best for: mid-range buyers needing more channels than entry controllers and wanting digital monitoring

Scythe Kaze Master FF — 5.25" bay | 5-channel | Manual sliders | Voltage (DC) only | LCD temp + RPM readout | Slim flat-panel design | No software needed
- Slimmer flat-panel aesthetic fits cleanly in a single bay slot; per-channel temp and RPM monitoring; Scythe's cooling-focused engineering reputation
- Best for: mid-range buyers wanting a clean slim design with per-channel monitoring

Enthusiast tier:
Lamptron FC10 SE — 5.25" bay | 10-channel | Touchscreen | Voltage (DC) only | Full-color touchscreen with temp/RPM graphs + programmable temperature alarms | No software needed
- 10 channels covers very large builds; full-color touchscreen shows detailed data without PC software; programmable alarms add safety awareness; higher per-channel power (2.5A)
- Best for: enthusiast builders with large fan counts wanting detailed touchscreen monitoring and alarms without software dependency

Aquacomputer aquaero 6 LT — Internal mount (no drive bay) | 4-channel | PWM + DC support | Fully programmable automatic temp curves (aquasuite software) | Temperature monitoring | Software required
- Supports both PWM and DC fans; automatic temp-curve control via respected aquasuite software; trusted by the custom liquid cooling community for pump control
- Best for: custom loop builders wanting programmable automatic curves at the lower entry point of the aquaero line

Flagship tier:
Aquacomputer aquaero 6 PRO — 5.25" bay + front touchscreen | 8-channel | PWM + DC support | Fully programmable automatic temp curves + front-panel touchscreen | Multiple flow/temp sensor inputs | Software optional (touchscreen works standalone)
- Widely regarded as one of the most capable, precise fan and pump controllers available; full-color front touchscreen for standalone operation; additional sensor inputs for advanced custom loop monitoring; significant overkill for simple air-cooled builds
- Best for: flagship custom liquid cooling loop builders wanting the most precise, fully-featured fan and pump control available`,
    metadata: { category: 'products', topic: 'fan-controllers-products' },
  },

  // ── DDR5 RAM: Buying Guide ────────────────────────────────────────────────
  {
    content: `DDR5 RAM Buying Guide (2026):

DDR5 is the current mainstream memory standard for new gaming builds:
- AM5 (Ryzen 7000 / 9000) is DDR5-ONLY — DDR4 physically does not fit
- Intel LGA1851 (Core Ultra 200) is DDR5-ONLY
- Intel LGA1700 exists as both DDR4 and DDR5 board variants — confirm which you have
- If building new in 2026, you're almost certainly using DDR5

Target speed for gaming:
- DDR5-6000 CL30-32: the widely accepted sweet spot — on AMD AM5 specifically, DDR5-6000 aligns with a 1:1 Infinity Fabric ratio (FCLK 2000MHz), giving measurable gaming FPS and 1% low improvements vs slower kits
- DDR5-5200/5600: reasonable budget alternative, functional but below the AM5 sweet spot
- DDR5-4800: JEDEC baseline speed only — leaves meaningful performance on the table, not recommended unless budget is critical
- DDR5-6400+: diminishing gaming returns; price rises faster than gaming performance; justified mainly for benchmarking or high-bandwidth workloads

Capacity:
- 32GB (2x16GB): recommended sweet spot for gaming + multitasking/streaming in 2026
- 16GB (2x8GB): functional but increasingly tight for newer AAA titles combined with browser/Discord/streaming overhead
- 64GB (2x32GB): useful for content creation, heavy multitasking, or local AI/LLM workloads — overkill for gaming-only
- 128GB: workstation/virtualization use only; zero gaming benefit over 32GB

EXPO vs XMP 3.0:
- AMD EXPO: AMD's DDR5 overclocking profile standard, optimized for Ryzen Infinity Fabric behavior and AM5 memory controllers
- Intel XMP 3.0: Intel's equivalent DDR5 standard
- Many current kits ship with BOTH profiles — the same kit works optimally on either platform with one-click profile enabling
- Without enabling EXPO (AMD) or XMP (Intel), DDR5 runs at slow JEDEC defaults (DDR5-4800 or slower) regardless of rated speed

AM5 four-DIMM stability caveat:
- Populating all 4 DIMM slots on AM5 (especially with high-capacity modules) frequently forces a lower stable speed than a 2-DIMM configuration with the same total capacity
- This is a documented AM5 memory controller characteristic — not a kit defect
- For maximum speed + stability: prefer 2x16GB or 2x32GB over 4x8GB/4x16GB

CUDIMM — what it is and do you need it:
- CUDIMM (Clocked Unbuffered DIMM) adds an onboard clock driver enabling stable speeds beyond standard DDR5 (8000MHz+)
- Requires explicit CUDIMM support from BOTH the CPU and motherboard — check compatibility before buying
- Zero practical gaming benefit over a well-chosen DDR5-6000 kit for typical users

On-die ECC: every DDR5 kit already has it — silently corrects internal chip errors; not the same as server ECC; already present in every consumer DDR5 gaming kit

Top picks:
- Best overall (non-RGB): G.Skill Ripjaws S5 32GB DDR5-6000 CL30 or Kingston FURY Renegade 32GB DDR5-6000 CL32
- Best overall (RGB): Corsair Vengeance RGB DDR5 32GB 6000 CL30 or G.Skill Trident Z5 Neo RGB (AMD-optimized)
- Best for AMD Ryzen AM5: G.Skill Trident Z5 Neo RGB (EXPO-validated, Infinity Fabric-tuned)
- Best budget: Corsair Vengeance DDR5 32GB 5200 CL40 or G.Skill Ripjaws S5 5200 CL36
- Best flagship: Corsair Dominator Titanium or G.Skill Trident Z5 Royal`,
    metadata: { category: 'products', topic: 'ddr5-ram-buying-guide' },
  },

  // ── DDR5 RAM: Entry & Budget ──────────────────────────────────────────────
  {
    content: `DDR5 RAM — Entry (DDR5-4800) and Budget (DDR5-5200/5600) Kits:

Entry tier — DDR5-4800 CL40 (JEDEC baseline, functional but not recommended):
- TeamGroup Elite DDR5 16GB (2x8GB) 4800 CL40: no heat spreader, no XMP/EXPO; cheapest possible DDR5 entry
- ADATA Premier DDR5 16GB (2x8GB) 4800 CL40: basic thin heat spreader; widely available; no XMP/EXPO profile
- Crucial DDR5 16GB (2x8GB) 4800 CL40: bare PCB; Micron's own memory ICs; reliable brand but no XMP/EXPO
- Silicon Power Value Gaming DDR5 16GB (2x8GB) 4800 CL40: among the cheapest DDR5 available; smaller brand track record
All entry kits: leave significant gaming performance on the table vs DDR5-5200/6000. The price gap to budget kits is small — upgrade if at all possible.

Budget tier — DDR5-5200/5600 (solid entry points with EXPO/XMP profiles):

Corsair Vengeance DDR5 32GB (2x16GB) DDR5-5200 CL40 ⭐ Best Budget Entry:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | 1.25V
- Both EXPO and XMP 3.0 for cross-platform flexibility; dependable Corsair reputation; excellent budget value
- Best for: budget AM5 or Intel DDR5 gaming builds

G.Skill Ripjaws S5 32GB (2x16GB) DDR5-5200 CL36 ⭐ Top Budget Value:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | 1.25V
- Tighter CL36 than most budget DDR5-5200 competitors; DDR5 successor to the trusted Ripjaws V line
- Best for: budget builds wanting tighter timings without RGB

Kingston FURY Beast DDR5 32GB (2x16GB) DDR5-5200 CL40 ⭐:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | 1.25V
- Kingston's manufacturing reputation (HyperX Fury lineage); strong price-to-performance and warranty support

TeamGroup T-Force Vulcan DDR5 32GB (2x16GB) DDR5-5200 CL38:
- ~34mm | No RGB | EXPO + XMP 3.0 | Angular heat spreader design | Competitive pricing; smaller community track record

ADATA XPG Lancer DDR5 32GB (2x16GB) DDR5-5200 CL38:
- ~34mm | No RGB | EXPO + XMP 3.0 | CL38 between tightest and loosest budget options; RGB variant also available

Patriot Viper Venom DDR5 32GB (2x16GB) DDR5-5200 CL38:
- ~34mm | No RGB | EXPO + XMP 3.0 | Competitive pricing; similar spec to Lancer/Vulcan; RGB variant available

Lexar Thor DDR5 32GB (2x16GB) DDR5-5200 CL40:
- ~35mm | No RGB | EXPO + XMP 3.0 | Budget pricing; newer/smaller RAM brand (Lexar more established in storage)

Silicon Power XPOWER Zenith DDR5 32GB (2x16GB) DDR5-5200 CL40:
- ~35mm | No RGB | EXPO + XMP 3.0 | Budget pricing; competitive but smaller community track record

Crucial Pro DDR5 32GB (2x16GB) DDR5-5600 CL46:
- Very low-profile ~31mm | No RGB | XMP 3.0 only (no EXPO) | Built on Micron's own ICs | 1.25V
- Slightly higher speed (5600) but loose CL46 partially offsets it; no EXPO profile — less optimal on AM5 without manual tuning
- Best for: Intel-platform builds wanting Micron IC reliability at a budget-to-mid price`,
    metadata: { category: 'products', topic: 'ddr5-ram-entry-budget' },
  },

  // ── DDR5 RAM: Mid-Range RGB (DDR5-6000) ──────────────────────────────────
  {
    content: `DDR5 RAM — Mid-Range RGB Kits (DDR5-6000):
DDR5-6000 is the widely accepted gaming sweet spot for both AM5 and Intel DDR5 platforms.

Corsair Vengeance RGB DDR5 32GB (2x16GB) DDR5-6000 CL30 ⭐ Most Popular DDR5 Kit:
- ~35mm | 12-zone addressable RGB | EXPO + XMP 3.0 | 1.35V
- Hits the DDR5-6000 CL30 sweet spot; compatible with all major RGB ecosystems (iCUE, Aura Sync, MSI Mystic Light, Gigabyte RGB Fusion)
- Dominant QVL presence; one of the most recommended DDR5 kits in the community
- Best for: the go-to recommendation for mid-range gaming builds on AM5 or Intel DDR5

G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000 CL30 ⭐ Best for AMD Ryzen AM5:
- ~44mm | Two-tone aluminum + addressable RGB | EXPO-validated for AM5 + XMP 3.0 | 1.35V
- Designed and validated specifically for AM5 Ryzen Infinity Fabric behavior — the go-to RGB pick for Ryzen 7000/9000 builds
- Tight CL30; excellent EXPO compatibility history
- Note: tall ~44mm — verify air cooler RAM clearance before buying
- Best for: AM5 builds prioritizing Ryzen-validated performance and Infinity Fabric-tuned memory stability

G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000 CL36:
- ~44mm | Iconic clear RGB light bar + dual-tone crown | EXPO + XMP 3.0 | 1.35V
- DDR5 successor to the iconic Trident Z RGB line; wide range of speed/capacity configs; CL36 looser than Neo's CL30
- Best when the Trident Z5 RGB crown aesthetic is preferred and CL30 isn't required

Kingston FURY Beast RGB DDR5 32GB (2x16GB) DDR5-6000 CL36:
- ~35mm | Addressable RGB | EXPO + XMP 3.0 | 1.35V
- Competitive RGB pricing at DDR5-6000; Kingston's reputation and warranty backing; CL36 looser than premium CL30 alternatives

TeamGroup T-Force Delta RGB DDR5 32GB (2x16GB) DDR5-6000 CL38:
- ~41mm | Full-length RGB diffuser (uniform diffuse glow) | EXPO + XMP 3.0 | 1.35V
- Distinctive full-length diffuser creates a different look vs point-LED competitors; looser CL38; typically cheaper than Corsair/G.Skill RGB
- Best for: budget RGB builds wanting a distinctive lighting aesthetic at a lower price

ADATA XPG Lancer RGB DDR5 32GB (2x16GB) DDR5-6000 CL30:
- ~35mm | Faceted aluminum + RGB | EXPO + XMP 3.0 | 1.35V
- Tight CL30 at a typically lower price than Corsair/G.Skill RGB alternatives; distinctive faceted design; smaller compatibility track record

Patriot Viper Venom RGB DDR5 32GB (2x16GB) DDR5-6000 CL36:
- ~35mm | Addressable RGB | EXPO + XMP 3.0 | 1.35V
- Competitive RGB pricing; CL36 timing; solid alternative when top brands are at a premium

Crucial Pro RGB DDR5 32GB (2x16GB) DDR5-6000 CL36:
- ~34mm | Addressable RGB | EXPO + XMP 3.0 | Built on Micron's own ICs
- Solid mid-range RGB option from a vertically-integrated memory manufacturer; competitive pricing for branded RGB`,
    metadata: { category: 'products', topic: 'ddr5-ram-midrange-rgb' },
  },

  // ── DDR5 RAM: Non-RGB & Enthusiast ───────────────────────────────────────
  {
    content: `DDR5 RAM — Mid-Range Non-RGB (DDR5-6000) and Enthusiast (DDR5-6400/6600/7200) + High-Capacity 64GB Kits:

Mid-range non-RGB — DDR5-6000 (same performance sweet spot, no RGB price premium):

G.Skill Ripjaws S5 32GB (2x16GB) DDR5-6000 CL30 ⭐ Top Non-RGB Value Pick:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | 1.35V
- Tight CL30 at DDR5-6000 without RGB; low-profile fits under any air cooler
- Best for: builds wanting the DDR5-6000 sweet spot at the lowest price

Kingston FURY Renegade DDR5 32GB (2x16GB) DDR5-6000 CL32 ⭐:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | Hand-tested, tightly-binned | 1.35V
- Kingston's premium FURY Renegade line; hand-tested modules; excellent quality control and overclocking headroom; fits under any cooler
- Best for: enthusiast gaming builds wanting top-tier non-RGB DDR5-6000 performance

---
Enthusiast tier — DDR5-6400 to DDR5-7200:

G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6400 CL32:
- ~44mm | Iconic RGB | EXPO + XMP 3.0 | 1.4V (higher voltage vs mainstream)
- Higher-binned Trident Z5; above-mainstream speed with tight CL32; small real-world gaming FPS gain over DDR5-6000

Kingston FURY Renegade RGB DDR5 32GB (2x16GB) DDR5-6400 CL32:
- ~42mm | Addressable RGB | EXPO + XMP 3.0 | Hand-tested, tightly-binned | 1.4V
- Premium RGB enthusiast kit with Kingston's hand-testing quality assurance

Corsair Dominator Titanium DDR5 32GB (2x16GB) DDR5-6600 CL32 ⭐ Flagship Corsair DDR5:
- ~47mm | Dual-material heat spreader + enhanced Capellix RGB | EXPO + XMP 3.0 | 1.4V
- Corsair's flagship DDR5 line — top-tier binning, enhanced brightness Capellix RGB, lighter build vs Platinum era
- Best for: showcase builds wanting the best Corsair DDR5 available; verify cooler clearance

Patriot Viper Xtreme 5 DDR5 32GB (2x16GB) DDR5-7200 CL34:
- ~44mm | RGB | XMP 3.0 only (no EXPO) | 1.4V
- High DDR5-7200 speed with tight CL34; Intel platforms recommended (no EXPO = manual tuning needed on AM5); verify QVL
- Diminishing gaming returns; suited to bandwidth-sensitive workloads or Intel benchmark enthusiasts

---
High-capacity 64GB kits (2-DIMM — better AM5 stability than 4-DIMM equivalent):

G.Skill Trident Z5 Neo RGB 64GB (2x32GB) DDR5-6000 CL30 ⭐ Best High-Cap AM5 Kit:
- ~44mm | Two-tone RGB | EXPO-validated for AM5 + XMP 3.0 | 1.35V | 2-DIMM config maintains speed stability
- Best 64GB choice for AM5 — keeps the DDR5-6000 CL30 Infinity Fabric sweet spot at 64GB capacity

Kingston FURY Renegade DDR5 64GB (2x32GB) DDR5-6400 CL32:
- Low-profile ~34mm | No RGB | EXPO + XMP 3.0 | Hand-tested | 1.4V | 2-DIMM config
- High capacity + high speed + low-profile height — fits under any air cooler even at 64GB

Corsair Dominator Titanium DDR5 64GB (2x32GB) DDR5-6600 CL32:
- ~47mm | Enhanced Capellix RGB | EXPO + XMP 3.0 | 1.4V | 2-DIMM config
- Flagship build quality at 64GB; premium pricing; 2-DIMM config for better stability vs 4-DIMM

TeamGroup T-Force Delta RGB DDR5 64GB (2x32GB) DDR5-6000 CL38:
- ~41mm | Full-length RGB diffuser | EXPO + XMP 3.0 | 1.35V | 2-DIMM config
- Competitive pricing for 64GB DDR5-6000 RGB; CL38 looser than premium alternatives; solid value option

ADATA XPG Lancer RGB DDR5 64GB (2x32GB) DDR5-6000 CL40:
- ~35mm | Faceted RGB | EXPO + XMP 3.0 | 1.35V | 2-DIMM config | Loosest CL40 at this tier
- Most affordable 64GB DDR5-6000 RGB option; value pick for high-capacity builds on a tighter budget

Note on 64GB for gaming: 32GB is sufficient for gaming-only builds. 64GB is worthwhile only when combining gaming with heavy streaming, content creation, video editing, or running local AI/LLM workloads.`,
    metadata: { category: 'products', topic: 'ddr5-ram-nonrgb-enthusiast-highcap' },
  },

  // ── DDR5 RAM: Flagship & FAQs ─────────────────────────────────────────────
  {
    content: `DDR5 RAM — Flagship Kits (Extreme Speed, Luxury Aesthetic, CUDIMM, Max Capacity) + FAQs:

Flagship extreme-speed and luxury kits:

G.Skill Trident Z5 Royal DDR5 32GB (2x16GB) DDR5-6800 CL34 ⭐ Most Distinctive Aesthetic:
- ~44mm | Chrome/gold-finish aluminum + crystalline RGB diffuser | EXPO + XMP 3.0 | 1.4V
- The luxury DDR5 kit — chrome or gold finish with a crystal-like diffuser is unlike any other RAM on the market
- Above-mainstream speed; premium pricing reflects aesthetics and binning quality over gaming FPS gains vs DDR5-6000
- Best for: showcase builds wanting the most visually distinctive DDR5 kit available

G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) DDR5-8000 CL38:
- ~44mm | Clear RGB light bar | XMP 3.0 only (no EXPO) | 1.45V
- Extreme DDR5-8000 requires specific high-end board + favorable CPU memory controller sample at rated speed
- Minimal real-world gaming FPS gain vs DDR5-6000/6400; primarily a benchmarking/showcase product
- Best for: extreme Intel enthusiasts chasing maximum memory bandwidth with confirmed compatible hardware

G.Skill Trident Z5 CK (CUDIMM) DDR5 32GB (2x16GB) DDR5-8600 CL40:
- ~44mm | RGB | XMP 3.0 CUDIMM-specific | 1.4V
- Onboard Clock Driver (CKD) chip enables 8600MHz+ — the highest consumer DDR5 speeds currently available
- REQUIRES both CPU and motherboard with explicit CUDIMM support (primarily LGA1851; select AM5 boards)
- CUDIMM on unsupported hardware delivers no speed benefit and may not function at rated spec
- Best for: extreme enthusiasts and early adopters with confirmed CUDIMM-supporting hardware

Corsair Dominator Titanium DDR5 128GB (4x32GB) DDR5-6000 CL30:
- ~47mm | Enhanced Capellix RGB | EXPO + XMP 3.0 | 1.35V | 4-DIMM config (AM5 speed caveat applies)
- Maximum consumer DDR5 capacity — for virtualization, heavy simulation, rendering, or local AI/LLM workloads
- No gaming benefit over 32GB — only worthwhile for genuine professional-workload needs
- On AM5: 4-DIMM configuration typically limits achievable stable speed below a 2-DIMM equivalent

---
DDR5 RAM FAQs:

Q: Is DDR5-6000 worth paying more for over DDR5-5200 on AM5?
A: Yes, measurably — DDR5-6000 at the 1:1 Infinity Fabric ratio is one of the more reliably worthwhile RAM upgrades on AM5, with documented gaming FPS and 1% low improvements.

Q: Do I need both EXPO and XMP 3.0 profiles on my DDR5 kit?
A: Only for platform flexibility or resale value. AMD-only build: EXPO-focused kit (Trident Z5 Neo) is fine. Intel-only: XMP 3.0 is fine. Most current kits include both anyway.

Q: Is CUDIMM worth the premium?
A: Only if your CPU and motherboard explicitly list CUDIMM support AND you're chasing 8000MHz+ for benchmarking. Typical gaming builds see no practical benefit over DDR5-6000.

Q: Can I use all 4 DIMM slots on AM5?
A: Yes, but it typically caps achievable stable speed below a 2-DIMM config at the same total capacity — a documented AM5 memory controller characteristic, not a defect.

Q: 32GB or 64GB for a gaming PC in 2026?
A: 32GB is the practical sweet spot for gaming. 64GB is worthwhile only if also doing heavy content creation, virtualization, or running local AI/LLM workloads.

Q: My DDR5 is running at 4800MHz but the box says 6000MHz — what's wrong?
A: Enable EXPO (AMD boards) or XMP 3.0 (Intel boards) in BIOS. DDR5 defaults to slow JEDEC speed without this step regardless of the speed rating on the box.

Q: Will DDR5 RAM work in my LGA1700 Intel board?
A: Only if your specific LGA1700 board is a DDR5 variant (e.g. DDR5 Z790 board) — LGA1700 exists as both DDR4 and DDR5 variants, and DDR5 physically will not fit in a DDR4 board's slots.`,
    metadata: { category: 'products', topic: 'ddr5-ram-flagship-faq' },
  },

  // ── DDR4 RAM: Buying Guide ────────────────────────────────────────────────
  {
    content: `DDR4 RAM Buying Guide:

Is DDR4 still relevant in 2026?
- DDR4 is the right choice ONLY for existing AM4 systems (Ryzen 1000–5000) or Intel DDR4 boards (LGA1200, some LGA1700 boards)
- New AM5 (Ryzen 7000/9000) and Intel LGA1851 (Core Ultra 200) platforms are DDR5-ONLY — DDR4 is physically incompatible with these sockets
- For any new AM5 or LGA1851 build, skip this section and look at DDR5 instead

Speed target for gaming:
- DDR4-3200 CL16: the widely accepted sweet spot — fast enough to not leave meaningful performance on the table, costs less than faster kits
- DDR4-3600 CL16: the next meaningful step up, especially on AMD Ryzen AM4 — Ryzen's Infinity Fabric clock is tied to memory speed, so DDR4-3600 often measurably improves gaming FPS and 1% lows on AM4
- DDR4-4000+: diminishing gaming returns; price increases faster than performance; only worthwhile for benchmark enthusiasts
- DDR4-2666 CL19 (JEDEC only): functional but leaves gaming performance on the table — worth spending a little more for DDR4-3200

Capacity:
- 16GB (2x8GB): functional minimum for most gaming in 2026; can feel tight with browser + Discord + streaming software running
- 32GB (2x16GB): recommended sweet spot for gaming + multitasking/streaming — future-proof without overkill cost
- 64GB+: overkill for gaming only; useful for content creation, rendering, virtualization
- 128GB: workstation-only; no gaming benefit over 32GB

Dual-channel matters — always buy a matched 2-stick kit:
- 2x8GB (dual-channel) significantly outperforms 1x16GB (single-channel) despite the same total capacity
- Dual-channel roughly doubles memory bandwidth — measurably affects gaming especially on integrated graphics
- Keep DIMM count even (2 or 4 sticks) — avoid installing 3 sticks

XMP / DOCP — enable it in BIOS or you're leaving performance behind:
- RAM ships running at slow JEDEC defaults (DDR4-2133 or 2400) regardless of what's printed on the box
- Enable XMP (Intel) or DOCP / A-XMP (AMD boards) in BIOS to reach advertised speed
- This is the #1 overlooked RAM setup step

RAM height and cooler clearance:
- Low-profile kits (~34mm): Corsair Vengeance LPX, G.Skill Ripjaws V, Kingston FURY Beast — safe with any air cooler
- RGB kits (~40-47mm): check your air cooler's RAM clearance spec before buying — may conflict with large tower coolers near the CPU socket

Top picks:
- Best overall DDR4 value (16GB): Corsair Vengeance LPX 3200 CL16 or G.Skill Ripjaws V 3200 CL16
- Best 32GB non-RGB: G.Skill Ripjaws V 3600 CL16 or Kingston FURY Beast 3600 CL16
- Best 32GB RGB: Corsair Vengeance RGB Pro or G.Skill Trident Z Neo (AM4-optimized)
- Best for AMD Ryzen AM4: G.Skill Trident Z Neo or Flare X (AM4-validated, Infinity Fabric-tuned)
- Best showcase/flagship: G.Skill Trident Z Royal or Corsair Dominator Platinum RGB`,
    metadata: { category: 'products', topic: 'ddr4-ram-buying-guide' },
  },

  // ── DDR4 RAM: Entry & Budget 16GB ─────────────────────────────────────────
  {
    content: `DDR4 RAM — Entry (DDR4-2666) and Budget 16GB Kits (DDR4-3200 CL16):

Entry tier — DDR4-2666 CL19 (functional, but slower than recommended):
- Crucial DDR4 16GB 2666 CL19: bare PCB, no XMP, lowest possible price; recommended only if budget is extremely tight
- TeamGroup Elite 16GB 2666 CL19: basic aluminum heat spreader, same low price point
- ADATA Premier 16GB 2666 CL19: bare PCB, widely available, same tier
- Silicon Power Value Series 16GB 2266 CL19: among the cheapest available; smaller brand track record
All entry kits: functional but leave gaming performance on the table vs DDR4-3200 CL16 kits. The price gap to budget kits is usually small — upgrade if at all possible.

Budget tier — DDR4-3200 CL16 (the gaming sweet spot):

Corsair Vengeance LPX 16GB DDR4-3200 CL16 ⭐ Most Recommended Budget Kit:
- Low-profile (~34mm, great cooler clearance) | No RGB | XMP 2.0 | 1.35V | Black/Red/Blue/White color options
- One of the most recommended DDR4 kits ever made — enormous QVL presence, validated across virtually all motherboards
- Best for: any budget-to-mid gaming build on AM4 or Intel DDR4 boards; especially useful with large air coolers

G.Skill Ripjaws V 16GB DDR4-3200 CL16 ⭐ Long-Running Value King:
- Low-profile (~34mm) | No RGB | XMP 2.0 | 1.35V | Multiple color options
- Long track record of reliability and motherboard compatibility; consistently top-ranked budget DDR4 pick
- Best for: budget-to-mid gaming builds; same tier as Vengeance LPX — buy whichever is cheapest

Kingston FURY Beast 16GB DDR4-3200 CL16 ⭐:
- Low-profile (~34mm) | No RGB | XMP 2.0 | 1.35V
- Successor to the well-known HyperX Fury line; Kingston's manufacturing reputation and warranty
- Best for: budget-to-mid gaming builds

TeamGroup Vulcan Z 16GB DDR4-3200 CL16:
- Angular heat spreader (~34mm) | No RGB | XMP 2.0 | Competitive pricing
- Solid budget pick with a distinctive angular look

ADATA XPG Gammix D30 16GB DDR4-3200 CL16:
- Low-profile (~33mm) | No RGB | XMP 2.0 | Competitive pricing
- Solid budget option; slightly looser secondary timings than some competitors

Patriot Viper Steel 16GB DDR4-3200 CL16:
- Low-profile (~34mm) | No RGB | Brushed metal aesthetic | XMP 2.0
- Good budget option with a distinctive brushed metal look

Crucial Ballistix 16GB DDR4-3200 CL16 (DISCONTINUED — legacy only):
- Built on Micron's own ICs with excellent overclocking headroom; discontinued in 2023
- Only available via remaining retail stock or used market — buy if found at a good price

Lexar Ares RGB 16GB DDR4-3200 CL16:
- ~37mm | RGB | XMP 2.0 | Budget-friendly RGB option; newer/smaller brand with less QVL track record
- Best for: budget builds wanting some RGB without premium-brand pricing`,
    metadata: { category: 'products', topic: 'ddr4-ram-entry-budget-16gb' },
  },

  // ── DDR4 RAM: Mid-Range 32GB Non-RGB ──────────────────────────────────────
  {
    content: `DDR4 RAM — Mid-Range 32GB Non-RGB Kits (DDR4-3200/3600 CL14-16):
For gaming builds wanting 32GB capacity without RGB lighting. 32GB is the recommended sweet spot for 2026.

Corsair Vengeance LPX 32GB DDR4-3200 CL16 ⭐:
- 2x16GB | Low-profile ~34mm | No RGB | XMP 2.0 | 1.35V
- Same proven low-profile design scaled to 32GB capacity; excellent value and compatibility
- Best for: budget-to-mid gaming builds needing 32GB headroom for multitasking or streaming

G.Skill Ripjaws V 32GB DDR4-3600 CL16 ⭐:
- 2x16GB | Low-profile ~34mm | No RGB | XMP 2.0 | 1.35V
- Tight CL16 at DDR4-3600 — especially beneficial on AM4 Ryzen (Infinity Fabric sweet spot)
- Best for: mid-range gaming builds, particularly on AM4 Ryzen

Kingston FURY Beast 32GB DDR4-3600 CL16:
- 2x16GB | Low-profile ~34mm | No RGB | XMP 2.0 | 1.35V
- Strong price-to-performance; Kingston's manufacturing reputation; good alternative to the Ripjaws V at the same spec
- Best for: mid-range gaming builds on AM4 or Intel DDR4 boards

ADATA XPG Gammix D30 32GB DDR4-3600 CL16:
- 2x16GB | Low-profile ~33mm | No RGB | XMP 2.0 | 1.35V
- Value-focused DDR4-3600 CL16 at a typically lower price than G.Skill/Kingston
- Best for: value-focused enthusiasts wanting DDR4-3600 CL16 performance

Patriot Viper 4 Blackout 32GB DDR4-3600 CL18:
- 2x16GB | Low-profile ~34mm | All-black aesthetic | No RGB | XMP 2.0 | 1.35V
- Clean all-black look for stealth builds; CL18 slightly looser than CL16 alternatives
- Best for: mid-range builds wanting a non-RGB all-black aesthetic

G.Skill Flare X 16GB DDR4-3200 CL14 (AMD-optimized, legacy):
- 2x8GB | Low-profile ~34mm | No RGB | Validated specifically for early AMD Ryzen AM4
- Unusually tight CL14 at DDR4-3200 — exceptional low latency for AM4 builds
- Availability has narrowed as it's an older product; check stock before targeting it
- Best for: AM4 builds specifically prioritizing low memory latency

Note on CL16 vs CL18 at DDR4-3600: same clock speed, but CL16 has lower latency. The real-world gaming difference is small (~1-3%) but CL16 kits are generally the better buy if priced similarly.`,
    metadata: { category: 'products', topic: 'ddr4-ram-midrange-32gb-nonrgb' },
  },

  // ── DDR4 RAM: Mid-Range & Enthusiast RGB ──────────────────────────────────
  {
    content: `DDR4 RAM — Mid-Range & Enthusiast RGB Kits (32GB DDR4-3600):
RGB RAM offers no performance advantage over otherwise identical non-RGB kits — it's purely aesthetic. These are the best options when looks matter.

Corsair Vengeance RGB Pro 32GB DDR4-3600 CL18 ⭐ Most Popular RGB DDR4 Kit:
- 2x16GB | ~44mm | 10-zone addressable RGB | XMP 2.0 | 1.35V
- Compatible with all major RGB ecosystems: Corsair iCUE, ASUS Aura Sync, MSI Mystic Light, Gigabyte RGB Fusion
- One of the most popular RGB DDR4 kits ever released; huge QVL presence; excellent compatibility track record
- CL18 timing — looser than CL16 alternatives, but the performance difference is minimal
- Best for: mid-range gaming builds wanting established, widely compatible RGB lighting
- Note: ~44mm height — verify clearance with large air coolers

G.Skill Trident Z Neo 32GB DDR4-3600 CL16 ⭐ Best RGB Kit for Ryzen AM4:
- 2x16GB | ~44mm | Two-tone aluminum + addressable RGB light bar | XMP 2.0 + AMD DOCP validated | 1.35V
- Designed and validated specifically for AMD Ryzen's Infinity Fabric behavior — pre-tested for AM4 stability at DDR4-3600
- Tight CL16 timing — better latency than CL18 competitors at the same speed
- Best for: AM4 Ryzen builds wanting the best combination of RGB aesthetics and Ryzen-optimized performance

TeamGroup T-Force Delta RGB 32GB DDR4-3600 CL18:
- 2x16GB | ~41mm | Full-length RGB diffuser | XMP 2.0
- Distinctive full-length diffuser creates a different RGB look than point LEDs; competitive pricing vs Corsair
- CL18 timing; competitive price vs Corsair Vengeance RGB Pro
- Best for: budget RGB builds wanting a unique RGB effect at a lower price

ADATA XPG Spectrix D50 32GB DDR4-3600 CL18:
- 2x16GB | ~44mm | Faceted aluminum + RGB | XMP 2.0
- Distinctive faceted heat spreader design; competitive pricing; CL18 timing
- Best for: mid-range RGB builds wanting a distinctive look at a competitive price

G.Skill Trident Z RGB 32GB DDR4-3600 CL16 ⭐ Iconic Enthusiast RGB Kit:
- 2x16GB | ~44mm | Clear RGB light bar with dual-tone crown | XMP 2.0 | 1.35V | Very tight CL16 16-16-16
- One of the most recognized and celebrated gaming RAM kits ever made — the classic enthusiast RGB look
- Excellent binning and overclocking headroom; premium pricing reflects aesthetic and binning quality
- Best for: enthusiast showcase builds where the iconic Trident Z RGB look is desired

Crucial Ballistix RGB 32GB DDR4-3600 CL16 (DISCONTINUED — legacy):
- Built on Micron's own ICs; tight CL16; discontinued in 2023 — available via remaining stock or used market

Corsair Dominator Platinum RGB 32GB DDR4-3600 CL16 ⭐ Flagship Corsair DDR4:
- 2x16GB | ~47mm | Dual-material heat spreader + 12-zone Capellix RGB | XMP 2.0 | 1.35V | Top-tier binning
- Corsair's top DDR4 kit — premium binning, excellent overclocking headroom, and stunning Capellix lighting
- Best for: showcase builds wanting the best Corsair DDR4 has to offer; check cooler clearance

G.Skill Trident Z Royal 32GB DDR4-3600 CL16 ⭐ Most Distinctive Aesthetic:
- 2x16GB | ~44mm | Chrome/gold finish + crystalline RGB diffuser | XMP 2.0 | 1.35V | Very tight CL16
- The most visually distinctive DDR4 kit available — luxury chrome or gold finish
- Premium pricing reflects aesthetics rather than performance gains over the Trident Z RGB
- Best for: showcase builds wanting the most unique, luxurious DDR4 aesthetic`,
    metadata: { category: 'products', topic: 'ddr4-ram-midrange-enthusiast-rgb' },
  },

  // ── DDR4 RAM: High-Capacity & High-Speed + FAQs ───────────────────────────
  {
    content: `DDR4 RAM — High-Capacity (64GB+) & High-Speed (DDR4-4000) Kits + FAQs:

High-speed DDR4-4000 kits (enthusiast/Intel-focused):
TeamGroup Xtreem ARGB 32GB DDR4-4000 CL18:
- Silver crown aesthetic + ARGB | 1.4V | Intel platforms recommended (verify AM4 QVL at 4000MHz)
- High bandwidth; diminishing gaming returns vs DDR4-3600; suited to Intel enthusiasts

Patriot Viper Steel 32GB DDR4-4000 CL19:
- Low-profile brushed metal | No RGB | 1.35V | Intel platforms recommended
- High speed without RGB; CL19 partially offsets the speed advantage over DDR4-3600 CL16

Note: Above DDR4-3600, gaming FPS gains are small — that budget is usually better spent elsewhere.

High-capacity 64GB kits (for gaming + heavy multitasking/streaming/content creation):
- Corsair Vengeance RGB Pro 64GB (4x16GB) DDR4-3200 CL16 — popular RGB option; 4-DIMM configs typically run slower than 2-DIMM
- G.Skill Trident Z Neo 64GB (4x16GB) DDR4-3600 CL16 — AMD Ryzen optimized; great for AM4 streaming builds
- G.Skill Trident Z Royal 64GB (4x16GB) DDR4-3600 CL16 — luxury aesthetic
- Corsair Dominator Platinum RGB 64GB (4x16GB) DDR4-3600 CL18 — flagship build quality
- Kingston FURY Renegade 64GB (4x16GB) DDR4-3600 CL16 — low-profile, no RGB, hand-tested modules
Note: 4-DIMM kits typically can't reach as high a stable XMP speed as 2-DIMM kits — check your motherboard's 4-DIMM max speed spec.

Maximum capacity (workstation-adjacent):
- Corsair Vengeance LPX 128GB (4x32GB) DDR4-3200 CL16 — for virtualization, simulation, or extreme multitasking
- No gaming benefit over 32GB — only buy for legitimate professional workload needs

Kingston FURY Renegade 32GB DDR4-3600 CL16 ⭐:
- 2x16GB | Low-profile ~34mm | No RGB | Hand-tested, tightly-binned modules | XMP 2.0
- Premium non-RGB enthusiast kit with excellent overclocking headroom; successor to HyperX Predator
- Best for: enthusiast gaming builds wanting top-tier performance without RGB

---
DDR4 RAM FAQs:

Q: Is DDR4-3600 worth the extra cost over DDR4-3200?
A: On AMD Ryzen AM4 — yes, measurably. DDR4-3600 aligns well with Infinity Fabric behavior and can improve gaming FPS and 1% lows. On Intel — smaller gain, more a "nice to have."

Q: Do I need RGB RAM?
A: No — RGB RAM offers zero performance benefit over identical non-RGB kits. It's purely aesthetic and usually costs more. Non-RGB kits (Vengeance LPX, Ripjaws V) are the value pick.

Q: Can I mix RAM kits from different brands?
A: Possible but not recommended — mismatched kits often can't run at full rated XMP speed together. Buy a single matched 2-stick kit sized for your total capacity needs.

Q: What is CAS Latency (CL) and does lower mean better?
A: CL is the delay (in clock cycles) between a memory request and data delivery. Lower CL at the same speed = lower latency. BUT actual latency (in nanoseconds) depends on both CL and frequency — DDR4-3600 CL18 has similar real-world latency to DDR4-3200 CL16. Always compare CL relative to speed.

Q: 16GB or 32GB for gaming in 2026?
A: 32GB is the more comfortable and future-proof choice. 16GB is still functional for most titles played in isolation, but 32GB removes pressure from running browsers, Discord, and background applications simultaneously.

Q: I installed faster RAM but it's still running at 2133MHz — what's wrong?
A: You need to enable XMP (on Intel boards) or DOCP/A-XMP (on AMD boards) in the BIOS. RAM ships defaulting to slow JEDEC speeds regardless of the speed rating on the label.`,
    metadata: { category: 'products', topic: 'ddr4-ram-highcap-highspeed-faq' },
  },

  // ── CPUs: Buying Guide ────────────────────────────────────────────────────
  {
    content: `CPU Buying Guide for Gaming PCs:

How to choose a gaming CPU:
- Prioritize single-core speed and cache over raw core count — most games use 6-8 fast cores, not 16+ slower ones
- 6 cores / 12 threads: practical minimum for smooth modern gaming (2026)
- 8 cores: comfortable sweet spot if you also stream, record, or multitask
- Beyond 8 cores: helps productivity workloads (rendering, video editing, compiling), not gaming FPS

What is 3D V-Cache (X3D)?
- AMD's 3D V-Cache stacks extra L3 cache onto the CPU die, dramatically reducing memory latency for game engines
- X3D chips (5800X3D, 7800X3D, 9800X3D, 9950X3D) consistently top gaming benchmarks, often beating higher-clocked non-X3D chips
- Single-CCD X3D (5800X3D, 7800X3D, 9800X3D): all cores on one chiplet with cache — no scheduling complexity, best for gaming
- Dual-CCD X3D (7900X3D, 7950X3D, 9950X3D): one CCD with cache + one without — more total cores and productivity muscle, but requires driver/BIOS for optimal game thread scheduling

Platform overview (socket determines motherboard and RAM):
- AM4 (AMD): Ryzen 1000–5000 series — DDR4, mature platform, longest-lived mainstream socket ever; CPUs like 5600 and 5800X3D still excellent value
- AM5 (AMD): Ryzen 7000–9000 series — DDR5 only; confirmed support through 2027+; drop-in CPU upgrades within the platform
- LGA1700 (Intel): 12th/13th/14th gen Core — DDR4 or DDR5 (board-dependent); end of life — no further upgrades beyond 14th gen
- LGA1851 (Intel): Core Ultra 200 / Arrow Lake — DDR5 only; Intel's current socket

CPU naming suffixes:
- Intel 'K': unlocked for overclocking (requires Z-series motherboard to OC)
- Intel 'F': no integrated graphics — needs a discrete GPU, but cheaper
- AMD 'X': higher factory clocks (often marginal gaming gain over non-X, which runs cooler)
- AMD 'X3D': 3D V-Cache gaming-optimized variant

Matching CPU to GPU tier (avoid bottlenecks):
- Entry/Budget GPU (RTX 4060, RX 7600): any mid-range CPU works; don't overspend on CPU
- Mid-range GPU (RTX 4070, RX 7700 XT): i5-12400F / Ryzen 5 5600 class or better
- High-end GPU (RTX 4080, RX 7900 XT): i5-13600K / Ryzen 7 7800X3D class
- Flagship GPU (RTX 4090, RTX 5090): Ryzen 7 9800X3D or equivalent
- At 4K the GPU is almost always the bottleneck — CPU tier matters less; save on CPU, invest in GPU

Top picks:
- Best gaming CPU overall: AMD Ryzen 7 9800X3D — current gaming performance leader across virtually all titles
- Best value AM4 upgrade: AMD Ryzen 7 5800X3D — definitive final AM4 upgrade, matches early AM5 in gaming
- Best budget AM5 entry: AMD Ryzen 5 7600 — excellent 1080p/1440p with upgrade path to X3D on the same board
- Best budget LGA1700: Intel Core i5-12400F or i5-13400F — outstanding price-to-performance, no GPU required for troubleshooting
- Best gaming + productivity: AMD Ryzen 9 9950X3D — 3D V-Cache CCD for gaming + full-power second CCD for work`,
    metadata: { category: 'products', topic: 'cpus-buying-guide' },
  },

  // ── CPUs: AMD AM4 Budget & Entry ──────────────────────────────────────────
  {
    content: `CPUs — AMD AM4 Budget & Entry (Ryzen 1000–5000, Socket AM4):
AM4 uses DDR4 RAM. These chips are the best value for budget gaming builds or upgrading an existing AM4 system.

Ryzen 5 1600 (Zen 1, 2017 — Legacy):
- 6 cores / 12 threads | 3.6 / 3.6 GHz | AM4 | Overclockable | No iGPU
- Historical significance: launched AMD's Zen resurgence and the AM4 platform; brought 6C/12T to the mainstream budget market
- Dated IPC today — only for ultra-budget or retro builds; the 5500/5600 cost little more and perform far better

Ryzen 3 3100 (Zen 2, 2020 — Legacy):
- 4 cores / 8 threads | 3.6 / 3.9 GHz | AM4 | Overclockable | No iGPU | PCIe 4.0
- Very inexpensive quad-core; dual-CCX design can cause inconsistent frame times in some games
- Best for: absolute minimum budget 1080p builds only

Ryzen 5 4500 (Zen 2, 2022):
- 6 cores / 12 threads | 3.6 / 4.1 GHz | AM4 | Locked | No iGPU | PCIe 3.0
- Ultra-budget 6-core option; smaller 8MB L3 cache (vs 32MB on the 3600/5600) slightly limits gaming
- Best for: tightest-budget 1080p builds

Ryzen 5 3600 ⭐ Legendary Budget Value (Zen 2, 2019 — Legacy):
- 6 cores / 12 threads | 3.6 / 4.2 GHz | AM4 | Overclockable | No iGPU | PCIe 4.0 | 32MB L3
- Widely regarded as one of the best value CPUs ever made; excellent drop-in upgrade for older AM4 boards
- Best for: upgrading from Ryzen 1000/2000-series on the same board; budget AM4 gaming

Ryzen 5 5500 ⭐ Best Budget Zen 3 (Zen 3, 2022):
- 6 cores / 12 threads | 3.6 / 4.2 GHz | AM4 | Locked | No iGPU | PCIe 3.0 | 16MB L3
- Strong Zen 3 IPC at a low price; PCIe 3.0 only (the 5600 has PCIe 4.0)
- Best for: budget 1080p/1440p gaming builds wanting Zen 3 performance without Zen 3 prices

Ryzen 5 5600 ⭐ Best AM4 Budget CPU:
- 6 cores / 12 threads | 3.5 / 4.4 GHz | AM4 | Locked | No iGPU | PCIe 4.0 | 32MB L3 | 65W
- One of the most recommended AM4 gaming CPUs ever — nearly matches the 5600X at a lower price
- Best for: the default budget/mid AM4 gaming recommendation; excellent paired with RTX 4060 / RX 7600

Ryzen 5 5600X (Zen 3, 2020 — Legacy):
- 6 cores / 12 threads | 3.7 / 4.6 GHz | AM4 | Locked | No iGPU | PCIe 4.0 | 32MB L3 | 65W
- Briefly held the gaming performance crown; marginally faster than the 5600 — only worth buying when priced below the non-X 5600
- Best for: AM4 builds when found cheaper than the Ryzen 5 5600`,
    metadata: { category: 'products', topic: 'cpus-amd-am4-budget-entry' },
  },

  // ── CPUs: AMD AM4 Upper-Mid & Enthusiast ──────────────────────────────────
  {
    content: `CPUs — AMD AM4 Upper-Mid & Enthusiast (Ryzen 5000, Socket AM4):
The upper tier of the AM4 platform. The 5800X3D is the definitive final upgrade for any AM4 system.

Ryzen 7 5700X (Zen 3, 2022):
- 8 cores / 16 threads | 3.4 / 4.6 GHz | AM4 | Locked | No iGPU | PCIe 4.0 | 32MB L3 | 65W
- Affordable 8-core AM4 option; gaming FPS close to the 6-core 5600/5600X — extra cores mainly help streaming/multitasking
- Best for: AM4 builds wanting more cores for streaming or light content creation alongside gaming

Ryzen 7 5800X3D ⭐ Definitive AM4 Gaming Upgrade:
- 8 cores / 16 threads | 3.4 / 4.5 GHz | AM4 | Locked | No iGPU | PCIe 4.0 | 96MB L3 (3D V-Cache) | 105W
- AMD's first X3D chip stunned the industry — turned a two-year-old platform into a gaming performance leader
- Drop-in upgrade for any AM4 system (B450/X470/B550/X570) — BIOS update required on older boards
- No further meaningful AM4 gaming upgrade exists; this is the ceiling
- Best for: anyone upgrading an existing AM4 system for maximum gaming performance — the definitive final AM4 upgrade
- Note: locked multiplier — cannot be manually overclocked; runs cooler than the 5800X due to power limits

Ryzen 9 5900X (Zen 3, 2020 — Legacy):
- 12 cores / 24 threads | 3.7 / 4.8 GHz | AM4 | Overclockable | No iGPU | PCIe 4.0 | 64MB L3 | 105W
- Class-leading gaming at launch alongside strong multi-core muscle; great for streaming-while-gaming
- Outclassed in pure gaming FPS by the cheaper 5800X3D; best for combined gaming + heavy productivity
- Best for: AM4 builds needing both strong gaming and heavy multi-core workloads

Ryzen 9 5950X (Zen 3, 2020 — Legacy):
- 16 cores / 32 threads | 3.4 / 4.9 GHz | AM4 | Overclockable | No iGPU | PCIe 4.0 | 64MB L3 | 105W
- AM4's flagship 16-core chip; overkill core count for gaming; trails the 5800X3D in games
- Best for: professionals needing maximum multi-core throughput who also want strong gaming capability
- Avoid if: gaming is the only priority — the 5800X3D is faster in games for significantly less

AM4 upgrade path summary:
- Ryzen 1000/2000/3000 → Ryzen 5 5600 (value upgrade) or Ryzen 7 5800X3D (maximum gaming upgrade)
- After 5800X3D: full platform change to AM5 is the next step`,
    metadata: { category: 'products', topic: 'cpus-amd-am4-enthusiast' },
  },

  // ── CPUs: AMD AM5 Ryzen 7000 (Zen 4) ─────────────────────────────────────
  {
    content: `CPUs — AMD AM5 Ryzen 7000 Series (Zen 4, Socket AM5, DDR5):
AM5 uses DDR5 RAM (DDR5-6000 CL30 recommended for gaming). All Ryzen 7000/9000 CPUs include a minimal iGPU (2 CUs) for display output and troubleshooting — useful even if you have a discrete GPU.

Ryzen 5 7600 ⭐ Best Budget AM5 CPU:
- 6 cores / 12 threads | 3.8 / 5.1 GHz | AM5 | Locked | 32MB L3 | 65W | iGPU included
- The most affordable practical AM5 entry point; excellent 1080p/1440p gaming performance
- Clear upgrade path: same board can accept Ryzen 9800X3D in the future (BIOS update)
- Best for: budget-to-mid builds wanting a future-proof AM5 platform — our default AM5 entry recommendation

Ryzen 5 7600X (Zen 4, 2022):
- 6 cores / 12 threads | 4.7 / 5.3 GHz | AM5 | Overclockable | 32MB L3 | 105W
- Higher factory clocks than the 7600; runs hotter for a small performance gain
- Best for: when priced competitively with the non-X 7600; otherwise the 7600 is the smarter buy

Ryzen 7 7700X (Zen 4, 2022):
- 8 cores / 16 threads | 4.5 / 5.4 GHz | AM5 | Overclockable | 32MB L3 | 105W
- Strong all-around gaming and productivity; high factory clocks; outperformed in gaming by the 7800X3D
- Best for: builders wanting a balance of gaming and productivity performance on AM5

Ryzen 7 7800X3D ⭐ Definitive AM5 Gaming CPU:
- 8 cores / 16 threads | 4.2 / 5.0 GHz | AM5 | Locked | 96MB L3 (3D V-Cache) | 120W | iGPU included
- Led virtually every gaming benchmark chart for over a year — the default recommendation for pure gaming AM5 builds
- Single-CCD design means no scheduling complexity — consistent performance out of the box
- Best for: pure gaming builds at any resolution wanting the best FPS-per-dollar on AM5
- Note: weaker multi-core productivity than the 7700X/7900X due to lower clocks

Ryzen 9 7900X (Zen 4, 2022):
- 12 cores / 24 threads | 4.7 / 5.6 GHz | AM5 | Overclockable | 64MB L3 | 170W
- Strong gaming + heavy multi-core productivity; trails X3D chips in pure gaming FPS
- Best for: gaming + heavy streaming/rendering/compiling workloads on AM5

Ryzen 9 7900X3D (Zen 4, 2023):
- 12 cores / 24 threads (6 V-Cache CCD + 6 standard CCD) | 4.4 / 5.6 GHz | AM5 | 128MB L3 combined | 120W
- Dual-CCD: 3D V-Cache CCD for gaming + standard CCD for productivity; requires updated AMD driver for optimal CCD scheduling
- Best for: builders needing both strong gaming and heavy multi-core productivity who find the 7800X3D insufficient on core count

Ryzen 9 7950X (Zen 4, 2022):
- 16 cores / 32 threads | 4.5 / 5.7 GHz | AM5 | Overclockable | 64MB L3 | 170W
- AM5's non-X3D flagship; trails X3D chips in gaming FPS; best for professional multi-core workloads
- Best for: professionals needing elite multi-core throughput who also want strong gaming

Ryzen 9 7950X3D ⭐ Best Combined Gaming + Productivity AM5 (Zen 4):
- 16 cores / 32 threads (8 V-Cache CCD + 8 standard CCD) | 4.2 / 5.7 GHz | AM5 | 144MB L3 combined | 120W
- Pairs a full X3D gaming CCD with a second high-clock productivity CCD
- Best for: enthusiasts wanting the single best combined gaming-plus-productivity chip (Zen 4 generation)`,
    metadata: { category: 'products', topic: 'cpus-amd-am5-ryzen-7000' },
  },

  // ── CPUs: AMD AM5 Ryzen 9000 (Zen 5) ─────────────────────────────────────
  {
    content: `CPUs — AMD AM5 Ryzen 9000 Series (Zen 5, Socket AM5, DDR5):
Zen 5 brings meaningful IPC gains over Zen 4 (~10-16% in gaming workloads) with improved efficiency. All run on AM5 with DDR5; drop-in compatible with existing AM5 boards via BIOS update.

Ryzen 5 9600X (Zen 5, 2024):
- 6 cores / 12 threads | 3.9 / 5.4 GHz | AM5 | Overclockable | 32MB L3 | 65W | iGPU included
- Zen 5 refresh of the 7600X; modest but real IPC gains and improved efficiency
- Best for: new AM5 builds wanting the latest Zen 5 architecture in a 6-core chip
- Often a similar price/performance decision to the prior-gen 7600X — check current pricing

Ryzen 7 9700X (Zen 5, 2024):
- 8 cores / 16 threads | 3.8 / 5.5 GHz | AM5 | Overclockable | 32MB L3 | 65W | iGPU included
- Notable: only 65W TDP (vs 105W for the 7700X) — excellent efficiency at lower power draw
- Strong all-around gaming and productivity; trails the 9800X3D in pure gaming FPS
- Best for: builders wanting a balance of gaming/productivity with excellent power efficiency on Zen 5

Ryzen 7 9800X3D ⭐ Current Gaming Performance Leader:
- 8 cores / 16 threads | 4.7 / 5.2 GHz | AM5 | Limited OC (Curve Optimizer + memory tuning) | 96MB L3 (3D V-Cache) | 120W | iGPU included
- Redesigned V-Cache-under-die layout (cache below the compute die) improves thermal headroom vs 7800X3D
- The fastest gaming CPU available across virtually all titles and resolutions as of 2025-2026
- Unlike prior X3D chips, supports limited overclocking via Curve Optimizer
- Best for: any gaming-focused build — the default recommendation for maximum gaming FPS

Ryzen 9 9900X (Zen 5, 2024):
- 12 cores / 24 threads | 4.4 / 5.6 GHz | AM5 | Overclockable | 64MB L3 | 120W | iGPU included
- Improved efficiency over the 7900X at a lower 120W TDP; strong gaming + multi-core balance
- Best for: gaming + heavy streaming/rendering/compiling workloads on Zen 5

Ryzen 9 9950X (Zen 5, 2024):
- 16 cores / 32 threads | 4.3 / 5.7 GHz | AM5 | Overclockable | 64MB L3 | 170W | iGPU included
- Zen 5's non-X3D 16-core flagship; elite multi-core throughput; trails X3D chips in gaming
- Best for: professionals needing maximum multi-core performance who also want excellent gaming

Ryzen 9 9950X3D ⭐ Best All-Around Desktop CPU:
- 16 cores / 32 threads (8 V-Cache CCD + 8 standard CCD) | 4.3 / 5.7 GHz | AM5 | 144MB L3 combined | 170W | iGPU included
- Pairs a Zen 5 X3D gaming CCD with a full-power second CCD for elite productivity — the fastest all-around desktop CPU AMD offers
- Best gaming + productivity combination available; the simpler 9800X3D is the smarter buy for gaming-only builds
- Best for: enthusiasts and professionals wanting the single fastest all-around desktop CPU, cost no object

AM5 upgrade path: Ryzen 5 7600 → Ryzen 7 9800X3D is a drop-in socket upgrade (BIOS update may be required)`,
    metadata: { category: 'products', topic: 'cpus-amd-am5-zen5-ryzen-9000' },
  },

  // ── CPUs: Intel LGA1200 Legacy ────────────────────────────────────────────
  {
    content: `CPUs — Intel Legacy LGA1200 (10th & 11th Gen, Comet Lake / Rocket Lake):
LGA1200 is end-of-life — no further CPU upgrade path on this socket. Only relevant for existing systems or finding these chips second-hand. For new builds, choose LGA1700 or AM5.

Core i3-10100F (Comet Lake, 2020 — Legacy):
- 4 cores / 8 threads | 3.6 / 4.3 GHz | LGA1200 | No iGPU | PCIe 3.0 | DDR4-2666 | 65W
- Ultra-budget gaming chip; fine for 1080p esports with mid-range GPUs; 4 cores shows its age in newer AAA titles
- Best for: existing LGA1200 builds or ultra-budget esports-only rigs

Core i5-10400F (Comet Lake, 2020 — Legacy):
- 6 cores / 12 threads | 2.9 / 4.3 GHz | LGA1200 | No iGPU | PCIe 3.0 | DDR4-2666 | 65W
- Hugely popular 6-core budget chip of its era; very capable paired with RTX 3060-class GPUs
- Best for: reusing existing LGA1200 boards; budget 1080p/1440p gaming

Core i5-11400F (Rocket Lake, 2021 — Legacy):
- 6 cores / 12 threads | 2.6 / 4.4 GHz | LGA1200 | No iGPU | PCIe 4.0 | DDR4-3200 | 65W
- Improved IPC over the 10400F; PCIe 4.0 is the main practical bonus over its predecessor
- Best for: budget 1080p/1440p builds that found LGA1200 boards on sale

Core i7-10700K (Comet Lake, 2020 — Legacy):
- 8 cores / 16 threads | 3.8 / 5.1 GHz | LGA1200 | Overclockable | PCIe 3.0 | 125W
- High boost clocks; strong gaming performance for its era; PCIe 3.0 limits future upgrade headroom
- Best for: existing LGA1200 owners not ready to platform-change

Core i7-11700K (Rocket Lake, 2021 — Legacy):
- 8 cores / 16 threads | 3.6 / 5.0 GHz | LGA1200 | Overclockable | PCIe 4.0 | 125W
- Improved IPC over 10th gen but ran notably hotter; PCIe 4.0 support
- Avoid if: building new today — efficiency issues hurt its value

Core i9-10900K (Comet Lake, 2020 — Legacy):
- 10 cores / 20 threads | 3.7 / 5.3 GHz | LGA1200 | Overclockable | PCIe 3.0 | 125W
- Held the gaming FPS crown at launch; very high power draw; requires 280mm+ AIO
- Best for: existing LGA1200 owners wanting the platform's fastest chip

Core i9-11900K (Rocket Lake, 2021 — Legacy):
- 8 cores / 16 threads | 3.5 / 5.3 GHz | LGA1200 | Overclockable | PCIe 4.0 | 125W+
- Controversial: fewer cores than the 10900K predecessor; very high power draw for the gaming gain delivered
- One of Intel's least efficient flagship launches — avoid for new builds

No further LGA1200 upgrade path exists — next step is a full platform change to LGA1700 or AM5.`,
    metadata: { category: 'products', topic: 'cpus-intel-legacy-lga1200' },
  },

  // ── CPUs: Intel LGA1700 Budget-Mid (12th-14th Gen) ───────────────────────
  {
    content: `CPUs — Intel LGA1700 Budget to Mid-Range (12th/13th/14th Gen, Alder/Raptor Lake):
LGA1700 supports 12th, 13th, and 14th gen Intel CPUs. DDR4 or DDR5 depending on the specific motherboard — check before buying RAM. LGA1700 is now end-of-life for further CPU upgrades (no 15th gen on this socket).

Core i3-12100F ⭐ Outstanding Budget Value (Alder Lake, 2022):
- 4 cores / 8 threads | 3.3 / 4.3 GHz | LGA1700 | No iGPU | PCIe 4.0 | DDR4/DDR5 | 58W
- Very high clock speeds punch well above its price — often matches or beats older 6-core CPUs
- Best for: best-value 1080p esports builds; one of the best budget gaming CPUs ever released

Core i5-12400F ⭐ Best Overall Budget-Mid CPU (Alder Lake, 2022):
- 6 cores / 12 threads | 2.5 / 4.4 GHz | LGA1700 | No iGPU | PCIe 4.0 | DDR4/DDR5 | 65W
- One of the most recommended gaming CPUs ever — outstanding price-to-performance; pairs well with GPUs well above its price tier
- Best for: the default recommendation for budget-to-mid ATX gaming builds; 1080p and 1440p gaming

Core i5-13400F (Raptor Lake, 2023):
- 10 cores (6P+4E) / 16 threads | 2.5 / 4.6 GHz | LGA1700 | No iGPU | PCIe 4.0 | DDR4/DDR5 | 65W
- Adds E-cores over the 12400F for extra multi-threaded headroom; E-cores help streaming/background load
- Best for: budget/mid builds wanting extra multi-core headroom over the 12400F

Core i5-12600K (Alder Lake, 2021 — Legacy):
- 10 cores (6P+4E) / 16 threads | 3.7 / 4.9 GHz | LGA1700 | Overclockable | iGPU included | PCIe 5.0 | 125W
- Introduced Intel's hybrid P-core/E-core architecture; a landmark mid-range overclocking CPU
- Best for: mid-range overclocking builds on LGA1700

Core i5-13600K ⭐ Best Mid-Range Value (Raptor Lake, 2022):
- 14 cores (6P+8E) / 20 threads | 3.5 / 5.1 GHz | LGA1700 | Overclockable | iGPU included | PCIe 5.0 | 125W
- Near-flagship gaming performance at a fraction of i9 pricing; frequently the top enthusiast value pick
- Best for: high-end 1080p/1440p/4K gaming builds wanting near-flagship performance at mid-range cost

Core i5-14600K (Raptor Lake Refresh, 2023):
- 14 cores (6P+8E) / 20 threads | 3.5 / 5.3 GHz | LGA1700 | Overclockable | iGPU included | PCIe 5.0 | 125W
- Mild clock-speed refresh of the 13600K; buy whichever is cheaper — the gaming difference is minimal
- Best for: high-end gaming builds when found cheaper than the 13600K

Core i7-12700K (Alder Lake, 2021 — Legacy):
- 12 cores (8P+4E) / 20 threads | 3.6 / 5.0 GHz | LGA1700 | Overclockable | iGPU included | PCIe 5.0 | 125W
- Well-balanced gaming and productivity chip; near-flagship performance at launch
- Best for: high-end gaming + productivity builds; excellent on sale`,
    metadata: { category: 'products', topic: 'cpus-intel-lga1700-budget-mid' },
  },

  // ── CPUs: Intel LGA1700 Enthusiast-Flagship ───────────────────────────────
  {
    content: `CPUs — Intel LGA1700 Enthusiast & Flagship (13th/14th Gen, Raptor Lake):
The highest-tier LGA1700 chips. Outstanding multi-core performance, but require premium cooling (280-360mm AIO) and quality PSUs due to high power draw under load.

Core i7-13700K (Raptor Lake, 2022):
- 16 cores (8P+8E) / 24 threads | 3.4 / 5.4 GHz | LGA1700 | Overclockable | iGPU | PCIe 5.0 | 125W (253W PL2)
- Excellent gaming + strong multi-core; great for streaming while gaming
- Best for: high-end gaming builds that also do heavy multitasking or content creation

Core i7-14700K (Raptor Lake Refresh, 2023):
- 20 cores (8P+12E) / 28 threads | 3.4 / 5.6 GHz | LGA1700 | Overclockable | iGPU | PCIe 5.0 | 125W (253W PL2)
- Adds four extra E-cores over 13700K; excellent all-around gaming+productivity chip
- Best for: high-end gaming builds wanting the best LGA1700 has to offer below flagship pricing

Core i9-12900K (Alder Lake, 2021 — Legacy):
- 16 cores (8P+8E) / 24 threads | 3.2 / 5.2 GHz | LGA1700 | Overclockable | iGPU | PCIe 5.0 | 125W (241W PL2)
- Reclaimed gaming performance crown from AMD at launch; a landmark CPU generation
- Still very capable; excellent value on the used/sale market

Core i9-12900KS (Alder Lake, 2022 — Legacy):
- Factory-binned 12900K with higher clocks (5.5 GHz boost); marginal gaming gain over standard 12900K
- Halo product — only worth buying when priced same as or below the 12900K

Core i9-13900K (Raptor Lake, 2022):
- 24 cores (8P+16E) / 32 threads | 3.0 / 5.8 GHz | LGA1700 | Overclockable | iGPU | PCIe 5.0 | 125W (253W PL2)
- Major core-count increase; excellent gaming and productivity; 253W+ peak power requires 360mm AIO
- Note: some early units affected by voltage degradation (addressed via microcode updates)
- Best for: high-end gaming + content creation; pure gaming builds should look at the 13600K instead for better value

Core i9-13900KS (Raptor Lake, 2023):
- First consumer CPU with 6.0 GHz factory boost; binned halo product; marginal gain over 13900K for significant extra cost
- Avoid if: value matters — the 13900K or 14900K are better buys

Core i9-14900K (Raptor Lake Refresh, 2023):
- 24 cores (8P+16E) / 32 threads | 3.2 / 6.0 GHz | LGA1700 | Overclockable | iGPU | PCIe 5.0 | 125W (253W PL2)
- Intel's last LGA1700 flagship; slightly higher clocks over 13900K; among the fastest non-X3D gaming CPUs
- Best for: high-end gaming and content creation builds wanting the fastest LGA1700 chip
- Avoid if: gaming-only — a Ryzen X3D chip delivers better FPS for less

Core i9-14900KS (Raptor Lake Refresh, 2024):
- Factory boost to 6.2 GHz; extreme halo product; 320W+ under load; requires 360mm AIO + 1000W PSU
- Marginal real-world gaming gain over the 14900K — a bragging-rights chip only

Cooling requirement: all 'K' i9 parts require a 280mm-360mm AIO — do not pair with budget air coolers.`,
    metadata: { category: 'products', topic: 'cpus-intel-lga1700-enthusiast-flagship' },
  },

  // ── CPUs: Intel Arrow Lake (LGA1851) + Compatibility & FAQs ──────────────
  {
    content: `CPUs — Intel Arrow Lake / Core Ultra 200 Series (LGA1851, DDR5 Only):
Intel's newest platform. Requires a new LGA1851 motherboard and DDR5 RAM — not compatible with LGA1700. Naming changed from i5/i7/i9 to Core Ultra 5/7/9.

Core Ultra 5 245K (Arrow Lake, 2024):
- 14 cores (6P+8E) / 14 threads | 4.2 / 5.2 GHz | LGA1851 | Overclockable | iGPU | PCIe 5.0 | DDR5-6400 | 125W
- Note: no Hyper-Threading on Arrow Lake — thread count = core count
- Gaming performance competitive but inconsistent versus prior-gen 13600K/14600K in some titles
- Improved power efficiency and NPU (AI features) over prior generation
- Best for: new builds specifically wanting the latest Intel platform and efficiency gains
- Avoid if: pure gaming value is the priority — the 13600K/14600K or Ryzen 7600 often match or beat it for less

Core Ultra 7 265K (Arrow Lake, 2024):
- 20 cores (8P+12E) / 20 threads | 3.9 / 5.5 GHz | LGA1851 | Overclockable | iGPU | PCIe 5.0 | DDR5-6400 | 125W
- Significantly better power efficiency than the outgoing 14700K; strong multi-core productivity
- Gaming competitive but trails AMD X3D chips in cache-sensitive titles
- Best for: high-end builds valuing efficiency and productivity alongside strong gaming performance

Core Ultra 9 285K (Arrow Lake, 2024):
- 24 cores (8P+16E) / 24 threads | 3.7 / 5.7 GHz | LGA1851 | Overclockable | iGPU | PCIe 5.0 | DDR5-6400 | 125W
- Dramatically lower power draw than the 14900K at similar or better multi-core performance
- Trails the 14900K and AMD X3D chips in pure gaming FPS at launch — better positioned as a workstation-gaming chip
- Best for: workstation-plus-gaming builds wanting Intel's latest platform with lower power draw
- Avoid if: gaming FPS is the only priority — Ryzen 7 9800X3D is faster in games for less

---
CPU Compatibility & FAQ:

Q: What socket does my CPU need?
A: AMD: Ryzen 1000-5000 → AM4 | Ryzen 7000-9000 → AM5. Intel: 10th/11th gen → LGA1200 | 12th/13th/14th gen → LGA1700 | Core Ultra 200 → LGA1851. No cross-socket compatibility.

Q: Can I use DDR4 RAM with an AM5 or LGA1851 CPU?
A: No. AM5 and LGA1851 require DDR5 only. Some LGA1700 motherboards support DDR4, others DDR5 — check your specific board.

Q: Do I need to update the BIOS to use a newer CPU on an older AM4/AM5 board?
A: Often yes. AM4 boards with Ryzen 1000/2000 BIOS may need an update to support Ryzen 5000-series CPUs. AM5 boards may need an update for Ryzen 9000-series. Always check the motherboard manufacturer's CPU support list.

Q: Does a faster CPU give more FPS at 4K?
A: Almost never — at 4K the GPU is the bottleneck in virtually all games. Save on CPU, invest in GPU for 4K builds. Any mid-range CPU (Ryzen 5 7600, i5-13600K) is sufficient for 4K gaming.

Q: Will a budget CPU bottleneck a high-end GPU?
A: At 1080p, yes — an Entry or Budget CPU can noticeably bottleneck a flagship GPU. At 1440p the effect shrinks; at 4K it's usually negligible. Don't pair a flagship GPU with an entry-tier CPU.`,
    metadata: { category: 'products', topic: 'cpus-intel-arrow-lake-faq' },
  },

  // ── Cases: Buying Guide ───────────────────────────────────────────────────
  {
    content: `PC Case Buying Guide:

Form factor — the most important decision:
- Mini-ITX cases (~11-30L): ultra-compact, one GPU slot, typically 1-2 fans or small radiator, SFX PSU often required — great for space-constrained builds but more expensive and complex to build in
- Micro-ATX (compact mid-tower): supports mATX and ITX motherboards; good middle ground for small footprint without ITX pricing; budget-friendly (Montech Air 100, Cooler Master Q300L)
- ATX mid-tower: the most common and versatile choice — full-size GPUs, multiple fans/radiators, good cable management, widest price range; default recommendation for most gaming builds
- E-ATX / Full tower: maximum expansion room and radiator support for extreme enthusiast builds; large footprint, premium price, overkill for most

Mesh/airflow front vs glass/showcase front:
- Mesh-front cases (Corsair 4000D Airflow, Fractal Meshify 2, Lian Li Lancool II Mesh): maximize intake area, typically run components 3-8°C cooler than equivalent glass-front designs — best if cooling performance matters
- Glass/solid-front showcase cases (Lian Li O11 Dynamic, HYTE Y60): prioritize displaying components and RGB; generally trade cooling headroom for aesthetics
- Dual-chamber showcase cases (O11 Dynamic, HYTE Y60, Corsair 6500X): hide PSU and cables in a rear chamber — cleanest look but pricier and more involved builds

GPU clearance — always verify before buying:
- Flagship-tier GPUs frequently exceed 340mm in length; compact and budget cases often max out at 300-360mm
- This is the #1 case-return reason — always check your specific GPU length against the case spec

Radiator clearance — check position-by-position:
- A case may support 360mm at the front but only 240mm at the top — always check the specific mounting position you plan to use
- AIO fans add thickness — verify both radiator size AND fan clearance at your intended mount point

Top picks by use case:
- Best overall value: Corsair 4000D Airflow — most recommended case of the past several years
- Best budget compact: Montech Air 100 (mATX) or Cooler Master Q300L (mATX, great dust filters)
- Best showcase: Lian Li O11 Dynamic EVO — defines the dual-chamber showcase category
- Best extreme airflow: Fractal Design Torrent — class-leading thermal benchmark
- Best quiet: Fractal Design Define 7 — swappable mesh/solid panels, extensive dampening
- Best SFF: Lian Li A4-H2O — full-size GPU in an ~11L aluminum enclosure`,
    metadata: { category: 'products', topic: 'cases-buying-guide' },
  },

  // ── Cases: Entry & Compact ────────────────────────────────────────────────
  {
    content: `PC Cases — Entry & Compact (mATX, ITX, and basic ATX options):

Montech Air 100 ⭐ Best Budget mATX Case:
- Form factor: Micro-ATX / Mini-ITX | Full mesh front | 2-3x ARGB fans included | GPU clearance: ~320mm | Radiator: up to 240mm front
- Exceptional value — mesh front, included fans, solid build quality at an extremely low price
- Best for: Budget Micro-ATX or Mini-ITX gaming builds where price is the top priority
- Avoid if: Using a full ATX motherboard — this case doesn't support it

Cooler Master MasterBox Q300L ⭐ Long-Standing Compact Budget Favorite:
- Form factor: Micro-ATX / Mini-ITX | Solid front with magnetic dust filter | 1x fan | GPU clearance: ~360mm | Radiator: up to 240mm top
- Magnetic removable dust filters on multiple panels — unusually easy dust maintenance for the price
- GPU clearance (~360mm) is more generous than most compact cases at this price
- Best for: Budget compact builds wanting easy dust management and generous GPU clearance
- Avoid if: Wanting a mesh front for maximum airflow

DeepCool CH510:
- Form factor: ATX / mATX / ITX | Mesh front | 2x fans | GPU clearance: ~350mm | Radiator: up to 240mm front
- Basic entry-level ATX mesh case; functional and accessible
- Best for: Tightest-budget ATX builds needing full ATX motherboard support

NZXT H510 (Legacy — current recommendation: H5 Flow):
- Form factor: ATX / mATX / ITX | Solid steel front (no ventilation) | 2x fans | GPU clearance: ~381mm | Front IO: USB-A, USB-C
- One of the most popular cases of its era — outstanding cable management, clean minimalist aesthetic
- Known limitation: solid front restricts airflow; the H5 Flow is the better current choice
- Best for: Budget-to-mid builds wanting NZXT's clean aesthetic — the H5 Flow now does it better

Thermaltake Versa H18:
- Form factor: Micro-ATX / Mini-ITX | Solid front | 1x fan | GPU clearance: ~300mm
- Very low price with tempered glass, but limited GPU clearance and solid front limit airflow
- Avoid if: The Q300L is available at a similar price — it offers more GPU clearance and better dust management`,
    metadata: { category: 'products', topic: 'cases-entry-compact' },
  },

  // ── Cases: Budget ATX Airflow ─────────────────────────────────────────────
  {
    content: `PC Cases — Budget ATX Airflow (Best Value Mid-Tower Picks):

Corsair 4000D Airflow ⭐ Most Recommended Case — Best Overall Value:
- ATX / mATX / ITX | High-airflow mesh front | 2x 120mm fans | GPU clearance: ~360mm | Radiator: 360mm front, 280mm top | Front IO: USB-A, USB-C | Available in black and white
- One of the most universally recommended PC cases of the past several years; excellent cable management
- Best for: The default recommendation for budget-to-mid ATX gaming builds — hard to go wrong

Lian Li Lancool II Mesh ⭐ Most Feature-Packed Budget Case:
- ATX / mATX / ITX / E-ATX (limited) | Mesh front | 3x fans | GPU clearance: ~384mm | Radiator: 360mm front, 360mm top
- Removable drive cages for flexible interior layout; three fans and extensive radiator support
- Best for: Budget-to-mid builds wanting maximum radiator flexibility and fans included

Phanteks P400A ⭐ Best GPU Clearance at Budget Price:
- ATX / mATX / ITX | Mesh front | 3x fans | GPU clearance: ~420mm | Radiator: 360mm front, 280mm top
- Exceptional ~420mm GPU clearance — handles even the longest flagship GPUs
- Best for: Budget-to-mid builds with very long GPUs needing maximum clearance

NZXT H5 Flow (H510 successor):
- ATX / mATX / ITX | Mesh front | 2x fans | GPU clearance: ~381mm | Radiator: 280mm front, 240mm top
- Addresses the H510's solid-front airflow limitation while retaining NZXT's clean minimalist aesthetic
- Best for: Budget-to-mid builds wanting NZXT's clean look with proper mesh airflow

Montech Air 900:
- ATX / mATX / ITX / E-ATX | Full mesh front | 4x ARGB fans | GPU clearance: ~450mm | Radiator: 360mm front, 360mm top
- Exceptional capacity, GPU clearance, and fans-included count for the price; large footprint
- Best for: Budget-to-mid builds wanting maximum capacity and airflow value

DeepCool CH710:
- ATX / mATX / ITX / E-ATX (limited) | Mesh front | 3x fans | GPU clearance: ~380mm | Radiator: 360mm front, 280mm top
- Three fans included; more capacity than the entry-level CH510
- Best for: Budget-to-mid builds wanting extra fan count and capacity

Fractal Design Focus 2:
- ATX / mATX / ITX | Mesh or solid front (variant-dependent) | 1-2x fans | Radiator: up to 240mm front/top
- Fractal's clean design language at a budget price; multiple front panel/color variants available
- Best for: Budget builds wanting Fractal's aesthetics without premium pricing`,
    metadata: { category: 'products', topic: 'cases-budget-atx-airflow' },
  },

  // ── Cases: Mid-Range ATX Airflow ──────────────────────────────────────────
  {
    content: `PC Cases — Mid-Range ATX Airflow (Performance-Focused Mid-Tower Options):

Corsair 5000D Airflow:
- ATX / mATX / ITX / E-ATX | High-airflow mesh front | 2x fans | GPU clearance: ~420mm | Radiator: 360mm front, 360mm top
- Larger, roomier sibling to the 4000D Airflow — same excellent design with E-ATX support and extra interior space
- Best for: Mid-to-high-end builds wanting extra room, large GPU clearance, or E-ATX motherboard support

Fractal Design Meshify 2 ⭐ Best Airflow + Build Quality Combination:
- ATX / mATX / ITX / E-ATX | Angular mesh front | 2-3x fans | GPU clearance: ~460mm | Radiator: 420mm front, 360mm top
- Consistently top-rated in independent thermal benchmarks; premium materials throughout
- Very generous GPU and radiator clearance — supports up to 420mm radiators at the front
- Best for: Mid-to-high-end builds prioritizing both airflow performance and premium build quality

Cooler Master MasterBox TD500 Mesh ⭐ Most Distinctive Airflow Aesthetic:
- ATX / mATX / ITX | Distinctive polygonal mesh front | 3x ARGB fans | GPU clearance: ~410mm | Radiator: 360mm front, 240mm top
- Polygonal mesh design unlike any other mainstream case; three ARGB fans included
- Best for: Mid-range builds wanting a visually distinctive airflow case with fans included

be quiet! Pure Base 500DX:
- ATX / mATX / ITX | Mesh front with dampening elements elsewhere | 3x ARGB fans | GPU clearance: ~369mm | Radiator: 360mm front, 280mm top
- Balances be quiet!'s acoustic heritage with a mesh front; quieter overall character than most airflow cases
- Best for: Mid-range builds wanting a balance between airflow and quiet operation

NZXT H7 Flow:
- ATX / mATX / ITX / E-ATX (limited) | Mesh front | 3x fans | GPU clearance: ~400mm | Radiator: 360mm front, 360mm top
- Larger, roomier H5 Flow with more radiator support; retains NZXT's clean minimalist cable management
- Best for: Mid-range builds wanting NZXT's clean aesthetic with extra interior room

DeepCool Matrexx 55:
- ATX / mATX / ITX | Mesh front | 3x ARGB fans | GPU clearance: ~370mm | Radiator: 360mm front, 240mm top
- Three ARGB fans included; balanced airflow + aesthetics at a competitive price

Phanteks Eclipse G360A:
- ATX / mATX / ITX / E-ATX (limited) | Mesh front | 3x D-RGB fans | GPU clearance: ~400mm+ | Radiator: 360mm front, 360mm top
- Standard ARGB headers; strong radiator support at both positions; three D-RGB fans included
- Best for: Mid-range builds wanting D-RGB fans and extensive radiator flexibility`,
    metadata: { category: 'products', topic: 'cases-midrange-atx-airflow' },
  },

  // ── Cases: Showcase & Glass Mid-Range ─────────────────────────────────────
  {
    content: `PC Cases — Showcase & Glass Designs (Mid-Range + Specialty):
For builders who prioritize displaying components and RGB over maximum airflow.

HYTE Y40:
- ATX / mATX / ITX | Distinctive curved dual-chamber design | 3x fans | GPU clearance: ~400mm (vertical mount supported) | Radiator: 240mm front, 280mm top
- Unique curved tempered glass wraps from front to side — unlike any conventional rectangular case
- Dual-chamber layout hides PSU and cables for a very clean look; vertical GPU mounting well-supported
- Best for: Mid-range showcase builds wanting a distinctive, head-turning design

Antec P120 Crystal:
- ATX / mATX / ITX / E-ATX (limited) | Triple tempered glass panels | 4x ARGB fans | GPU clearance: ~435mm | Radiator: 360mm front, 280mm top
- Triple glass panels (front, side, top) for maximum component visibility; four ARGB fans included
- Glass front limits airflow versus mesh-front alternatives
- Best for: Mid-range builds wanting maximum glass visibility and RGB showcase with fans included

Corsair iCUE 4000X RGB:
- ATX / mATX / ITX | Tempered glass front + side | 3x iCUE RGB fans | GPU clearance: ~360mm | Radiator: 360mm front, 280mm top
- Three pre-installed iCUE-controllable RGB fans; glass-front showcase sibling to the mesh 4000D Airflow
- Choose 4000D Airflow for better thermal performance, 4000X for showcase RGB aesthetics
- Best for: Corsair iCUE ecosystem showcase builds wanting RGB fans out of the box

Thermaltake Core P3 (open-frame specialty):
- ATX / mATX / ITX / E-ATX | Open-frame design | No fans | GPU clearance: 400mm+ | Radiator: highly flexible
- Fully exposes all components; can be wall-mounted; no dust filtering; no fans included
- Best for: Extreme showcase or wall-mounted display builds — not a practical everyday case

Key guidance — airflow vs showcase tradeoff:
- Glass-front cases typically run 3-8°C warmer under load than equivalent mesh-front designs
- For most gaming builds this doesn't cause throttling, but it reduces thermal headroom
- Prioritize cases with mesh top/sides even if the front is glass (e.g. HYTE Y40, HYTE Y60) for a better showcase+airflow balance`,
    metadata: { category: 'products', topic: 'cases-showcase-glass' },
  },

  // ── Cases: Dual-Chamber Showcase & Enthusiast ─────────────────────────────
  {
    content: `PC Cases — Dual-Chamber Showcase & Enthusiast (Premium Showcase Designs):
Dual-chamber cases hide the PSU and cables in a rear chamber for a clean, uncluttered front view. Popular for custom loops and RGB showcase builds.

Lian Li O11 Dynamic ⭐ Category-Defining Showcase Case:
- ATX / mATX / ITX / E-ATX (limited) | Tempered glass front + side | No fans standard | GPU clearance: ~420mm | Radiator: 360mm front, 360mm top, 240mm side/bottom configs
- Widely credited with defining the modern dual-chamber showcase case category
- Massive aftermarket accessory and modding ecosystem — more O11-compatible accessories than nearly any other case
- Best for: Enthusiast showcase builds and custom loop projects wanting the widest ecosystem support
- Note: no fans included on most SKUs — factor into build budget

Lian Li O11 Dynamic EVO ⭐ Best Dual-Chamber Case:
- ATX / mATX / ITX / E-ATX (limited) | Tempered glass front + side | No fans standard | GPU clearance: ~422mm | Radiator: 360mm front, 360mm top, 360mm side — extensive multi-radiator
- Adds genuine interior modularity over the original: movable drive trays, adjustable PSU shroud, reversible layout options
- Best for: Enthusiasts wanting maximum interior configuration flexibility; the top dual-chamber choice for new builds

HYTE Y60 ⭐ Most Visually Distinctive Case:
- ATX / mATX / ITX | Panoramic CURVED single-piece glass (front-to-side) | No fans standard | GPU clearance: ~400mm (vertical mount supported) | Radiator: 280mm front, 240mm top
- Single-piece curved tempered glass wraps from front to side — unmatched visual distinctiveness of any mainstream case
- Best for: Showcase builds where standing out visually is the absolute top priority
- Note: more limited radiator support than the O11 EVO; no fans included

NZXT H9 Flow:
- ATX / mATX / ITX / E-ATX (limited) | Panoramic glass front + side | 3x fans | GPU clearance: ~435mm | Radiator: 360mm front, 280mm top
- NZXT's dual-chamber showcase case with the brand's clean minimalist design language; three fans included
- Best for: Enthusiasts wanting NZXT's clean aesthetic in a dual-chamber design

Corsair 6500X:
- ATX / mATX / ITX / E-ATX (limited) | Panoramic glass | 3x iCUE LINK fans (SKU-dependent) | GPU clearance: ~450mm | Radiator: 360mm front, 360mm top
- Corsair's dual-chamber showcase case; integrates with the newer iCUE LINK single-cable ecosystem
- Best for: New Corsair iCUE LINK-centric builds wanting a dual-chamber showcase design

Antec C8:
- ATX / mATX / ITX / E-ATX (limited) | Distinctive angular glass | 4x ARGB fans | GPU clearance: ~420mm | Radiator: 360mm front, 360mm top
- Four ARGB fans included; distinctive angular aesthetic; strong radiator support for custom loops
- Best for: Showcase dual-chamber design with fans included and a different angular aesthetic`,
    metadata: { category: 'products', topic: 'cases-dual-chamber-showcase' },
  },

  // ── Cases: Flagship, Specialty & FAQs ─────────────────────────────────────
  {
    content: `PC Cases — Flagship, Full Tower, SFF & FAQs:

Fractal Design Define 7 ⭐ Best Quiet + Flexible Case:
- ATX / mATX / ITX / E-ATX | Swappable solid/mesh front panels — BOTH INCLUDED | 2-3x fans | GPU clearance: ~440-491mm | Radiator: 360mm+ front, 360mm top
- The only mainstream case that ships with BOTH a sound-dampened solid front AND a mesh front panel — switch between quiet and airflow configurations at any time
- Extensive sound dampening; E-ATX support; very generous clearances
- Best for: Enthusiasts wanting full flexibility to choose quiet or airflow priority in one case

Fractal Design Torrent ⭐ Best Airflow Performance:
- ATX / mATX / ITX / E-ATX | Open-design front | 2x 180mm front + 2x 120mm bottom fans | GPU clearance: ~461mm | Radiator: 360mm front, 240mm top
- Class-leading thermal performance in independent benchmarks — large fans with an unobstructed intake path
- Best for: High-TDP builds (flagship CPU + GPU) where maximum cooling performance is the top priority

Cooler Master HAF 700 (E-ATX Full Tower):
- E-ATX | Full tower | 3-4x large fans | GPU clearance: ~500mm+ | Radiator: 420mm front, 360mm top | Built-in fan/RGB controller
- Revives the legendary HAF (High Air Flow) name; massive interior; built-in controller simplifies extreme multi-fan wiring
- Best for: Extreme builds with E-ATX motherboards, multiple GPUs, or elaborate custom loops

be quiet! Dark Base 900 (E-ATX Full Tower):
- E-ATX | Full tower | Solid or mesh front | 3x 140mm fans | GPU clearance: ~470mm | Radiator: 420mm front, 360mm top
- Repositionable motherboard tray, tool-less modular interior; extensive sound dampening at full-tower scale
- Best for: Extreme builds prioritizing quiet operation at maximum capacity

Lian Li A4-H2O ⭐ Best SFF Case:
- Mini-ITX ONLY | ~11 liter volume | Perforated aluminum | No fans standard | Full-size GPU via PCIe riser | AIO: 240/280mm
- Remarkable engineering — full-size GPU support in an ~11L premium aluminum enclosure
- Requires SFX/SFX-L PSU (NOT standard ATX) — plan your PSU accordingly
- Best for: SFF enthusiasts wanting full-size GPU performance in the smallest practical package
- Avoid if: First-time builder — SFF builds require more planning and care

---
Cases Compatibility & FAQ:

Q: Does the case affect gaming performance?
A: Indirectly — better airflow helps components sustain boost clocks under load, but the case itself doesn't affect FPS. A good budget airflow case performs nearly as well as a premium one.

Q: How many fans should come included?
A: 2-4 is standard for mid-range cases and adequate for most builds. Budget cases sometimes include only 1 — factor in additional fan cost if needed.

Q: Is tempered glass durable enough for LAN parties?
A: Reasonable for normal handling but more fragile and heavier than steel/mesh. If frequent transport is a priority, look for a mesh side panel option.

Common mistakes:
- Not checking GPU length before buying a compact case — the #1 case-return reason
- Buying a showcase case without checking thermal reviews — some glass-front designs run notably hotter
- Checking only the largest supported radiator size, not the support at your specific mount position
- Ignoring dust filter quality — non-removable filters require more disassembly for cleaning over time`,
    metadata: { category: 'products', topic: 'cases-flagship-specialty-faq' },
  },

  // ── Case Fans: Buying Guide ───────────────────────────────────────────────
  {
    content: `Case Fan Buying Guide:

Airflow vs static pressure fans — most important decision:
- Airflow-optimized fans (open blade spacing): best for unobstructed case intake/exhaust where air moves freely
- Static pressure fans (angled blades designed to push through resistance): best on radiators, AIOs, dense dust filters, or restrictive mesh
- Always use STATIC PRESSURE fans on a radiator — airflow fans lose performance trying to push through the resistance
- For open case intake/exhaust: airflow fans; for AIO/radiator: static pressure fans

120mm vs 140mm:
- 120mm: most universally compatible size — works in nearly all cases and radiators
- 140mm: moves more air at the same RPM (quieter for the same airflow), but requires case and radiator support — check before buying
- Use 140mm where your case/radiator supports it and quiet operation is a priority

Bearing types (longevity matters for always-on fans):
- Sleeve bearing: cheapest, shortest lifespan, bad in non-horizontal orientation — avoid for long-term use
- Rifle bearing: better than sleeve, used in most budget fans (Arctic P12, SickleFlow, etc.)
- Fluid dynamic bearing (FDB): premium design, long lifespan, quiet — used in Noctua, Lian Li, be quiet! flagship fans
- Magnetic levitation (Corsair ML/iCUE LINK): minimal friction, very long lifespan, wide RPM range
- SSO2 (Noctua): Noctua's proprietary bearing — regarded as among the best available

Daisy-chain RGB ecosystems (simplified cable management):
- Lian Li UNI FAN series: daisy-chains multiple fans with a single cable run — huge cable management advantage for multi-fan builds
- Corsair iCUE LINK: same concept, compatible with Corsair AIOs and other iCUE LINK components
- Both require a compatible hub (usually included in multi-packs); not cross-compatible between brands

How many fans do you need?
- Minimum: 1 intake + 1 exhaust (functional)
- Typical gaming build: 2-3 intakes + 1-2 exhausts (comfortable for most mid-tower cases)
- Your AIO/cooler fans count separately — they're dedicated to cooling the radiator
- More than 4-6 case fans yields diminishing returns in most cases

Top picks:
- Best value non-RGB: Arctic P12 PWM PST — exceptional static pressure + PST daisy-chaining at a low price
- Best budget RGB: Cooler Master SickleFlow 120 ARGB — most popular budget RGB fan
- Best daisy-chain ecosystem: Lian Li UNI FAN SL120 — simplest multi-fan RGB wiring
- Best performance 120mm: Noctua NF-A12x25 — benchmark reference, outstanding on both radiators and case
- Best performance 120mm radiator: Phanteks T30-120 — top-tier static pressure + airflow hybrid
- Quietest: be quiet! Silent Wings 4 120/140 — among the quietest fans available`,
    metadata: { category: 'products', topic: 'case-fans-buying-guide' },
  },

  // ── Case Fans: Entry & Budget Non-RGB ─────────────────────────────────────
  {
    content: `Case Fans — Entry & Budget (Non-RGB, Performance-Focused):
Best for builders who want the most airflow or cooling for the money without paying an RGB premium.

Entry fans:
Corsair AF120 Slim:
- 120mm, 15mm thin (slim!) | No RGB | Airflow | Rifle bearing
- Standout: 15mm slim profile fits tight clearance spaces where a standard 25mm fan won't fit
- Best for: Small form factor or compact builds with restricted clearance

NZXT F120Q (quiet):
- 120mm, 25mm | No RGB | Airflow | FDB | Max ~21 dBA | 500-1500 RPM
- Best for: Budget builds prioritizing quiet operation; clean non-RGB aesthetic

NZXT F120P (static pressure):
- 120mm, 25mm | No RGB | Static pressure | FDB | 4-pin PWM
- Best for: Budget radiator/AIO fan replacement or upgrade without needing RGB

Budget fans (outstanding value):

Arctic P12 PWM PST ⭐ Community Favorite — Best Value Fan:
- 120mm, 25mm | No RGB | Static pressure | FDB | PST daisy-chain | 200-1800 RPM | ~22.5 dBA | 6-year warranty
- PST daisy-chain: connects fans together on one cable (reduces cable clutter)
- Works great on BOTH radiators AND case intake/exhaust
- Best for: Anyone wanting the most airflow/cooling per dollar — our top value recommendation

Arctic P14 PWM PST:
- 140mm, 25mm | No RGB | Static pressure | FDB | PST daisy-chain | 200-1700 RPM | 6-year warranty
- Same excellent P12 performance scaled to 140mm — best value 140mm fan available
- Best for: Builds with 140mm case/radiator support wanting top value

Thermalright TL-C12:
- 120mm, 25mm | No RGB | Airflow | Rifle bearing | 300-1550 RPM
- Standout: punches well above its very low price in independent testing; often bundled with Thermalright coolers
- Best for: The absolute lowest budget needing a decent airflow fan

Noctua NF-P12 Redux:
- 120mm, 25mm | No RGB | Static pressure | SSO2 bearing | ~24.6 dBA | 6-year warranty
- Noctua's quality and reliability at a lower price (grey/black colorway, simplified bundle)
- Best for: Builds wanting Noctua's engineering reputation without the full-price premium

be quiet! Pure Wings 3 120:
- 120mm, 25mm | No RGB | Airflow | Rifle bearing | Max ~23.4 dBA | Anti-vibration mounting
- Best for: Budget builds prioritizing quiet operation; be quiet!'s acoustic reputation at a low price`,
    metadata: { category: 'products', topic: 'case-fans-entry-budget-nonrgb' },
  },

  // ── Case Fans: Budget & Mid-Range RGB ─────────────────────────────────────
  {
    content: `Case Fans — Budget & Mid-Range RGB (Non-Daisy-Chain):
For builders who want ARGB/RGB lighting without daisy-chain complexity.

Budget RGB:

Cooler Master SickleFlow 120 ARGB ⭐ Most Popular Budget RGB Fan:
- 120mm | ARGB | Airflow | Rifle bearing | 650-1800 RPM | Up to ~27 dBA
- Connector: 4-pin PWM + 3-pin 5V ARGB (standard motherboard header)
- Often sold in value 3-packs; huge install base; works directly with ARGB motherboard headers
- Best for: Budget RGB builds wanting colorful lighting at the lowest price

Mid-range RGB:

Corsair LL120 RGB (iconic dual-ring):
- 120mm | RGB | Airflow | Rifle bearing | 600-1500 RPM | ~24.8 dBA
- Connector: 4-pin PWM + proprietary RGB (requires Corsair Lighting Node Pro or Commander)
- Standout: iconic dual-ring 16-LED look — one of the most recognized gaming PC aesthetics
- Best for: Corsair iCUE ecosystem builds wanting the iconic LL120 look
- Note: requires a Corsair controller (not a standard motherboard header)

NZXT Aer RGB 2:
- 120mm or 140mm | RGB | Airflow | FDB | 500-1800 RPM (120mm)
- Connector: proprietary (requires NZXT RGB & Fan Controller or HUE 2)
- Best for: NZXT-cased builds wanting matching RGB fans in both 120mm and 140mm

be quiet! Light Wings 120:
- 120mm | ARGB | Airflow | Rifle bearing | 1500-2000 RPM | ~26.1 dBA
- Connector: 4-pin PWM + 3-pin 5V ARGB (standard motherboard header)
- Best for: Builds wanting ARGB lighting with be quiet!'s quieter acoustic character

Phanteks D30 RGB:
- 120mm | RGB | Airflow | FDB | 500-1800 RPM | ~29.6 dBA
- Connector: 4-pin PWM + 3-pin 5V ARGB (standard motherboard header)
- Standout: distinctive smooth diffused RGB ring lighting effect
- Best for: Builds wanting a unique diffused glow rather than individual LED points

DeepCool FC120:
- 120mm | ARGB | Airflow | FDB | 500-1800 RPM | ~29.6 dBA | infinity-mirror pump effect
- Often bundled with a controller in multi-fan packs
- Best for: Builds wanting an infinity-mirror style RGB look at a competitive price

Thermalright TF120 (non-RGB value):
- 120mm | No RGB | Airflow | Rifle bearing | 300-1500 RPM | ~24.6 dBA
- Best for: Mid-range non-RGB builds wanting strong airflow value from Thermalright's lineup`,
    metadata: { category: 'products', topic: 'case-fans-rgb-midrange' },
  },

  // ── Case Fans: Daisy-Chain Ecosystems ─────────────────────────────────────
  {
    content: `Case Fans — Daisy-Chain RGB Ecosystems (Simplified Cable Management):
These fans connect together so that a set of 3 fans only needs ONE cable run instead of 3 separate cables. Huge benefit for cable management.

Lian Li UNI FAN SL120 ⭐ Community Favorite:
- 120mm | ARGB | Airflow | FDB | 0-1900 RPM | ~28 dBA | Zero-RPM idle mode
- Daisy-chain: each fan connects to the next; the last fan connects to a hub (hub included in multi-packs)
- Best value when bought as a 3-pack (controller/hub usually included)
- Zero-RPM idle: fans stop completely at low loads for silent operation
- Best for: Multi-fan builds wanting the best RGB cable management — our top daisy-chain recommendation

Lian Li UNI FAN TL120 (premium step up):
- 120mm | ARGB | Airflow | FDB | 0-2000 RPM | ~28 dBA | Zero-RPM idle
- Same daisy-chain system as SL120 but with translucent blades for enhanced RGB light diffusion
- Best for: Premium showcase builds wanting more vivid RGB glow through the blades

Lian Li UNI FAN SL-Infinity 120 (flagship aesthetic):
- 120mm | ARGB | Airflow | FDB | 0-1900 RPM | Zero-RPM idle
- Adds an infinity-mirror effect inside the fan — the most visually striking Lian Li fan
- Best for: Ultimate showcase builds where the fans are a centerpiece; most expensive Lian Li option

Corsair iCUE LINK RX120 (Corsair's new daisy-chain system):
- 120mm | ARGB | Airflow | Magnetic levitation bearing | 0-2100 RPM | Zero-RPM idle
- iCUE LINK: Corsair's newer single-cable ecosystem — fans, AIOs, and other components all connect via the same single-cable chain
- Magnetic levitation bearing: very low friction, long lifespan
- Best for: New Corsair-centric builds that also use iCUE LINK AIOs — the single-cable benefit extends across the whole build
- Note: requires commitment to the iCUE LINK hub/ecosystem; not backwards-compatible with older Corsair RGB systems

Key advice:
- Buy daisy-chain fans as a matching multi-pack (3-pack typically) — the hub/controller is usually only included in packs, not single-fan purchases
- Lian Li UNI FAN ecosystem (SL120, TL120, SL-Infinity) all work with the same UNI FAN controller hub
- Don't mix Lian Li and Corsair iCUE LINK — they use different proprietary connectors`,
    metadata: { category: 'products', topic: 'case-fans-daisy-chain-rgb' },
  },

  // ── Case Fans: Enthusiast Premium 120mm ──────────────────────────────────
  {
    content: `Case Fans — Enthusiast Premium 120mm (Best Performance & Quiet Operation):
Premium 120mm fans for builds where performance and/or noise reduction actually matters.

Noctua NF-A12x25 ⭐ Benchmark Reference — Best 120mm Fan:
- 120mm | No RGB | Hybrid airflow/static pressure | SSO2 bearing | 450-2000 RPM | ~22.6 dBA | 6-year warranty
- Widely regarded by independent reviewers as one of the best-performing 120mm fans ever made
- Excels in ALL positions: radiators, case intake, case exhaust — no compromises
- Available in chromax.black colorway (all-black, still no RGB) for modern build aesthetics
- Best for: Enthusiasts wanting the benchmark 120mm fan that dominates in every metric; ideal for AIO radiators and high-airflow case builds

Phanteks T30-120 ⭐ Best Radiator Fan:
- 120mm | No RGB (D-RGB variant available) | Hybrid airflow/static pressure | FDB | 500-3000 RPM | ~34.6 dBA max (run slower for noise)
- Standout: exceptional radiator performance — among the best static pressure fans available; liquid crystal polymer blades
- 3000 RPM ceiling means you can run it slow (quiet) and still have headroom for peak cooling when needed
- Best for: AIO and custom loop radiators where maximum thermal performance matters; also excels in case use

be quiet! Silent Wings 4 120 ⭐ Quietest 120mm:
- 120mm | No RGB | Airflow | Precision FDB | 950-1450 RPM | Max ~19.7 dBA | 4-pin PWM
- Among the quietest 120mm fans available at its performance level — lower noise than NF-A12x25
- Best for: Builds where near-silent operation is the top priority; perfect for open-air or sound-transparent cases

Corsair ML120 PRO RGB:
- 120mm | RGB | Airflow | Magnetic levitation bearing | 400-2400 RPM | ~36 dBA max
- Very wide RPM range — can run whisper-quiet at low speeds or push hard when needed
- Requires Corsair Lighting Node Pro or Commander for full RGB control
- Best for: Corsair-ecosystem builds wanting high RPM headroom with premium bearing longevity

Corsair QL120 RGB (maximum RGB impact):
- 120mm | RGB | Airflow | Rifle bearing | 600-1250 RPM | ~24.7 dBA | 34 individually addressable LEDs (quad-ring)
- Most LEDs of any standard 120mm fan in our lineup — maximum visual showcase impact
- Requires iCUE Lighting Node Core or Commander for full RGB control
- Best for: Showcase Corsair-ecosystem builds where visual impact is the top priority over maximum airflow`,
    metadata: { category: 'products', topic: 'case-fans-enthusiast-120mm' },
  },

  // ── Case Fans: Flagship 140mm + Compatibility & FAQs ─────────────────────
  {
    content: `Case Fans — Flagship 140mm Premium Fans:
140mm fans move more air at the same RPM = quieter for the same cooling. Best where case/radiator supports them.

Noctua NF-A14 PWM ⭐ Benchmark 140mm:
- 140mm | No RGB | Airflow | SSO2 bearing | 300-1500 RPM | ~24.6 dBA | 6-year warranty
- Long-running benchmark reference for 140mm fan performance; excellent airflow-to-noise ratio
- Available in chromax.black.swap colorway for modern all-black aesthetics
- Best for: Enthusiast builds with 140mm support wanting top-tier quiet performance

Noctua NF-A14x25 G2 (next generation):
- 140mm | No RGB | Refined blade geometry | SSO2 bearing | 300-1600 RPM | ~24.8 dBA | 6-year warranty
- Noctua's 2024 refinement of the NF-A14 — improved blade geometry; multiple tuned variants for high pressure vs low noise
- Best for: Enthusiasts on newest platforms wanting Noctua's latest engineering (prefer over NF-A14 for new builds)

Phanteks T30-140 ⭐ Best 140mm Radiator Fan:
- 140mm | No RGB (D-RGB variant available) | Hybrid airflow/static pressure | FDB | 500-2400 RPM | ~34.6 dBA max
- Same acclaimed T30 hybrid design scaled to 140mm — top-tier radiator and case cooling
- Best for: 140mm AIOs and radiators where maximum thermal performance is the goal

be quiet! Silent Wings 4 140 ⭐ Quietest 140mm:
- 140mm | No RGB | Airflow | Precision FDB | 950-1300 RPM | Max ~19.7 dBA | 4-pin PWM
- Among the quietest 140mm fans available — exceptionally low noise at its performance level
- Best for: Silent-focused flagship builds with 140mm case/radiator support

Corsair QL140 RGB:
- 140mm | RGB | Airflow | Rifle bearing | 600-1250 RPM | ~26 dBA | 50+ individually addressable LEDs
- Maximum RGB visual impact at the 140mm size; Corsair iCUE ecosystem
- Requires iCUE Lighting Node Core or Commander for full RGB control
- Best for: Showcase Corsair-ecosystem builds with 140mm support prioritizing maximum visual impact

---
Case Fan Compatibility & FAQs:

Fan placement guidance:
- Front/bottom: intake (pulling cool air in)
- Rear/top: exhaust (pushing hot air out)
- Radiator: use static pressure fans (Arctic P12, Phanteks T30, Noctua NF-A12x25)
- Reversed intake fan is the most common installation mistake — check arrow on fan frame (arrow = airflow direction)

RGB header types:
- Standard ARGB: 3-pin 5V header — works with any modern motherboard ARGB header (most fans use this)
- Proprietary: Corsair iCUE LINK and older Corsair RGB — requires Corsair's own hub; doesn't plug into motherboard ARGB headers
- Lian Li UNI FAN: requires UNI FAN hub (included in multi-packs)

Q: How many case fans do I need?
A: 2-3 intakes + 1-2 exhausts is a comfortable standard for a mid-tower gaming build. Your AIO/cooler fans are separate.

Q: Can I mix different fan brands?
A: Yes for basic cooling — but unified RGB control across different brands' apps isn't always seamless. Stick to one ecosystem (or standard 5V ARGB headers) for easiest control.

Q: Should my front intake use static pressure or airflow fans?
A: Only static pressure if the front panel is behind a dense mesh/dust filter. Many modern cases have open fronts where either type works.

Common mistakes:
- Using airflow fans on a radiator — always use static pressure fans on AIOs
- Installing fans backwards (reversed airflow direction)
- Buying ecosystem-specific fans without the required hub — always check what's in the box vs. what's needed`,
    metadata: { category: 'products', topic: 'case-fans-140mm-flagship-faq' },
  },

  // ── Capture Cards: Buying Guide ───────────────────────────────────────────
  {
    content: `Capture Card Buying Guide:

Do you even need a capture card?
- NO: if you're streaming or recording from the same gaming PC running the game — OBS/Streamlabs captures the screen directly without any extra hardware
- YES: if you're capturing from a console (PS5, Xbox Series X, Switch) or a second gaming PC — the video output needs a capture card to get into your streaming PC

External (USB) vs Internal (PCIe):
- External USB: plug in anywhere — desktop or laptop, any USB port; portable; easiest setup. Slight bandwidth limit vs internal. Best for most people.
- Internal PCIe: installs inside a desktop PC motherboard slot; lowest latency and highest throughput; supports high-refresh 1440p/4K capture; requires opening the case and having a free PCIe slot

Passthrough — why it matters for console gaming:
- Passthrough sends the video to your TV/monitor in real time while simultaneously sending it to the PC for capture
- Without passthrough, you'd only see the delayed captured preview — unplayable for gaming
- Passthrough latency: "low latency" (near-zero perceptible delay) is what you want; some budget cards add a slight delay
- Passthrough resolution vs capture resolution: these are DIFFERENT — a card may pass through 4K60 to your TV but only capture at 1080p60. Always check both specs.

HDR passthrough:
- Keeps your TV/monitor showing correct HDR colors while the card captures in SDR (most streams are SDR anyway)
- Important for current-gen consoles (PS5, Xbox Series X) that output HDR by default

USB bandwidth tip:
- 1080p60 capture: USB 3.0 (5Gbps) is enough
- 4K30 or higher capture: needs USB 3.1 Gen 2 / USB 3.2 (10Gbps) and a good quality cable
- Using a low-spec cable will bottleneck even a good card

Software:
- Most cards work directly in OBS/Streamlabs as a UVC source — no proprietary software needed
- Elgato Game Capture software and AVerMedia RECentral are optional alternatives with scene switching, overlays, etc.

Top picks summary:
- Best entry 1080p capture: Elgato HD60 S or Elgato Game Capture Neo
- Best mid-range (4K passthrough): Elgato HD60 X
- Best genuine 4K60 capture (external): AVerMedia Live Gamer BOLT
- Best genuine 4K60 capture (internal): Elgato 4K60 Pro MK.2 / Game Capture 4K X
- Best standalone (no PC needed): Elgato 4K60 S+ or AVerMedia Live Gamer BOLT`,
    metadata: { category: 'products', topic: 'capture-cards-buying-guide' },
  },

  // ── Capture Cards: Entry ──────────────────────────────────────────────────
  {
    content: `Capture Cards — Entry Level (1080p60, Basic Console Capture):
For beginners capturing console gameplay at 1080p. Plug-and-play, work directly in OBS.

Elgato Game Capture Neo:
- Form: External USB | Passthrough: 1080p60 | Capture: 1080p60 | HDR passthrough: No
- Simplest plug-and-play Elgato card; no HDR passthrough; works as a UVC source in OBS directly
- Best for: Entry buyers wanting basic 1080p console capture at the lowest Elgato price

AVerMedia Live Gamer Mini (GC311):
- Form: External USB | Passthrough: 1080p60 | Capture: 1080p60 | HDR passthrough: No
- Very compact, portable design; works in OBS without extra software
- Best for: Entry buyers wanting a compact, portable 1080p capture solution

AVerMedia Live Gamer HD 2 (GC570):
- Form: External USB | Passthrough: 1080p60 (pure hardware zero-latency pass) | Capture: 1080p60 | HDR passthrough: No
- Standout: genuinely zero-latency hardware HDMI passthrough (a pure hardware pass, not re-encoded) — better for competitive gaming on console while capturing
- Best for: Entry buyers where truly zero-latency passthrough for competitive console gaming is a priority

Razer Ripsaw HD:
- Form: External USB 3.0 | Passthrough: 4K30 | Capture: 1080p60 | HDR passthrough: No
- Standout: 4K30 passthrough gives a sharper live image on your TV/monitor than 1080p-only competitors — even though capture is still 1080p60
- Best for: Entry buyers wanting a cleaner 4K live display picture while recording at 1080p

Elgato Cam Link 4K:
- Form: External USB dongle | Passthrough: None | Capture: 1080p60 (or 4K30 low-frame feed)
- Standout: NOT a traditional gaming capture card — designed to turn a DSLR/mirrorless camera into a high-quality webcam via its HDMI clean output
- Best for: Content creators wanting to use a camera as a webcam; NOT suitable for console gaming capture (no passthrough output)

Note: None of the entry cards support 4K passthrough (except Ripsaw HD at 4K30) or HDR passthrough.`,
    metadata: { category: 'products', topic: 'capture-cards-entry' },
  },

  // ── Capture Cards: Budget ─────────────────────────────────────────────────
  {
    content: `Capture Cards — Budget (Better Features, Still 1080p Capture):
Better passthrough quality, more software features, and some HDR/4K passthrough at budget pricing.

Elgato HD60 S ⭐ Community Favorite:
- Form: External USB 3.0 | Passthrough: 1080p60 | Capture: 1080p60 | HDR passthrough: No
- One of the most widely used and documented capture cards; backed by Elgato's polished Game Capture software
- Best for: Budget buyers wanting the most widely supported, best-documented 1080p capture card

AVerMedia Live Gamer Portable 2 Plus (GC513):
- Form: External USB + standalone SD card recording | Passthrough: 1080p60 | Capture: 1080p60 | HDR: No
- Standout: records directly to an SD card without any PC — useful for LAN events or travel recording
- Best for: Budget buyers wanting PC-free standalone recording flexibility

AVerMedia Live Gamer Extreme 3 (GC551G2):
- Form: External USB-C | Passthrough: 1080p60 + HDR | Capture: 1080p60 | HDR passthrough: Yes
- Standout: HDR passthrough at a budget price — keeps your TV showing correct HDR colors while capturing
- Best for: Budget buyers with a current-gen console wanting HDR passthrough without paying mid-range pricing

Razer Ripsaw X:
- Form: External USB-C | Passthrough: 4K30 | Capture: 1080p60 | HDR passthrough: No
- Standout: dual HDMI inputs (switch between two consoles/sources without re-cabling); onboard hardware encoding reduces PC CPU/GPU load; 4K30 passthrough
- Best for: Budget buyers wanting dual-source switching between two consoles

Elgato HD60 S+:
- Form: External USB-C | Passthrough: 4K60 + HDR | Capture: 1080p60 | HDR passthrough: Yes
- Standout: 4K60 HDR passthrough for current-gen consoles at a budget price — your TV sees full 4K60 HDR even though capture is 1080p60
- Best for: Budget buyers with PS5 or Xbox Series X wanting 4K60 HDR passthrough while capturing at 1080p

Blackmagic UltraStudio HD Mini (Thunderbolt):
- Form: External Thunderbolt 3 | Passthrough: 1080p60 | Capture: 1080p60 | HDR: No
- Standout: professional broadcast-grade SDI + HDMI inputs; lowest price Blackmagic gear; suited for professional camera/broadcast workflows
- Requires Thunderbolt 3 port | Best for: Budget buyers needing professional signal handling (cameras, broadcast equipment)`,
    metadata: { category: 'products', topic: 'capture-cards-budget' },
  },

  // ── Capture Cards: Mid-Range ──────────────────────────────────────────────
  {
    content: `Capture Cards — Mid-Range (4K Passthrough + Some 4K Capture):
Best for current-gen console (PS5, Xbox Series X) streaming with proper 4K HDR passthrough.

Elgato HD60 X ⭐ Community Favorite:
- Form: External USB-C | Passthrough: 4K60 HDR10 | Capture: 1080p60 | HDR passthrough: Yes
- Best overall mid-range pick; Elgato's full Game Capture software with scene switching and overlays
- Best for: Console streamers wanting current-gen 4K60 HDR passthrough with a polished software suite

AVerMedia Live Gamer Ultra (GC553):
- Form: External USB-C | Passthrough: 4K60 HDR | Capture: 4K30 or 1080p60 | HDR passthrough: Yes
- Standout: genuine 4K30 capture (not just passthrough) at a mid-range price; onboard hardware encoding
- Best for: Buyers wanting actual 4K capture, accepting 30fps at that resolution

AVerMedia Live Gamer Ultra 2.1 (GC553G2):
- Form: External USB-C | Passthrough: 4K60 HDR10+ | Capture: 4K30 or 1080p60 | HDR passthrough: Yes
- Updated version of Live Gamer Ultra with HDR10+ passthrough; same 4K30 capture capability
- Best for: Buyers wanting the latest HDR10+ passthrough refinement with 4K30 capture capability

Elgato 4K60 S+ (standalone):
- Form: External USB + standalone SD card | Passthrough: 4K60 HDR10 | Capture: 4K60 HDR (to SD card) or 1080p60 (to PC via USB)
- Standout: records genuine 4K60 HDR10 directly to an SD card without a PC at all
- Best for: Buyers wanting standalone 4K60 HDR recording without a PC (travel, LAN events, console capture on the go)

Magewell USB Capture HDMI Gen 2 (professional):
- Form: External USB 3.0 | Passthrough: 1080p60 | Capture: 1080p60 | HDR: No
- Standout: professional broadcast-grade reliability; ultra-low latency; Linux support; used in broadcast production
- Best for: Mid-range buyers prioritizing professional reliability over gaming-focused features

Blackmagic DeckLink Mini Recorder 4K (internal PCIe):
- Form: Internal PCIe | Passthrough: None | Capture: 4K30 (SDI + HDMI) | HDR: No
- No HDMI passthrough (internal card only); professional broadcast-grade signal handling; lowest latency capture path
- Best for: Desktop recording workflows with a professional camera — not for console gaming while playing

AVerMedia Live Gamer 4K (GC573, internal PCIe):
- Form: Internal PCIe x4 | Passthrough: 4K30 HDR | Capture: 1080p60 | HDR passthrough: Yes
- Internal PCIe with HDMI loop-through passthrough; onboard hardware encoding
- Best for: Mid-range desktop users wanting an internal PCIe card with HDR passthrough`,
    metadata: { category: 'products', topic: 'capture-cards-midrange' },
  },

  // ── Capture Cards: Enthusiast (True 4K60 Capture) ─────────────────────────
  {
    content: `Capture Cards — Enthusiast (Genuine 4K60 HDR Capture):
These cards actually capture at 4K60 — not just passthrough at 4K while recording at 1080p.

Elgato 4K60 Pro MK.2 (internal PCIe) ⭐:
- Form: Internal PCIe x4 | Passthrough: 4K60 HDR10 (HDMI loop-through) | Capture: 4K60 HDR10
- Genuine 4K60 HDR10 capture with onboard hardware encoding; lowest latency internal path
- Best for: Desktop enthusiasts wanting uncompromising 4K60 internal capture without compromise
- Requires: free PCIe x4 slot in a desktop PC

Elgato Game Capture 4K X (internal PCIe — current generation):
- Form: Internal PCIe x4 | Passthrough: 4K60 HDR10 | Capture: 4K60 HDR10
- Newer generation succeeding the 4K60 Pro MK.2 — refined hardware encoding, better driver/software support for current systems
- Best for: Buyers choosing Elgato's current-gen flagship internal card (prefer this over the MK.2 for new purchases)

AVerMedia Live Gamer BOLT (GC555, standalone Wi-Fi streaming):
- Form: External USB-C + standalone Wi-Fi/Ethernet | Passthrough: 4K60 HDR10 | Capture: 4K60 HDR10 (standalone) or 4K30/1080p60 (PC via USB)
- Standout: streams 4K60 HDR10 directly to Twitch/YouTube over Wi-Fi without any PC at all — unique standalone streaming capability
- Best for: Console streamers wanting to broadcast 4K60 without owning or using a PC at all

AVerMedia Live Gamer 4K 2 (GC575, internal PCIe):
- Form: Internal PCIe x4 | Passthrough: 4K60 HDR10 | Capture: 4K60 HDR10
- AVerMedia's current-gen flagship internal card — upgrades from the Live Gamer 4K's 4K30 limit to genuine 4K60 capture
- Best for: Desktop enthusiasts wanting AVerMedia's current-generation internal 4K60 capture

Blackmagic UltraStudio Recorder 3G (Thunderbolt, professional):
- Form: External Thunderbolt 3 | Passthrough: 1080p60 | Capture: 1080p60 (SDI + HDMI + component)
- Most complete professional I/O below Blackmagic's 4K gear; includes component and analog audio I/O
- Best for: Professional broadcast/production environments; requires Thunderbolt 3 port

Magewell Pro Capture HDMI 4K Plus (internal PCIe, professional):
- Form: Internal PCIe x4 | Passthrough: None | Capture: 4K60
- Professional-grade 4K60 capture with exceptional reliability and ultra-low latency; Linux support
- Best for: Professional production workflows requiring rock-solid 4K60 capture without needing live passthrough`,
    metadata: { category: 'products', topic: 'capture-cards-enthusiast' },
  },

  // ── Capture Cards: Flagship / Professional Multi-Channel ──────────────────
  {
    content: `Capture Cards — Flagship & Professional Multi-Channel:
Broadcast-grade and multi-camera professional capture for production environments. These go beyond typical gaming capture.

Blackmagic UltraStudio 4K Mini (Thunderbolt, flagship external):
- Form: External Thunderbolt 3 | Passthrough: 4K60 | Capture: 4K60 (SDI + HDMI)
- Benchmark professional external 4K60 capture device; broadcast-grade reliability; Thunderbolt bandwidth
- Best for: Professional production environments wanting uncompromising 4K60 external capture reliability; requires Thunderbolt 3

Blackmagic UltraStudio Monitor 3G (Thunderbolt, monitoring focus):
- Form: External Thunderbolt 3 | Capture: 1080p60 | Includes precise reference monitoring output
- Combines broadcast-grade monitoring output with capture; aimed at production needing reference monitoring alongside capture; no 4K
- Best for: Professional colorists and video editors needing accurate reference monitoring while capturing

Blackmagic DeckLink Duo 2 (4-channel internal PCIe):
- Form: Internal PCIe x4 | Channels: 4 independent SDI/HDMI | Capture: 1080p60 per channel
- 4 channels configurable as any mix of capture and playback; multi-camera professional production
- Best for: Multi-camera production with up to 4 simultaneous SDI/HDMI sources

Blackmagic DeckLink Quad 2 (8-channel internal PCIe):
- Form: Internal PCIe x8 | Channels: 8 independent SDI connections | Capture: 1080p60 per channel
- Largest-scale DeckLink card; 8 independently configurable SDI channels for broadcast infrastructure
- Best for: Large-scale broadcast production environments needing maximum channel density

Magewell Pro Capture Dual HDMI 4K Plus (2-channel 4K60 internal PCIe):
- Form: Internal PCIe x8 | Channels: 2 independent HDMI | Capture: 4K60 per channel
- Two simultaneous independent 4K60 HDMI capture channels; exceptional reliability
- Best for: Professional dual-camera 4K production requiring maximum per-channel reliability

Magewell Pro Capture Quad HDMI (4-channel internal PCIe):
- Form: Internal PCIe x8 | Channels: 4 independent HDMI | Capture: 1080p60 per channel
- Four HDMI inputs on a single card; dense multi-source professional production
- Best for: Multi-camera environments needing 4 simultaneous HDMI channels on one card

Note: Flagship professional cards (Magewell, Blackmagic multi-channel) are intended for broadcast and video production workflows. For typical gaming/console streaming, Enthusiast-tier cards are more than sufficient.`,
    metadata: { category: 'products', topic: 'capture-cards-flagship-professional' },
  },

  // ── Capture Cards: Compatibility & FAQs ──────────────────────────────────
  {
    content: `Capture Card Compatibility & FAQs:

Setup requirements:
- External USB cards: need a USB 3.0+ port (USB 3.1 Gen 2 for 4K60 capture); USB-C connector on newer cards but often include a USB-C to USB-A cable
- Internal PCIe cards: need a free PCIe x4 slot in a desktop PC; not compatible with laptops
- Thunderbolt cards (Blackmagic): need a Thunderbolt 3 port — verify your PC/laptop has one before buying
- All external cards work on both Windows and Mac; most internal PCIe cards also support Mac

Console compatibility:
- PlayStation 5 and Xbox Series X output up to 4K/120Hz via HDMI 2.1 — a mid-range or better card is recommended for proper 4K passthrough
- Nintendo Switch: outputs max 1080p60 — any capture card works
- Most capture cards require HDCP to be disabled on the console for capture to work:
  - PS5: Settings → System → HDMI → Enable HDCP → Off
  - Xbox: Settings → General → TV & display → Video fidelity → Allow 4K, then turn off HDCP

FAQs:
Q: Do I need a capture card if I stream PC games?
A: No — OBS/Streamlabs captures your screen directly. Capture cards are only needed for consoles or a second PC.

Q: What does passthrough mean?
A: The card passes the video signal through to your monitor/TV in real time while simultaneously sending it to the PC for capture — essential so you can actually play the game while it's being recorded.

Q: Why is my captured video worse quality than what I see on my TV?
A: The card's capture resolution is often lower than its passthrough resolution. For example, many cards pass through 4K60 to the TV but only capture at 1080p60. Check both specs — they're different.

Q: Can I use a regular HDMI cable?
A: Yes for passthrough. For high-bandwidth capture (4K60+ via USB), use a quality certified USB cable — cheap cables can bottleneck the bandwidth and cause frame drops.

Q: Which capture cards work with OBS?
A: Nearly all — most cards are UVC-compliant and appear as a video source in OBS without any drivers. Elgato, AVerMedia, and Razer all work natively in OBS.

Common mistakes:
- Buying a capture card when streaming from the same PC (not needed)
- Only checking passthrough resolution, not the lower capture resolution
- Using a poor-quality USB cable that bottlenecks 4K capture bandwidth
- Not disabling HDCP on the console before trying to capture (HDCP-protected output cannot be captured)
- Buying an internal PCIe card without a free PCIe slot available`,
    metadata: { category: 'support', topic: 'capture-cards-compatibility-faq' },
  },

  // ── AIO Liquid Coolers: Buying Guide & Overview ───────────────────────────
  {
    content: `AIO Liquid Cooler Buying Guide — All-In-One CPU Coolers:

Radiator size guide:
- 240mm (2×120mm fans): suits budget-to-mid builds; fits most mid-tower cases; handles up to ~250W TDP
- 280mm (2×140mm fans): modest step up in cooling capacity; quieter at same temps; not all cases support it
- 360mm (3×120mm fans): enthusiast sweet spot; comfortably handles flagship CPUs like Ryzen 9 9950X, Core Ultra 9 285K; fits most mid/full-tower cases
- 420mm (3×140mm fans): maximum cooling headroom; for extreme overclocking or the highest-TDP CPUs; only fits large cases

AIO vs air cooling — when AIOs make sense:
- For most gaming CPUs, a premium air cooler performs within a few degrees of a similarly-priced AIO
- Choose an AIO when: your case favors radiator mounting over tall towers, you're cooling a very high-TDP flagship CPU, or you prefer the aesthetic (no big heatsink blocking the view)
- Air coolers: simpler, no pump to fail, no leak risk, often quieter, better long-term reliability
- AIOs: better aesthetics, easier RAM clearance, better for top-radiator mounting in compact cases

LCD pump displays:
- NZXT Kraken Elite, Lian Li Galahad II LCD, Corsair H170i LCD, DeepCool LT/Mystique series all include a small LCD on the pump
- Shows temps, custom images, or GIFs — purely cosmetic, no cooling benefit
- Adds significant cost — skip if you don't specifically want it

Key recommendations:
- Best value AIO at any size: Arctic Liquid Freezer II (comes in 240/280/360/420mm) — exceptional cooling per dollar, includes unique 40mm VRM fan on the pump
- Best quiet AIO: be quiet! Silent Loop 2 — engineered specifically for low noise with Silent Wings fans
- Best LCD AIO: NZXT Kraken Elite — mature NZXT CAM software, circular display, 6-year warranty

Pump lifespan: AIO pumps are rated ~50,000–70,000 hours (~6–8+ years). They are sealed and non-serviceable — when the pump fails, replace the entire unit.`,
    metadata: { category: 'products', topic: 'aio-coolers-buying-guide' },
  },

  // ── AIO Liquid Coolers: Entry 240mm ──────────────────────────────────────
  {
    content: `AIO Liquid Coolers — Entry Level 240mm:
These are the most affordable AIOs we carry, ideal for budget builds wanting the AIO aesthetic without spending much.

Cooler Master MasterLiquid ML240L V2 (ARGB):
- Radiator: 240mm | Fans: 2×120mm ARGB PWM | TDP: ~200W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Best for: Budget builds wanting a basic AIO aesthetic
- Avoid if: pairing with a high-TDP CPU — limited headroom

DeepCool LS520:
- Radiator: 240mm | Fans: 2×120mm ARGB PWM | TDP: ~220W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Standout: distinctive infinity-mirror pump cap at a budget price
- Best for: Budget builds wanting a unique visual element

be quiet! Pure Loop 2 240:
- Radiator: 240mm | Fans: 2×120mm Pure Wings 3 PWM | TDP: ~220W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Standout: quiet operation, clean aesthetic with no RGB (great for understated builds)
- Best for: Budget builds prioritizing quiet over RGB

Thermalright Frozen Notte 240:
- Radiator: 240mm | Fans: 2×120mm ARGB PWM | TDP: ~220–250W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Standout: excellent value, Thermalright's reputation for price-to-performance
- Best for: Budget builds wanting the most cooling for the money at entry level

All entry AIOs pair well with: Ryzen 5 9600X, Core Ultra 5 245K, or any mid-range CPU under 150W sustained load.`,
    metadata: { category: 'products', topic: 'aio-coolers-240mm-entry' },
  },

  // ── AIO Liquid Coolers: Budget 240mm ──────────────────────────────────────
  {
    content: `AIO Liquid Coolers — Budget 240mm (Step Up from Entry):
Better performance, longer warranties, and stronger brand ecosystems than entry-level 240mm AIOs.

Arctic Liquid Freezer II 240 (A-RGB):
- Radiator: 240mm | Fans: 2×120mm P12 PWM + 1×40mm VRM fan | TDP: ~250W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: unique 40mm fan on pump block cools nearby VRMs; exceptional value, best-performing 240mm AIO for the price
- Best for: Anyone wanting max 240mm performance per dollar — our top recommendation at this tier

Corsair iCUE H100i Elite RGB:
- Radiator: 240mm | Fans: 2×120mm ML120 RGB PWM | TDP: ~230W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Standout: mature Corsair iCUE software for RGB sync; great if you have other Corsair components
- Best for: Corsair-centric builds wanting ecosystem consistency

NZXT Kraken 240:
- Radiator: 240mm | Fans: 2×120mm Aer RGB 2 | TDP: ~230W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: infinity-mirror pump cap, strong NZXT CAM software, longest warranty at this tier
- Best for: NZXT-cased builds or users who want NZXT software ecosystem

Lian Li Galahad II 240:
- Radiator: 240mm | Fans: 2×120mm SL-Infinity ARGB | TDP: ~230W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Standout: attractive mirror fan aesthetic; competitive vs. Corsair/NZXT on price

Cooler Master MasterLiquid PL240 Flux:
- Radiator: 240mm | Fans: 2×120mm Flux ARGB | TDP: ~240W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Cooler Master ecosystem builds, step up from the ML240L V2

Phanteks Glacier One 240 D-RGB:
- Radiator: 240mm | Fans: 2×120mm D-RGB PWM | TDP: ~220W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Phanteks-cased builds wanting matching aesthetics`,
    metadata: { category: 'products', topic: 'aio-coolers-240mm-budget' },
  },

  // ── AIO Liquid Coolers: Mid-Range (280mm + LCD 240mm + 360mm value) ───────
  {
    content: `AIO Liquid Coolers — Mid-Range (280mm, LCD 240mm, Value 360mm):
A step up from budget 240mm AIOs, offering more cooling capacity or premium features like LCD displays.

Arctic Liquid Freezer II 280:
- Radiator: 280mm | Fans: 2×140mm P14 PWM + 1×40mm VRM fan | TDP: ~280W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: best value 280mm AIO; VRM fan included; exceptional cooling per dollar
- Best for: Mid-range builds with 280mm case support wanting top performance for the price

Corsair iCUE H115i Elite RGB:
- Radiator: 280mm | Fans: 2×140mm ML140 RGB | TDP: ~270W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Corsair-centric builds needing 280mm headroom

NZXT Kraken 280:
- Radiator: 280mm | Fans: 2×140mm Aer RGB 2 | TDP: ~270W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Best for: NZXT-cased systems; long warranty, infinity-mirror pump

be quiet! Pure Loop 2 280:
- Radiator: 280mm | Fans: 2×140mm Pure Wings 3 | TDP: ~260W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Best for: Mid-range builds prioritizing quietest possible operation; no RGB

DeepCool LT520 (240mm with LCD display):
- Radiator: 240mm | Fans: 2×120mm ARGB | TDP: ~250W | Display: 2.8-inch customizable LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Mid-range builds wanting an LCD display at an accessible price point

Thermalright Frozen Warframe 360 (value 360mm):
- Radiator: 360mm | Fans: 3×120mm ARGB | TDP: ~300W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Best for: Builds wanting 360mm capacity without paying enthusiast-tier pricing

Lian Li Galahad II LCD 280:
- Radiator: 280mm | Fans: 2×140mm SL-Infinity ARGB | TDP: ~270W | Display: 2.88-inch LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Mid-range builds wanting LCD display + distinctive SL-Infinity fan aesthetic

Note: 280mm case support is less universal than 240mm or 360mm — always verify your case supports a 280mm radiator before purchasing.`,
    metadata: { category: 'products', topic: 'aio-coolers-280mm-midrange' },
  },

  // ── AIO Liquid Coolers: Enthusiast 360mm ─────────────────────────────────
  {
    content: `AIO Liquid Coolers — Enthusiast 360mm:
The 360mm sweet spot for high-end gaming builds running flagship CPUs (Ryzen 9 9950X, Core Ultra 9 285K, Core i9 14900K, etc.).

Arctic Liquid Freezer II 360 (A-RGB):
- Radiator: 360mm | Fans: 3×120mm P12 PWM + 1×40mm VRM fan | TDP: ~350W+
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: rivals premium 360mm AIOs costing 2× more; best value at this tier; VRM fan included
- Best for: High-end builds wanting maximum 360mm performance per dollar — our top pick

Corsair iCUE H150i Elite RGB:
- Radiator: 360mm | Fans: 3×120mm ML120 RGB | TDP: ~320W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Corsair ecosystem builds running flagship CPUs

NZXT Kraken Elite 360:
- Radiator: 360mm | Fans: 3×120mm Aer RGB 2 | TDP: ~320W | Display: 2.36-inch circular LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: customizable circular LCD with NZXT CAM; pioneer of the pump display trend
- Best for: High-end builds wanting an LCD display alongside strong 360mm cooling

Lian Li Galahad II Trinity 360:
- Radiator: 360mm | Fans: 3×120mm SL-Infinity ARGB + integrated pump fan | TDP: ~320W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Standout: unique pump-integrated fan improves airflow over nearby VRMs/RAM

DeepCool LT720:
- Radiator: 360mm | Fans: 3×120mm ARGB | TDP: ~320W | Display: 3.35-inch LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Standout: one of the largest LCD displays at this tier at a competitive price

be quiet! Silent Loop 2 360:
- Radiator: 360mm | Fans: 3×120mm Silent Wings 4 | TDP: ~320W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 3 years
- Standout: among the quietest 360mm AIOs available; no RGB, clean aesthetic
- Best for: Silent high-end builds — the quietest 360mm AIO we carry

Cooler Master MasterLiquid PL360 Flux:
- Radiator: 360mm | Fans: 3×120mm Flux ARGB | TDP: ~300W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: Cooler Master ecosystem builds wanting 360mm capacity`,
    metadata: { category: 'products', topic: 'aio-coolers-360mm-enthusiast' },
  },

  // ── AIO Liquid Coolers: Flagship (420mm + Premium 360mm LCD) ──────────────
  {
    content: `AIO Liquid Coolers — Flagship (420mm + Premium 360mm LCD):
Maximum cooling headroom for extreme builds, overclocking, and showcase PCs with premium displays.

Arctic Liquid Freezer II 420:
- Radiator: 420mm | Fans: 3×140mm P14 PWM + 1×40mm VRM fan | TDP: ~400W+
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: maximum cooling at the best price; VRM fan included; only fits larger cases
- Best for: Extreme builds wanting 420mm headroom at the best value

Corsair iCUE LINK H170i LCD (420mm):
- Radiator: 420mm | Fans: 3×140mm iCUE LINK RX140 | TDP: ~400W+ | Display: 2.1-inch square LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: iCUE LINK daisy-chain wiring simplifies cable management for multiple components
- Best for: Premium Corsair-centric builds with a large case

NZXT Kraken Elite 420:
- Radiator: 420mm | Fans: 3×140mm Aer RGB 2 | TDP: ~400W+ | Display: 2.36-inch circular LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: customizable circular LCD with mature NZXT CAM; maximum cooling headroom
- Best for: Large-case builds wanting NZXT aesthetics + maximum cooling

DeepCool Mystique 360 (flagship 360mm):
- Radiator: 360mm | Fans: 3×120mm ARGB | TDP: ~320W | Display: 3.99-inch large LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Standout: among the largest pump LCD displays on any consumer AIO
- Best for: Showcase builds where the pump display is a centerpiece

Lian Li Galahad II LCD 360 (flagship 360mm):
- Radiator: 360mm | Fans: 3×120mm SL-Infinity ARGB | TDP: ~320W | Display: 2.88-inch LCD
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 5 years
- Best for: High-end builds wanting LCD + distinctive SL-Infinity mirror fan aesthetic

Cooler Master MasterLiquid ML360 Sub-Zero (extreme — TEC cooler):
- Radiator: 360mm | TDP: ~280W conventional + sub-ambient TEC element
- Sockets: AM4, LGA1200, LGA1700 (verify AM5/LGA1851 support) | Warranty: 2 years
- Standout: uses a Peltier TEC element to achieve sub-ambient CPU temperatures — below 0°C
- Best for: Extreme overclocking enthusiasts specifically targeting sub-ambient temps
- Caution: requires condensation management, significant added complexity and cost; not for typical gaming builds

Note: 420mm radiators only fit larger mid-tower and full-tower cases — always verify your case's max radiator support before purchasing.`,
    metadata: { category: 'products', topic: 'aio-coolers-420mm-flagship' },
  },

  // ── Air Coolers: Buying Guide & Overview ─────────────────────────────────
  {
    content: `CPU Air Cooler Buying Guide:

Single-tower vs dual-tower:
- Single-tower: one fin stack, 1-2 fans — compact, better RAM/case clearance, suits CPUs up to ~65-150W sustained; good for mid-range builds
- Dual-tower: two fin stacks with 2 fans — significantly more surface area, handles high-TDP CPUs (Ryzen 9, Core i9, Core Ultra 9, 170W+), but needs more case clearance and can conflict with tall RAM

Can air coolers compete with liquid cooling (AIOs)?
- YES for most gaming builds — a good dual-tower air cooler (Noctua NH-D15, Thermalright Phantom Spirit 120) performs within a few degrees of a 240-280mm AIO at a lower price with no pump failure or leak risk
- AIOs only pull clearly ahead for the very highest-TDP CPUs under sustained heavy all-core loads, or when a case layout strongly favors radiator mounting

Key recommendations:
- Best value overall: Thermalright Peerless Assassin 120 SE — dual-tower cooling rivaling coolers 2-3x its price
- Best single-tower value: DeepCool AK400 — punches well above its price in a compact footprint
- Best for high-end CPUs: Noctua NH-D15 or Thermalright Frost Commander 140
- Quietest: be quiet! Dark Rock Pro 4/5 — engineered specifically for near-silent operation
- Best for tall RGB RAM: Noctua NH-D15S — asymmetric offset fin stack avoids RAM slot conflicts
- Best flagship on a budget: Thermalright Frost Commander 140 (Black ARGB) — flagship-tier cooling for much less than Noctua

TDP ratings guide:
- ~130-180W: suits entry to mid CPUs (Ryzen 5, Core i5 non-K)
- ~180-260W: handles mid to high-end CPUs (Ryzen 7, Core i7, Core i5-K)
- ~260-300W+: required for flagship CPUs (Ryzen 9, Core i9, Core Ultra 9)

RAM and case clearance tips:
- Always check the cooler's height against your case's maximum CPU cooler clearance spec
- Dual-tower coolers can overhang DIMM slots — check RAM height vs. cooler's RAM clearance spec
- Budget and compact cases often restrict height to 155-160mm — verify before buying a tall dual-tower
- If using very tall RGB RAM: choose the Noctua NH-D15S (offset design) or ask us for clearance advice`,
    metadata: { category: 'products', topic: 'air-coolers-buying-guide' },
  },

  // ── Air Coolers: Entry Level ──────────────────────────────────────────────
  {
    content: `CPU Air Coolers — Entry Level (Single Tower, Budget):
Great upgrade over stock coolers at the lowest price. Best for mid-range CPUs (Ryzen 5, Core i5 non-K, Core i3).

Cooler Master Hyper 212 Black Edition:
- Type: Single tower | Height: 159mm | Fans: 1×120mm PWM | TDP: ~150-180W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 2 years
- Legendary budget cooler — one of the best-selling CPU coolers of all time
- Best for: Budget builds wanting a proven, familiar name at the lowest price
- Dual-fan kit available separately for added performance

Arctic Freezer 12:
- Type: Single tower | Height: 150mm | Fans: 1×120mm PWM | TDP: ~130-150W
- Sockets: AM4, LGA1200, LGA1700 | Noise: ~22.5 dBA (very quiet for the tier)
- Best for: Budget builds prioritizing quiet operation; most compact height option

DeepCool GAMMAXX 400 (RGB):
- Type: Single tower | Height: 155mm | Fans: 1×120mm RGB | TDP: ~130W
- Sockets: AM4, LGA1200, LGA1700
- Best for: Budget builds wanting RGB lighting at the lowest possible price

be quiet! Pure Rock 2:
- Type: Single tower | Height: 155mm | Fans: 1×120mm Pure Wings 2 | TDP: ~150W | Noise: ~25.5 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Budget builds prioritizing quiet operation; clean black aesthetic with no RGB
- Community favorite for quiet budget cooling

Thermalright Assassin X 120 (SE):
- Type: Single tower | Height: 155mm | Fans: 1×120mm PWM | TDP: ~180-220W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: exceptional performance for its very low price — Thermalright's value reputation at entry level
- Best for: Budget builds wanting the most cooling per dollar; handles higher-TDP CPUs than most entry coolers

All entry air coolers pair well with: Ryzen 5 9600X, Core Ultra 5 245K, Core i5 13400F, or any CPU under 125W sustained TDP.`,
    metadata: { category: 'products', topic: 'air-coolers-entry' },
  },

  // ── Air Coolers: Budget-to-Mid (Best Value) ───────────────────────────────
  {
    content: `CPU Air Coolers — Budget-to-Mid (Best Value Options):
Exceptional cooling performance at budget prices. The Peerless Assassin 120 SE is one of the most recommended coolers ever made.

Thermalright Peerless Assassin 120 SE ⭐ Community Favorite:
- Type: Dual tower | Height: 157mm | Fans: 2×120mm PWM included | TDP: ~220-260W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Noise: ~25.6 dBA
- Standout: dual-tower cooling rivaling premium coolers 2-3x its price — the single best value cooler on the market
- Best for: Any budget-to-mid build wanting the most cooling for the money; handles Ryzen 7, Core i7
- Caveat: RAM clearance can be tight with very tall RGB RAM kits

DeepCool AK400 ⭐ Community Favorite:
- Type: Single tower | Height: 155.6mm | Fans: 1×120mm PWM | TDP: ~220W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: best-performing compact single-tower at this price; Digital variant adds a temperature display
- Best for: Builds wanting strong single-tower performance in a RAM/case-clearance-friendly footprint

Arctic Freezer 34 eSports Duo:
- Type: Compact tower (push-pull dual fan) | Height: 157mm | Fans: 2×120mm PWM | TDP: ~210W | Noise: ~22.5 dBA
- Sockets: AM4, LGA1200, LGA1700 (verify AM5)
- Standout: push-pull configuration + distinctive color accent options (red, yellow, green, blue) at a budget price
- Best for: Builds wanting push-pull performance and some visual personalization without an RGB premium

Cooler Master Hyper 212 Halo:
- Type: Single tower | Height: 159mm | Fans: 1×120mm ARGB | TDP: ~180-200W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Budget-to-mid builds wanting ARGB lighting from the trusted Hyper 212 lineage

be quiet! Shadow Rock Core:
- Type: Single tower | Height: 160mm | Fans: 1×120mm Pure Wings 2 | TDP: ~190W | Noise: ~24.5 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Budget-to-mid builds prioritizing quiet operation over maximum performance per dollar

Noctua NH-U12S Redux:
- Type: Single tower | Height: 158mm | Fans: 1×120mm NF-P12 Redux | TDP: ~150-180W | Noise: ~22.4 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Best for: Builds wanting Noctua's renowned build quality and reliability at a more accessible price (grey/black colorway, simplified bundle)`,
    metadata: { category: 'products', topic: 'air-coolers-budget-mid' },
  },

  // ── Air Coolers: Mid-Range ────────────────────────────────────────────────
  {
    content: `CPU Air Coolers — Mid-Range (Single & Dual Tower):
Premium single-tower performance and entry into enthusiast dual-tower territory. Good for Ryzen 7, Core i7, Core i5-K builds.

Noctua NH-U12S (+ chromax.black):
- Type: Single tower | Height: 158mm | Fans: 1×120mm NF-F12 | TDP: ~150-180W | Noise: ~22.4 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: Noctua's benchmark for single-tower quality — exceptional build quality, near-silent, ultra-reliable
- Best for: Mid-range builds prioritizing quiet operation and long-term reliability; compact single-tower profile
- Available in chromax.black for an all-black build

DeepCool AK620 (+ Digital) ⭐ Community Favorite:
- Type: Dual tower | Height: 160mm (162mm Digital) | Fans: 2×120mm PWM included | TDP: ~260W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: rivals premium flagship coolers at a mid-range price; Digital variant adds real-time temperature display on the top of the cooler
- Best for: Mid to high-end builds wanting near-flagship cooling without flagship pricing

Thermalright Phantom Spirit 120 (SE) ⭐ Community Favorite:
- Type: Dual tower | Height: 158mm | Fans: 2×120mm PWM included | TDP: ~270W | Noise: ~25.6 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: matches or exceeds premium coolers costing significantly more — often compared to the AK620 as equally outstanding value
- Best for: Mid to high-end builds wanting the absolute best cooling performance for the money

Cooler Master Hyper 622 Halo:
- Type: Dual tower | Height: 158mm | Fans: 2×120mm ARGB included | TDP: ~220W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Mid-range builds wanting ARGB lighting on a dual-tower cooler from a trusted brand

be quiet! Shadow Rock 3:
- Type: Single tower | Height: 163mm | Fans: 1×135mm Silent Wings | TDP: ~190W | Noise: ~24.3 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Builds prioritizing the quietest possible single-tower operation; larger 135mm fan improves noise/airflow ratio

Arctic Freezer i35 / Freezer 36:
- Type: Single tower | Height: 157mm | Fans: 1×120mm P12 PWM | TDP: ~200W | Noise: ~22.7 dBA
- Sockets: Intel LGA (i35 naming) / AMD AM4+AM5 (Freezer 36 naming)
- Best for: Mid-range builds wanting strong single-tower value at a competitive Arctic price

Phanteks Glacier T30-120:
- Type: Single tower | Height: 155mm | Fans: 1×120mm PWM | TDP: ~180-220W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Best for: Mid-range builds, especially in a Phanteks-cased system wanting matching aesthetics`,
    metadata: { category: 'products', topic: 'air-coolers-midrange' },
  },

  // ── Air Coolers: Enthusiast Dual-Tower ───────────────────────────────────
  {
    content: `CPU Air Coolers — Enthusiast Dual-Tower:
High-end dual-tower coolers for flagship CPUs (Ryzen 9 9950X, Core Ultra 9 285K, Core i9). Rival or match 280-360mm AIOs.

Noctua NH-D15 ⭐ Legendary — The Benchmark Air Cooler:
- Type: Dual tower | Height: 165mm | Fans: 2×140mm NF-A15 included | TDP: ~220-250W (handles much more in testing)
- Sockets: AM4, AM5, LGA1200, LGA1700 | Noise: ~24.6 dBA | Warranty: 6 years
- Standout: one of the most famous CPU coolers ever made — benchmark reference for air cooling for over a decade
- Best for: High-end builds wanting the most trusted, best-tested air cooler available
- Caveat: large — 165mm height and wide design; check case and RAM clearance. Brown/beige colorway (chromax.black available separately)

Noctua NH-D15S (RAM-clearance-friendly variant):
- Type: Dual tower (asymmetric offset fin stack) | Height: 165mm | Fans: 1×140mm NF-A15 | TDP: ~220-250W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Standout: offset fin-stack design avoids overhanging the first RAM slot — the go-to if you have very tall RGB RAM
- Ships with one fan (second fan mount available); slightly less cooling than the standard NH-D15 with one fan

be quiet! Dark Rock Pro 4:
- Type: Dual tower | Height: 163mm | Fans: 1×135mm + 1×120mm Silent Wings | TDP: ~250W | Noise: ~24.3 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700 | 7 heatpipes
- Standout: among the quietest high-end air coolers available; all-black aesthetic popular for stealth builds
- Best for: High-end builds prioritizing the quietest possible operation at this performance tier

Thermalright Frost Commander 140 ⭐:
- Type: Dual tower | Height: 158-162mm | Fans: 2×140mm PWM included | TDP: ~300W
- Sockets: AM4, AM5, LGA1200, LGA1700 | Noise: ~25 dBA
- Standout: flagship-level cooling capacity at a price well below Noctua/be quiet! competitors; 140mm fans maximize airflow
- Best for: Enthusiasts wanting maximum air cooling performance at the best possible price

DeepCool AK620 Digital:
- Type: Dual tower | Height: 162mm | Fans: 2×120mm PWM included | TDP: ~260W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: same excellent AK620 cooling with an added real-time CPU temperature display on the cooler top
- Best for: Enthusiasts wanting AK620 performance plus a monitoring display

Cooler Master MA624 Stealth:
- Type: Dual tower | Height: 163mm | Fans: 2×120mm PWM included | TDP: ~250W
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: distinctive all-black stealth aesthetic with sandblasted nickel-plated fins
- Best for: High-end builds where all-black aesthetics are the priority

Phanteks PH-TC14PE (Classic):
- Type: Dual tower | Height: 163mm | Fans: 2×140mm PWM included | TDP: ~200-250W
- Standout: long-running classic with distinctive color accent options; verify AM5/LGA1851 mounting kit availability before buying`,
    metadata: { category: 'products', topic: 'air-coolers-enthusiast' },
  },

  // ── Air Coolers: Flagship ─────────────────────────────────────────────────
  {
    content: `CPU Air Coolers — Flagship:
The best air coolers money can buy. Rival or exceed 360mm AIOs for most gaming CPUs.

Noctua NH-D15 chromax.black ⭐ Community Favorite:
- Type: Dual tower | Height: 165mm | Fans: 2×140mm NF-A15 chromax.black | TDP: ~220-250W+ | Noise: ~24.6 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700 | Warranty: 6 years
- Same legendary cooling performance as the standard NH-D15 in a fully all-black colorway — no brown/beige
- Best for: High-end gaming builds wanting Noctua's benchmark performance with a modern all-black aesthetic
- Costs a bit more than the standard brown NH-D15 for the colorway alone

Noctua NH-D15 G2 (Next Generation):
- Type: Dual tower | Height: 160-168mm | Fans: 2×140mm NF-A14x25r G2 | TDP: ~250W+ | Noise: ~24.8 dBA
- Sockets: AM4, AM5, LGA1700, LGA1851 (new SecuFirm3 mounting — no separate kit needed for newest sockets)
- Standout: Noctua's 2024 redesign — improved fin geometry, revised heatpipe layout, improved thermal performance over original NH-D15; multiple height variants for different build scenarios
- Best for: Enthusiasts building on the newest platforms (AM5, LGA1851) wanting Noctua's latest engineering

be quiet! Dark Rock Pro 5:
- Type: Dual tower | Height: 163mm | Fans: 2×120mm Silent Wings 4 | TDP: ~270W | Noise: ~25.5 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700, LGA1851 (native support) | 7 heatpipes
- Standout: improved over the Dark Rock Pro 4 — more cooling capacity, same near-silent operation; native newest-socket support
- Best for: High-end builds prioritizing the quietest possible operation at flagship cooling performance

Thermalright Frost Commander 140 Black ARGB ⭐:
- Type: Dual tower | Height: 158-162mm | Fans: 2×140mm ARGB PWM included | TDP: ~300W | Noise: ~25 dBA
- Sockets: AM4, AM5, LGA1200, LGA1700
- Standout: flagship-tier cooling with ARGB lighting at a price well below Noctua/be quiet! — best value at flagship performance level
- Best for: Enthusiasts wanting RGB aesthetics with flagship-tier cooling at the best possible price

DeepCool Assassin IV:
- Type: Dual tower | Height: 170mm (tallest in our lineup) | Fans: 2×140mm PWM included | TDP: ~280-300W
- Sockets: AM4, AM5, LGA1200, LGA1700 | 7 heatpipes
- Standout: DeepCool's flagship answer to the NH-D15 tier; 7 heatpipes and large 140mm fans deliver top-tier thermal capacity
- Best for: Enthusiasts with large cases who want DeepCool's flagship at a competitive price vs. Noctua/be quiet!
- Important: 170mm height is among the tallest available — verify case clearance carefully before purchasing`,
    metadata: { category: 'products', topic: 'air-coolers-flagship' },
  },

  // ── Air Coolers: Compatibility, FAQs & Common Mistakes ───────────────────
  {
    content: `CPU Air Cooler Compatibility, FAQs & Common Mistakes:

Socket compatibility:
- All coolers we carry support AM4, AM5, LGA1200, and LGA1700
- Some older cooler models may need a separately requested mounting kit for the newest sockets (AM5, LGA1851) — we can confirm before you buy
- The Noctua NH-D15 G2 and be quiet! Dark Rock Pro 5 have native LGA1851 support built in

Case clearance — most common return reason:
- Always check your case's maximum CPU cooler height against the cooler you're buying
- Budget and compact cases: often limited to 155-160mm — fits most single-tower and budget dual-tower coolers
- Standard mid-tower cases: typically support up to 160-165mm — fits nearly all coolers
- DeepCool Assassin IV (170mm) may not fit some mid-tower cases — always verify

RAM clearance with dual-tower coolers:
- Many dual-tower coolers overhang the first DIMM slot — check the cooler's published RAM clearance spec
- Very tall RGB RAM heat spreaders (47mm+) can physically conflict with the lower fan/fin stack
- Best solution for tall RAM + high-end build: Noctua NH-D15S (asymmetric offset design)

Does it come with thermal paste?
- Yes — all coolers ship with thermal paste pre-applied or included in the box. No need to buy separate paste.

FAQs:
Q: Should I get an air cooler or AIO?
A: For most gaming builds, a premium dual-tower air cooler performs within a few degrees of a 240-280mm AIO at lower cost with no pump/leak risk. Choose an AIO mainly for aesthetics, specific case layouts, or the absolute highest-TDP flagship CPUs.

Q: Is a bigger, more expensive cooler always better?
A: No — a 250W-rated cooler on a 65W CPU wastes money and case space. Match the cooler to your CPU's actual power draw.

Q: How often should I replace thermal paste?
A: Every 3-5 years for a typical gaming PC, or sooner if temperatures rise unexpectedly.

Q: Do I need to remove the stock motherboard backplate?
A: Most coolers include their own backplate and hardware. Some cases and boards may require partial disassembly — follow the included installation guide.

Common mistakes:
- Not checking case clearance — most common reason coolers get returned
- Forgetting RAM height — tall RGB kits can conflict with dual-tower fin stacks
- Assuming stock coolers handle sustained boost — stock coolers are sized for base clocks only; most gaming CPUs benefit from an aftermarket cooler
- Overtightening mounting screws — follow the diagonal/star tightening pattern in stages for even contact pressure`,
    metadata: { category: 'support', topic: 'air-coolers-compatibility-faq' },
  },

  // ── AIO Liquid Coolers: Compatibility, FAQs & Common Mistakes ─────────────
  {
    content: `AIO Liquid Cooler Compatibility, FAQs & Common Mistakes:

Socket compatibility:
- All AIOs we carry support AM4, AM5, LGA1200, and LGA1700 (newer LGA1851 may need a bracket update on older AIO models — ask us to confirm)
- Always verify AM5 or LGA1851 support on older AIO units; manufacturers sometimes require requesting an updated mounting bracket

Radiator clearance — most common mistake:
- Always check your case's maximum supported radiator size AND thickness (with fans mounted) before buying
- 240mm fits almost all mid-tower cases; 280mm has less universal support; 360mm fits most mid/full-tower cases; 420mm only fits larger cases
- Front-mount radiators may conflict with drive cages in some cases — check your specific case specs

Pump orientation matters:
- Best orientation: tubes pointing downward or to the side — keeps the pump impeller submerged
- Avoid: tubes pointing straight up — can accelerate air bubbles around the pump, adding noise and wear
- Top-mount radiator installs are common and fine; check the manufacturer's orientation guide for unusual positions

FAQs:
Q: Do AIOs need maintenance?
A: No — they're sealed, non-serviceable units. No coolant to top off, no filter to clean.

Q: Is gurgling normal?
A: Occasional gurgling (especially after moving the PC) is normal and usually resolves on its own. Persistent loud gurgling or rising-pitch whine may indicate pump wear.

Q: Can an AIO leak and damage my PC?
A: Rare with reputable brands, but not impossible. Choose an established brand, avoid pinching tubes, and follow correct orientation to minimize risk.

Q: Do I need push-pull fans?
A: No — single-fan (push) configuration is sufficient for virtually all gaming builds. Push-pull adds modest cooling improvement at the cost of extra noise, fans, and clearance.

Q: How long do AIOs last?
A: Quality AIOs are rated for 6–8+ years. Warranty length (often 5–6 years for premium brands) is a good reliability indicator.

Common mistakes:
- Buying a 360/420mm AIO without confirming case radiator clearance — the most frequent compatibility issue
- Mounting pump in an unsupported orientation (tubes straight up)
- Assuming bigger radiator always means quieter — fan quality matters as much as size
- Not checking RGB software ecosystem compatibility between the AIO and other components (Corsair iCUE, NZXT CAM, Lian Li L-Connect don't always sync across brands)

Upgrade advice:
- Upgrading from stock cooler or budget air: only worthwhile for high-TDP CPUs, specific case layouts, or aesthetics — a premium air cooler often matches AIO performance for less
- If upgrading your CPU and have an older 240mm AIO: check the AIO's rated TDP against the new CPU's sustained power draw — a 240mm unit may not keep up with a 170W+ flagship CPU under sustained all-core loads`,
    metadata: { category: 'support', topic: 'aio-coolers-compatibility-faq' },
  },
];

async function main() {
  console.log(`Ingesting ${documents.length} documents into Supabase…\n`);

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    process.stdout.write(`[${i + 1}/${documents.length}] ${doc.metadata.topic}… `);
    try {
      await ingest(doc.content, doc.metadata);
      console.log('✓');
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }
  }

  console.log('\nDone! Knowledge base is ready.');
}

main();
