import { useState, useMemo, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F3EF",
  border: "#EEEAE4",
  text: "#1A1714",
  textSub: "#7A756E",
  textMuted: "#B8B2AA",
  accent: "#E8622A",
  accentSoft: "#FEF0EA",
  green: "#2D7A4F",
  greenSoft: "#EAF5EE",
  amber: "#C47A1E",
  amberSoft: "#FDF6E8",
  red: "#C04040",
  redSoft: "#FDEAEA",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",
  radius: "16px",
  radiusSm: "10px",
  radiusXs: "6px",
};

// ─── Value Definitions ─────────────────────────────────────────────────────────
const VALUE_DEFS = [
  { id: "independent",   label: "Independent Ownership", short: "Indep.",       desc: "No PE or VC money",                        color: "#E8622A", soft: "#FEF0EA", cluster: "Ownership",    emoji: "🏠",
    why: "Your money stays with founders, families, and local operators — not Wall Street funds extracting profit from your neighborhood." },
  { id: "sourcing",      label: "Transparent Sourcing",  short: "Sourcing",     desc: "Named farms, traceable supply chain",      color: "#2D7A4F", soft: "#EAF5EE", cluster: "Supply Chain", emoji: "🌱",
    why: "Know where your food actually comes from. Not just 'ethically sourced' marketing — real farm names, real relationships." },
  { id: "organic",       label: "Organic & Clean",       short: "Organic",      desc: "No harmful pesticides or additives",       color: "#5A7A3A", soft: "#F0F5EA", cluster: "Supply Chain", emoji: "🌿",
    why: "Products grown without shortcuts that cut corners on your health and the health of farmworkers." },
  { id: "living_wage",   label: "Living Wage",           short: "Wages",        desc: "Workers paid above minimum, with benefits",color: "#1A6B9A", soft: "#EEF5FB", cluster: "Labor",        emoji: "💸",
    why: "A business worth supporting pays people enough to actually live in the city they work in." },
  { id: "worker_owned",  label: "Worker Ownership",      short: "Worker-owned", desc: "Employees have equity or profit sharing",  color: "#7C4DFF", soft: "#F3EEFF", cluster: "Labor",        emoji: "🤝",
    why: "When workers own a stake, decisions get made for the long term, not next quarter's returns." },
  { id: "community",     label: "Community Rooted",      short: "Community",    desc: "Locally founded, reinvests in neighborhood",color: "#C97A1A", soft: "#FDF5EA", cluster: "Community",   emoji: "🏘",
    why: "Businesses that hire locally, source locally, and give back locally create multiplier effects your dollars can support." },
  { id: "diverse_owned", label: "Diverse Ownership",     short: "Diverse",      desc: "Women, BIPOC, or LGBTQ+ owned",            color: "#B5338A", soft: "#FAEEF6", cluster: "Community",   emoji: "✊",
    why: "Support businesses building wealth for communities that have historically had fewer pathways to ownership." },
  { id: "climate",       label: "Climate Conscious",     short: "Climate",      desc: "Low carbon footprint, B Corp, renewable",  color: "#0B7A75", soft: "#EAF5F5", cluster: "Environment", emoji: "🌍",
    why: "Businesses actively reducing their environmental impact — not just offsetting with credits." },
];

const INTENSITY_LABELS = ["Off", "Somewhat", "Important", "Must-Have"];
const INTENSITY_WEIGHTS = [0, 1, 2, 4];

const DEFAULT_USER_VALUES = {
  independent: 0, sourcing: 0, organic: 0, living_wage: 0,
  worker_owned: 0, community: 0, diverse_owned: 0, climate: 0,
};

// ─── Place Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "coffee", label: "Coffee", icon: "☕" },
  { id: "food",   label: "Food",   icon: "🍽" },
  { id: "grocery",label: "Grocery",icon: "🛒" },
  { id: "clothing",label: "Clothing",icon: "👕" },
];

const CITIES = [
  { id: "sf",   label: "San Francisco", neighborhoods: ["Mission", "Bernal Heights", "Noe Valley", "Haight"] },
  { id: "nb",   label: "Newport Beach", neighborhoods: ["Balboa Island", "Westcliff", "Corona del Mar", "Balboa Peninsula"] },
];

const NEIGHBORHOODS = ["Mission", "Bernal Heights", "Noe Valley", "Haight"]; // kept for legacy

