import { useState, useEffect, useRef } from "react";

/* ── TOKENS ────────────────────────────────────────────────────── */
const C = {
  navy:     "#1a1a2e",
  navyMid:  "#12122a",
  cream:    "#fff8e7",
  creamDim: "#ffefba",
  pink:     "#d86d9c",
  pinkDim:  "#a84d76",
  green:    "#5D7B3D",
  greenDim: "#4a6230",
  muted:    "#9a8f7a",
  gold:     "#f5c842",
  purple:   "#7B5EA7",
  warm:     "#f0ebe0",
};

/* ── FONTS ─────────────────────────────────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e) {} };
  }, []);
  return null;
};

/* ── FIREFLY CURSOR ────────────────────────────────────────────── */
function FireflyCursor() {
  const [trail, setTrail] = useState([]);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const idRef = useRef(0);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const id = ++idRef.current;
      const colors = [C.creamDim, C.pink, C.green, "#fff", C.gold];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 5 + 3;
      setTrail(prev => [...prev.slice(-18), { id, x: e.clientX, y: e.clientY, color, size, born: Date.now() }]);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(p => Date.now() - p.born < 600));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      <div style={{ position: "fixed", left: pos.x - 8, top: pos.y - 8, width: 16, height: 16, pointerEvents: "none" }}>
        <div style={{ width: 10, height: 14, background: `radial-gradient(ellipse at 50% 40%, ${C.navy} 60%, #2a2a4e 100%)`, borderRadius: "50% 50% 45% 45%", position: "absolute", left: 3, top: 0 }} />
        <div style={{ width: 10, height: 8, background: `radial-gradient(ellipse, ${C.creamDim} 0%, ${C.gold}cc 50%, transparent 100%)`, borderRadius: "50%", position: "absolute", left: 3, top: 9, boxShadow: `0 0 8px ${C.creamDim}, 0 0 16px ${C.gold}88`, animation: "ffpulse 1.2s ease-in-out infinite" }} />
        <div style={{ width: 7, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: "50%", position: "absolute", left: -2, top: 3, transform: "rotate(-20deg)" }} />
        <div style={{ width: 7, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: "50%", position: "absolute", right: -2, top: 3, transform: "rotate(20deg)" }} />
      </div>
      {trail.map(p => {
        const age = (Date.now() - p.born) / 600;
        return (
          <div key={p.id} style={{
            position: "fixed", left: p.x - p.size / 2, top: p.y - p.size / 2,
            width: p.size, height: p.size, borderRadius: "50%", background: p.color,
            opacity: Math.max(0, 1 - age), boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            pointerEvents: "none", transform: `scale(${1 - age * 0.5})`,
          }} />
        );
      })}
      <style>{`@keyframes ffpulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}*{cursor:none!important}`}</style>
    </div>
  );
}

/* ── MOBILE CLOVER ─────────────────────────────────────────────── */
function CloverPulse() {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, width: 48, height: 48, animation: "cpulse 2.5s ease-in-out infinite", filter: "drop-shadow(0 0 8px rgba(93,123,61,.6))", pointerEvents: "none" }}>
      <img src="/clover.png" alt="luckystains" style={{ width: 48, height: 48, objectFit: "contain" }} />
      <style>{`@keyframes cpulse{0%,100%{opacity:.6;transform:scale(.92)}50%{opacity:1;transform:scale(1.08)}}`}</style>
    </div>
  );
}

