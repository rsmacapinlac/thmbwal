// prototype.jsx — Working interactive prototype of the thmbwal contact sheet.
// Drive it with the keyboard: h/j/k/l navigate, / filter, ↵ picker, d quick
// download, , settings, ? help, t theme, q quit.
//
// Reuses Term/Row/Span/Box/AsciiArt/KittyPreview/THEMES from tui.jsx.

const { Term, Row, Span, Box, AsciiArt, KittyPreview, THEMES, CELL_W, CELL_H, FONT } = window;
const { useState, useEffect, useRef, useCallback } = React;

// ---- Data -------------------------------------------------------------------
const DATA = [
  { m: "Dec 2024", title: "Window of Christmas",      author: "Chiara Faes",     art: "window", tone: "warm",   resCount: 18, dl: true  },
  { m: "Nov 2024", title: "Autumn Library",           author: "PopArt Studio",   art: "leaves", tone: "warm",   resCount: 22, dl: false },
  { m: "Oct 2024", title: "Night Walk",               author: "Ricardo Gimenes", art: "city",   tone: "cool",   resCount: 24, dl: false },
  { m: "Sep 2024", title: "Listening to Leaves Fall", author: "Cerb. Studios",   art: "leaves", tone: "forest", resCount: 20, dl: true  },
  { m: "Aug 2024", title: "Cosmic Dance",             author: "LibraFire Team",  art: "cosmic", tone: "plum",   resCount: 22, dl: false },
  { m: "Jul 2024", title: "Sunset Tides",             author: "Color Mean",      art: "waves",  tone: "warm",   resCount: 24, dl: false },
  { m: "Jun 2024", title: "Solstice Bloom",           author: "Vlad Gerasimov",  art: "leaves", tone: "forest", resCount: 20, dl: false },
  { m: "May 2024", title: "Pebble Garden",            author: "Skyform Lab",     art: "waves",  tone: "cool",   resCount: 18, dl: true  },
  { m: "Apr 2024", title: "Spring Awakening",         author: "Studio Mecho",    art: "leaves", tone: "forest", resCount: 22, dl: false },
  { m: "Mar 2024", title: "Coffee & Code",            author: "Lívia Lénárt",    art: "waves",  tone: "warm",   resCount: 18, dl: false },
  { m: "Feb 2024", title: "Polar Light",              author: "Iulia Manea",     art: "waves",  tone: "cool",   resCount: 24, dl: false },
  { m: "Jan 2024", title: "Hello, 2024",              author: "Ricardo Gimenes", art: "cosmic", tone: "plum",   resCount: 22, dl: false },
];

const DETECTED = "2560×1440";
const RES_GROUPS = [
  { name: "16:9 widescreen", items: [["1280×720","HD"],["1920×1080","FHD"],["2560×1440","QHD"],["3840×2160","4K UHD"]] },
  { name: "ultrawide",       items: [["2560×1080","UW"],["3440×1440","UWQHD"],["5120×1440","DQHD"]] },
  { name: "16:10",           items: [["1280×800","WXGA"],["1440×900",""],["1680×1050","WSXGA+"],["1920×1200","WUXGA"]] },
  { name: "mobile · tablet", items: [["320×480","iPhone 4"],["1024×768","iPad"],["2778×1284","iPhone 13"]] },
];
// Flatten for picker navigation; remember default index = detected
const RES_FLAT = [];
RES_GROUPS.forEach(g => g.items.forEach(([res, label]) => RES_FLAT.push({ res, label, group: g.name })));
const DEFAULT_RES_IDX = RES_FLAT.findIndex(r => r.res === DETECTED);

const COLS = 4;
const CARD_W = 28;
const CARD_H = 12;        // 2 rows: 3 + 2*(12+1) = 29, ending before the detail strip
const GUTTER = 1;
const PAD_X = 2;
const GRID_Y = 3;
const VIS_ROWS = 2;       // visible card rows at 120×34

