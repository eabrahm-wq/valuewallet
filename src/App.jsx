import { useState, useMemo } from "react";

// ─── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  bg: "#FAFAF8", surface: "#FFFFFF", surfaceAlt: "#F5F2ED",
  border: "#EEEAE4", borderStrong: "#DDD8D0",
  text: "#1A1714", textSub: "#5C5650", textMuted: "#9B958D",
  accent: "#E8622A", accentSoft: "#FEF0EA",
  green: "#2D7A4F", greenSoft: "#EAF5EE",
  amber: "#C47A1E", amberSoft: "#FDF6E8",
  red: "#C04040", redSoft: "#FDEAEA",
  radius: 16, radiusSm: 10, radiusXs: 6,
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const INTENSITY_WEIGHTS = { 0: 0, 1: 1, 2: 2, 3: 4 };
const INTENSITY_LABELS  = ["Off", "Somewhat", "Important", "Must-Have"];

const VALUES = [
  { id: "independent",   label: "Independent Ownership", short: "Indep.",      emoji: "🏠", cluster: "Ownership",    color: "#E8622A", soft: "#FEF0EA",
    desc: "No PE, VC, or corporate chains.",
    why:  "Your money stays with founders, families, and local operators — not Wall Street funds extracting profit from your neighbourhood." },
  { id: "sourcing",      label: "Transparent Sourcing",  short: "Sourcing",    emoji: "🌱", cluster: "Supply Chain", color: "#2D7A4F", soft: "#EAF5EE",
    desc: "Named farms, real relationships.",
    why:  "Named farms, published relationships, and prices paid above commodity. Not just a feel-good label." },
  { id: "organic",       label: "Organic & Clean",        short: "Organic",     emoji: "🌿", cluster: "Supply Chain", color: "#5A7A3A", soft: "#F0F5EA",
    desc: "No harmful pesticides. Verified, not claimed.",
    why:  "Certified organic or verifiably clean inputs. Better for farmers, communities, and you." },
  { id: "living_wage",   label: "Living Wage",             short: "Wages",       emoji: "💸", cluster: "Labor",        color: "#1A6B9A", soft: "#EEF5FB",
    desc: "Workers paid enough to live here.",
    why:  "Documented above-minimum wages, transparent pay, or a living wage certification." },
  { id: "worker_owned",  label: "Worker Ownership",        short: "Worker-owned",emoji: "🤝", cluster: "Labor",        color: "#7C4DFF", soft: "#F0EEFF",
    desc: "Employees with equity, not just wages.",
    why:  "Co-ops, ESOPs, or equity sharing. Workers have a real stake in the outcome." },
  { id: "community",     label: "Community Rooted",        short: "Community",   emoji: "🏘", cluster: "Community",   color: "#C97A1A", soft: "#FDF5EA",
    desc: "Locally founded, reinvests in the neighbourhood.",
    why:  "Founded locally, operated locally, and reinvesting in the neighbourhood through hiring, events, or sourcing." },
  { id: "diverse_owned", label: "Diverse Ownership",       short: "Diverse",     emoji: "✊", cluster: "Community",   color: "#B5338A", soft: "#FCEEF7",
    desc: "Women, BIPOC, LGBTQ+ founders.",
    why:  "Ownership by women, BIPOC, LGBTQ+, or other underrepresented founders — verified, not assumed." },
  { id: "climate",       label: "Climate Conscious",       short: "Climate",     emoji: "🌍", cluster: "Environment", color: "#0B7A75", soft: "#E8F5F4",
    desc: "B Corp, renewables, real reductions.",
    why:  "B Corp certification, verified renewable energy, or documented carbon reduction — not just 'we care'." },
];

const CITIES = [
  { id: "sf", label: "San Francisco", neighborhoods: ["Mission", "Bernal Heights", "Noe Valley", "Haight"] },
  { id: "nb", label: "Newport Beach", neighborhoods: ["Balboa Island", "Westcliff", "Corona del Mar", "Balboa Peninsula"] },
];