/* ── STARFIELD ─────────────────────────────────────────────────── */
function Starfield({ count = 80 }) {
  const stars = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4, dur: Math.random() * 3 + 2,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: "white", animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.8;transform:scale(1.3)}}`}</style>
    </div>
  );
}

/* ── WATERCOLOR BLOOM ──────────────────────────────────────────── */
function WatercolorBloom({ color, active, onDone }) {
  useEffect(() => { if (active) { const t = setTimeout(onDone, 900); return () => clearTimeout(t); } }, [active]);
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100vmax", height: "100vmax", borderRadius: "50%", background: `radial-gradient(circle, ${color}ee 0%, ${color}88 40%, ${color}22 70%, transparent 100%)`, animation: "wbloom .9s cubic-bezier(.2,.8,.4,1) forwards", filter: "blur(8px)" }} />
      <style>{`@keyframes wbloom{0%{transform:scale(0);opacity:.9}50%{transform:scale(1.2);opacity:.7}100%{transform:scale(3);opacity:0}}`}</style>
    </div>
  );
}

/* ── NAV ───────────────────────────────────────────────────────── */
function Nav({ page, setPage, scrolled }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Care", page: "care" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        background: scrolled ? `${C.navy}f0` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(255,255,255,.06)` : "none",
        transition: "all 0.3s", padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <button onClick={() => go("home")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, cursor: "none" }}>
          <img src="/clover.png" alt="luckystains" style={{ width: 28, height: 28, objectFit: "contain", filter: "drop-shadow(0 0 4px rgba(93,123,61,.4))" }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.cream, letterSpacing: "0.06em" }}>luckystains</span>
        </button>

        <div className="ls-desktop-nav" style={{ display: "flex", gap: 28 }}>
          {items.map(i => (
            <button key={i.page} onClick={() => go(i.page)} style={{
              background: "none", border: "none", cursor: "none",
              fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: page === i.page ? C.cream : C.muted,
              borderBottom: page === i.page ? `1px solid ${C.pink}` : "1px solid transparent",
              paddingBottom: 2, transition: "all 0.2s",
            }}>{i.label}</button>
          ))}
        </div>

        <button onClick={() => setOpen(o => !o)} className="ls-hamburger" style={{ background: "none", border: "none", display: "none", flexDirection: "column", gap: 5, padding: 4, cursor: "pointer" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 22, height: 2, background: C.cream, borderRadius: 2, transition: "all 0.3s",
              transform: open ? i===0 ? "rotate(45deg) translate(5px,5px)" : i===2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)" : "none",
              opacity: open && i===1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 260, zIndex: 490,
        background: `${C.navy}f8`, backdropFilter: "blur(20px)",
        borderRight: `1px solid rgba(255,255,255,.08)`,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", padding: "80px 32px 40px", gap: 8,
      }}>
        <img src="/clover.png" alt="" style={{ width: 48, height: 48, objectFit: "contain", marginBottom: 24, filter: "drop-shadow(0 0 8px rgba(93,123,61,.4))" }} />
        {[{ label: "Home", page: "home" }, ...items].map(i => (
          <button key={i.page} onClick={() => go(i.page)} style={{
            background: "none", border: "none", borderBottom: `1px solid rgba(255,255,255,.06)`,
            fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600,
            color: page === i.page ? C.pink : C.cream, textAlign: "left",
            padding: "10px 0", cursor: "pointer", letterSpacing: "0.02em",
          }}>{i.label}</button>
        ))}
        <div style={{ marginTop: "auto", fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.muted }}>hello@luckystains.org</div>
      </div>

      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 480, background: "rgba(26,26,46,.5)", backdropFilter: "blur(2px)" }} />}

      <style>{`
        @media(max-width:768px){.ls-desktop-nav{display:none!important}.ls-hamburger{display:flex!important}}
        @media(min-width:769px){.ls-hamburger{display:none!important}}
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
function HomePage({ setPage }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [blooming, setBlooming] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 200); return () => clearTimeout(t); }, []);

  const go = (dest) => {
    const color = dest === "care" ? C.green : C.pink;
    setBlooming(color);
    setTimeout(() => { setPage(dest); window.scrollTo(0, 0); }, 900);
  };

  const branches = [
    { icon: "♥︎", name: "luckystains care", sub: "a pet & home service", color: C.green, status: "active" },
    { icon: "✦", name: "bridge", sub: "life architecture practice", color: C.pink, status: "coming soon" },
    { icon: "★", name: "luckystains collection", sub: "creative studio · all mediums", color: C.creamDim, status: "active" },
    { icon: "◈", name: "everhearth", sub: "community foundation", color: C.purple, status: "in becoming" },
  ];

  return (
    <>
      <section style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 30% 20%, #2a1a3e 0%, ${C.navy} 40%, ${C.navyMid} 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 24px 60px",
      }}>
        <Starfield />
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle,rgba(93,123,61,.09) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ marginBottom: 16, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1s ease", animation: "logofloat 4s ease-in-out infinite", filter: "drop-shadow(0 4px 24px rgba(93,123,61,.35))" }}>
          <img src="/clover.png" alt="luckystains" style={{ width: 160, height: 160, objectFit: "contain", display: "block" }} />
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(52px,10vw,100px)", fontWeight: 300, color: C.cream, letterSpacing: "0.08em", marginBottom: 8, textShadow: "0 0 40px rgba(255,239,186,.27)", opacity: loaded ? 1 : 0, transition: "all 1.2s ease 0.3s" }}>luckystains</div>

        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "clamp(12px,2vw,15px)", color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 60, opacity: loaded ? 1 : 0, transition: "all 1.2s ease 0.5s" }}>the marks left by what we love</div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "all 1.2s ease 0.8s", width: "100%", maxWidth: 600 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(15px,2.5vw,20px)", color: `${C.cream}66`, letterSpacing: "0.1em", fontStyle: "italic", textAlign: "center", marginBottom: 16 }}>you're here because —</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { id: "care",       label: "Care services for your home and family.", color: C.green, rgb: "93,123,61"    },
              { id: "collection", label: "Curious about the stories?",              color: C.pink,  rgb: "216,109,156" },
            ].map(opt => (
              <button key={opt.id}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => go(opt.id === "collection" ? "collection" : "care")}
                style={{
                  flex: 1, minWidth: 200,
                  background: hovered === opt.id ? `rgba(${opt.rgb},.18)` : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${hovered === opt.id ? opt.color : "rgba(255,255,255,.10)"}`,
                  borderRadius: 20, padding: "24px 28px", cursor: "none", transition: "all 0.35s",
                  boxShadow: hovered === opt.id ? `0 0 32px rgba(${opt.rgb},.25)` : "none",
                  transform: hovered === opt.id ? "translateY(-2px)" : "none",
                }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(18px,3vw,24px)", fontWeight: 600, color: hovered === opt.id ? opt.color : C.cream, lineHeight: 1.3, transition: "color 0.3s" }}>{opt.label}</div>
              </button>
            ))}
          </div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: `${C.muted}88`, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 16, textAlign: "center" }}>or scroll to see everything</div>
        </div>

        <WatercolorBloom color={blooming} active={!!blooming} onDone={() => setBlooming(null)} />
        <style>{`@keyframes logofloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      </section>

      <section style={{ background: C.cream, padding: "80px 24px", borderTop: `1px solid rgba(26,26,46,.08)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 600, color: C.navy, marginBottom: 4 }}>one container.</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 300, fontStyle: "italic", color: C.navy, marginBottom: 20 }}>infinite expression.</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, color: C.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Four expressions of one belief — that showing up fully in people's lives is work worth doing with care and intention.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {branches.map(b => (
              <div key={b.name} style={{ background: "white", borderRadius: 16, padding: "24px 20px", border: `1px solid rgba(26,26,46,.07)`, boxShadow: "0 2px 16px rgba(26,26,46,.05)", borderTop: `3px solid ${b.color}` }}>
                <div style={{ fontSize: 22, color: b.color, marginBottom: 10 }}>{b.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{b.name}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.4 }}>{b.sub}</div>
                <div style={{ display: "inline-block", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 800, fontFamily: "'Nunito',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", background: b.status === "active" ? `${C.green}15` : `${b.color}15`, color: b.status === "active" ? C.green : b.color }}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CARE PAGE