const PLACES = {
  Mission: [
    { name: "Grand Coffee",     address: "2663 Mission St", category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Founded by Nabeel Silmi in 2010. Zero institutional funding.", sourcing: "Single-origin in-house roasting. Transparent sourcing.", community: "Mission-born, neighbourhood fixture for 14 years." },
      note: "Tiny, communal, always buzzing" },
    { name: "Linea Caffe",      address: "18 Mariposa St",  category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: true  },
      why: { independent: "Founded 2013 via SBA loans only. B Corp certified. Zero VC.", sourcing: "CCOF organic & biodynamic. Named farms in Ethiopia, Colombia, Bolivia.", organic: "CCOF Certified Organic. Biodynamic growing practices.", community: "SF-founded with strong local partnerships.", climate: "B Corp certified, CA Green Business, renewable energy." },
      note: "World-class beans, serious craft" },
    { name: "Ritual Coffee",    address: "1026 Valencia St", category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: true,  worker_owned: true,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "100% independent since 2005. Transitioning to ESOP. Rejected VC explicitly.", sourcing: "Direct trade since 2007. Pays 2–3× commodity price. Named producer partners.", living_wage: "Transparent pay. Model employer in SF specialty coffee.", worker_owned: "Active ESOP transition — employees will own the company.", community: "SF original, owner-operated, deeply embedded in Mission." },
      note: "SF original, beloved by locals" },
    { name: "Sightglass Coffee", address: "3014 20th St",   category: "coffee",
      scores: { independent: false, sourcing: true,  organic: null,  living_wage: null,  worker_owned: false, community: false, diverse_owned: null, climate: null  },
      why: { independent: "VC-backed by GingerBread Capital + Jack Dorsey. Founders left 2024.", sourcing: "Solid smallholder farm sourcing despite ownership changes.", worker_owned: "VC structure with no employee ownership program.", community: "Community-focused founders have departed." },
      note: "Beautiful space, serious pour-overs" },
  ],
  "Bernal Heights": [
    { name: "CoffeeShop",        address: "3139 Mission St",  category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Solo-operated by Wilson. One person, no investors.", sourcing: "Single-origin from Nicaragua, Congo, Mexico, Ethiopia.", organic: "Organic-forward sourcing.", community: "Hyper-local — operator lives in and serves Bernal." },
      note: "No sign — walk until you smell it" },
    { name: "Pinhole Coffee",    address: "231 Cortland Ave", category: "coffee",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Independently owned. No outside investment.", sourcing: "Sourcing not publicly documented at farm level.", community: "Community events, kids welcome, Bernal Heights hub." },
      note: "Community hub, kid-friendly" },
    { name: "Progressive Grounds",address: "400 Cortland Ave",category: "coffee",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Long-running institution. No outside investors.", sourcing: "Limited public info on bean sourcing.", community: "Jazz, local art, shaded patio — deeply rooted in Bernal." },
      note: "Jazz plays, local art, shaded patio" },
    { name: "Martha & Bros.",    address: "745 Cortland Ave", category: "coffee",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Family-owned 30+ years. Same family as Flywheel Coffee.", sourcing: "Sourcing not documented at farm level.", community: "30-year Bernal staple. Aquiles Guerrero family is deeply SF." },
      note: "30-year Bernal staple, deeply local" },
  ],
  "Noe Valley": [
    { name: "Ritual Coffee",     address: "1050 Valencia St", category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: true,  worker_owned: true,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Fully independent. ESOP transition underway.", sourcing: "Same direct-trade model — named farms, 2–3× commodity pricing.", living_wage: "Consistent with Ritual's company-wide pay practices.", worker_owned: "ESOP covers all locations.", community: "Noe Valley location is a neighbourhood anchor." },
      note: "Quiet neighbourhood outpost" },
    { name: "Martha & Bros.",    address: "3868 24th St",     category: "coffee",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Same family-owned operation — 30+ years of independent SF coffee.", sourcing: "Quality-forward but sourcing not publicly documented.", community: "Family operated in SF for 3+ decades across multiple locations." },
      note: "Sunny 24th St, loyal crowd" },
    { name: "Starbucks",         address: "3973 24th St",     category: "coffee",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null, climate: false },
      why: { independent: "Publicly traded. Owned by institutional shareholders.", sourcing: "C.A.F.E. Practices criticised for lack of farm-level transparency.", organic: "No organic commitment in standard menu items.", living_wage: "Multiple wage disputes and union-busting allegations.", worker_owned: "Zero worker ownership.", community: "Profits leave the neighbourhood and the city.", climate: "Large carbon footprint, high single-use plastic waste." },
      note: "Reliable and convenient" },
  ],
  Haight: [
    { name: "Flywheel Coffee",   address: "672 Stanyan St",   category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Family-owned by Aquiles Guerrero — same family as Martha & Bros. Bootstrapped.", sourcing: "In-house roasting, single-origin. Traceable via named importers.", community: "Haight-native. Family operated in SF 30+ years." },
      note: "Roastery at the park entrance" },
    { name: "Cantata Coffee",    address: "1690 Haight St",   category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Husband-and-wife owned. Purely independent, purely local.", sourcing: "Sustainable and fair-trade sourcing is a core stated value.", community: "Husband-wife team rooted in the Haight.", diverse_owned: "Woman co-owned, family-run small business." },
      note: "Specialty espresso, creative drinks" },
    { name: "Coffee to the People", address: "1206 Masonic Ave", category: "coffee",
      scores: { independent: true,  sourcing: false, organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null, climate: null  },
      why: { independent: "Family-owned local institution. No corporate ties.", sourcing: "Fair-trade stated but limited farm-level transparency.", community: "Haight institution for over 20 years." },
      note: "Comfy couches, the Haight spirit" },
  ],

  // ── Newport Beach ──────────────────────────────────────────────────────────
  "Balboa Island": [
    { name: "Huskins Coffee",     address: "229 Marine Ave",     category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Family-owned by Bri & Kent Huskins. Opened 2018. Zero outside investment.", sourcing: "Roasts own beans in-house at Santa Ana roastery. Maple syrup imported direct from Kent's family farm in Ontario, Canada.", organic: "Certified organic beans. All syrups housemade from real ingredients — no artificial flavours.", community: "Moved to Balboa Island after Starbucks vacated, filling the gap for the community.", diverse_owned: "Woman co-owned and operated. Bri Huskins leads the business and design." },
      note: "Family-run gem, Hometown Maple Latte is legendary" },
    { name: "Starbucks",          address: "310 Marine Ave",     category: "coffee",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null,  climate: false },
      why: { independent: "Publicly traded. Owned by institutional shareholders.", sourcing: "C.A.F.E. Practices with limited farm-level transparency.", organic: "No organic commitment on standard menu.", living_wage: "Multiple wage disputes and union-busting allegations.", worker_owned: "Zero worker ownership.", community: "Huskins only opened here because this Starbucks closed — profits leave the neighbourhood.", climate: "High single-use plastic waste, large carbon footprint." },
      note: "Reliable, convenient" },
  ],

  "Westcliff": [
    { name: "Kean Coffee",        address: "2043 Westcliff Dr",  category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: true  },
      why: { independent: "Founded 2005 by Martin & Karen Diedrich. Purely family-owned. Martin left the corporate Diedrich Coffee chain specifically to go independent.", sourcing: "Original direct-trade roasters. Longstanding personal relationships with smallholder farmers since the 1970s. Martin hand-selects ~40 coffees/year from 750 sampled.", organic: "Organic and Fair Trade coffees roasted on-site daily. Rainforest Alliance certified.", community: "Named for the Diedrichs' son. Community coffeehouse is the core vision — intentionally no wifi.", climate: "Rainforest Alliance certification. Multi-generational sustainable sourcing practices." },
      note: "OC's finest micro-roaster — no wifi by design" },
    { name: "Stereoscope Coffee",  address: "100 Bayview Cir",   category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded 2013 by Leif An & Clifford Park. Independent multi-location roaster. No PE or VC.", sourcing: "In-house roasting at LA Arts District lab. Single-origin from named harvests. CEO is CQI-certified Q-grader.", community: "Monthly charity donations from retail bag sales. Grand opening tips donated entirely to anti-trafficking org.", diverse_owned: "Korean-American co-founders Leif An and Clifford Park." },
      note: "Award-winning specialty, seriously good espresso" },
  ],

  "Corona del Mar": [
    { name: "Alta Coffee",         address: "506 31st St",        category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: true,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Family-founded by Patti Spooner and Tony Wilson. Closely tied to Wilson Coffee Roasters — a family roastery. Purely independent.", sourcing: "Roasts in-house. Fair trade and sustainable farm sourcing via Wilson Coffee Roasters family operation.", organic: "Organic coffees roasted fresh daily. Dairy-free milk alternatives including housemade options.", community: "Monthly music, poetry, and art events. Strong neighbourhood anchor on 31st St." },
      note: "Farmhouse vibes, local art nights" },
    { name: "Zinc Café & Market",  address: "3010 Ocean Blvd",    category: "coffee",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independent local restaurant group. No chain affiliation.", community: "Corona del Mar institution. Beloved neighbourhood gathering spot." },
      note: "Ocean views, plant-forward menu" },
    { name: "Starbucks",           address: "2200 E Coast Hwy",   category: "coffee",
      scores: { independent: false, sourcing: false, organic: false, living_wage: false, worker_owned: false, community: false, diverse_owned: null,  climate: false },
      why: { independent: "Publicly traded, institutional shareholder ownership.", sourcing: "C.A.F.E. Practices with limited farm-level transparency.", organic: "No organic standard across menu.", living_wage: "Union-busting and wage disputes documented nationally.", worker_owned: "No worker ownership program.", community: "Profits exit the local economy.", climate: "High single-use plastic waste, large carbon footprint." },
      note: "Convenient drive-through location" },
  ],

  "Balboa Peninsula": [
    { name: "Newport Coffee Co.",  address: "2901 Newport Blvd",  category: "coffee",
      scores: { independent: true,  sourcing: true,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Founded 2014 by local Newport Beach operators. Private-label coffee roasted locally in small batches. Purely independent.", sourcing: "Own private-label roast sourced and roasted locally in small batches.", community: "Newport Beach original — founded with a vision for a community coffee spot by the shore." },
      note: "Local institution right by the pier" },
    { name: "Balboa Lily's",       address: "600 E Balboa Blvd",  category: "coffee",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: null,  climate: null  },
      why: { independent: "Independent neighbourhood coffeehouse in Balboa Village. No chain affiliation.", community: "Dog-friendly patio steps from Balboa Pier. Neighbourhood fixture with farm-to-table fare." },
      note: "Dog-friendly patio, steps from the pier" },
    { name: "Vacancy Coffee",      address: "6480 W Coast Hwy",   category: "coffee",
      scores: { independent: true,  sourcing: null,  organic: null,  living_wage: null,  worker_owned: null,  community: true,  diverse_owned: true,  climate: null  },
      why: { independent: "Founded by Bonnie & Oliver Williams. Independent husband-wife operation on PCH.", community: "PCH local — idyllic spot next to a dog beach. Strong neighbourhood identity.", diverse_owned: "Woman co-founded and operated by Bonnie Williams." },
      note: "Lavender lattes, Gothic mocha, right on PCH" },
  ],
};