// slug for filenames
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---- Scaling stage ----------------------------------------------------------
function ScaledStage({ children, termW = 120, termH = 34 }) {
  const W = termW * CELL_W + 2;
  const H = 22 + termH * CELL_H + 2;
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const sw = (window.innerWidth - 48) / W;
      const sh = (window.innerHeight - 48) / H;
      setScale(Math.min(sw, sh, 1.4));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [W, H]);
  return (
    <div style={{
      position: "fixed", inset: 0, display: "grid", placeItems: "center",
      background: "#0A0A0E",
      backgroundImage: "radial-gradient(circle at 50% 0%, #16161f, #0A0A0E 70%)",
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        {children}
      </div>
    </div>
  );
}

// ---- Card -------------------------------------------------------------------
function Card({ x, y, item, active, dimmed, downloading, dl }) {
  const t = window.__theme;
  const borderColor = active ? t.primary : t.border;
  const opacity = dimmed ? 0.3 : 1;
  const previewH = CARD_H - 5;
  const previewW = CARD_W - 2;
  const truncTitle = item.title.length > CARD_W - 4 ? item.title.slice(0, CARD_W - 5) + "…" : item.title;
  const truncAuthor = ("by " + item.author).length > CARD_W - 4 ? ("by " + item.author).slice(0, CARD_W - 5) + "…" : "by " + item.author;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity, transition: "opacity .15s" }}>
      <Box x={x} y={y} w={CARD_W} h={CARD_H} color={borderColor} kind="round" />
      <AsciiArt x={x + 1} y={y + 1} pattern={item.art} color={active ? t.text : t.subtle} w={previewW} h={previewH} />
      <Row y={y + previewH + 1} x={x}>
        <Span fg={borderColor}>├{"─".repeat(CARD_W - 2)}┤</Span>
      </Row>
      <Row y={y + previewH + 2} x={x + 2}>
        <Span fg={dimmed ? t.dim : (active ? t.text : t.subtle)} bold>{truncTitle}</Span>
        {dl && <Span fg={t.accent}>  ●</Span>}
      </Row>
      <Row y={y + previewH + 3} x={x + 2}>
        <Span fg={active ? t.subtle : t.dim} italic>{truncAuthor}</Span>
      </Row>
      <Row y={y + previewH + 4} x={x + 2}>
        <Span fg={t.dim}>{item.m}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={active ? t.secondary : t.dim} bold={active}>{item.resCount} res</Span>
      </Row>
      {active && (
        <Row y={y} x={x + 2}>
          <Span fg={t.bg} bg={t.primary} bold>{` ${item.m} `}</Span>
        </Row>
      )}
      {downloading != null && (
        <Row y={y + 1} x={x + 2}>
          <Span fg={t.bg} bg={t.accent} bold>{` ⤓ ${downloading}% `}</Span>
        </Row>
      )}
    </div>
  );
}

// ---- Header -----------------------------------------------------------------
function Header({ crumbs, count, toast }) {
  const t = window.__theme;
  if (toast) {
    return (
      <>
        <Row y={1} x={2}>
          <Span fg={t.primary} bold>▌</Span>
          <Span fg={t.text} bold> thmbwal</Span>
          <Span fg={t.dim}> › </Span>
          <Span fg={t.subtle}>Contact sheet</Span>
          <Span fg={t.dim}>{"     "}</Span>
          <Span fg={t.bg} bg={t.accent} bold>{` ⤓ downloading `}</Span>
          <Span fg={t.subtle}>  {toast.title} · {toast.res} · </Span>
          <Span fg={t.accent} bold>{toast.pct}%</Span>
          <Span fg={t.dim}>  {bar(toast.pct, 18)}</Span>
        </Row>
        <Row y={2} x={0}><Span fg={t.border}>{"─".repeat(120)}</Span></Row>
      </>
    );
  }
  return (
    <>
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> thmbwal </Span>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <Span fg={t.dim}> › </Span>
            <Span fg={i === crumbs.length - 1 ? t.secondary : t.subtle}>{c}</Span>
          </React.Fragment>
        ))}
        <Span fg={t.dim}>{" ".repeat(Math.max(1, 118 - 14 - crumbs.join(" › ").length - count.length))}</Span>
        <Span fg={t.dim}>{count}</Span>
      </Row>
      <Row y={2} x={0}><Span fg={t.border}>{"─".repeat(120)}</Span></Row>
    </>
  );
}

const bar = (pct, w) => {
  const f = Math.round((pct / 100) * w);
  return "▰".repeat(f) + "▱".repeat(w - f);
};