const PLACES = {
  Mission: [
    { name: "Grand Coffee",      address: "2663 Mission St",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Founded by Nabeel Silmi in 2010. Zero institutional funding.", sourcing: "Single-origin in-house roasting. Transparent sourcing.", community: "Mission-born, neighbourhood fixture for 14 years." },
      note: "Tiny, communal, always buzzing" },
    { name: "Linea Caffe",       address: "18 Mariposa St",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: true  },
      why: { independent: "Founded 2013 via SBA loans only. B Corp certified. Zero VC.", sourcing: "CCOF organic & biodynamic. Named farms in Ethiopia, Colombia, Bolivia.", organic: "CCOF Certified Organic. Biodynamic growing practices.", community: "SF-founded with strong local partnerships.", climate: "B Corp certified, CA Green Business, renewable energy." },
      note: "World-class beans, serious craft" },
    { name: "Ritual Coffee",     address: "1026 Valencia St",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: true,  worker_owned: true,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "100% independent since 2005. ESOP transition underway. Rejected VC explicitly.", sourcing: "Direct trade since 2007. Pays 2–3× commodity price. Named producer partners.", living_wage: "Transparent pay. Model employer in SF specialty coffee.", worker_owned: "Active ESOP transition — employees will own the company.", community: "SF original, owner-operated, deeply embedded in Mission." },
      note: "SF original, beloved by locals" },
    { name: "Sightglass Coffee", address: "3014 20th St",
      scores: { independent: false, sourcing: true,  organic: null,  living_wage: null,  worker_owned: false, community: false, diverse_owned: null,  climate: null  },
      why: { independent: "VC-backed by GingerBread Capital + Jack Dorsey. Founders left 2024.", sourcing: "Solid smallholder farm sourcing despite ownership changes.", worker_owned: "VC structure with no employee ownership program.", community: "Community-focused founders have departed." },
      note: "Beautiful space, serious pour-overs" },
  ],
  "Bernal Heights": [
    { name: "CoffeeShop",          address: "3139 Mission St",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Solo-operated by Wilson. One person, no investors.", sourcing: "Single-origin from Nicaragua, Congo, Mexico, Ethiopia.", organic: "Organic-forward sourcing.", community: "Hyper-local — operator lives in and serves Bernal." },
      note: "No sign — walk until you smell it" },
    { name: "Pinhole Coffee",      address: "231 Cortland Ave",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independently owned. No outside investment.", sourcing: "Sourcing not publicly documented at farm level.", community: "Community events, kids welcome, Bernal Heights hub." },
      note: "Community hub, kid-friendly" },
    { name: "Progressive Grounds", address: "400 Cortland Ave",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Long-running institution. No outside investors.", sourcing: "Limited public info on bean sourcing.", community: "Jazz, local art, shaded patio — deeply rooted in Bernal." },
      note: "Jazz plays, local art, shaded patio" },
    { name: "Martha & Bros.",      address: "745 Cortland Ave",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Family-owned 30+ years. Same family as Flywheel Coffee.", sourcing: "Sourcing not documented at farm level.", community: "30-year Bernal staple. Aquiles Guerrero family is deeply SF." },
      note: "30-year Bernal staple, deeply local" },
  ],
  "Noe Valley": [
    { name: "Ritual Coffee",   address: "1050 Valencia St",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: true,  worker_owned: true,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Fully independent. ESOP transition underway.", sourcing: "Same direct-trade model — named farms, 2–3× commodity pricing.", living_wage: "Consistent with Ritual's company-wide pay practices.", worker_owned: "ESOP covers all locations.", community: "Noe Valley location is a neighbourhood anchor." },
      note: "Quiet neighbourhood outpost" },
    { name: "Martha & Bros.", address: "3868 24th St",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Same family-owned operation — 30+ years of independent SF coffee.", sourcing: "Quality-forward but sourcing not publicly documented.", community: "Family operated in SF for 3+ decades across multiple locations." },
      note: "Sunny 24th St, loyal crowd" },
    { name: "Starbucks",      address: "3973 24th St",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null,  climate: false },
      why: { independent: "Publicly traded. Owned by institutional shareholders.", sourcing: "C.A.F.E. Practices criticised for lack of farm-level transparency.", organic: "No organic commitment in standard menu items.", living_wage: "Multiple wage disputes and union-busting allegations.", worker_owned: "Zero worker ownership.", community: "Profits leave the neighbourhood and the city.", climate: "Large carbon footprint, high single-use plastic waste." },
      note: "Reliable and convenient" },
  ],
  Haight: [
    { name: "Flywheel Coffee",      address: "672 Stanyan St",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Family-owned by Aquiles Guerrero — same family as Martha & Bros. Bootstrapped.", sourcing: "In-house roasting, single-origin. Traceable via named importers.", community: "Haight-native. Family operated in SF 30+ years." },
      note: "Roastery at the park entrance" },
    { name: "Cantata Coffee",       address: "1690 Haight St",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Husband-and-wife owned. Purely independent, purely local.", sourcing: "Sustainable and fair-trade sourcing is a core stated value.", community: "Husband-wife team rooted in the Haight.", diverse_owned: "Woman co-owned, family-run small business." },
      note: "Specialty espresso, creative drinks" },
    { name: "Coffee to the People", address: "1206 Masonic Ave",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Family-owned local institution. No corporate ties.", sourcing: "Fair-trade stated but limited farm-level transparency.", community: "Haight institution for over 20 years." },
      note: "Comfy couches, the Haight spirit" },
  ],
  "Balboa Island": [
    { name: "Huskins Coffee", address: "229 Marine Ave",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Family-owned by Bri & Kent Huskins. Opened 2018. Zero outside investment.", sourcing: "Roasts own beans in-house. Maple syrup direct from Kent's family farm in Ontario — completely traceable.", organic: "Certified organic beans. All syrups housemade from real ingredients, no artificial flavors.", community: "Opened on Balboa Island after Starbucks vacated, filling the community gap for locals.", diverse_owned: "Woman co-owned and operated. Bri Huskins leads the business day-to-day." },
      note: "Family-run gem — the Hometown Maple Latte is legendary" },
    { name: "JASPER",         address: "327 Marine Ave",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independently owned boutique café on Marine Ave. No chain affiliation.", community: "Balboa Island local — top-rated neighbourhood spot steps from the ferry." },
      note: "Tiny, charming, steps from the ferry" },
    { name: "Starbucks",      address: "310 Marine Ave",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null,  climate: false },
      why: { independent: "Publicly traded. Owned by institutional shareholders.", sourcing: "C.A.F.E. Practices with limited farm-level transparency.", organic: "No organic commitment on standard menu.", living_wage: "Multiple wage disputes and union-busting allegations documented nationwide.", worker_owned: "Zero worker ownership.", community: "Huskins only opened on the island because this Starbucks closed.", climate: "High single-use plastic waste, large carbon footprint." },
      note: "Reliable, convenient" },
  ],
  Westcliff: [
    { name: "Kean Coffee",        address: "2043 Westcliff Dr",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: true  },
      why: { independent: "Founded 2005 by Martin & Karen Diedrich. Purely family-owned. Martin left the corporate Diedrich Coffee chain specifically to go independent.", sourcing: "Original direct-trade roasters. Martin personally selects ~40 coffees/year. Relationships with smallholder farmers dating to the 1970s.", organic: "Organic and Fair Trade coffees roasted on-site daily by Martin Diedrich himself. Rainforest Alliance certified.", community: "Named for the Diedrichs' son Kean. Intentionally no wifi — community conversation over screens.", climate: "Rainforest Alliance certified. Multi-generational sustainable sourcing commitment." },
      note: "OC's finest micro-roaster — no wifi by design" },
    { name: "KIT Coffee",         address: "1617 Westcliff Dr",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded 2016 by Eunice Hwang & Jee Shin. Bootstrapped local business. No PE or VC backing.", sourcing: "Multi-roaster program. Rotates Temple Coffee, Heart Coffee, and Coava Coffee Roasters — all specialty-grade with traceable sourcing.", community: "KIT stands for Keep In Touch. Purpose-built as a community gathering space. Now expanding into Newport Beach Public Library.", diverse_owned: "Korean-American woman co-founded and owned by Eunice Hwang." },
      note: "Community-first, great avocado toast, rotating specialty roasters" },
    { name: "Stereoscope Coffee",  address: "100 Bayview Cir",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded 2013 by Leif An & Clifford Park. Independent multi-location roaster. No PE or VC.", sourcing: "In-house roasting at LA Arts District lab. Single-origin named harvests. CEO is CQI-certified Q-grader.", community: "Monthly charity donations from retail bag sales benefit local nonprofits.", diverse_owned: "Korean-American co-founders Leif An and Clifford Park." },
      note: "Award-winning specialty, seriously good espresso" },
  ],
  "Corona del Mar": [
    { name: "Alta Coffee",         address: "506 31st St",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Founded by Patti Spooner and Tony Wilson. Family-tied to Wilson Coffee Roasters — roasted by family, served by family.", sourcing: "Coffees sourced and roasted by Wilson Coffee Roasters. Fair trade and sustainable farm-level sourcing published.", organic: "Organic coffees roasted fresh daily on-site. Housemade dairy-free milk options.", community: "Monthly music, poetry, and art events. Neighbourhood anchor on 31st St for years." },
      note: "Farmhouse vibes, local art nights, totally neighbourhood" },
    { name: "Zinc Café & Market",  address: "3010 Ocean Blvd",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independent local restaurant group. No chain or PE affiliation.", community: "Corona del Mar institution with ocean views. Long-time neighbourhood gathering spot for locals." },
      note: "Ocean views, plant-forward menu, local institution" },
    { name: "Starbucks",           address: "2200 E Coast Hwy",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null,  climate: false },
      why: { independent: "Publicly traded, institutional shareholder ownership.", sourcing: "C.A.F.E. Practices with limited farm-level transparency.", organic: "No organic standard across menu.", living_wage: "Union-busting and wage disputes documented nationally.", worker_owned: "No worker ownership program.", community: "Profits exit the local economy entirely.", climate: "High single-use plastic waste, large carbon footprint." },
      note: "Convenient drive-through" },
  ],
  "Balboa Peninsula": [
    { name: "Newport Coffee Co.", address: "2901 Newport Blvd",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Founded 2014 by local Balboa Peninsula residents. No chain affiliation or outside investors.", sourcing: "Serves Stumptown Coffee Roasters — a quality brand now owned by JAB Holding Company. Sourcing not locally controlled.", community: "Newport Beach original. Steps from Newport Pier, deeply embedded in the beachside community." },
      note: "Local institution right by the pier" },
    { name: "Balboa Lily's",      address: "711 E Balboa Blvd",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independent neighbourhood coffeehouse. No chain affiliation.", sourcing: "Serves Kean Coffee beans — direct-trade, Rainforest Alliance certified, roasted locally by Martin Diedrich.", community: "Dog-friendly patio steps from Balboa Pier. Farm-to-table breakfast and lunch menu." },
      note: "Dog-friendly, farm-to-table, steps from the pier" },
    { name: "Vacancy Coffee",     address: "6480 W Coast Hwy",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded by Bonnie & Oliver Williams. Independent husband-wife operation. No investors.", sourcing: "Currently serves Partners Coffee Roasters from Brooklyn, NY. Not locally sourced or roasted.", community: "PCH local — idyllic spot next to a dog beach, strong local following.", diverse_owned: "Woman co-founded and operated by Bonnie Williams." },
      note: "Lavender lattes, Gothic mocha, right on PCH" },
    { name: "Daydream Surf Shop", address: "1588 Monrovia Ave",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded by Becca Mantei and Kyle Kennelly. Independent surf-and-coffee shop. No chain ties.", community: "Rotating seasonal menu, 24 experimental surfboard designs, quintessential Newport surf culture.", diverse_owned: "Woman co-founded by Becca Mantei." },
      note: "Surf shop + specialty coffee, seasonal creative drinks" },
  ],
};

