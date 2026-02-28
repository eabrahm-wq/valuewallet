import { useEffect, useRef, useState } from "react";

const TICKER_ITEMS = [
  { n: "Ritual Coffee",       h: "Mission",        s: "a", label: "Aligned",   score: "94%" },
  { n: "Linea Caffe",         h: "Mission",        s: "a", label: "Aligned",   score: "88%" },
  { n: "Flywheel Coffee",     h: "Haight",         s: "a", label: "Aligned",   score: "85%" },
  { n: "CoffeeShop",          h: "Bernal Heights", s: "a", label: "Aligned",   score: "90%" },
  { n: "Cantata Coffee",      h: "Haight",         s: "a", label: "Aligned",   score: "87%" },
  { n: "Grand Coffee",        h: "Mission",        s: "a", label: "Aligned",   score: "82%" },
  { n: "Sightglass Coffee",   h: "Mission",        s: "p", label: "Partial",   score: "52%" },
  { n: "Martha & Bros.",      h: "Noe Valley",     s: "p", label: "Partial",   score: "58%" },
  { n: "Progressive Grounds", h: "Bernal Heights", s: "p", label: "Partial",   score: "60%" },
  { n: "Starbucks",           h: "Noe Valley",     s: "c", label: "Conflicts", score: "4%"  },
];

const BC = {
  a: { bg: "#EAF5EE", color: "#2D7A4F" },
  p: { bg: "#FDF6E8", color: "#C47A1E" },
  c: { bg: "#FDEAEA", color: "#C04040" },
};

