// tui.jsx — Terminal frame, theme system, and ASCII-art preview helpers
// Exports to window: Term, Row, Span, BoxChar, StatusBar, AsciiArt, KittyPreview, THEMES, useTheme

const THEMES = {
  charm: {
    name: "Charm default",
    bg:        "#0E0E12",
    surface:   "#16161D",
    surface2:  "#1F1F2A",
    border:    "#2A2A38",
    borderHi:  "#FF06B7",
    text:      "#FAFAFA",
    dim:       "#7A7A88",
    subtle:    "#A8A8B8",
    primary:   "#FF06B7", // charm pink
    secondary: "#874BFD", // charm purple
    accent:    "#43BF6D", // green
    warn:      "#F2BC2F",
    err:       "#FF5C8A",
    info:      "#74D7FF",
  },
  catppuccin: {
    name: "Catppuccin Mocha",
    bg:        "#1E1E2E",
    surface:   "#181825",
    surface2:  "#313244",
    border:    "#45475A",
    borderHi:  "#CBA6F7",
    text:      "#CDD6F4",
    dim:       "#6C7086",
    subtle:    "#BAC2DE",
    primary:   "#CBA6F7", // mauve
    secondary: "#F5C2E7", // pink
    accent:    "#A6E3A1", // green
    warn:      "#F9E2AF",
    err:       "#F38BA8",
    info:      "#89DCEB",
  },
};

const ThemeContext = React.createContext(THEMES.charm);
const useTheme = () => React.useContext(ThemeContext);

// Terminal cell sizing — we lock characters to a grid so box drawing aligns.
// Chosen so a 120×34 terminal sits comfortably in a ~960×620 artboard.
const CELL_W = 8;
const CELL_H = 17;
const FONT = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace';

// ---- Terminal frame ----------------------------------------------------------
function Term({ cols = 120, rows = 34, theme = "charm", title = "thmbwal", children, chrome = "alacritty", scanlines = false, style }) {
  const t = THEMES[theme] || THEMES.charm;
  const w = cols * CELL_W;
  const h = rows * CELL_H;
  const chromeH = chrome === "none" ? 0 : 22;
  return (
    <ThemeContext.Provider value={t}>
      <div style={{
        display: "inline-block",
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 6,
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        overflow: "hidden",
        ...style,
      }}>
        {chrome !== "none" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            height: chromeH, padding: "0 10px",
            background: t.bg,
            borderBottom: `1px solid ${t.border}`,
            color: t.dim, fontFamily: FONT, fontSize: 11,
          }}>
            {chrome === "macos" ? (
              <>
                <span style={dot("#FF5F57")} />
                <span style={dot("#FEBC2E")} />
                <span style={dot("#28C840")} />
                <span style={{ flex: 1, textAlign: "center", color: t.subtle }}>{title}</span>
              </>
            ) : (
              <>
                <span style={{ color: t.primary }}>●</span>
                <span style={{ color: t.subtle, letterSpacing: 0.4 }}>{title}</span>
                <span style={{ marginLeft: "auto", color: t.dim }}>120×34</span>
              </>
            )}
          </div>
        )}
        <div style={{
          width: w, height: h,
          background: t.bg, color: t.text,
          fontFamily: FONT, fontSize: 13, lineHeight: `${CELL_H}px`,
          padding: 0,
          position: "relative",
          fontVariantLigatures: "none",
          tabSize: 1,
        }}>
          {children}
          {scanlines && <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)",
          }} />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

const dot = (c) => ({ width: 11, height: 11, borderRadius: 999, background: c, display: "inline-block" });

// Row — one terminal line, positioned by row index (0-based). Lets us layer easily.
function Row({ y = 0, x = 0, children, style }) {
  return (
    <div style={{
      position: "absolute",
      left: x * CELL_W, top: y * CELL_H,
      height: CELL_H, lineHeight: `${CELL_H}px`,
      whiteSpace: "pre",
      ...style,
    }}>{children}</div>
  );
}

// Span with inline style — used for colored runs inside a row.
function Span({ fg, bg, bold, dim, italic, underline, children, style }) {
  return (
    <span style={{
      color: fg, background: bg,
      fontWeight: bold ? 600 : 400,
      opacity: dim ? 0.55 : 1,
      fontStyle: italic ? "italic" : "normal",
      textDecoration: underline ? "underline" : "none",
      ...style,
    }}>{children}</span>
  );
}

