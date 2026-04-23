import { useState, useEffect, useRef } from "react";

/* ── TOKENS ────────────────────────────────────────────────────── */
const C = {
  navy:    "#1a1a2e",
  navyMid: "#12122a",
  cream:   "#fff8e7",
  creamDim:"#ffefba",
  pink:    "#d86d9c",
  pinkDim: "#a84d76",
  green:   "#5D7B3D",
  greenDim:"#4a6230",
  muted:   "#9a8f7a",
  gold:    "#f5c842",
};

/* ── FIREFLY CURSOR ────────────────────────────────────────────── */
function FireflyCursor() {
  const [trail, setTrail] = useState([]);
  const [pos, setPos]     = useState({ x: -100, y: -100 });
  const idRef = useRef(0);

  useEffect(() => {
    const move = (e) => {
      const x = e.clientX, y = e.clientY;
      setPos({ x, y });
      const id = ++idRef.current;
      const colors = [C.creamDim, C.pink, C.green, "#ffffff", C.gold];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 5 + 3;
      setTrail(prev => [...prev.slice(-18), { id, x, y, color, size, born: Date.now() }]);
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
      {/* Firefly cursor body */}
      <div style={{
        position: "fixed",
        left: pos.x - 8, top: pos.y - 8,
        width: 16, height: 16,
        pointerEvents: "none",
        transition: "left 0.05s, top 0.05s",
      }}>
        {/* Body */}
        <div style={{
          width: 10, height: 14,
          background: `radial-gradient(ellipse at 50% 40%, ${C.navy} 60%, #2a2a4e 100%)`,
          borderRadius: "50% 50% 45% 45%",
          position: "absolute", left: 3, top: 0,
          boxShadow: `0 0 4px ${C.creamDim}40`,
        }} />
        {/* Abdomen / clover glow */}
        <div style={{
          width: 10, height: 8,
          background: `radial-gradient(ellipse, ${C.creamDim} 0%, ${C.gold}cc 50%, transparent 100%)`,
          borderRadius: "50%",
          position: "absolute", left: 3, top: 9,
          boxShadow: `0 0 8px ${C.creamDim}, 0 0 16px ${C.gold}88`,
          animation: "firefly-pulse 1.2s ease-in-out infinite",
        }} />
        {/* Wings */}
        <div style={{
          width: 7, height: 4,
          background: "rgba(255,255,255,0.12)",
          borderRadius: "50%",
          position: "absolute", left: -2, top: 3,
          transform: "rotate(-20deg)",
        }} />
        <div style={{
          width: 7, height: 4,
          background: "rgba(255,255,255,0.12)",
          borderRadius: "50%",
          position: "absolute", right: -2, top: 3,
          transform: "rotate(20deg)",
        }} />
      </div>

      {/* Sparkle trail */}
      {trail.map(p => {
        const age = (Date.now() - p.born) / 600;
        const opacity = Math.max(0, 1 - age);
        return (
          <div key={p.id} style={{
            position: "fixed",
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            pointerEvents: "none",
            transform: `scale(${1 - age * 0.5})`,
          }} />
        );
      })}

      <style>{`
        @keyframes firefly-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        * { cursor: none !important; }
      `}</style>
    </div>
  );
}

/* ── MOBILE CLOVER PULSE ───────────────────────────────────────── */
function CloverPulse() {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 100,
      width: 40, height: 40,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontSize: 28,
        animation: "clover-pulse 2.5s ease-in-out infinite",
        filter: `drop-shadow(0 0 8px ${C.green}) drop-shadow(0 0 16px ${C.creamDim})`,
      }}>🍀</div>
      <style>{`
        @keyframes clover-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

/* ── STARFIELD ─────────────────────────────────────────────────── */
function Starfield({ count = 80 }) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 2,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: "white",
          opacity: 0.4,
          animation: `star-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

/* ── ANIMATED CLOVER LOGO — IMAGE BASED ───────────────────────── */
// Uses the real luckystains clover image as base
// SVG overlays animate on top with mix-blend-mode for colored leaf blooms

const LEAF_SEQUENCE = [
  { id: "tl", color: C.pink,      delay: 600  },  // top-left    → Sol Bridge
  { id: "tr", color: "#f0a050",   delay: 1100 },  // top-right   → collection
  { id: "bl", color: "#8B6BAE",   delay: 1600 },  // bottom-left → everhearth
  { id: "br", color: C.navy,      delay: 2100 },  // bottom-right → care
];

// Overlay leaf shapes matching the real image proportions
// viewBox 0 0 200 200, image fills it
const LEAF_OVERLAYS = {
  tl: "M 100 92 C 100 92 85 72 60 58 C 33 42 18 57 23 76 C 28 95 62 98 100 92 Z",
  tr: "M 100 92 C 100 92 118 72 143 60 C 170 44 184 60 178 79 C 172 98 136 97 100 92 Z",
  bl: "M 100 108 C 100 108 83 126 58 140 C 31 156 18 140 24 121 C 30 102 65 103 100 108 Z",
  br: "M 100 108 C 100 108 118 128 143 142 C 170 158 183 141 177 122 C 171 103 135 103 100 108 Z",
};

function AnimatedClover({ phase, hoveredPath, size = 200 }) {
  const getOverlayOpacity = (leafId) => {
    if (phase === "loading") return 0;
    return 0.55;
  };

  const getHoverGlow = (leafId) => {
    if (hoveredPath === "care"  && leafId === "br") return 0.35;
    if (hoveredPath === "story" && leafId === "tl") return 0.35;
    return 0;
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Real clover image — the foundation */}
      <img
        src="/ls_main_logo_transparent.png"
        alt="luckystains"
        style={{
          width: size, height: size,
          objectFit: "contain",
          display: "block",
          filter: "drop-shadow(0 4px 24px rgba(93,123,61,0.35))",
        }}
      />

      {/* SVG color overlays — animate on top of real image */}
      <svg
        width={size} height={size}
        viewBox="0 0 200 200"
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      >
        {LEAF_SEQUENCE.map((leaf) => (
          <path
            key={leaf.id}
            d={LEAF_OVERLAYS[leaf.id]}
            fill={leaf.color}
            style={{
              opacity: getOverlayOpacity(leaf.id) + getHoverGlow(leaf.id),
              transition: `opacity 0.9s ease ${leaf.delay}ms`,
            }}
          />
        ))}
      </svg>

      {/* Watercolor bloom on transition */}
      {(phase === "blooming-care" || phase === "blooming-story") && (
        <div style={{
          position: "absolute", inset: "50%",
          width: 20, height: 20,
          marginLeft: -10, marginTop: -10,
          borderRadius: "50%",
          background: phase === "blooming-care" ? C.navy : C.pink,
          animation: "leaf-bloom 0.7s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      <style>{`
        @keyframes leaf-bloom {
          0%   { transform: scale(0); opacity: 0.8; }
          60%  { transform: scale(12); opacity: 0.5; }
          100% { transform: scale(20); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── WATERCOLOR TRANSITION OVERLAY ────────────────────────────── */
function WatercolorBloom({ color, active, onDone }) {
  useEffect(() => {
    if (active) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      pointerEvents: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: "100vmax", height: "100vmax",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}ee 0%, ${color}88 40%, ${color}22 70%, transparent 100%)`,
        animation: "watercolor-bloom 0.9s cubic-bezier(0.2, 0.8, 0.4, 1) forwards",
        filter: "blur(8px)",
      }} />
      <style>{`
        @keyframes watercolor-bloom {
          0%   { transform: scale(0); opacity: 0.9; }
          50%  { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── SECTION COMPONENTS ────────────────────────────────────────── */

function HeroSection({ onChoose }) {
  const [hovered, setHovered]   = useState(null);
  const [loaded, setLoaded]     = useState(false);
  const [logoPhase, setLogoPhase] = useState("loading");
  const [blooming, setBlooming] = useState(null);

  useEffect(() => {
    // Page loads → text fades in
    const t1 = setTimeout(() => setLoaded(true), 200);
    // Logo starts sequential leaf bloom
    const t2 = setTimeout(() => setLogoPhase("loaded"), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleChoose = (id) => {
    const bloomColor = id === "care" ? C.navy : C.pink;
    setBlooming(bloomColor);
    setLogoPhase(id === "care" ? "blooming-care" : "blooming-story");
  };

  return (
    <section style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 30% 20%, #2a1a3e 0%, ${C.navy} 40%, ${C.navyMid} 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      padding: "60px 24px",
    }}>
      <Starfield />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 400, height: 400,
        background: `radial-gradient(circle, ${C.green}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Animated clover logo */}
      <div style={{
        marginBottom: 16,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s ease",
        animation: logoPhase === "loaded" ? "logo-float 4s ease-in-out infinite" : "none",
      }}>
        <AnimatedClover
          phase={logoPhase}
          hoveredPath={hovered}
          size={180}
        />
      </div>

      {/* Wordmark */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(48px, 10vw, 96px)",
        fontWeight: 300,
        color: C.cream,
        letterSpacing: "0.08em",
        marginBottom: 8,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 1.2s ease 0.3s",
        textShadow: `0 0 40px ${C.creamDim}44`,
      }}>luckystains</div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: "clamp(13px, 2vw, 16px)",
        color: C.muted,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: 56,
        opacity: loaded ? 1 : 0,
        transition: "all 1.2s ease 0.5s",
      }}>the marks left by what we love</div>

      {/* The split */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transition: "all 1.2s ease 0.8s",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 16,
        width: "100%", maxWidth: 600,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(15px, 2.5vw, 20px)",
          color: `${C.cream}66`,
          letterSpacing: "0.1em",
          marginBottom: 8, fontStyle: "italic",
        }}>you're here because —</div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {[
            { id: "care",  label: "looking for someone to care",  color: C.green, rgb: "93,123,61"   },
            { id: "story", label: "looking for something to feel", color: C.pink,  rgb: "216,109,156" },
          ].map(opt => (
            <button key={opt.id}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleChoose(opt.id)}
              style={{
                flex: 1, minWidth: 200,
                background: hovered === opt.id
                  ? `rgba(${opt.rgb},0.15)`
                  : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${hovered === opt.id ? opt.color : "rgba(255,255,255,0.12)"}`,
                borderRadius: 16, padding: "20px 24px",
                cursor: "none", transition: "all 0.3s ease",
                boxShadow: hovered === opt.id ? `0 0 24px ${opt.color}33` : "none",
              }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(16px, 2.5vw, 20px)",
                color: hovered === opt.id ? opt.color : C.cream,
                fontStyle: "italic", lineHeight: 1.3,
                transition: "color 0.3s",
              }}>{opt.label}</div>
            </button>
          ))}
        </div>

        <div style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11, color: `${C.muted}88`,
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginTop: 8,
        }}>or scroll to see everything</div>
      </div>

      <WatercolorBloom
        color={blooming}
        active={!!blooming}
        onDone={() => {
          setBlooming(null);
          const id = logoPhase === "blooming-care" ? "care" : "story";
          onChoose(id);
          setLogoPhase("loaded");
        }}
      />

      <style>{`
        @keyframes logo-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}

/* ── CARE SECTION ──────────────────────────────────────────────── */
function CareSection({ id }) {
  return (
    <section id={id} style={{
      background: `linear-gradient(180deg, ${C.navy} 0%, #fff8e7 8%)`,
      padding: "80px 24px",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: C.green,
            marginBottom: 12, fontWeight: 800,
          }}>luckystains care  ♥︎</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 600, color: C.navy, lineHeight: 1.1,
            marginBottom: 20,
          }}>Someone who shows up.</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: C.muted, maxWidth: 560, margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Professional pet sitting and house sitting in the Denver and Broomfield area — and wherever else the work leads. Your animals stay home. Your home stays whole. You travel without that quiet worry in the back of your mind.
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 56 }}>
          {[
            { icon: "🐾", title: "All Animals Welcome", body: "Dogs, cats, birds, reptiles, exotics. Every animal gets the same careful attention." },
            { icon: "🏠", title: "Your Home, Intact", body: "Full documentation on arrival and departure. Carbon copy records. Nothing gets missed." },
            { icon: "📋", title: "Rigorous Standards", body: "Consultation before every sit. Timestamped photos. Daily diary before we leave. CYA for everyone." },
            { icon: "💬", title: "You Stay in the Loop", body: "Text updates and photos during every visit. You opted in. We follow through." },
          ].map(f => (
            <div key={f.title} style={{
              background: "white",
              borderRadius: 16,
              padding: "24px",
              border: `1px solid rgba(26,26,46,0.08)`,
              boxShadow: "0 2px 20px rgba(26,26,46,0.06)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: 15,
                color: C.navy, marginBottom: 8,
              }}>{f.title}</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14, color: C.muted, lineHeight: 1.6,
              }}>{f.body}</div>
            </div>
          ))}
        </div>

        {/* Animal photo permission note */}
        <div style={{
          background: `${C.green}0d`,
          border: `1px solid ${C.green}33`,
          borderRadius: 12, padding: "16px 20px",
          marginBottom: 40,
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{ fontSize: 18, flexShrink: 0 }}>📸</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13, color: C.muted, lineHeight: 1.6,
          }}>
            <strong style={{ color: C.navy }}>A note on photos:</strong> We only share photos of your pets on social media with your explicit permission — a simple checkbox in the intake form and a clause in the service agreement. Your animals, your call. Always.
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="mailto:hello@luckystains.org"
            style={{
              background: C.green, color: "white",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: 14,
              padding: "14px 28px", borderRadius: 12,
              textDecoration: "none",
              letterSpacing: "0.05em",
              boxShadow: `0 4px 20px ${C.green}44`,
              transition: "all 0.2s",
            }}>Request a Meet & Greet</a>
          <a href="mailto:hello@luckystains.org?subject=Intake Form Request"
            style={{
              background: "transparent",
              border: `1.5px solid ${C.green}`,
              color: C.green,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: 14,
              padding: "14px 28px", borderRadius: 12,
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}>Get the Intake Form</a>
        </div>
      </div>
    </section>
  );
}