const VALUES = [
  { e:"🏠", cluster:"Ownership",    title:"Independent Ownership", desc:"No PE, VC, or corporate chains. Your money stays with founders and families.",         accent:"#E8622A" },
  { e:"🌱", cluster:"Supply Chain", title:"Transparent Sourcing",  desc:"Named farms, real relationships. Not just 'ethically sourced' marketing.",              accent:"#2D7A4F" },
  { e:"🌿", cluster:"Supply Chain", title:"Organic & Clean",       desc:"No harmful pesticides or additives. Verified, not just claimed.",                       accent:"#5A7A3A" },
  { e:"💸", cluster:"Labor",        title:"Living Wage",           desc:"Workers paid enough to actually live in the city they work in.",                        accent:"#1A6B9A" },
  { e:"🤝", cluster:"Labor",        title:"Worker Ownership",      desc:"Employees with equity make decisions for the long term, not next quarter.",             accent:"#7C4DFF" },
  { e:"🏘", cluster:"Community",    title:"Community Rooted",      desc:"Locally founded. Reinvests in the neighborhood. Multiplier effects for your money.",    accent:"#C97A1A" },
  { e:"✊", cluster:"Community",    title:"Diverse Ownership",     desc:"Women, BIPOC, and LGBTQ+ founders building wealth in their communities.",               accent:"#B5338A" },
  { e:"🌍", cluster:"Environment",  title:"Climate Conscious",     desc:"B Corp certified. Renewable energy. Actually reducing footprint, not just offsetting.", accent:"#0B7A75" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Eyebrow({ children, center }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E8622A", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: center ? "center" : "flex-start", gap: 8 }}>
      <span style={{ display: "inline-block", width: 18, height: 1.5, background: "#E8622A" }} />
      {children}
    </div>
  );
}

function ScoreBar({ w, color }) {
  return (
    <div style={{ height: 4, background: "#F0EDE8", borderRadius: 100, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 100, background: `linear-gradient(90deg,${color}70,${color})` }} />
    </div>
  );
}

function PhoneShell({ children }) {
  return (
    <div style={{ width: 280, background: "#1A1714", borderRadius: 40, padding: 10, boxShadow: "0 32px 64px rgba(26,23,20,0.2), 0 0 0 1px rgba(255,255,255,0.06)" }}>
      <div style={{ background: "#FAFAF8", borderRadius: 32, overflow: "hidden", height: 560 }}>
        <div style={{ height: 32, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 22, background: "#1A1714", borderRadius: 100 }} />
        </div>
        {children}
      </div>
    </div>
  );
}

function PhoneHeader({ badge }) {
  return (
    <div style={{ background: "#fff", padding: "10px 14px 12px", borderBottom: "1px solid #EEEAE4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 26, height: 26, background: "#E8622A", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white" }}>♡</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "-0.02em" }}>ValueWallet</div>
          <div style={{ fontSize: 8, color: "#7A756E" }}>Spend with intention</div>
        </div>
      </div>
      <div style={{ background: "#EAF5EE", color: "#2D7A4F", borderRadius: 100, padding: "3px 9px", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#2D7A4F" }} />{badge}
      </div>
    </div>
  );
}

function PhoneTabs({ active }) {
  return (
    <div style={{ background: "#fff", display: "flex", padding: "0 14px", borderBottom: "1px solid #EEEAE4" }}>
      {["Discover","My Values"].map((t,i) => (
        <div key={t} style={{ flex: 1, padding: "9px 0", fontSize: 10, fontWeight: active===i?700:500, textAlign: "center", color: active===i?"#1A1714":"#B8B2AA", borderBottom: active===i?"2px solid #E8622A":"2px solid transparent" }}>{t}</div>
      ))}
    </div>
  );
}

function PhoneDiscover() {
  const cards = [
    { name:"Ritual Coffee", addr:"1026 Valencia St", pill:"✓ Aligned",   pc:"#2D7A4F", pb:"#EAF5EE", w:94, best:true  },
    { name:"Linea Caffe",   addr:"18 Mariposa St",   pill:"✓ Aligned",   pc:"#2D7A4F", pb:"#EAF5EE", w:86, best:false },
    { name:"Sightglass",    addr:"3014 20th St",     pill:"~ Partial",   pc:"#C47A1E", pb:"#FDF6E8", w:50, best:false },
    { name:"Starbucks",     addr:"3973 24th St",     pill:"✗ Conflicts", pc:"#C04040", pb:"#FDEAEA", w:4,  best:false },
  ];
  return (
    <PhoneShell>
      <PhoneHeader badge="84% aligned" />
      <PhoneTabs active={0} />
      <div style={{ padding: 10 }}>
        <div style={{ display:"flex", gap:4, marginBottom:10, flexWrap:"wrap" }}>
          {["Mission","Bernal","Noe Valley","Haight"].map((n,i) => (
            <div key={n} style={{ fontSize:9, fontWeight:600, padding:"3px 8px", borderRadius:100, border:`1.5px solid ${i===0?"#E8622A":"#EEEAE4"}`, background:i===0?"#E8622A":"#fff", color:i===0?"white":"#7A756E" }}>{n}</div>
          ))}
        </div>
        <div style={{ display:"flex", gap:4, marginBottom:10, flexWrap:"wrap" }}>
          {[["🏠","Indep.","#E8622A","#FEF0EA"],["🌱","Sourcing","#2D7A4F","#EAF5EE"],["💸","Wages","#1A6B9A","#EEF5FB"]].map(([e,l,c,bg]) => (
            <span key={l} style={{ background:bg, color:c, borderRadius:5, padding:"2px 6px", fontSize:8, fontWeight:700 }}>{e} {l}</span>
          ))}
        </div>
        {cards.map(c => (
          <div key={c.name} style={{ background:"#fff", borderRadius:10, border:`1.5px solid ${c.best?"rgba(232,98,42,0.3)":"#EEEAE4"}`, marginBottom:6, overflow:"hidden", boxShadow:c.best?"0 4px 12px rgba(232,98,42,0.1)":"none" }}>
            {c.best && <div style={{ background:"linear-gradient(90deg,rgba(232,98,42,0.12),rgba(232,98,42,0.04))", padding:"3px 10px", borderBottom:"1px solid rgba(232,98,42,0.1)", fontSize:7, fontWeight:800, color:"#E8622A", letterSpacing:"0.05em", textTransform:"uppercase" }}>● Best match for your values</div>}
            <div style={{ padding:"9px 10px 8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div><div style={{ fontSize:11, fontWeight:700 }}>{c.name}</div><div style={{ fontSize:8, color:"#B8B2AA", marginTop:1 }}>{c.addr}</div></div>
                <div style={{ background:c.pb, color:c.pc, fontSize:8, fontWeight:700, padding:"2px 6px", borderRadius:100, whiteSpace:"nowrap" }}>{c.pill}</div>
              </div>
              <ScoreBar w={c.w} color={c.pc} />
            </div>
          </div>
        ))}
      </div>
    </PhoneShell>
  );
}

function PhonePortfolio() {
  return (
    <PhoneShell>
      <PhoneHeader badge="79% aligned" />
      <PhoneTabs active={1} />
      <div style={{ padding:"12px 10px 0" }}>
        <div style={{ background:"#fff", border:"1.5px solid #EEEAE4", borderRadius:10, padding:12, marginBottom:8 }}>
          <div style={{ fontSize:8, fontWeight:700, color:"#B8B2AA", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>Overall alignment</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <svg width="64" height="64" viewBox="0 0 70 70">
              <path d="M35 9 A26 26 0 1 1 34.99 9Z" fill="#F0EDE8"/>
              <path d="M35 9 A26 26 0 0 1 59 46 L51 41 A17 17 0 0 0 35 18Z" fill="#2D7A4F"/>
              <text x="35" y="36" textAnchor="middle" dominantBaseline="middle" fill="#1A1714" fontSize="13" fontFamily="DM Sans" fontWeight="800">79%</text>
            </svg>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
              {[["#2D7A4F","#EAF5EE","Aligned","5"],["#C47A1E","#FDF6E8","Partial","2"],["#C04040","#FDEAEA","Conflicts","1"]].map(([c,bg,l,n]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:c, flexShrink:0 }}/>
                  <div style={{ flex:1, fontSize:10, color:"#7A756E" }}>{l}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:c, background:bg, padding:"1px 6px", borderRadius:100 }}>{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:8 }}>
          {[["8","#E8622A","Decisions"],["79%","#2D7A4F","Avg score"],["3🔥","#C47A1E","Streak"]].map(([v,c,l]) => (
            <div key={l} style={{ background:"#fff", border:"1.5px solid #EEEAE4", borderRadius:8, padding:"8px 6px", textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:c, letterSpacing:"-0.02em" }}>{v}</div>
              <div style={{ fontSize:8, fontWeight:700, color:"#1A1714", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", border:"1.5px solid #EEEAE4", borderRadius:10, padding:12 }}>
          <div style={{ fontSize:8, fontWeight:700, color:"#B8B2AA", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>By value</div>
          {[["🏠","Independent","#E8622A",88],["🌱","Sourcing","#2D7A4F",75],["💸","Wages","#1A6B9A",62]].map(([e,l,c,w]) => (
            <div key={l} style={{ marginBottom:9 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:10, fontWeight:600 }}>{e} {l}</span>
                <span style={{ fontSize:10, fontWeight:700, color:c }}>{w}%</span>
              </div>
              <div style={{ background:"#F0EDE8", borderRadius:100, height:4, overflow:"hidden" }}>
                <div style={{ width:`${w}%`, height:"100%", background:`linear-gradient(90deg,${c}70,${c})`, borderRadius:100 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

export default function Landing({ onLaunchApp }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const r = (i, delay = 0) => el => {
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
      refs.current[i] = el;
    }
  };

  const P = isMobile ? "20px" : "40px"; // horizontal padding
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div style={{ fontFamily:"'DM Sans',-apple-system,sans-serif", background:"#FAFAF8", color:"#1A1714", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{-webkit-font-smoothing:antialiased}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.85)}}
        .hover-lift:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.1)!important}
        .hover-lift:hover .accent-bar{opacity:1!important}
        .vcard:hover{background:#fff!important;transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.08)!important}
        .vcard:hover .vbar{transform:scaleX(1)!important}
        .ticker-wrap:hover .ticker-anim{animation-play-state:paused!important}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:`0 ${P}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(250,250,248,0.92)", backdropFilter:"saturate(180%) blur(20px)", borderBottom:"1px solid #EEEAE4" }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:30, height:30, background:"#E8622A", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"white", boxShadow:"0 3px 10px rgba(232,98,42,0.35)" }}>♡</div>
          <span style={{ fontSize:15, fontWeight:800, color:"#1A1714", letterSpacing:"-0.02em" }}>ValueWallet</span>
        </a>

        {/* Desktop links — hidden on mobile */}
        {!isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:32 }}>
            <a href="#how"      style={{ fontSize:13, fontWeight:500, color:"#7A756E", textDecoration:"none" }}>How it works</a>
            <a href="#values"   style={{ fontSize:13, fontWeight:500, color:"#7A756E", textDecoration:"none" }}>The values</a>
            <a href="#waitlist" style={{ fontSize:13, fontWeight:500, color:"#7A756E", textDecoration:"none" }}>Waitlist</a>
          </div>
        )}

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {!isMobile && (
            <button onClick={onLaunchApp} style={{ background:"none", border:"none", fontSize:13, fontWeight:600, color:"#7A756E", cursor:"pointer", fontFamily:"inherit" }}>
              Try the app →
            </button>
          )}
          <a href="#waitlist" style={{ background:"#E8622A", color:"white", borderRadius:100, padding:"9px 18px", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 3px 10px rgba(232,98,42,0.3)", display:"inline-block", whiteSpace:"nowrap" }}>
            {isMobile ? "Join waitlist" : "Get early access"}
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "100px 20px 60px" : "140px 40px 100px", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems:"center" }}>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#FEF0EA", color:"#E8622A", borderRadius:100, padding:"5px 14px 5px 10px", fontSize:12, fontWeight:700, marginBottom:24, animation:"fadeUp 0.5s ease 0.1s both" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#E8622A", animation:"pulse 2s ease infinite" }}/>
            SF Beta · Coming soon
          </div>
          <h1 style={{ fontSize: isMobile ? 44 : "clamp(40px,5vw,64px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-0.035em", marginBottom:18, animation:"fadeUp 0.6s ease 0.2s both" }}>
            Spend money<br/>that <span style={{ color:"#E8622A" }}>matches</span><br/>your values.
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 17, color:"#7A756E", lineHeight:1.65, marginBottom:36, fontWeight:400, animation:"fadeUp 0.6s ease 0.32s both" }}>
            ValueWallet ranks every coffee shop, restaurant, and store by your personal values — before you walk in.
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", animation:"fadeUp 0.6s ease 0.44s both" }}>
            <a href="#waitlist" style={{ background:"linear-gradient(135deg,#E8622A,#C84A15)", color:"white", border:"none", borderRadius:14, padding:"15px 28px", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800, cursor:"pointer", textDecoration:"none", display:"inline-block", boxShadow:"0 6px 20px rgba(232,98,42,0.35)" }}>
              Join the waitlist →
            </a>
            <button onClick={onLaunchApp} style={{ background:"none", border:"none", fontSize:14, fontWeight:700, color:"#E8622A", cursor:"pointer", fontFamily:"inherit" }}>
              Try the demo →
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop:36, display:"flex", alignItems:"center", gap:14, animation:"fadeUp 0.6s ease 0.56s both" }}>
            <div style={{ display:"flex" }}>
              {["🙋","👤","🙍","👥"].map((e,i) => (
                <div key={i} style={{ width:26, height:26, borderRadius:"50%", border:"2px solid #FAFAF8", marginRight:-8, background:"#F5F3EF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>{e}</div>
              ))}
            </div>
            <div style={{ fontSize:12, color:"#7A756E", lineHeight:1.4 }}>
              <strong style={{ color:"#1A1714", fontWeight:700 }}>340+ people</strong> on the waitlist<br/>SF neighborhoods launching first
            </div>
          </div>
        </div>

        {/* Phone — centered on mobile, right col on desktop */}
        <div style={{ display:"flex", justifyContent:"center", position:"relative", animation:"fadeUp 0.7s ease 0.3s both" }}>
          <div style={{ position:"absolute", top:"5%", left:"5%", right:"5%", bottom:"5%", background:"radial-gradient(ellipse,rgba(232,98,42,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <PhoneDiscover />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap" style={{ borderTop:"1px solid #EEEAE4", borderBottom:"1px solid #EEEAE4", padding:"12px 0", overflow:"hidden", background:"#FFFFFF" }}>
        <div className="ticker-anim" style={{ display:"flex", animation:"ticker 28s linear infinite", width:"max-content" }}>
          {doubled.map((d,i) => {
            const bc = BC[d.s];
            return (
              <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"4px 24px 4px 0", borderRight:"1px solid #EEEAE4", marginRight:24, whiteSpace:"nowrap", fontSize:12, fontWeight:600, color:"#1A1714" }}>
                <div style={{ width:22, height:22, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, background:bc.bg }}>☕</div>
                <span>{d.n}</span>
                <span style={{ fontSize:11, color:"#B8B2AA", fontWeight:400 }}>{d.h}</span>
                <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:4, textTransform:"uppercase", letterSpacing:"0.04em", background:bc.bg, color:bc.color }}>{d.label}</span>
                <span style={{ fontSize:11, color:"#B8B2AA" }}>{d.score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "72px 20px" : "96px 40px" }}>
        <div ref={r(0)}><Eyebrow>How it works</Eyebrow></div>
        <h2 ref={r(1,0.08)} style={{ fontSize: isMobile ? 32 : "clamp(32px,4vw,52px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom: isMobile ? 36 : 56 }}>
          Three steps to <span style={{ color:"#E8622A" }}>aligned</span> spending
        </h2>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:14 }}>
          {[
            { num:"1", icon:"♡",  title:"Set your values",     text:"Swipe through 8 values and set how much each matters — from Somewhat to Must-Have. Your priorities, not a one-size-fits-all score." },
            { num:"2", icon:"📍", title:"Find spots near you",  text:"Open nearby results ranked by a weighted score built from your exact value priorities. Tap any spot for a full sourced breakdown." },
            { num:"3", icon:"📊", title:"Track your alignment", text:"Log decisions and watch your portfolio grow. See your alignment percentage and per-value streaks over time." },
          ].map((s,i) => (
            <div ref={r(2+i, i*0.08)} key={i} className="hover-lift" style={{ background:"#FFFFFF", border:"1.5px solid #EEEAE4", borderRadius:20, padding: isMobile ? "28px 24px" : "36px 32px", position:"relative", overflow:"hidden", transition:"transform 0.2s,box-shadow 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.05)" }}>
              <div className="accent-bar" style={{ position:"absolute", top:0, left:0, width:"100%", height:3, background:"linear-gradient(90deg,#E8622A,#C84A15)", opacity:0, transition:"opacity 0.2s" }}/>
              <div style={{ position:"absolute", top:16, right:20, fontSize:56, fontWeight:900, color:"#EEEAE4", lineHeight:1, pointerEvents:"none" }}>{s.num}</div>
              <div style={{ fontSize:28, marginBottom:16 }}>{s.icon}</div>
              <h3 style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.02em", marginBottom:10 }}>{s.title}</h3>
              <p style={{ fontSize:14, color:"#7A756E", lineHeight:1.7 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROOF ── */}
      <div style={{ background:"#FFFFFF", borderTop:"1px solid #EEEAE4", borderBottom:"1px solid #EEEAE4", padding: isMobile ? "20px" : "24px 40px", display:"flex", alignItems:"center", justifyContent:"center", gap: isMobile ? 16 : 40, flexWrap:"wrap" }}>
        {[["20+","SF spots researched"],["8","trackable values"],["4","SF neighborhoods"],].map(([strong,rest],i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#7A756E" }}>
            {i>0 && !isMobile && <div style={{ width:4, height:4, borderRadius:"50%", background:"#EEEAE4", marginRight:8 }}/>}
            <strong style={{ color:"#1A1714", fontWeight:700 }}>{strong} </strong>{rest}
          </div>
        ))}
        {!isMobile && <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#7A756E" }}><div style={{ width:4, height:4, borderRadius:"50%", background:"#EEEAE4", marginRight:8 }}/>All data <strong style={{ color:"#1A1714", fontWeight:700, marginLeft:4 }}>sourced and cited</strong></div>}
      </div>

      {/* ── VALUES ── */}
      <div id="values" style={{ background:"#FFFFFF", borderBottom:"1px solid #EEEAE4" }}>
        <section style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "72px 20px" : "96px 40px" }}>
          <div ref={r(5)}><Eyebrow>The values</Eyebrow></div>
          <h2 ref={r(6,0.08)} style={{ fontSize: isMobile ? 32 : "clamp(32px,4vw,52px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:40 }}>
            Eight dimensions. <span style={{ color:"#E8622A" }}>Your</span> priorities.
          </h2>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap:10 }}>
            {VALUES.map((v,i) => (
              <div ref={r(7+i, (i%4)*0.07)} key={i} className="vcard" style={{ background:"#FAFAF8", border:"1.5px solid #EEEAE4", borderRadius:14, padding: isMobile ? "18px 16px" : "24px 20px", transition:"all 0.2s", position:"relative", overflow:"hidden" }}>
                <div className="vbar" style={{ position:"absolute", top:0, left:0, width:"100%", height:2.5, background:v.accent, transform:"scaleX(0)", transformOrigin:"left", transition:"transform 0.25s ease" }}/>
                <div style={{ fontSize: isMobile ? 22 : 26, marginBottom:10 }}>{v.e}</div>
                <div style={{ fontSize:9, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:v.accent, marginBottom:5 }}>{v.cluster}</div>
                <div style={{ fontSize: isMobile ? 12 : 14, fontWeight:800, color:"#1A1714", marginBottom:5, lineHeight:1.3, letterSpacing:"-0.01em" }}>{v.title}</div>
                {!isMobile && <div style={{ fontSize:12, color:"#7A756E", lineHeight:1.6 }}>{v.desc}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FEATURE ── */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "72px 20px" : "96px 40px", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems:"center" }}>
        <div ref={r(15)}>
          <Eyebrow>The ranking</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 32 : "clamp(32px,4vw,52px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:18 }}>
            Ranked by <span style={{ color:"#E8622A" }}>your</span> weights,<br/>not ours
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 16, color:"#7A756E", lineHeight:1.7, marginBottom:16 }}>
            Set "Independent Ownership" as a must-have and PE-backed spots get pushed to the bottom. Must-Have values hard-override the entire ranking.
          </p>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:12, marginTop:28 }}>
            {["GPS-powered results sorted by your exact priorities","Per-spot breakdowns with sourced, verified explanations","Must-Have values override the ranking entirely","Decision history and alignment score tracked over time","Coffee → food → grocery → clothing. Every decision."].map((item,i) => (
              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, fontSize:14, color:"#1A1714", lineHeight:1.5 }}>
                <div style={{ width:20, height:20, background:"#EAF5EE", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#2D7A4F", fontWeight:800, flexShrink:0, marginTop:1 }}>✓</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div ref={r(16,0.1)} style={{ display:"flex", justifyContent:"center" }}>
          <PhonePortfolio />
        </div>
      </section>

      {/* ── CAPTURE ── */}
      <div id="waitlist" style={{ background:"#FFFFFF", borderTop:"1px solid #EEEAE4" }}>
        <section style={{ padding: isMobile ? "72px 20px" : "100px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:700, height:400, background:"radial-gradient(ellipse at top,rgba(232,98,42,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:540, margin:"0 auto", position:"relative" }}>
            <div ref={r(17)}><Eyebrow center>Early access</Eyebrow></div>
            <h2 ref={r(18,0.08)} style={{ fontSize: isMobile ? 32 : "clamp(32px,4vw,52px)", fontWeight:900, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:14 }}>
              Be first to <span style={{ color:"#E8622A" }}>spend<br/>with intention.</span>
            </h2>
            <p ref={r(19,0.14)} style={{ fontSize: isMobile ? 15 : 16, color:"#7A756E", lineHeight:1.65, marginBottom:40 }}>
              SF Beta launching soon. Join the waitlist and help us expand to your neighbourhood.
            </p>
            {!submitted ? (
              <div ref={r(20,0.18)} style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:10, background:"#FFFFFF", border:"1.5px solid #EEEAE4", borderRadius:16, padding: isMobile ? "12px 16px" : "6px 6px 6px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.07),0 12px 40px rgba(0,0,0,0.07)", maxWidth:460, margin:"0 auto 14px" }}>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setSubmitted(true)} placeholder="your@email.com"
                  style={{ flex:1, border:"none", outline:"none", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#1A1714", background:"transparent", padding: isMobile ? "4px 0" : 0 }}/>
                <button onClick={()=>email.includes("@")&&setSubmitted(true)}
                  style={{ background:"linear-gradient(135deg,#E8622A,#C84A15)", color:"white", border:"none", borderRadius:11, padding:"13px 24px", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer", boxShadow:"0 3px 10px rgba(232,98,42,0.3)", whiteSpace:"nowrap", width: isMobile ? "100%" : "auto" }}>
                  Join waitlist →
                </button>
              </div>
            ) : (
              <div style={{ color:"#2D7A4F", fontSize:15, fontWeight:700, margin:"0 0 14px", animation:"fadeUp 0.3s ease" }}>✓ You're on the list — we'll be in touch.</div>
            )}
            <p style={{ fontSize:12, color:"#B8B2AA" }}>No spam. One launch email when we ship.</p>
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid #EEEAE4", padding: isMobile ? "32px 20px" : "40px", display:"flex", alignItems: isMobile ? "flex-start" : "center", justifyContent:"space-between", flexWrap:"wrap", gap:24, background:"#FAFAF8", flexDirection: isMobile ? "column" : "row" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:6 }}>
            <div style={{ width:30, height:30, background:"#E8622A", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"white" }}>♡</div>
            <span style={{ fontSize:15, fontWeight:800, color:"#1A1714", letterSpacing:"-0.02em" }}>ValueWallet</span>
          </div>
          <div style={{ fontSize:12, color:"#B8B2AA" }}>Spend with intention.</div>
        </div>
        <div style={{ display:"flex", gap: isMobile ? 20 : 28, flexWrap:"wrap" }}>
          {[["#how","How it works"],["#values","The values"],["#waitlist","Waitlist"]].map(([href,label]) => (
            <a key={href} href={href} style={{ fontSize:13, color:"#7A756E", textDecoration:"none" }}>{label}</a>
          ))}
          <button onClick={onLaunchApp} style={{ background:"none", border:"none", fontSize:13, fontWeight:700, color:"#E8622A", cursor:"pointer", fontFamily:"inherit" }}>Try the app →</button>
        </div>
        {!isMobile && <div style={{ fontSize:12, color:"#B8B2AA", textAlign:"right" }}>SF Beta · © 2025 ValueWallet<br/><span style={{ opacity:0.6 }}>Built in San Francisco</span></div>}
      </footer>
    </div>
  );
}