// Box helpers — generate horizontal / vertical lines / corners
// Rounded set ╭─╮│╰╯  | Sharp set ┌─┐│└┘
const BOX = {
  round: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│", lc: "├", rc: "┤", tc: "┬", bc: "┴", x: "┼" },
  sharp: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│", lc: "├", rc: "┤", tc: "┬", bc: "┴", x: "┼" },
  double:{ tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║", lc: "╠", rc: "╣", tc: "╦", bc: "╩", x: "╬" },
};

// Draw a box at (x,y) with (w,h) cells. Children render inside, content area starts (x+1,y+1).
function Box({ x = 0, y = 0, w, h, kind = "round", color, title, titleColor, children, fill }) {
  const t = useTheme();
  const b = BOX[kind];
  const lines = [];
  // top
  lines.push(b.tl + b.h.repeat(w - 2) + b.tr);
  // middles
  for (let i = 0; i < h - 2; i++) lines.push(b.v + " ".repeat(w - 2) + b.v);
  // bottom
  lines.push(b.bl + b.h.repeat(w - 2) + b.br);
  return (
    <>
      <div style={{
        position: "absolute",
        left: x * CELL_W, top: y * CELL_H,
        whiteSpace: "pre", color: color || t.border,
        lineHeight: `${CELL_H}px`,
        ...(fill ? { background: fill } : {}),
      }}>
        {lines.map((l, i) => <div key={i} style={{ height: CELL_H }}>{l}</div>)}
      </div>
      {title && (
        <Row y={y} x={x + 2}>
          <Span fg={color || t.border}>{b.h}</Span>
          <Span fg={titleColor || t.text} bold> {title} </Span>
          <Span fg={color || t.border}>{b.h}</Span>
        </Row>
      )}
      {children}
    </>
  );
}

// ---- Status / key bar --------------------------------------------------------
function StatusBar({ y, keys = [], theme: tOverride, accent }) {
  const t = useTheme();
  return (
    <Row y={y} x={0}>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          <Span fg={t.bg} bg={accent || t.primary} bold>{` ${k.k} `}</Span>
          <Span fg={t.subtle} bg={t.surface2}>{` ${k.label} `}</Span>
        </React.Fragment>
      ))}
    </Row>
  );
}