// ---- Detail strip -----------------------------------------------------------
function DetailStrip({ y, item, dl }) {
  const t = window.__theme;
  return (
    <>
      <Row y={y} x={0}><Span fg={t.border}>{"─".repeat(120)}</Span></Row>
      <Row y={y + 1} x={2}>
        <Span fg={t.dim}>FOCUSED   </Span>
        <Span fg={t.text} bold>{item.title}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.subtle} italic>by {item.author}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.subtle}>{item.m}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.secondary}>{item.resCount} resolutions</Span>
        {dl && <><Span fg={t.dim}>  ·  </Span><Span fg={t.accent}>● downloaded</Span></>}
      </Row>
      <Row y={y + 2} x={2}>
        <Span fg={t.bg} bg={t.primary} bold>{`  ↵  pick resolution  `}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{`  d  quick: ${DETECTED}  `}</Span>
        <Span fg={t.dim}>     match for your display: </Span>
        <Span fg={t.accent} bold>● {DETECTED}</Span>
      </Row>
    </>
  );
}

// ---- Footer -----------------------------------------------------------------
function Footer({ y, mode }) {
  const t = window.__theme;
  const accent = mode === "filter" ? t.warn : t.primary;
  const label = mode === "filter" ? "FILTER" : "GRID";
  const keys = mode === "filter"
    ? [["type", "search"], ["↵", "apply"], ["esc", "clear"]]
    : [["h j k l", "move"], ["↵", "pick"], ["d", "download"], ["/", "filter"], ["t", "theme"], [",", "settings"], ["?", "help"], ["q", "quit"]];
  return (
    <Row y={y} x={0}>
      <Span fg={t.bg} bg={accent} bold>{` ${label} `}</Span>
      {keys.map(([k, l], i) => <Span key={i} fg={t.subtle} bg={t.surface2}>{`  ${k} ${l}  `}</Span>)}
    </Row>
  );
}

// ---- Picker overlay ---------------------------------------------------------
function Picker({ item, sel }) {
  const t = window.__theme;
  // Render flat list grouped, single column, with a moving highlight.
  let row = 0;
  const lines = [];
  RES_GROUPS.forEach((g) => {
    lines.push({ type: "head", text: g.name });
    g.items.forEach(([res, label]) => {
      const idx = RES_FLAT.findIndex(r => r.res === res);
      lines.push({ type: "item", res, label, idx, detected: res === DETECTED });
    });
  });

  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.72))", pointerEvents: "none" }} />
      <Box x={36} y={3} w={48} h={28} color={t.primary} kind="round" fill={t.surface} />
      <Row y={3} x={39}>
        <Span fg={t.border}>─</Span>
        <Span fg={t.primary} bold> Pick a resolution </Span>
        <Span fg={t.border}>─</Span>
      </Row>
      <Row y={5} x={39}><Span fg={t.text} bold>{item.title}</Span></Row>
      <Row y={6} x={39}><Span fg={t.dim}>{item.m} · by {item.author}</Span></Row>

      {lines.map((ln, i) => {
        const yy = 8 + i;
        if (ln.type === "head") {
          return <Row key={i} y={yy} x={39}><Span fg={t.secondary} bold>{ln.text}</Span></Row>;
        }
        const isSel = ln.idx === sel;
        return (
          <Row key={i} y={yy} x={39}>
            <Span fg={isSel ? t.primary : t.dim}>{isSel ? "▌ " : "  "}</Span>
            <Span fg={ln.detected ? t.accent : t.dim}>{ln.detected ? "● " : "  "}</Span>
            <Span fg={isSel ? t.text : t.subtle} bold={isSel} bg={isSel ? t.surface2 : undefined}>{ln.res.padEnd(11)}</Span>
            <Span fg={ln.detected ? t.accent : t.dim} bg={isSel ? t.surface2 : undefined}>{ln.label.padEnd(8)}</Span>
            {ln.detected && <Span fg={t.accent}> your display</Span>}
          </Row>
        );
      })}

      <Row y={29} x={39}>
        <Span fg={t.bg} bg={t.primary} bold>{` ↵ download `}</Span>
        <Span fg={t.dim}>  j/k move · esc cancel</Span>
      </Row>
    </>
  );
}