// ─── Scoring Engine ────────────────────────────────────────────────────────────
function computeScore(place, userValues) {
  let earned = 0, possible = 0, mustHaveFailed = false;
  for (const [valueId, intensity] of Object.entries(userValues)) {
    if (intensity === 0) continue;
    const weight = INTENSITY_WEIGHTS[intensity];
    const result = place.scores[valueId];
    if (result === null) continue;
    possible += weight;
    if (result === true) earned += weight;
    else if (result === false && intensity === 3) mustHaveFailed = true;
  }
  if (possible === 0) return { score: null, mustHaveFailed: false };
  return { score: Math.round((earned / possible) * 100), mustHaveFailed };
}

function getAlignment(score, mustHaveFailed) {
  if (score === null)    return { label: "No data",         color: T.textMuted, soft: T.surfaceAlt, icon: "?" };
  if (mustHaveFailed)   return { label: "Fails must-have", color: T.red,       soft: T.redSoft,    icon: "✗" };
  if (score >= 80)      return { label: "Aligned",         color: T.green,     soft: T.greenSoft,  icon: "✓" };
  if (score >= 40)      return { label: "Partial",         color: T.amber,     soft: T.amberSoft,  icon: "~" };
  return                       { label: "Conflicts",        color: T.red,       soft: T.redSoft,    icon: "✗" };
}

// ─── Shared Components ─────────────────────────────────────────────────────────
function Pill({ label, color, soft, icon }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: soft, color, fontSize: 11, fontWeight: 700,
      padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 10 }}>{icon}</span>{label}
    </span>
  );
}