// ---- ASCII art preview -------------------------------------------------------
// A small library of hand-crafted ASCII art pieces sized for a typical thumbnail
// region (e.g. 38 cols × 16 rows). Characters draw from ░▒▓█ shading.
//
// Each pattern returns an array of strings — one per row.
const ASCII = {
  // Cosy window-scene (warm interior + snowy view)
  window: [
    "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
    "▓░░░░░░░░░▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░▓",
    "▓░  ✦   ░░▒▒▒▒▒▒▒▒░░       ✦       ░░▓",
    "▓░░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░▓",
    "▓████████████████████████████████████▓",
    "▓█  ░░░░░░░░░░  ████  ░░░░░░░░░░    █▓",
    "▓█  ░·  ✦  ·░░  ████  ░·  ❄   ·░    █▓",
    "▓█  ░░░░░░░░░░  ████  ░░░░░░░░░░    █▓",
    "▓█  ██████████  ████  ██████████    █▓",
    "▓█  ░░░░░░░░░░  ████  ░░░░░░░░░░    █▓",
    "▓█  ░·   ❄  ·░  ████  ░·   ✦  ·░    █▓",
    "▓█  ░░░░░░░░░░  ████  ░░░░░░░░░░    █▓",
    "▓████████████████████████████████████▓",
    "▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓",
    "▓▒░░░░▒▒▒░░░░▒▒▒░░░░▒▒▒░░░░▒▒▒░░░░▒▒▒▓",
    "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
  ],
  // Abstract waves
  waves: [
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒░░░░░░░░",
    "░░▒▒▒▓▓▓▓▓▓▒▒▒▒▒░░░░░░▒▒▒▒▒▒▒▒▒░░░░░░░",
    "░▒▒▓▓▓████▓▓▓▒▒▒▒░░▒▒▒▒▓▓▓▓▒▒▒▒░░░░░░░",
    "▒▒▓▓████████▓▓▒▒▒▒▒▓▓▓▓▓██▓▓▓▒▒▒░░░░░░",
    "▓▓███▒▒▒▒▒██▓▓▓▓▓▓▓███▒▒▒██▓▓▒▒▒░░░░░░",
    "▓████▒░░░░▒██████████▒░░░▒██▓▒▒░░░░░░░",
    "▓███▒░ ◐ ░▒██████████░ ◑ ░▒██▒▒░░░░░░░",
    "▓██▓▒░░░░▒██▓▓▓▓▓▓▓██▒░░▒▒█▓▒░░░░░░░░░",
    "▓██▓▓▒▒▒▒█▓▒▒▒▒▒▒▒▒▓██▒▒██▓▒░░░░░░░░░░",
    "▒▓███████▓▒░░░░░░░░▒▓█████▒░░░░░░░░░░░",
    "░▒▒▓▓██▓▓▒░░░░░░░░░░▒▓▓██▒░░░░░░░░░░░░",
    "░░░▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  ],
  // City silhouette at dusk
  city: [
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░  ✦  ░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░  ✦   ░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒",
    "▒▒▒▒▓▓▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒",
    "▓▓▓▓██▓▓▒▒▓▓▓▓██▓▓▒▒▒▒▒▒▒▒▓▓▒▒▒▒▓▓██▓▓",
    "███████▓▓▓▓▓▓████▓▓▓▒▒▒▒▒▓██▓▓▓▓██████",
    "██░██████████░██░██▓▓▓▓▓████░████░████",
    "██████░██████████░██████░█████████░███",
    "█░░██░█░░██░██░█░██░███████░█░██░██░██",
    "███████░██████░██████░██████████░█████",
    "██░██░█████░██░██░██████░██░██░██░████",
    "██████████████████████████████████████",
    "██████████████████████████████████████",
  ],
  // Botanical leaves
  leaves: [
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░  ▓▓▓▓  ░░░░░░░░░░░  ▓▓▓▓░░░░░░░",
    "░░░░░ ▓▓████▓▓ ░░░░░░░░░ ▓▓████▓▓░░░░░",
    "░░░░▓▓██████▓▓▓░░░░░░░░▓▓██████▓▓░░░░░",
    "░░░░ ▓█████▓▒▒  ░░░░░░░ ▓█████▓▒▒ ░░░░",
    "░░░░░ ▓██▓▒░    ░░░░░░░░░▓██▓▒░  ░░░░░",
    "░░░░░░░  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░  ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░ ▓▓███████▓▓ ░░░░░░░░░░░░░░░",
    "░░░░░░░░ ▓▓████████████▓▓ ░░░░░░░░░░░░",
    "░░░░░░░  ▓██████████████▓▒  ░░░░░░░░░░",
    "░░░░░░░░  ▓███████████▓▒    ░░░░░░░░░░",
    "░░░░░░░░░  ▓█████████▓░     ░░░░░░░░░░",
    "░░░░░░░░░░   ▓▓███▓▓░       ░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  ],
  // Cosmic dance — abstract orbits
  cosmic: [
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░ ✦  ░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░ ░░░░░░░░ ✦ ░░░░░░░",
    "░░░░░░░░░░░░░▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░",
    "░░░░░░░░▒▓▓██░░░░░░██▓▓▒░░░░░░░░░░░░░░",
    "░░░░░░░▒▓██░░░░ ⊙ ░░░██▓▒░░░░░░░░░░░░░",
    "░░░░░░▒▒▓█░░░░░░░░░░░░█▓▒▒░░░░░░░░░░░░",
    "░░░░░░▒▓█░░░░░░░░░░░░░░█▓▒░░░░░░░░░░░░",
    "░░░░░░▒▓██░░░░░░░░░░░░██▓▒░░░░░░░░░░░░",
    "░░░░░░░▒▓██▒░░░░░░░░▒██▓▒░░░░░░░░░░░░░",
    "░░░░░░░░▒▓▓██▒▒▒▒██▓▓▒░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░▒▒▓▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░  ✦  ░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  ],
};

// AsciiArt renders one of the patterns at (x,y) with a tint color.
function AsciiArt({ x = 0, y = 0, pattern = "window", color, dim = false, w, h }) {
  const t = useTheme();
  const lines = ASCII[pattern] || ASCII.window;
  const slice = lines.slice(0, h || lines.length).map(l => (w ? l.slice(0, w) : l));
  return (
    <div style={{
      position: "absolute",
      left: x * CELL_W, top: y * CELL_H,
      color: color || t.subtle, opacity: dim ? 0.5 : 1,
      whiteSpace: "pre", lineHeight: `${CELL_H}px`,
      pointerEvents: "none",
    }}>
      {slice.map((l, i) => <div key={i} style={{ height: CELL_H }}>{l}</div>)}
    </div>
  );
}

// KittyPreview — a stand-in for the kitty image protocol: a soft gradient panel
// with a subtle film-grain dither so it reads as "an actual photo would go here".
function KittyPreview({ x, y, w, h, tone = "warm", label = "kitty graphics" }) {
  const t = useTheme();
  const tones = {
    warm:  ["#3D2A2E", "#7A4B3A", "#C99064", "#F3D2A4"],
    cool:  ["#0F2235", "#1E4A6E", "#4189B5", "#A5D8E6"],
    plum:  ["#2A1B3D", "#5D3B8C", "#A974D0", "#E7C9F0"],
    forest:["#0E2A1F", "#1E5C3F", "#4FA77A", "#B5E3C4"],
  }[tone] || ["#222", "#444", "#888", "#bbb"];
  return (
    <div style={{
      position: "absolute",
      left: x * CELL_W, top: y * CELL_H,
      width: w * CELL_W, height: h * CELL_H,
      background: `linear-gradient(135deg, ${tones[0]} 0%, ${tones[1]} 35%, ${tones[2]} 70%, ${tones[3]} 100%)`,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0, transparent 30%)," +
          "radial-gradient(circle at 75% 70%, rgba(0,0,0,0.25) 0, transparent 40%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 3px)," +
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)",
      }} />
      <div style={{
        position: "absolute", left: 6, bottom: 4,
        font: `11px ${FONT}`, color: "rgba(255,255,255,0.55)",
        letterSpacing: 0.4,
      }}>{label}</div>
    </div>
  );
}

Object.assign(window, { Term, Row, Span, Box, BOX, StatusBar, AsciiArt, KittyPreview, THEMES, useTheme, CELL_W, CELL_H, FONT, ASCII });