const CHAINS = [
  { name: "Starbucks",        address: "Locations everywhere",
    scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null, climate: false },
    why: { independent: "Publicly traded (NASDAQ: SBUX). Owned by institutional shareholders including Vanguard and BlackRock.", sourcing: "C.A.F.E. Practices program criticized for lack of farm-level price transparency and third-party verification gaps.", organic: "No organic commitment on standard menu items. Conventional milk and syrups throughout.", living_wage: "Documented nationwide wage disputes. Workers United union campaign cites poverty wages in high cost-of-living cities.", worker_owned: "No worker ownership. CEO compensation ratio to median barista wage is over 6,000:1.", community: "Profits flow to institutional shareholders. Aggressive expansion displaces independent shops.", climate: "Pledged 50% emissions reduction by 2030 but independent audits show limited progress. Billions of single-use cups annually." },
    note: "The benchmark for chain coffee — convenient, consistent, and everywhere" },
  { name: "Peet's Coffee",    address: "Locations everywhere",
    scores: { independent: false, sourcing: false, organic: null, living_wage: false, worker_owned: false, community: false, diverse_owned: null, climate: null },
    why: { independent: "Now owned by Keurig Dr Pepper (NASDAQ: KDP) following its $18B acquisition of JDE Peet's in 2025. Previously owned by JAB Holding — a secretive Luxembourg-based investment firm.", sourcing: "Sourcing claims face watchdog scrutiny. Inconsistencies reported between public sustainability language and on-the-ground realities in Central America.", living_wage: "Workers at multiple locations voted to unionize citing low pay, poor scheduling, and unsafe conditions. Peet's paid $125K+ to outside union-avoidance consultants.", worker_owned: "Zero worker ownership. Corporate structure focused on shareholder returns.", community: "Also owns Stumptown and Intelligentsia — systematically acquiring and corporatizing independent coffee culture." },
    note: "Founded by the godfather of specialty coffee — now several corporate owners removed from those roots" },
  { name: "Blue Bottle Coffee", address: "Locations in major cities",
    scores: { independent: false, sourcing: true, organic: null, living_wage: false, worker_owned: false, community: null, diverse_owned: null, climate: true },
    why: { independent: "Majority-owned (68%) by Nestlé since 2017 for ~$500M. Nestlé exploring sale to Luckin Coffee/Centurium Capital as of late 2025.", sourcing: "Strong direct-trade model — pays 250% above Fair Trade prices, named farm partners, publishes impact reports. One of the better sourcing stories despite corporate ownership.", living_wage: "Workers filed to unionize in 2024 explicitly citing poverty wages. Baristas stated they 'cannot afford to live in the city we work in.' Strike over Thanksgiving 2025.", worker_owned: "Zero worker ownership. Nestlé corporate structure. Workers went on strike over lack of living wages and workplace input.", climate: "B Corp certified 2022, score 108.3. TRUE Zero Waste certification at 85% of cafes. Genuine sustainability commitment." },
    note: "Best-in-class sourcing and climate for a chain — but Nestlé ownership and labor disputes undercut the indie story" },
  { name: "Stumptown Coffee",  address: "Locations in select cities",
    scores: { independent: false, sourcing: true, organic: null, living_wage: null, worker_owned: false, community: false, diverse_owned: null, climate: null },
    why: { independent: "Founded independently in Portland in 1999. Acquired by Peet's (JAB Holding) in 2015. Now part of JDE Peet's/Keurig Dr Pepper empire.", sourcing: "Direct-trade pioneer with named farm relationships maintained despite acquisition. Sourcing program retains some integrity from original founders.", worker_owned: "Zero worker ownership. Absorbed into JAB/KDP corporate structure after acquisition.", community: "Profits flow out of Portland and the communities where it operates to multinational shareholders." },
    note: "Pioneer of direct trade — acquired by Peet's in 2015, now part of the KDP empire" },
  { name: "Dunkin'",           address: "Locations everywhere",
    scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null, climate: false },
    why: { independent: "Owned by Inspire Brands, a private equity-backed restaurant conglomerate that also owns Arby's, Buffalo Wild Wings, and Sonic.", sourcing: "No meaningful transparency on coffee sourcing. Commodity-grade beans with no farm-level disclosure.", organic: "No organic offerings. Conventional ingredients throughout the entire menu.", living_wage: "Franchise model with documented wage violations. Franchisees regularly cited for minimum wage and overtime violations.", worker_owned: "No worker ownership. PE-owned franchise structure optimized for extraction, not worker welfare.", community: "Franchise model extracts value from local communities to PE owners.", climate: "Large carbon footprint. Polystyrene cups phased out but sustainability commitments remain vague." },
    note: "America runs on Dunkin — but the ownership runs on private equity" },
  { name: "The Coffee Bean & Tea Leaf", address: "Locations in select cities",
    scores: { independent: false, sourcing: false, organic: null, living_wage: null, worker_owned: false, community: false, diverse_owned: null, climate: null },
    why: { independent: "Acquired by Jollibee Foods Corporation, the Philippine fast food conglomerate, in 2019 for $350M. No longer independent.", sourcing: "Limited public transparency on farm-level sourcing. No named farm relationships published.", worker_owned: "No worker ownership. Corporate fast-food conglomerate ownership structure.", community: "Profits flow to Jollibee Foods shareholders in the Philippines. Local community investment minimal." },
    note: "SoCal original — sold to Jollibee Foods (Philippines) in 2019" },
];
// ─── Scoring ───────────────────────────────────────────────────────────────────
function computeScore(place, userValues) {
  let earned = 0, possible = 0, mustHaveFailed = false;
  for (const [id, intensity] of Object.entries(userValues)) {
    if (intensity === 0) continue;
    const weight = INTENSITY_WEIGHTS[intensity];
    const result = place.scores[id];
    if (result === null) continue;
    possible += weight;
    if (result === true) earned += weight;
    else if (result === false && intensity === 3) mustHaveFailed = true;
  }
  if (possible === 0) return { score: null, mustHaveFailed: false };
  return { score: Math.round((earned / possible) * 100), mustHaveFailed };
}