function ScoreBar({ score, mustHaveFailed, size = "md" }) {
  if (score === null) return null;
  const align = getAlignment(score, mustHaveFailed);
  const h = size === "sm" ? 4 : 6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#F0EDE8", borderRadius: 100, height: h, overflow: "hidden" }}>
        <div style={{
          width: `${mustHaveFailed ? 0 : score}%`, height: "100%",
          background: `linear-gradient(90deg, ${align.color}80, ${align.color})`,
          borderRadius: 100, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: align.color, minWidth: 28, textAlign: "right" }}>
        {mustHaveFailed ? "0%" : `${score}%`}
      </span>
    </div>
  );
}

function DonutChart({ pct, color, size = 80 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38, innerR = size * 0.26;
  function arc(s, e) {
    if (e - s >= 1) e = 0.9999;
    const xy = (p, rad) => { const a = p * 2 * Math.PI - Math.PI / 2; return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; };
    const [x1,y1]=xy(s,r),[x2,y2]=xy(e,r),[x3,y3]=xy(e,innerR),[x4,y4]=xy(s,innerR);
    return `M${x1} ${y1} A${r} ${r} 0 ${e-s>0.5?1:0} 1 ${x2} ${y2} L${x3} ${y3} A${innerR} ${innerR} 0 ${e-s>0.5?1:0} 0 ${x4} ${y4}Z`;
  }
  return (
    <svg width={size} height={size}>
      <path d={arc(0,1)} fill="#F0EDE8" />
      {pct > 0 && <path d={arc(0, pct)} fill={color} />}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill={T.text} fontSize={size*0.2} fontFamily="'DM Sans',sans-serif" fontWeight="800">
        {Math.round(pct*100)}%
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

function SplashScreen({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "64px 28px 48px",
      background: T.surface,
      animation: "fadeUp 0.5s ease",
    }}>
      {/* Logo */}
      <div>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: T.accent, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28,
          boxShadow: `0 8px 24px ${T.accent}50`,
          marginBottom: 28,
        }}>♡</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: T.text, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Spend with<br />intention.
        </h1>
        <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.65, margin: 0, maxWidth: 300 }}>
          ValueWallet ranks every coffee shop, restaurant, and store by how well it matches your personal values — before you walk in the door.
        </p>
      </div>

      {/* Feature pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "40px 0" }}>
        {[
          { icon: "🏠", text: "See who actually owns your favourite spots" },
          { icon: "🌱", text: "Verify supply chain claims aren't just marketing" },
          { icon: "💸", text: "Know if workers are paid fairly" },
          { icon: "📊", text: "Track your spending decisions over time" },
        ].map(f => (
          <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: T.surfaceAlt, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>{f.icon}</div>
            <span style={{ fontSize: 14, color: T.text, fontWeight: 500, lineHeight: 1.4 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div>
        <button onClick={onStart} style={{
          width: "100%", padding: "17px 0", borderRadius: 14,
          border: "none", background: `linear-gradient(135deg, ${T.accent}, #C84A15)`,
          fontSize: 15, fontWeight: 800, color: "white",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 6px 20px ${T.accent}50`,
          letterSpacing: "0.01em",
        }}>
          Set up my values →
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: T.textMuted, marginTop: 12 }}>
          Takes about 2 minutes · Always editable
        </p>
      </div>
    </div>
  );
}

function ValueCard({ valueDef: v, onSwipe, cardIndex, total }) {
  const [intensity, setIntensity] = useState(2); // default to "Important"

  return (
    <div style={{
      background: T.surface, borderRadius: 24,
      padding: "28px 28px 24px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
      border: `1.5px solid ${v.color}30`,
    }}>
      {/* Cluster */}
      <div style={{
        display: "inline-flex", alignItems: "center",
        background: v.soft, color: v.color,
        borderRadius: 20, padding: "4px 12px",
        fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
        textTransform: "uppercase", marginBottom: 20,
      }}>
        {v.cluster}
      </div>

      {/* Title */}
      <div style={{ fontSize: 38, marginBottom: 10, lineHeight: 1 }}>{v.emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: T.text, lineHeight: 1.2, marginBottom: 4, letterSpacing: "-0.02em" }}>
        {v.label}
      </div>
      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 14 }}>{v.desc}</div>

      {/* Why */}
      <p style={{
        fontSize: 13, color: T.textSub, lineHeight: 1.65, margin: "0 0 20px",
        borderLeft: `3px solid ${v.color}`, paddingLeft: 14,
      }}>
        {v.why}
      </p>

      {/* Intensity */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            How much does this matter?
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: v.color }}>
            {INTENSITY_LABELS[intensity]}
          </span>
        </div>
        <div style={{ position: "relative", height: 6, background: "#F0EDE8", borderRadius: 3 }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${(intensity / 3) * 100}%`,
            background: `linear-gradient(90deg, ${v.color}60, ${v.color})`,
            borderRadius: 3, transition: "width 0.2s ease",
          }} />
          <input type="range" min={1} max={3} value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 22, opacity: 0, cursor: "pointer", margin: 0 }}
          />
          {[1, 2, 3].map(i => (
            <div key={i} onClick={() => setIntensity(i)} style={{
              position: "absolute", top: "50%",
              left: `${((i - 1) / 2) * 100}%`,
              transform: "translate(-50%, -50%)",
              width: intensity === i ? 16 : 10,
              height: intensity === i ? 16 : 10,
              borderRadius: "50%",
              background: i <= intensity ? v.color : "#E0D8D0",
              border: "2px solid white",
              boxShadow: intensity === i ? `0 0 0 3px ${v.color}40` : "none",
              transition: "all 0.2s", cursor: "pointer", zIndex: 2,
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {["Somewhat", "Important", "Must-Have"].map(l => (
            <span key={l} style={{ fontSize: 9, color: T.textMuted, fontWeight: 600 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => onSwipe("skip", 0)} style={{
          flex: 1, padding: "13px 0", borderRadius: 12,
          border: `1.5px solid ${T.border}`, background: T.surface,
          fontSize: 13, fontWeight: 700, color: T.textMuted,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Not for me
        </button>
        <button onClick={() => onSwipe("accept", intensity)} style={{
          flex: 2, padding: "13px 0", borderRadius: 12,
          border: "none",
          background: `linear-gradient(135deg, ${v.color}, ${v.color}CC)`,
          fontSize: 13, fontWeight: 800, color: "white",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 4px 14px ${v.color}45`,
        }}>
          This matters to me ✓
        </button>
      </div>
    </div>
  );
}