══════════════════════════════════════════════════════════════════ */
function CarePage({ setPage }) {
  const features = [
    { icon: "🐾", title: "All Animals Welcome", body: "Dogs, cats, birds, reptiles, exotic pets. Every animal gets the same careful attention — from Bengals to Tegus." },
    { icon: "🏠", title: "Your Home, Intact", body: "Full documentation on arrival and departure. Sweep logs, timestamped photos, carbon copy records. Nothing gets missed." },
    { icon: "📋", title: "Rigorous by Standard", body: "Consultation before every sit. Daily diary written before I leave. CYA for everyone — the animal, the owner, and me." },
    { icon: "💬", title: "Personal by Nature", body: "Text updates and photos during every visit. Warm, consistent, and attentive to the individuals in my care." },
  ];

  return (
    <>
      <section style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.cream} 12%)`, padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, marginBottom: 12, fontWeight: 800 }}>luckystains care  ♥︎</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,7vw,64px)", fontWeight: 600, color: C.navy, lineHeight: 1.1, marginBottom: 20 }}>Rigorous by standard.<br />Personal by nature.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "clamp(15px,2vw,18px)", color: C.muted, maxWidth: 560, lineHeight: 1.7, marginBottom: 48 }}>Professional pet sitting and house sitting in the Denver and Broomfield area — and wherever else the work leads. Your animals stay home. Your home stays whole.</div>
          <button onClick={() => setPage("contact")} style={{ background: C.green, color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", cursor: "none", boxShadow: `0 4px 20px rgba(93,123,61,.35)` }}>Request a Meet & Greet</button>
        </div>
      </section>

      <section style={{ background: C.cream, padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 56 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "white", borderRadius: 16, padding: 24, border: `1px solid rgba(26,26,46,.08)`, boxShadow: "0 2px 20px rgba(26,26,46,.06)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>

          <div style={{ background: `${C.green}08`, border: `1px solid ${C.green}25`, borderRadius: 16, padding: 32, marginBottom: 40 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Animal Experience</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Dogs", "Cats", "Birds", "Rodents", "Fish", "Bengals", "Australian Skinks", "Leopard Geckos", "Tegus", "Horse care basics"].map(a => (
                <span key={a} style={{ background: "white", border: `1px solid rgba(93,123,61,.2)`, borderRadius: 20, padding: "4px 14px", fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.green, fontWeight: 700 }}>{a}</span>
              ))}
            </div>
          </div>

          <div style={{ background: `${C.green}0d`, border: `1px solid ${C.green}33`, borderRadius: 12, padding: "16px 20px", marginBottom: 40, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📸</span>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              <strong style={{ color: C.navy }}>A note on photos:</strong> I only share photos of your pets on social media with your explicit permission — a checkbox in the intake form and a clause in the service agreement. Your animals, your call. Always.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => setPage("contact")} style={{ background: C.green, color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "none", boxShadow: `0 4px 20px rgba(93,123,61,.35)` }}>Request a Meet & Greet</button>
            <a href="mailto:hello@luckystains.org?subject=Intake Form Request" style={{ background: "transparent", border: `1.5px solid ${C.green}`, color: C.green, borderRadius: 12, padding: "14px 28px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>Get the Intake Form</a>
          </div>
        </div>
      </section>

      <section style={{ background: C.navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 600, color: C.cream, marginBottom: 32 }}>What to expect</div>
          {[
            { step: "01", title: "Consultation", body: "We meet — you, me, and your animals. I assess the home, the pets, the routine, and whether we're a good fit. This is where I get everything on file." },
            { step: "02", title: "Service Agreement", body: "A simple one-page agreement. What I cover, what you expect, the photo permission clause. Signed before any keys change hands." },
            { step: "03", title: "First Sweep", body: "I document the home on arrival — every room, every pet, the condition of everything. Timestamped photos. This protects both of us." },
            { step: "04", title: "Daily Diary", body: "Written before I leave each visit. The full story of the sit. You get warm text updates; the diary is the complete record." },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 20, textAlign: "left", marginBottom: 24, padding: 24, background: "rgba(255,255,255,.04)", borderRadius: 16, border: `1px solid rgba(255,255,255,.06)` }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: C.pink, flexShrink: 0, lineHeight: 1 }}>{s.step}</div>
              <div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: C.cream, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COLLECTION PAGE
══════════════════════════════════════════════════════════════════ */
function CollectionPage() {
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(180deg, #1a0a2e 0%, ${C.navy} 100%)`, padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <Starfield count={60} />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.pink, marginBottom: 12, fontWeight: 800 }}>luckystains collection  ★</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 600, color: C.cream, lineHeight: 1.1, marginBottom: 20 }}>The Emberian Universe</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: "clamp(15px,2vw,18px)", color: `${C.muted}cc`, maxWidth: 520, lineHeight: 1.7, marginBottom: 56 }}>A six-book series years in the making. A world that confirms itself through outside sources. A character named Phyre who has been waiting to be written properly for a very long time.</div>
        <div style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${C.pink}33`, borderRadius: 20, padding: 40, textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 600, color: C.cream, fontStyle: "italic", marginBottom: 12 }}>Phyre to Ashes</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>Book One · The Celosia Chronicles</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, color: `${C.cream}88`, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>In active development. The canon is locked. The world is ready. Updates, cover reveals, and early access for readers who want to be there from the beginning.</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <a href="mailto:hello@luckystains.org?subject=Celosia Chronicles Updates" style={{ background: C.pink, color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 12, textDecoration: "none", letterSpacing: "0.05em", boxShadow: `0 4px 20px rgba(216,109,156,.35)` }}>Follow the Story</a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════════════════ */
function AboutPage({ setPage }) {
  return (
    <>
      <section style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.warm} 14%)`, padding: "120px 24px 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, marginBottom: 12, fontWeight: 800 }}>about</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,56px)", fontWeight: 600, color: C.navy, lineHeight: 1.1, marginBottom: 32 }}>Some people show up fully.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: "#444", lineHeight: 1.85, marginBottom: 20 }}>Aylin Everhart is the name and the thread running through everything at luckystains. The belief behind all of it is simple: showing up fully in people's lives is work worth doing with care and intention.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: "#444", lineHeight: 1.85, marginBottom: 20 }}>luckystains is four things at once — a pet and home sitting service, a life architecture practice, a creative studio, and a community foundation in becoming. Each one is its own thing. Together they form something bigger than any of them alone.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: "#444", lineHeight: 1.85, marginBottom: 40 }}>The ecosystem is circular. The care work puts me in the community every day. The bridge practice serves the individual. The collection handles the storytelling. Everhearth is the answer to why any of this exists.</div>
          <div style={{ background: `${C.green}0d`, border: `1px solid ${C.green}33`, borderRadius: 12, padding: "16px 20px", fontFamily: "'Nunito',sans-serif", fontSize: 14, color: C.muted, fontStyle: "italic", lineHeight: 1.6 }}>Open to barter and trade — plants, labor, body mods, good things.</div>
        </div>
      </section>

      <section style={{ background: C.warm, padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ height: 1, background: "rgba(26,26,46,.1)", marginBottom: 56 }} />
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 600, color: C.navy, marginBottom: 16 }}>luckystains care</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: "#444", lineHeight: 1.85, marginBottom: 20 }}>Pet sitting sounds simple. You show up, you feed the animals, you leave. But done properly it's high-stakes, high-accountability, detail-intensive work. You have keys to someone's home. You're responsible for animals that are deeply loved.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: "#444", lineHeight: 1.85, marginBottom: 32 }}>Every sit begins with a formal consultation. Every visit ends with a diary written before I leave. The care is real. The documentation makes it provable.</div>
          <div style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: `1px solid rgba(93,123,61,.2)`, fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", color: C.navy, marginBottom: 32 }}>"Rigorous by standard. Personal by nature."</div>
          <button onClick={() => setPage("care")} style={{ background: C.green, color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "none", boxShadow: `0 4px 20px rgba(93,123,61,.35)` }}>Learn about care services</button>
        </div>
      </section>

      <section style={{ background: C.navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 600, color: C.cream, marginBottom: 16 }}>luckystains collection</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: `${C.muted}cc`, lineHeight: 1.85, marginBottom: 20 }}>The creative studio. Fiction, fiber arts, visual work, document design. The Emberian Universe is where years of writing have lived — a world finally coming together into a cohesive series.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: `${C.muted}cc`, lineHeight: 1.85 }}>The Celosia Chronicles is a six-book series centered on a character named Phyre. Book one — Phyre to Ashes — is in active development. The canon is locked. The story confirms itself.</div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════════════ */