/* ── STORY SECTION ─────────────────────────────────────────────── */
function StorySection({ id }) {
  return (
    <section id={id} style={{
      background: `linear-gradient(180deg, #fff8e7 0%, #1a0a2e 12%)`,
      padding: "80px 24px",
      position: "relative", overflow: "hidden",
    }}>
      <Starfield count={40} />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: C.pink,
            marginBottom: 12, fontWeight: 800,
          }}>luckystains collection  ★</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 600, color: C.cream, lineHeight: 1.1,
            marginBottom: 20,
          }}>The Emberian Universe</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: `${C.muted}cc`, maxWidth: 520, margin: "0 auto",
            lineHeight: 1.7,
          }}>
            A six-book series years in the making. A world that confirms itself through outside sources. A character named Phyre who has been waiting to be written properly for a very long time.
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${C.pink}33`,
          borderRadius: 20, padding: "40px",
          textAlign: "center", marginBottom: 40,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 600, color: C.cream,
            fontStyle: "italic", marginBottom: 12,
          }}>Phyre to Ashes</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13, color: C.muted,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 24,
          }}>Book One · The Celosia Chronicles</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15, color: `${C.cream}88`,
            lineHeight: 1.8, maxWidth: 480, margin: "0 auto",
          }}>
            In active development. The canon is locked. The world is ready. Updates, cover reveals, and early access for readers who want to be there from the beginning.
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="mailto:hello@luckystains.org?subject=Celosia Chronicles Updates"
            style={{
              background: C.pink, color: "white",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: 14,
              padding: "14px 28px", borderRadius: 12,
              textDecoration: "none",
              letterSpacing: "0.05em",
              boxShadow: `0 4px 20px ${C.pink}44`,
            }}>Follow the Story</a>
        </div>
      </div>
    </section>
  );
}

/* ── ECOSYSTEM SECTION ─────────────────────────────────────────── */
function EcosystemSection() {
  const branches = [
    { icon: "♥︎", name: "luckystains care", sub: "a pet & home service", color: C.green, status: "active" },
    { icon: "✦", name: "The Bridge", sub: "life architecture practice", color: C.pink, status: "coming soon" },
    { icon: "★", name: "luckystains collection", sub: "creative studio · all mediums", color: C.creamDim, status: "active" },
    { icon: "◈", name: "everhearth", sub: "community foundation", color: "#7B5EA7", status: "in becoming" },
  ];

  return (
    <section style={{
      background: C.cream,
      padding: "80px 24px",
      borderTop: `1px solid rgba(26,26,46,0.08)`,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 600, color: C.navy, marginBottom: 12,
          }}>one container.</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 300, color: C.navy, marginBottom: 20,
            fontStyle: "italic",
          }}>infinite expression.</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15, color: C.muted,
            maxWidth: 480, margin: "0 auto", lineHeight: 1.7,
          }}>
            Four businesses. One name. One animating belief — that showing up fully in people's lives is work worth doing with care and intention.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {branches.map(b => (
            <div key={b.name} style={{
              background: "white",
              borderRadius: 16,
              padding: "24px 20px",
              border: `1px solid rgba(26,26,46,0.07)`,
              boxShadow: "0 2px 16px rgba(26,26,46,0.05)",
              borderTop: `3px solid ${b.color}`,
            }}>
              <div style={{ fontSize: 22, color: b.color, marginBottom: 10 }}>{b.icon}</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, fontWeight: 600,
                color: C.navy, marginBottom: 4,
              }}>{b.name}</div>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11, color: C.muted,
                marginBottom: 12, lineHeight: 1.4,
              }}>{b.sub}</div>
              <div style={{
                display: "inline-block",
                background: b.status === "active" ? `${C.green}15` : `${C.pink}15`,
                color: b.status === "active" ? C.green : C.pink,
                borderRadius: 6, padding: "2px 8px",
                fontSize: 10, fontWeight: 800,
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>{b.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      background: C.navy,
      padding: "48px 24px",
      textAlign: "center",
      borderTop: `1px solid rgba(255,255,255,0.06)`,
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 28, color: C.cream,
        marginBottom: 8,
      }}>luckystains</div>
      <div style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 11, color: C.muted,
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginBottom: 24,
      }}>Wisteria Pathways Heading LLC</div>
      <a href="mailto:hello@luckystains.org" style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14, color: C.pink,
        textDecoration: "none", fontWeight: 700,
        letterSpacing: "0.05em",
      }}>hello@luckystains.org</a>
      <div style={{
        marginTop: 32,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 14, color: `${C.muted}66`,
        fontStyle: "italic",
      }}>the marks left by what we love.</div>
    </footer>
  );
}

/* ── NAV ───────────────────────────────────────────────────────── */
function Nav({ scrolled, onNav }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      background: scrolled ? `${C.navy}f0` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(255,255,255,0.06)` : "none",
      transition: "all 0.3s ease",
      padding: "14px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, color: C.cream, letterSpacing: "0.06em",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>🍀</span> luckystains
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {[
          { label: "Care", id: "care" },
          { label: "Collection", id: "story" },
          { label: "Contact", href: "mailto:hello@luckystains.org" },
        ].map(item => (
          item.href
            ? <a key={item.label} href={item.href} style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.muted, textDecoration: "none",
              }}>{item.label}</a>
            : <button key={item.label} onClick={() => onNav(item.id)} style={{
                background: "none", border: "none",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.muted, cursor: "none",
              }}>{item.label}</button>
        ))}
      </div>
    </nav>
  );
}

/* ── ROOT ──────────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const careRef  = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Nunito:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);

    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      try { document.head.removeChild(link); } catch(e) {}
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleChoose = (id) => scrollTo(id);

  return (
    <div style={{ background: C.navy, minHeight: "100vh" }}>
      {!isMobile && <FireflyCursor />}
      {isMobile && <CloverPulse />}
      <Nav scrolled={scrolled} onNav={scrollTo} />
      <HeroSection onChoose={handleChoose} />
      <CareSection id="care" />
      <StorySection id="story" />
      <EcosystemSection />
      <Footer />
    </div>
  );
}