function getAlignment(score, mustHaveFailed) {
  if (score === null)   return { label: "No data",         color: T.textMuted, soft: T.surfaceAlt, icon: "?" };
  if (mustHaveFailed)   return { label: "Fails must-have", color: T.red,       soft: T.redSoft,    icon: "✗" };
  if (score >= 80)      return { label: "Aligned",         color: T.green,     soft: T.greenSoft,  icon: "✓" };
  if (score >= 40)      return { label: "Partial",         color: T.amber,     soft: T.amberSoft,  icon: "~" };
  return                { label: "Conflicts",               color: T.red,       soft: T.redSoft,    icon: "✗" };
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────
function Pill({ label, color, soft, icon }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: soft, color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 10 }}>{icon}</span>{label}
    </span>
  );
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ height: 4, background: T.surfaceAlt, borderRadius: 100, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${score}%`, height: "100%", borderRadius: 100, background: `linear-gradient(90deg,${color}70,${color})`, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ─── Onboarding ────────────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(Object.fromEntries(VALUES.map(v => [v.id, 0])));
  const v = VALUES[step];

  const choose = (intensity) => {
    setValues(prev => ({ ...prev, [v.id]: intensity }));
  };

  const advance = () => {
    if (step < VALUES.length - 1) setStep(s => s + 1);
    else onDone(values);
  };

  return (
    <div style={{ minHeight: "100dvh", background: T.bg, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", fontFamily: "'DM Sans',-apple-system,sans-serif" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: T.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>♡</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>ValueWallet</span>
        </div>
        <span style={{ fontSize: 12, color: T.textMuted }}>{step + 1} / {VALUES.length}</span>
      </div>

      <div style={{ margin: "14px 20px 0", height: 3, background: T.surfaceAlt, borderRadius: 100 }}>
        <div style={{ width: `${(step / VALUES.length) * 100}%`, height: "100%", background: T.accent, borderRadius: 100, transition: "width 0.3s ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 20px" }}>
        <div style={{ background: T.surface, borderRadius: 24, padding: "32px 24px", border: `1.5px solid ${T.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 18 }}>{v.emoji}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: v.color, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: 6 }}>{v.cluster}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: T.text, textAlign: "center", letterSpacing: "-0.02em", marginBottom: 10 }}>{v.label}</h2>
          <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.65, textAlign: "center", marginBottom: 28 }}>{v.why}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INTENSITY_LABELS.map((label, i) => (
              <button key={i} onClick={() => choose(i)} style={{
                background: values[v.id] === i ? v.soft : T.surfaceAlt,
                border: `2px solid ${values[v.id] === i ? v.color : "transparent"}`,
                borderRadius: 12, padding: "13px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: values[v.id] === i ? v.color : T.textSub }}>{label}</span>
                {i === 0 && <span style={{ fontSize: 11, color: T.textMuted }}>Skip this value</span>}
                {i === 3 && <span style={{ fontSize: 11, color: v.color, fontWeight: 700 }}>Hard filter ✦</span>}
              </button>
            ))}
          </div>

          <button onClick={advance} style={{
            width: "100%", marginTop: 16,
            background: T.accent, color: "#fff", border: "none",
            borderRadius: 12, padding: "14px",
            fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          }}>
            {step < VALUES.length - 1 ? "Next →" : "See my results →"}
          </button>
        </div>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 14, background: "none", border: "none", color: T.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
        )}
      </div>
    </div>
  );
}