function ContactPage() {
  return (
    <>
      <section style={{ background: `linear-gradient(180deg, ${C.navy} 0%, #1a0a2e 100%)`, padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <Starfield count={40} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.pink, marginBottom: 12, fontWeight: 800 }}>get in touch</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,56px)", fontWeight: 600, color: C.cream, marginBottom: 16, lineHeight: 1.1 }}>Let's talk.</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: C.muted, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 56px" }}>Whether you need someone to care for your home and animals, or you're just curious about what's being built here — reach out.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {[
              { icon: "✉", label: "Email", value: "hello@luckystains.org", href: "mailto:hello@luckystains.org" },
              { icon: "☏", label: "Phone", value: "(720) 441-4257", href: "tel:+17204414257" },
            ].map(c => (
              <a key={c.label} href={c.href} style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "rgba(255,255,255,.05)", border: `1.5px solid rgba(255,255,255,.12)`,
                borderRadius: 14, padding: "18px 32px", textDecoration: "none",
                width: "100%", maxWidth: 380, boxSizing: "border-box", transition: "all 0.3s",
              }}>
                <span style={{ fontSize: 20, color: C.pink }}>{c.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{c.label}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: C.pink, fontWeight: 700 }}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.cream, padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 600, color: C.navy, marginBottom: 32, textAlign: "center" }}>What happens next</div>
          {[
            { icon: "📋", title: "Send the intake form", body: "I'll send you a link to complete before we meet. Takes about 5 minutes — your animals, your home, what you need." },
            { icon: "🤝", title: "We meet", body: "A formal meet and greet — you, me, and your pets. I assess everything and you get a feel for how I work." },
            { icon: "📝", title: "Agreement signed", body: "A simple service agreement. Clear expectations, photo permission clause, everything in writing before any keys change hands." },
            { icon: "✓",  title: "You travel with peace of mind", body: "I'm there. Your animals are cared for. The diary is written before I leave. You'll hear from me." },
          ].map(s => (
            <div key={s.title} style={{ display: "flex", gap: 16, marginBottom: 24, padding: "20px 24px", background: "white", borderRadius: 14, border: `1px solid rgba(26,26,46,.07)`, boxShadow: "0 2px 16px rgba(26,26,46,.05)" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: C.navy, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ── FOOTER ────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };
  return (
    <footer style={{ background: C.navy, padding: "48px 24px", textAlign: "center", borderTop: `1px solid rgba(255,255,255,.06)` }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "none" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.cream, marginBottom: 8 }}>luckystains</div>
      </button>
      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Wisteria Pathways Heading LLC</div>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {["care", "about", "contact"].map(p => (
          <button key={p} onClick={() => go(p)} style={{ background: "none", border: "none", fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, cursor: "none" }}>{p}</button>
        ))}
      </div>
      <a href="mailto:hello@luckystains.org" style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: C.pink, textDecoration: "none", fontWeight: 700, display: "block", marginBottom: 8 }}>hello@luckystains.org</a>
      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: `${C.muted}88`, fontStyle: "italic", marginBottom: 24 }}>Open to barter and trade — plants, labor, body mods, good things.</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: `${C.muted}66`, fontStyle: "italic" }}>the marks left by what we love.</div>
    </footer>
  );
}

/* ── ROOT ──────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    onResize();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const pages = {
    home:       <HomePage setPage={setPage} />,
    care:       <CarePage setPage={setPage} />,
    collection: <CollectionPage />,
    about:      <AboutPage setPage={setPage} />,
    contact:    <ContactPage />,
  };

  return (
    <div style={{ background: C.navy, minHeight: "100vh", fontFamily: "'Nunito',sans-serif", color: C.cream }}>
      <FontLoader />
      {!isMobile && <FireflyCursor />}
      {isMobile && <CloverPulse />}
      <Nav page={page} setPage={setPage} scrolled={scrolled} />
      <main>{pages[page] || pages.home}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