function OnboardingCards({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [leaving, setLeaving] = useState(null); // "accept" | "skip"
  const [done, setDone] = useState(false);

  const handleSwipe = (action, intensity) => {
    const v = VALUE_DEFS[index];
    setLeaving(action);
    setTimeout(() => {
      setSelections(prev => ({ ...prev, [v.id]: action === "accept" ? intensity : 0 }));
      setLeaving(null);
      if (index >= VALUE_DEFS.length - 1) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
    }, 280);
  };

  const handleFinish = () => {
    const finalValues = { ...DEFAULT_USER_VALUES, ...selections };
    onComplete(finalValues);
  };

  if (done) {
    const selected = VALUE_DEFS.filter(v => selections[v.id] > 0);
    return (
      <div style={{ padding: "0 20px 40px", animation: "fadeUp 0.4s ease" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🎯</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Your values profile
          </h2>
          <p style={{ fontSize: 13, color: T.textSub, margin: 0, lineHeight: 1.6 }}>
            {selected.length > 0
              ? `${selected.length} value${selected.length !== 1 ? "s" : ""} selected. We'll rank every recommendation to match.`
              : "No values selected — you'll see everything unfiltered. You can add values anytime."}
          </p>
        </div>

        {selected.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {selected.map(v => (
              <div key={v.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: T.surface, border: `1.5px solid ${v.color}25`,
                borderRadius: 12, padding: "12px 14px",
              }}>
                <span style={{ fontSize: 20 }}>{v.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v.label}</div>
                </div>
                <span style={{
                  background: v.soft, color: v.color,
                  borderRadius: 6, padding: "3px 9px",
                  fontSize: 11, fontWeight: 800,
                }}>
                  {INTENSITY_LABELS[selections[v.id]]}
                </span>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleFinish} style={{
          width: "100%", padding: "16px 0", borderRadius: 14,
          border: "none", background: `linear-gradient(135deg, ${T.accent}, #C84A15)`,
          fontSize: 15, fontWeight: 800, color: "white",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 6px 20px ${T.accent}50`,
        }}>
          Find aligned spots near me →
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: T.textMuted, marginTop: 10 }}>
          Edit anytime from the My Values tab
        </p>
      </div>
    );
  }

  const current = VALUE_DEFS[index];

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 20 }}>
        {VALUE_DEFS.map((_, i) => (
          <div key={i} style={{
            height: 4, borderRadius: 2,
            width: i === index ? 22 : i < index ? 12 : 8,
            background: i < index ? T.accent : i === index ? T.accent : "#E8E2DC",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        transition: "transform 0.28s cubic-bezier(0.36,0.66,0.04,1), opacity 0.28s ease",
        transform: leaving === "accept" ? "translateX(90%) rotate(12deg)"
          : leaving === "skip" ? "translateX(-90%) rotate(-12deg)"
          : "none",
        opacity: leaving ? 0 : 1,
      }}>
        <ValueCard
          valueDef={current}
          onSwipe={handleSwipe}
          cardIndex={index}
          total={VALUE_DEFS.length}
        />
      </div>

      {/* Counter */}
      <p style={{ textAlign: "center", fontSize: 12, color: T.textMuted, marginTop: 16 }}>
        {index + 1} of {VALUE_DEFS.length}
      </p>
    </div>
  );
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState("splash"); // "splash" | "cards"

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      maxWidth: 430, margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        button:active { opacity: 0.88; transform: scale(0.98); }
      `}</style>

      {step === "splash" && <SplashScreen onStart={() => setStep("cards")} />}
      {step === "cards" && <OnboardingCards onComplete={onComplete} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

function ValuesPanel({ userValues, onChange, onClose }) {
  const active   = VALUE_DEFS.filter(v => userValues[v.id] > 0);
  const inactive = VALUE_DEFS.filter(v => userValues[v.id] === 0);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(26,23,20,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 430, margin: "0 auto",
        background: T.surface, borderRadius: "20px 20px 0 0",
        padding: "0 0 40px", maxHeight: "88vh", overflow: "auto",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 10px" }}>
          <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2 }} />
        </div>
        <div style={{ padding: "0 20px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.text }}>My Values</div>
          <div style={{ fontSize: 12, color: T.textSub, marginTop: 3 }}>
            Adjust how much each value influences rankings · ★ = Must-Have
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {active.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Active</div>
              {active.map(v => <ValueRow key={v.id} v={v} intensity={userValues[v.id]} onChange={i => onChange(v.id, i)} />)}
            </div>
          )}
          {inactive.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Off — tap to enable</div>
              {inactive.map(v => <ValueRow key={v.id} v={v} intensity={0} onChange={i => onChange(v.id, i)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ValueRow({ v, intensity, onChange }) {
  const on = intensity > 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px",
      background: on ? T.surface : T.surfaceAlt,
      border: `1.5px solid ${on ? v.color + "30" : T.border}`,
      borderRadius: T.radiusSm, marginBottom: 8,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{v.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: on ? T.text : T.textMuted }}>{v.label}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
          {[0, 1, 2, 3].map(level => (
            <button key={level} onClick={() => onChange(level)} style={{
              padding: "3px 8px", borderRadius: 5,
              border: `1.5px solid ${intensity === level ? v.color : T.border}`,
              background: intensity === level ? v.color : "transparent",
              color: intensity === level ? "white" : T.textMuted,
              fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.12s",
            }}>
              {level === 3 ? "★ " : ""}{INTENSITY_LABELS[level]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceCard({ place, userValues, rank, onLog, isLogged }) {
  const [expanded, setExpanded] = useState(false);
  const { score, mustHaveFailed } = computeScore(place, userValues);
  const alignment = getAlignment(score, mustHaveFailed);
  const isBest = rank === 0 && score !== null;
  const activeVals = VALUE_DEFS.filter(v => userValues[v.id] > 0);

  return (
    <div style={{
      background: T.surface, borderRadius: T.radius,
      border: `1.5px solid ${isBest ? T.accent + "40" : T.border}`,
      boxShadow: isBest ? `0 4px 24px ${T.accent}18` : T.shadow,
      overflow: "hidden",
      animation: `fadeUp 0.25s ease ${rank * 0.05}s both`,
    }}>
      {isBest && (
        <div style={{
          background: `linear-gradient(90deg, ${T.accent}18, ${T.accent}06)`,
          borderBottom: `1px solid ${T.accent}20`,
          padding: "5px 16px", display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Best match for your values
          </span>
        </div>
      )}

      <button onClick={() => setExpanded(e => !e)} style={{
        width: "100%", background: "transparent", border: "none",
        padding: "14px 16px", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: score !== null ? 10 : 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 2 }}>{place.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{place.address}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, marginLeft: 12 }}>
            <Pill {...alignment} />
            <div style={{ display: "flex", gap: 4 }}>
              {activeVals.map(v => {
                const r = place.scores[v.id];
                return <div key={v.id} title={`${v.label}: ${r === null ? "unknown" : r ? "✓" : "✗"}`} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: r === true ? v.color : r === false ? T.red : "#E5E2DC",
                  border: userValues[v.id] === 3 ? `2px solid ${r === true ? v.color : r === false ? T.red : "#E5E2DC"}` : "none",
                  opacity: r === null ? 0.35 : 1,
                }} />;
              })}
            </div>
          </div>
        </div>
        {score !== null && <ScoreBar score={score} mustHaveFailed={mustHaveFailed} />}
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid #F0EDE8`, padding: "16px", animation: "fadeIn 0.15s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
            {activeVals.map(v => {
              const r = place.scores[v.id];
              const col = r === true ? v.color : r === false ? T.red : T.textMuted;
              const bg  = r === true ? v.soft  : r === false ? T.redSoft : T.surfaceAlt;
              return (
                <div key={v.id} style={{ background: bg, borderRadius: T.radiusSm, padding: "10px 13px", borderLeft: `3px solid ${col}`, opacity: r === null ? 0.65 : 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: col, marginBottom: place.why[v.id] ? 3 : 0, display: "flex", alignItems: "center", gap: 5 }}>
                    {r === true ? "✓" : r === false ? "✗" : "?"} {v.label}
                    {userValues[v.id] === 3 && <span style={{ fontSize: 9, background: col, color: "white", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>MUST-HAVE</span>}
                    {r === null && <span style={{ fontSize: 10, fontWeight: 500, color: T.textMuted }}>— not yet researched</span>}
                  </div>
                  {place.why[v.id] && <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.55 }}>{place.why[v.id]}</div>}
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: T.textSub, fontStyle: "italic", padding: "9px 13px", background: T.surfaceAlt, borderRadius: T.radiusXs, marginBottom: 13 }}>
            "{place.note}"
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, background: T.text, color: "#fff", border: "none", borderRadius: T.radiusSm, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Directions →
            </button>
            <button onClick={() => onLog(place)} style={{
              flex: 1, background: isLogged ? T.greenSoft : T.accentSoft,
              color: isLogged ? T.green : T.accent,
              border: `1.5px solid ${isLogged ? T.green + "40" : T.accent + "40"}`,
              borderRadius: T.radiusSm, padding: "11px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {isLogged ? "✓ Logged" : "+ Log it"}
            </button>
            <button onClick={() => setExpanded(false)} style={{ background: T.surfaceAlt, color: T.textMuted, border: "none", borderRadius: T.radiusSm, padding: "11px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DiscoverView({ userValues, onLog, onOpenValues }) {
  const [cityId, setCityId] = useState("sf");
  const [hood, setHood] = useState("Mission");
  const [locMode, setLocMode] = useState("neighborhood");
  const [zip, setZip] = useState("");
  const [cat, setCat] = useState("coffee");
  const [logged, setLogged] = useState({});
  const [animKey, setAnimKey] = useState(0);

  const city = CITIES.find(c => c.id === cityId);
  const setNeighborhood = n => { setHood(n); setAnimKey(k => k + 1); };
  const setCity = id => {
    setCityId(id);
    const c = CITIES.find(c => c.id === id);
    setHood(c.neighborhoods[0]);
    setAnimKey(k => k + 1);
  };
  const activeCount = Object.values(userValues).filter(v => v > 0).length;

  const places = useMemo(() => {
    const all = (PLACES[hood] || []).filter(p => p.category === cat);
    return all.sort((a, b) => {
      const sa = computeScore(a, userValues), sb = computeScore(b, userValues);
      if (sa.mustHaveFailed !== sb.mustHaveFailed) return sa.mustHaveFailed ? 1 : -1;
      if (sa.score === null && sb.score !== null) return 1;
      if (sa.score !== null && sb.score === null) return -1;
      return (sb.score || 0) - (sa.score || 0);
    });
  }, [hood, cat, userValues]);

  const handleLog = (place) => {
    onLog({ place: place.name, neighborhood: hood, scores: place.scores, category: place.category });
    setLogged(p => ({ ...p, [place.name + hood]: true }));
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 0" }}>
        {/* Location mode */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[{ id: "neighborhood", label: "Area" }, { id: "current", label: "⌖ Near me" }, { id: "zip", label: "Zip" }].map(m => (
            <button key={m.id} onClick={() => setLocMode(m.id)} style={{
              background: locMode === m.id ? T.text : T.surfaceAlt,
              color: locMode === m.id ? "#fff" : T.textSub,
              border: "none", borderRadius: 100, padding: "6px 14px",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>{m.label}</button>
          ))}
        </div>

        {locMode === "neighborhood" && (
          <div>
            {/* City selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {CITIES.map(c => (
                <button key={c.id} onClick={() => setCity(c.id)} style={{
                  background: cityId === c.id ? T.text : T.surfaceAlt,
                  color: cityId === c.id ? "#fff" : T.textSub,
                  border: "none", borderRadius: 100, padding: "5px 14px",
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
          </div>
        )}
        {locMode === "current" && (
          <div style={{ background: T.accentSoft, borderRadius: T.radiusSm, padding: "11px 14px", marginBottom: 14, border: `1px solid ${T.accent}25` }}>
            <div style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>⌖ Using your location</div>
            <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>GPS coming soon — showing Mission</div>
          </div>
        )}
        {locMode === "zip" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input value={zip} onChange={e => setZip(e.target.value)} placeholder="94110, 92662, 92660…" maxLength={5}
              style={{ flex: 1, background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, padding: "9px 13px", fontSize: 13, fontFamily: "inherit", outline: "none", color: T.text }} />
            <button onClick={() => {
              const m = {
                "94110": ["sf","Mission"], "94112": ["sf","Bernal Heights"], "94131": ["sf","Noe Valley"], "94117": ["sf","Haight"],
                "92662": ["nb","Balboa Island"], "92660": ["nb","Westcliff"], "92625": ["nb","Corona del Mar"], "92661": ["nb","Balboa Peninsula"],
              };
              if (m[zip]) { setCityId(m[zip][0]); setNeighborhood(m[zip][1]); }
            }} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: T.radiusSm, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Go</button>
          </div>
        )}

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12, background: T.surfaceAlt, borderRadius: T.radiusSm, padding: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              flex: 1, background: cat === c.id ? T.surface : "transparent",
              color: cat === c.id ? T.text : T.textMuted,
              border: "none", borderRadius: 7, padding: "7px 4px",
              fontSize: 11, fontWeight: cat === c.id ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: cat === c.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              <div>{c.icon}</div><div style={{ marginTop: 1 }}>{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active values bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 12px" }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
          {activeCount === 0
            ? <span style={{ fontSize: 12, color: T.textMuted }}>No values set — showing all spots</span>
            : VALUE_DEFS.filter(v => userValues[v.id] > 0).map(v => (
              <span key={v.id} style={{ background: v.soft, color: v.color, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                {userValues[v.id] === 3 ? "★ " : ""}{v.emoji} {v.short}
              </span>
            ))}
        </div>
        <button onClick={onOpenValues} style={{ background: T.surfaceAlt, border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: T.textSub, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 8 }}>
          ⚙ Edit
        </button>
      </div>

      {/* Cards */}
      <div key={animKey} style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {places.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontSize: 13 }}>No {cat} spots indexed here yet.</div>
          : places.map((p, i) => (
            <PlaceCard key={p.name} place={p} userValues={userValues} rank={i} onLog={handleLog} isLogged={logged[p.name + hood]} />
          ))}
      </div>
    </div>
  );
}

function PortfolioView({ history, userValues, onOpenValues }) {
  const total = history.length;
  if (total === 0) return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>♡</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>No decisions yet</div>
      <div style={{ fontSize: 13, color: T.textSub }}>Log your first decision from the Discover tab.</div>
    </div>
  );

  const scored = history.map(d => {
    const { score, mustHaveFailed } = computeScore({ scores: d.scores }, userValues);
    return { ...d, score, mustHaveFailed, alignment: getAlignment(score, mustHaveFailed) };
  });

  const aligned   = scored.filter(d => d.alignment.label === "Aligned").length;
  const partial   = scored.filter(d => d.alignment.label === "Partial").length;
  const conflicts = total - aligned - partial;
  const validScores = scored.filter(d => d.score !== null);
  const avg = validScores.length ? Math.round(validScores.reduce((s, d) => s + d.score, 0) / validScores.length) : null;
  const streak = (() => { let s = 0; for (const d of [...scored].reverse()) { if (d.alignment.label === "Aligned") s++; else break; } return s; })();
  const activeVals = VALUE_DEFS.filter(v => userValues[v.id] > 0);

  return (
    <div style={{ padding: "16px 16px 32px" }}>
      {/* Overall */}
      <div style={{ background: T.surface, borderRadius: T.radius, border: `1.5px solid ${T.border}`, boxShadow: T.shadow, padding: "20px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Overall alignment</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <DonutChart pct={aligned / total} color={T.green} size={86} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Aligned",   count: aligned,   color: T.green, soft: T.greenSoft },
              { label: "Partial",   count: partial,   color: T.amber, soft: T.amberSoft },
              { label: "Conflicts", count: conflicts, color: T.red,   soft: T.redSoft  },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 12, color: T.textSub }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.soft, padding: "2px 8px", borderRadius: 100 }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Decisions", value: total,        sub: "tracked",     color: T.accent },
          { label: "Avg score", value: avg ? `${avg}%` : "—", sub: "weighted", color: T.green },
          { label: "Streak",    value: streak,       sub: "aligned 🔥",  color: T.amber },
        ].map(s => (
          <div key={s.label} style={{ background: T.surface, borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, boxShadow: T.shadow, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: T.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* By value */}
      {activeVals.length > 0 && (
        <div style={{ background: T.surface, borderRadius: T.radius, border: `1.5px solid ${T.border}`, boxShadow: T.shadow, padding: "18px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>By value</div>
            <button onClick={onOpenValues} style={{ background: "none", border: "none", color: T.accent, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Edit →</button>
          </div>
          {activeVals.map(v => {
            const count = history.filter(d => d.scores[v.id] === true).length;
            const known = history.filter(d => d.scores[v.id] !== null).length;
            const pct = known > 0 ? count / known : 0;
            return (
              <div key={v.id} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 14 }}>{v.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{v.label}</span>
                    {userValues[v.id] === 3 && <span style={{ fontSize: 9, background: v.color, color: "white", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>★</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {known < total && <span style={{ fontSize: 10, color: T.textMuted }}>{total - known} unknown</span>}
                    <span style={{ fontSize: 12, fontWeight: 700, color: v.color }}>{Math.round(pct * 100)}%</span>
                  </div>
                </div>
                <div style={{ background: "#F0EDE8", borderRadius: 100, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${pct * 100}%`, height: "100%", background: `linear-gradient(90deg, ${v.color}70, ${v.color})`, borderRadius: 100, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Decision history</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[...scored].reverse().map((d, i) => {
          const cat = CATEGORIES.find(c => c.id === d.category);
          return (
            <div key={d.id} style={{ background: T.surface, borderRadius: T.radiusSm, border: `1.5px solid ${T.border}`, padding: "12px 14px", animation: `fadeUp 0.2s ease ${i * 0.025}s both` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: d.score !== null ? 8 : 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {cat?.icon || "📍"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{d.place}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{d.neighborhood} · {d.date}</div>
                </div>
                <Pill {...d.alignment} />
              </div>
              {d.score !== null && <ScoreBar score={d.score} mustHaveFailed={d.mustHaveFailed} size="sm" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MainApp({ userValues: initialValues }) {
  const [tab, setTab] = useState("discover");
  const [history, setHistory] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [userValues, setUserValues] = useState(initialValues);
  const [showValuesPanel, setShowValuesPanel] = useState(false);

  const logDecision = item => {
    const d = new Date();
    const dateStr = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
    setHistory(p => [...p, { ...item, id: nextId, date: dateStr }]);
    setNextId(n => n + 1);
  };

  const updateValue = (id, intensity) => setUserValues(p => ({ ...p, [id]: intensity }));

  const validScores = history.map(d => computeScore({ scores: d.scores }, userValues)).filter(s => s.score !== null);
  const avgAlign = validScores.length ? Math.round(validScores.reduce((s, d) => s + d.score, 0) / validScores.length) : null;
  const alignColor = avgAlign === null ? T.textMuted : avgAlign >= 70 ? T.green : avgAlign >= 40 ? T.amber : T.red;
  const alignBg    = avgAlign === null ? T.surfaceAlt : avgAlign >= 70 ? T.greenSoft : avgAlign >= 40 ? T.amberSoft : T.redSoft;

  const activeCount = Object.values(userValues).filter(v => v > 0).length;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: T.text, maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "48px 20px 20px", background: T.surface, borderBottom: `1px solid #F0EDE8` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: T.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 12px ${T.accent}40` }}>♡</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>ValueWallet</div>
              <div style={{ fontSize: 11, color: T.textSub, marginTop: 1 }}>Spend with intention</div>
            </div>
          </div>
          <button onClick={() => setShowValuesPanel(true)} style={{
            background: alignBg, borderRadius: 100, padding: "6px 14px",
            display: "flex", alignItems: "center", gap: 6,
            border: `1px solid ${alignColor}30`, cursor: "pointer", fontFamily: "inherit",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: alignColor }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: alignColor }}>
              {avgAlign !== null ? `${avgAlign}% aligned` : `${activeCount} value${activeCount !== 1 ? "s" : ""} set`}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: T.surface, borderBottom: `1px solid #F0EDE8`, padding: "0 16px" }}>
        {[{ id: "discover", label: "Discover" }, { id: "portfolio", label: "My Values" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: "transparent", border: "none",
            borderBottom: `2px solid ${tab === t.id ? T.accent : "transparent"}`,
            color: tab === t.id ? T.text : T.textMuted,
            padding: "14px 0", fontSize: 13, fontWeight: tab === t.id ? 700 : 400,
            cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ paddingTop: 16 }}>
        {tab === "discover"  && <DiscoverView  userValues={userValues} onLog={logDecision}    onOpenValues={() => setShowValuesPanel(true)} />}
        {tab === "portfolio" && <PortfolioView history={history}       userValues={userValues} onOpenValues={() => setShowValuesPanel(true)} />}
      </div>

      {showValuesPanel && <ValuesPanel userValues={userValues} onChange={updateValue} onClose={() => setShowValuesPanel(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — orchestrates onboarding → app transition
// ═══════════════════════════════════════════════════════════════════════════════
export default function ValueWalletApp() {
  const [phase, setPhase] = useState("onboarding"); // "onboarding" | "app"
  const [userValues, setUserValues] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleOnboardingComplete = (values) => {
    setUserValues(values);
    setTransitioning(true);
    setTimeout(() => {
      setPhase("app");
      setTransitioning(false);
    }, 350);
  };

  return (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transition: "opacity 0.35s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        @keyframes fadeUp   { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp  { from { transform:translateY(100%) } to { transform:translateY(0) } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        button { transition: opacity 0.1s, transform 0.1s; cursor: pointer; }
        button:active { opacity: 0.86; transform: scale(0.98); }
      `}</style>

      {phase === "onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}
      {phase === "app"        && <MainApp    userValues={userValues} />}
    </div>
  );
}