// ─── Place Card ────────────────────────────────────────────────────────────────
function PlaceCard({ place, userValues, onLog, logged }) {
  const [expanded, setExpanded] = useState(false);
  const { score, mustHaveFailed } = computeScore(place, userValues);
  const align = getAlignment(score, mustHaveFailed);
  const isBest = score !== null && score >= 80 && !mustHaveFailed;
  const activeValues = VALUES.filter(v => userValues[v.id] > 0 && place.scores[v.id] !== null);

  return (
    <div style={{ background: T.surface, borderRadius: T.radius, border: `1.5px solid ${isBest ? T.accent + "50" : T.border}`, overflow: "hidden", marginBottom: 10, boxShadow: isBest ? `0 4px 20px ${T.accent}15` : "0 1px 4px rgba(0,0,0,0.05)" }}>
      {isBest && (
        <div style={{ background: `linear-gradient(90deg,${T.accentSoft},#fff)`, padding: "5px 14px", borderBottom: `1px solid ${T.accent}20`, fontSize: 10, fontWeight: 800, color: T.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          ● Best match for your values
        </div>
      )}
      <div style={{ padding: "14px 14px 12px", cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ flex: 1, marginRight: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 2 }}>{place.name}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{place.address}</div>
          </div>
          <Pill {...align} />
        </div>
        {score !== null && <ScoreBar score={score} color={align.color} />}
        {place.note && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8, fontStyle: "italic" }}>{place.note}</div>}
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: 14 }}>
          {activeValues.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {activeValues.map(v => {
                const result = place.scores[v.id];
                const icon  = result === true ? "✓" : result === false ? "✗" : "?";
                const color = result === true ? T.green : result === false ? T.red : T.textMuted;
                return (
                  <div key={v.id} style={{ background: T.surfaceAlt, borderRadius: T.radiusSm, padding: "10px 12px", borderLeft: `3px solid ${color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: place.why?.[v.id] ? 4 : 0 }}>
                      <span style={{ fontSize: 14 }}>{v.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1 }}>{v.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color }}>{icon}</span>
                    </div>
                    {place.why?.[v.id] && <p style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, margin: 0 }}>{place.why[v.id]}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {!logged ? (
            <button onClick={() => onLog(place)} style={{ width: "100%", background: T.accent, color: "#fff", border: "none", borderRadius: T.radiusSm, padding: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Log this visit →</button>
          ) : (
            <div style={{ textAlign: "center", fontSize: 13, color: T.green, fontWeight: 700 }}>✓ Logged</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Discover ──────────────────────────────────────────────────────────────────
function DiscoverView({ userValues, onLog, onOpenValues }) {
  const [cityId, setCityId] = useState("sf");
  const [hood, setHood] = useState("Mission");
  const [logged, setLogged] = useState({});
  const [animKey, setAnimKey] = useState(0);

  const city = CITIES.find(c => c.id === cityId);

  const setCity = id => {
    setCityId(id);
    setHood(CITIES.find(c => c.id === id).neighborhoods[0]);
    setAnimKey(k => k + 1);
  };
  const setNeighborhood = n => { setHood(n); setAnimKey(k => k + 1); };

  const places = useMemo(() => {
    return (PLACES[hood] || []).sort((a, b) => {
      const sa = computeScore(a, userValues), sb = computeScore(b, userValues);
      if (sa.mustHaveFailed !== sb.mustHaveFailed) return sa.mustHaveFailed ? 1 : -1;
      if (sa.score === null && sb.score !== null) return 1;
      if (sa.score !== null && sb.score === null) return -1;
      return (sb.score || 0) - (sa.score || 0);
    });
  }, [hood, userValues]);

  const handleLog = (place) => {
    onLog({ place: place.name, neighborhood: hood, scores: place.scores });
    setLogged(p => ({ ...p, [place.name + hood]: true }));
  };

  const activeValues = VALUES.filter(v => userValues[v.id] > 0);

  return (
    <div>
      <div style={{ padding: "16px 16px 0" }}>
        {/* City tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)} style={{
              background: cityId === c.id ? T.text : T.surfaceAlt,
              color: cityId === c.id ? "#fff" : T.textSub,
              border: "none", borderRadius: 100, padding: "6px 16px",
              fontSize: 12, fontWeight: cityId === c.id ? 700 : 500,
              cursor: "pointer", fontFamily: "inherit",
            }}>{c.label}</button>
          ))}
        </div>

        {/* Neighborhood pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {city.neighborhoods.map(n => (
            <button key={n} onClick={() => setNeighborhood(n)} style={{
              background: hood === n ? T.accent : T.surface,
              color: hood === n ? "#fff" : T.textSub,
              border: `1.5px solid ${hood === n ? T.accent : T.border}`,
              borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: hood === n ? `0 2px 8px ${T.accent}40` : "none",
            }}>{n}</button>
          ))}
        </div>

        {/* Active values bar */}
        {activeValues.length > 0 ? (
          <button onClick={onOpenValues} style={{ width: "100%", background: T.accentSoft, border: `1px solid ${T.accent}25`, borderRadius: T.radiusSm, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {activeValues.map(v => (
                <span key={v.id} style={{ background: v.soft, color: v.color, borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{v.emoji} {v.short}</span>
              ))}
            </div>
            <span style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>Edit →</span>
          </button>
        ) : (
          <button onClick={onOpenValues} style={{ width: "100%", background: T.surfaceAlt, border: `1.5px dashed ${T.borderStrong}`, borderRadius: T.radiusSm, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>♡</span>
            <span style={{ fontSize: 13, color: T.textSub }}>Set your values to rank results</span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: T.accent, fontWeight: 700 }}>Set up →</span>
          </button>
        )}
      </div>

      <div key={animKey} style={{ padding: "0 16px 100px" }}>
        {places.map(p => (
          <PlaceCard key={p.name + hood} place={p} userValues={userValues} onLog={handleLog} logged={!!logged[p.name + hood]} />
        ))}

        {/* Chains section */}
        <div style={{ margin: "24px 0 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>The Chains — for contrast</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>
        </div>
        {CHAINS.map(p => (
          <PlaceCard key={p.name} place={p} userValues={userValues} onLog={handleLog} logged={!!logged[p.name + "chain"]} />
        ))}
      </div>
    </div>
  );
}

// ─── Values Editor ─────────────────────────────────────────────────────────────
function ValuesView({ userValues, onChange }) {
  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 20, lineHeight: 1.55 }}>
        Set how much each value matters. <strong style={{ color: T.accent }}>Must-Have</strong> acts as a hard filter — places that fail it rank last.
      </p>
      {VALUES.map(v => {
        const current = userValues[v.id];
        return (
          <div key={v.id} style={{ background: T.surface, border: `1.5px solid ${current > 0 ? v.color + "40" : T.border}`, borderRadius: T.radius, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{v.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{v.label}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{v.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {INTENSITY_LABELS.map((label, i) => (
                <button key={i} onClick={() => onChange(v.id, i)} style={{
                  flex: 1, background: current === i ? v.soft : T.surfaceAlt,
                  border: `1.5px solid ${current === i ? v.color : "transparent"}`,
                  borderRadius: T.radiusXs, padding: "7px 2px",
                  fontSize: 10, fontWeight: current === i ? 700 : 500,
                  color: current === i ? v.color : T.textMuted,
                  cursor: "pointer", fontFamily: "inherit", lineHeight: 1.2,
                }}>{label}</button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Portfolio ─────────────────────────────────────────────────────────────────
function PortfolioView({ decisions, userValues }) {
  if (decisions.length === 0) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>☕</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 8 }}>No decisions yet</h3>
        <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Log a visit from the Discover tab to start tracking your alignment.</p>
      </div>
    );
  }

  const total   = decisions.length;
  const aligned = decisions.filter(d => { const { score, mustHaveFailed } = computeScore({ scores: d.scores }, userValues); return !mustHaveFailed && score !== null && score >= 80; }).length;
  const pct     = Math.round((aligned / total) * 100);
  const pctColor = pct >= 70 ? T.green : pct >= 40 ? T.amber : T.red;

  const byValue = VALUES.map(v => {
    const relevant = decisions.filter(d => d.scores[v.id] !== null);
    if (!relevant.length) return null;
    const passing = relevant.filter(d => d.scores[v.id] === true).length;
    return { ...v, pct: Math.round((passing / relevant.length) * 100), n: relevant.length };
  }).filter(Boolean);

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Overall alignment</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: pctColor, letterSpacing: "-0.04em" }}>{pct}%</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{total} decisions</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, background: T.surfaceAlt, borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${pctColor}70,${pctColor})`, borderRadius: 100, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: T.textSub }}>{aligned} aligned · {total - aligned} not aligned</div>
          </div>
        </div>
      </div>

      {byValue.length > 0 && (
        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radius, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>By value</div>
          {byValue.map(v => (
            <div key={v.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v.emoji} {v.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: v.color }}>{v.pct}%</span>
              </div>
              <ScoreBar score={v.pct} color={v.color} />
            </div>
          ))}
        </div>
      )}

      <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radius, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>History</div>
        {[...decisions].reverse().map((d, i) => {
          const { score, mustHaveFailed } = computeScore({ scores: d.scores }, userValues);
          const align = getAlignment(score, mustHaveFailed);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < decisions.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{d.place}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{d.neighborhood} · {d.date}</div>
              </div>
              <Pill {...align} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
const DEFAULT_VALUES = Object.fromEntries(VALUES.map(v => [v.id, 0]));

function loadSaved() {
  try { const s = localStorage.getItem("vw_values"); if (s) return JSON.parse(s); } catch {}
  return null;
}

export default function App({ onBack }) {
  const saved = loadSaved();
  const [phase, setPhase]           = useState(saved ? "app" : "onboarding");
  const [tab, setTab]               = useState("discover");
  const [userValues, setUserValues] = useState(saved || DEFAULT_VALUES);
  const [decisions, setDecisions]   = useState([]);

  const handleOnboardingDone = (vals) => { localStorage.setItem("vw_values", JSON.stringify(vals)); setUserValues(vals); setPhase("app"); };
  const handleValueChange = (id, intensity) => setUserValues(prev => { const next = { ...prev, [id]: intensity }; localStorage.setItem("vw_values", JSON.stringify(next)); return next; });
  const handleLog = (entry) => setDecisions(prev => [...prev, { ...entry, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }]);

  if (phase === "onboarding") return <OnboardingScreen onDone={handleOnboardingDone} />;

  const TABS = [{ id: "discover", label: "Discover", icon: "📍" }, { id: "values", label: "My Values", icon: "♡" }, { id: "portfolio", label: "Portfolio", icon: "📊" }];
  const alignedPct = decisions.length ? Math.round(decisions.filter(d => { const {score,mustHaveFailed} = computeScore({scores:d.scores},userValues); return !mustHaveFailed&&score>=80; }).length / decisions.length * 100) : null;

  return (
    <div style={{ minHeight: "100dvh", background: T.bg, maxWidth: 430, margin: "0 auto", fontFamily: "'DM Sans',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button { transition: opacity 0.1s, transform 0.1s; cursor: pointer; }
        button:active { opacity: 0.82; transform: scale(0.97); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,248,0.94)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: T.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>♡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>ValueWallet</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Spend with intention</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {alignedPct !== null && (
              <div style={{ background: T.greenSoft, color: T.green, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} />{alignedPct}% aligned
              </div>
            )}
            {onBack && (
              <button onClick={onBack} style={{ background: T.surfaceAlt, border: "none", borderRadius: T.radiusXs, padding: "5px 10px", fontSize: 11, color: T.textSub, fontFamily: "inherit" }}>← Back</button>
            )}
            <button onClick={() => { localStorage.removeItem("vw_values"); setPhase("onboarding"); setUserValues(DEFAULT_VALUES); }} style={{ background: T.surfaceAlt, border: "none", borderRadius: T.radiusXs, padding: "5px 10px", fontSize: 11, color: T.textMuted, fontFamily: "inherit" }}>Reset</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, background: T.surfaceAlt, borderRadius: T.radiusSm, padding: 3 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: tab === t.id ? T.surface : "transparent",
              color: tab === t.id ? T.text : T.textMuted,
              border: "none", borderRadius: 8, padding: "8px 4px",
              fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
              fontFamily: "inherit", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ animation: "fadeUp 0.25s ease" }} key={tab}>
        {tab === "discover"  && <DiscoverView  userValues={userValues} onLog={handleLog} onOpenValues={() => setTab("values")} />}
        {tab === "values"    && <ValuesView    userValues={userValues} onChange={handleValueChange} />}
        {tab === "portfolio" && <PortfolioView decisions={decisions} userValues={userValues} />}
      </div>
    </div>
  );
}