// ---- Help overlay -----------------------------------------------------------
function HelpOverlay() {
  const t = window.__theme;
  const groups = [
    ["navigate", [["h j k l", "move around the grid"], ["g / G", "first / last"], ["↵", "pick resolution"], ["d", "quick download (your display)"]]],
    ["search", [["/", "filter titles & authors"], ["esc", "clear filter"], ["type", "live-narrows the grid"]]],
    ["view", [["t", "cycle theme (charm ⇄ catppuccin)"], [", ", "settings"], ["?", "this help"], ["q", "quit"]]],
  ];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", pointerEvents: "none" }} />
      <Box x={20} y={5} w={80} h={24} color={t.primary} kind="round" fill={t.surface} />
      <Row y={5} x={23}><Span fg={t.border}>─</Span><Span fg={t.primary} bold> Keybindings </Span><Span fg={t.border}>─</Span></Row>
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <Row y={8 + gi * 6} x={24}><Span fg={t.secondary} bold>{g[0]}</Span></Row>
          {g[1].map((r, ri) => (
            <Row key={ri} y={9 + gi * 6 + ri} x={24}>
              <Span fg={t.warn} bold>{r[0].padEnd(12)}</Span>
              <Span fg={t.subtle}>{r[1]}</Span>
            </Row>
          ))}
        </React.Fragment>
      ))}
      <Row y={26} x={24}><Span fg={t.dim}>thmbwal v0.1.0 · press ? or esc to close</Span></Row>
    </>
  );
}

// ---- Settings overlay -------------------------------------------------------
function SettingsOverlay({ theme }) {
  const t = window.__theme;
  const rows = [
    ["save_dir",      "~/Pictures/wallpapers"],
    ["default_res",   `auto (${DETECTED})`],
    ["overwrite",     "ask"],
    ["ascii_preview", "enabled"],
    ["theme",         theme],
    ["cache",         "7 days · 4.1 MB"],
  ];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", pointerEvents: "none" }} />
      <Box x={28} y={6} w={64} h={20} color={t.primary} kind="round" fill={t.surface} />
      <Row y={6} x={31}><Span fg={t.border}>─</Span><Span fg={t.primary} bold> Settings </Span><Span fg={t.border}>─</Span></Row>
      <Row y={8} x={31}><Span fg={t.dim}>~/.config/thmbwal/config.toml</Span></Row>
      {rows.map((r, i) => (
        <Row key={i} y={10 + i * 2} x={31}>
          <Span fg={t.dim}>{r[0].padEnd(16)}</Span>
          <Span fg={r[0] === "theme" ? t.primary : t.accent} bold={r[0] === "theme"}>{r[1]}</Span>
        </Row>
      ))}
      <Row y={23} x={31}><Span fg={t.accent}>✓ </Span><Span fg={t.subtle}>changes save automatically · t cycles theme</Span></Row>
      <Row y={24} x={31}><Span fg={t.dim}>esc to close</Span></Row>
    </>
  );
}

// ---- Quit overlay -----------------------------------------------------------
function QuitOverlay({ onRestart }) {
  const t = window.__theme;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.82)", pointerEvents: "none" }} />
      <Row y={14} x={48}><Span fg={t.subtle}>thmbwal session ended.</Span></Row>
      <Row y={16} x={44}><Span fg={t.dim}>$ </Span><Span fg={t.text}>thmbwal</Span><Span fg={t.primary}>▎</Span></Row>
      <div style={{
        position: "absolute", left: 44 * CELL_W, top: 18 * CELL_H,
        pointerEvents: "auto",
      }}>
        <button onClick={onRestart} style={{
          font: `13px ${FONT}`, color: t.bg, background: t.primary,
          border: "none", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontWeight: 700,
        }}>↻ restart (or press any key)</button>
      </div>
    </>
  );
}

// ---- Empty (no match) -------------------------------------------------------
function EmptyGrid({ filterText }) {
  const t = window.__theme;
  return (
    <>
      <Row y={14} x={42}><Span fg={t.subtle} bold>nothing matches "{filterText}".</Span></Row>
      <Row y={16} x={40}><Span fg={t.dim}>edit the filter, or press esc to see everything again.</Span></Row>
    </>
  );
}

