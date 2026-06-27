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
    content: `About our workshop:
We specialize in the sale of high-quality PC components and custom computer assembly services.
Customers can purchase individual parts such as CPUs, GPUs, motherboards, RAM, storage devices,
power supplies, and peripherals, or have our experienced technicians build a fully customized PC
tailored to their needs and budget.
Every assembled computer is professionally tested to ensure reliability and optimal performance
before delivery.`,
    metadata: { category: 'about', topic: 'overview' },
  },

  // ── Assembly service & discount ───────────────────────────────────────────
  {
    content: `Custom PC assembly service:
Our experienced technicians will build a fully customized computer based on the customer's
specific needs and budget. We offer expert component selection guidance if the customer is unsure
what to choose.

10% discount offer:
Customers who purchase ALL the components for a complete PC from our shop AND choose our
assembly service receive a 10% discount on their total order. This applies to the entire order
(components + assembly fee). To qualify, every component in the build must be purchased from us.

Every assembled PC is professionally tested before delivery to ensure reliability and
optimal performance.`,
    metadata: { category: 'service', topic: 'assembly-and-discount' },
  },

  // ── Products: CPUs ────────────────────────────────────────────────────────
  {
    content: `CPUs (Processors) we carry:
We stock the latest processors from both AMD and Intel for all budgets.

AMD Ryzen 9000 series (Zen 5, AM5 socket) — latest generation:
- AMD Ryzen 5 9600X — excellent mid-range gaming CPU, 6 cores / 12 threads
- AMD Ryzen 7 9700X — high-performance 8-core CPU, great for gaming + streaming
- AMD Ryzen 9 9900X — 12-core powerhouse for heavy multitasking
- AMD Ryzen 9 9950X — flagship 16-core CPU for professional workloads

Intel Core Ultra 200 series (Arrow Lake, LGA1851 socket) — latest generation:
- Intel Core Ultra 5 245K — strong mid-range gaming performance
- Intel Core Ultra 7 265K — excellent all-rounder for gaming and creative work
- Intel Core Ultra 9 285K — Intel's top-of-the-line consumer CPU

We also carry previous-gen AMD Ryzen 7000 and Intel 13th/14th gen CPUs at reduced prices.
All CPUs come with manufacturer warranty. We can advise on motherboard compatibility.`,
    metadata: { category: 'products', topic: 'cpus' },
  },

  // ── Products: GPUs ────────────────────────────────────────────────────────
  {
    content: `GPUs (Graphics Cards) we carry:
We carry the latest NVIDIA RTX 50 series and AMD RX 9000 series, as well as previous-gen cards.

NVIDIA GeForce RTX 50 series (Blackwell) — latest generation:
- NVIDIA GeForce RTX 5060 Ti — great budget-friendly 1080p/1440p card
- NVIDIA GeForce RTX 5070 — excellent 1440p gaming with DLSS 4 support
- NVIDIA GeForce RTX 5070 Ti — high-end 1440p/4K gaming
- NVIDIA GeForce RTX 5080 — near-flagship performance for 4K gaming
- NVIDIA GeForce RTX 5090 — the most powerful consumer GPU ever made, 32GB GDDR7, ideal for 4K gaming, AI, and professional creative work

AMD Radeon RX 9000 series (RDNA 4) — latest generation:
- AMD Radeon RX 9070 — strong 1440p gaming, excellent price-to-performance
- AMD Radeon RX 9070 XT — high-end 1440p and capable 4K gaming

Previous generation (still available at lower prices):
- NVIDIA RTX 4070, RTX 4080, RTX 4090
- AMD RX 7800 XT, RX 7900 XTX

We can advise on which GPU best matches your CPU, resolution, and use case.`,
    metadata: { category: 'products', topic: 'gpus' },
  },

  // ── Products: RAM & Storage ───────────────────────────────────────────────
  {
    content: `RAM (Memory) we carry:
- DDR4: 16GB kits (2x8GB) and 32GB kits (2x16GB) — compatible with older platforms
- DDR5: 16GB, 32GB, and 64GB kits — required for Intel 12th gen+ and AMD Ryzen 7000 series
We carry brands including Corsair, G.Skill, Kingston, and Crucial.

Storage devices we carry:
- NVMe SSDs (PCIe 4.0 and 5.0): 500GB, 1TB, 2TB, 4TB options
- SATA SSDs: budget-friendly 2.5" drives
- HDDs: 1TB to 8TB for mass storage / NAS use
Brands: Samsung, WD, Seagate, Kingston, Crucial.`,
    metadata: { category: 'products', topic: 'ram-and-storage' },
  },

  // ── Products: Motherboards, PSUs, Cases ───────────────────────────────────
  {
    content: `Motherboards:
We stock motherboards for all current platforms:
- AMD AM5 socket — for Ryzen 7000 and Ryzen 9000 series (X670, B650, X870, B850 chipsets)
- Intel LGA1851 socket — for Core Ultra 200 series / Arrow Lake (Z890, B860 chipsets)
- Intel LGA1700 socket — for 12th, 13th, and 14th gen Core processors (still available)
Brands: ASUS, MSI, Gigabyte, ASRock.

Power Supplies (PSUs):
We carry 80+ Bronze, Gold, and Platinum certified PSUs from 500W to 1200W.
Brands: Corsair, Seasonic, be quiet!, EVGA.

Cases:
Mid-tower and full-tower cases in various styles, with and without RGB.
We can help select a case based on your component sizes (GPU length, CPU cooler height).

Peripherals:
Gaming mice, keyboards (mechanical and membrane), monitors (1080p, 1440p, 4K, up to 360Hz),
headsets, and webcams.`,
    metadata: { category: 'products', topic: 'motherboards-psus-cases-peripherals' },
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
- GPU power requirements must be met by the PSU — the RTX 5090 can draw up to 575W alone, so a high-wattage PSU (1000W+) is recommended for high-end builds
- Case must fit the GPU length and CPU cooler height (high-end GPUs like the RTX 5090 are very large)
- NVMe slots: check how many M.2 slots the motherboard has and which PCIe generations they support
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
- Requesting a callback by leaving your name and email

For order support (tracking, delivery updates), please provide your order ID (e.g. ORD-1001)
and we can check the status instantly.

We offer:
- Free compatibility advice before purchase
- Post-build support and warranty service
- Upgrade consultations for existing systems`,
    metadata: { category: 'support', topic: 'contact-and-service' },
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