// ---- Main app ---------------------------------------------------------------
function Prototype() {
  const [themeKey, setThemeKey] = useState("charm");
  const [mode, setMode] = useState("browse"); // browse | filter | picker | help | settings | quit
  const [active, setActive] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [pickerSel, setPickerSel] = useState(DEFAULT_RES_IDX);
  const [downloads, setDownloads] = useState([]); // {id,title,res,pct}
  const [downloaded, setDownloaded] = useState(() => new Set(DATA.filter(d => d.dl).map(d => d.title)));
  const [flash, setFlash] = useState(null);
  const idRef = useRef(0);

  const t = THEMES[themeKey];
  window.__theme = t;

  // The active filter string used for display: live text while filtering, else applied
  const effFilter = mode === "filter" ? filterText : appliedFilter;
  const filtered = effFilter
    ? DATA.filter(d => (d.title + " " + d.author + " " + d.m).toLowerCase().includes(effFilter.toLowerCase()))
    : DATA;

  // Clamp active when the filtered set changes
  useEffect(() => {
    if (active >= filtered.length) setActive(Math.max(0, filtered.length - 1));
  }, [filtered.length]);

  const activeItem = filtered[active] || DATA[0];

  // Download progress ticker
  useEffect(() => {
    if (downloads.length === 0) return;
    const iv = setInterval(() => {
      setDownloads(prev => {
        const next = prev.map(d => ({ ...d, pct: Math.min(100, d.pct + Math.round(6 + Math.random() * 10)) }));
        const finished = next.filter(d => d.pct >= 100);
        if (finished.length) {
          setDownloaded(dl => {
            const s = new Set(dl);
            finished.forEach(f => s.add(f.title));
            return s;
          });
        }
        return next.filter(d => d.pct < 100);
      });
    }, 220);
    return () => clearInterval(iv);
  }, [downloads.length]);

  const startDownload = useCallback((item, res) => {
    idRef.current += 1;
    setDownloads(prev => [...prev, { id: idRef.current, title: item.title, res, pct: 8 }]);
    setFlash(`↓ ${item.title} · ${res} → ~/Pictures/${slug(item.m)}-${slug(item.title)}-${res.replace("×", "x")}.png`);
    setTimeout(() => setFlash(null), 2600);
  }, []);

  // Keyboard handling
  const onKey = useCallback((e) => {
    const k = e.key;

    // Quit overlay swallows everything → restart
    if (mode === "quit") { window.location.reload(); return; }

    // Overlays: help / settings → esc or same key closes
    if (mode === "help") { if (k === "Escape" || k === "?" ) setMode("browse"); e.preventDefault(); return; }
    if (mode === "settings") {
      if (k === "Escape" || k === ",") setMode("browse");
      if (k === "t") setThemeKey(p => p === "charm" ? "catppuccin" : "charm");
      e.preventDefault(); return;
    }

    // Picker
    if (mode === "picker") {
      if (k === "Escape") { setMode("browse"); }
      else if (k === "j" || k === "ArrowDown") { setPickerSel(s => Math.min(RES_FLAT.length - 1, s + 1)); }
      else if (k === "k" || k === "ArrowUp") { setPickerSel(s => Math.max(0, s - 1)); }
      else if (k === "Enter") { startDownload(activeItem, RES_FLAT[pickerSel].res); setMode("browse"); }
      e.preventDefault(); return;
    }

    // Filter typing
    if (mode === "filter") {
      if (k === "Escape") { setFilterText(""); setAppliedFilter(""); setMode("browse"); setActive(0); }
      else if (k === "Enter") { setAppliedFilter(filterText); setMode("browse"); }
      else if (k === "Backspace") { setFilterText(s => s.slice(0, -1)); setActive(0); }
      else if (k.length === 1 && !e.metaKey && !e.ctrlKey) { setFilterText(s => s + k); setActive(0); }
      e.preventDefault(); return;
    }

    // Browse mode
    switch (k) {
      case "h": case "ArrowLeft":  setActive(a => Math.max(0, a - 1)); break;
      case "l": case "ArrowRight": setActive(a => Math.min(filtered.length - 1, a + 1)); break;
      case "k": case "ArrowUp":    setActive(a => Math.max(0, a - COLS)); break;
      case "j": case "ArrowDown":  setActive(a => Math.min(filtered.length - 1, a + COLS)); break;
      case "g": setActive(0); break;
      case "G": setActive(filtered.length - 1); break;
      case "/": setMode("filter"); setFilterText(appliedFilter); break;
      case "Enter": if (filtered.length) { setPickerSel(DEFAULT_RES_IDX); setMode("picker"); } break;
      case "d": if (filtered.length) startDownload(activeItem, DETECTED); break;
      case "t": setThemeKey(p => p === "charm" ? "catppuccin" : "charm"); break;
      case ",": setMode("settings"); break;
      case "?": setMode("help"); break;
      case "q": setMode("quit"); break;
      case "Escape": if (appliedFilter) { setAppliedFilter(""); setActive(0); } break;
      default: return;
    }
    e.preventDefault();
  }, [mode, filtered.length, filterText, appliedFilter, pickerSel, activeItem, startDownload]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  // Map a wallpaper title → live download pct (for card badge)
  const dlPct = {};
  downloads.forEach(d => { dlPct[d.title] = d.pct; });
  const latestToast = downloads.length ? { ...downloads[downloads.length - 1] } : null;

  const noMatch = filtered.length === 0;
  const crumbs = appliedFilter ? ["Contact sheet", "filter"] : ["Contact sheet"];

  // Row-scrolling: keep the focused card's row inside the visible window
  const totalRows = Math.ceil(filtered.length / COLS);
  const activeRow = Math.floor(active / COLS);
  let rowOffset = activeRow >= VIS_ROWS ? activeRow - VIS_ROWS + 1 : 0;
  rowOffset = Math.min(rowOffset, Math.max(0, totalRows - VIS_ROWS));

  const totalRes = DATA.reduce((s, w) => s + w.resCount, 0);
  const count = appliedFilter
    ? `${filtered.length} of ${DATA.length} match`
    : `${DATA.length} months · ${totalRes} wallpapers`;

  return (
    <ScaledStage>
      <Term cols={120} rows={34} theme={themeKey} title="thmbwal — contact sheet">
        <Header crumbs={crumbs} count={count} toast={latestToast} />

        {/* Grid (scrolling window of VIS_ROWS rows) */}
        {!noMatch && filtered.map((item, i) => {
          const r = Math.floor(i / COLS);
          if (r < rowOffset || r >= rowOffset + VIS_ROWS) return null;
          const c = i % COLS;
          const x = PAD_X + c * (CARD_W + GUTTER);
          const y = GRID_Y + (r - rowOffset) * (CARD_H + 1);
          return (
            <Card key={item.title} x={x} y={y} item={item}
              active={i === active}
              dl={downloaded.has(item.title)}
              downloading={dlPct[item.title] != null ? dlPct[item.title] : null}
            />
          );
        })}

        {noMatch && <EmptyGrid filterText={effFilter} />}

        {/* Scroll indicator (sits in the gap above the detail strip) */}
        {!noMatch && totalRows > VIS_ROWS && (
          <Row y={28} x={2}>
            <Span fg={t.dim}>rows {rowOffset + 1}–{Math.min(totalRows, rowOffset + VIS_ROWS)} of {totalRows}   </Span>
            <Span fg={rowOffset > 0 ? t.secondary : t.dim}>↑</Span>
            <Span fg={rowOffset + VIS_ROWS < totalRows ? t.secondary : t.dim}>↓</Span>
            <Span fg={t.dim}>  j/k scrolls · {filtered.length} wallpapers</Span>
          </Row>
        )}

        {/* Detail strip (browse) */}
        {!noMatch && <DetailStrip y={29} item={activeItem} dl={downloaded.has(activeItem.title)} />}

        {/* Footer / filter prompt */}
        {mode === "filter" ? (
          <Row y={33} x={0}>
            <Span fg={t.bg} bg={t.warn} bold>{" /FILTER "}</Span>
            <Span fg={t.warn}> /</Span>
            <Span fg={t.text}>{filterText}</Span>
            <Span fg={t.primary}>▎</Span>
            <Span fg={t.dim}>     {filtered.length} match{filtered.length === 1 ? "" : "es"} · ↵ apply · esc clear</Span>
          </Row>
        ) : (
          <Footer y={33} mode="browse" />
        )}

        {/* Overlays */}
        {mode === "picker" && <Picker item={activeItem} sel={pickerSel} />}
        {mode === "help" && <HelpOverlay />}
        {mode === "settings" && <SettingsOverlay theme={themeKey} />}
        {mode === "quit" && <QuitOverlay onRestart={() => window.location.reload()} />}
      </Term>

      {/* Toast flash (download started) — floating below terminal */}
      {flash && (
        <div style={{
          position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)",
          font: `12px ${FONT}`, color: t.bg, background: t.accent,
          padding: "8px 16px", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.4)",
          maxWidth: "90vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{flash}</div>
      )}
    </ScaledStage>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Prototype />);
