// flow.jsx — User flow wireflow diagram for the contact-sheet direction
// Renders mini terminal thumbnails (scaled-down real components) connected by
// SVG arrows labeled with the keypress that triggers each transition.

const {
  Term, Row, Span, Box, useTheme, THEMES,
  CS_Default, CS_Filter, CS_NoMatch, CS_Downloading, CS_Picker, CS_Compact, CS_Kitty,
  ScreenSplash, ScreenSettings, ScreenHelp, ScreenError, ScreenEmpty, ScreenDownload,
  WALLPAPERS,
} = window;

// A mini terminal thumbnail — scales a full-size Term down. Caption sits below.
// `scale` defaults to 0.32 so a 120×34 terminal becomes ~307×196.
function Thumb({ x, y, w = 120, h = 34, scale = 0.32, label, sub, children, accent }) {
  const t = useTheme();
  const pixelW = (w * 8) * scale;
  // 22px chrome + h*17 cells, all multiplied by scale
  const pixelH = (22 + h * 17) * scale;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: pixelW + 4 }}>
      <div style={{
        width: pixelW + 4, height: pixelH + 4,
        padding: 2, borderRadius: 6,
        background: accent || "transparent",
        boxShadow: accent ? `0 0 0 2px ${accent}` : "0 6px 18px rgba(0,0,0,0.18)",
      }}>
        <div style={{
          width: pixelW, height: pixelH,
          overflow: "hidden", borderRadius: 4,
        }}>
          <div style={{
            width: w * 8, height: 22 + h * 17,
            transform: `scale(${scale})`, transformOrigin: "top left",
            pointerEvents: "none",
          }}>{children}</div>
        </div>
      </div>
      <div style={{
        marginTop: 8, fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: 12, fontWeight: 600, color: "#1A1A1F", letterSpacing: 0.2,
      }}>{label}</div>
      {sub && <div style={{
        fontSize: 11, color: "#7A6A45", marginTop: 2,
        fontFamily: "ui-sans-serif, system-ui, sans-serif", lineHeight: 1.4,
      }}>{sub}</div>}
    </div>
  );
}

// Arrow — SVG path with optional key-label badge in the middle of the line.
// Renders inside a single SVG that's absolute-positioned across the whole board.
function Arrow({ from, to, label, sub, bend = 0, color = "#3A3A40", dashed = false }) {
  // from, to: { x, y }
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + bend;
  const path = `M ${from.x} ${from.y} Q ${mx} ${my}, ${to.x} ${to.y}`;
  const labelX = mx;
  const labelY = my - 4;
  return (
    <>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5 5" : undefined}
        markerEnd="url(#arrowhead)" />
      {label && (
        <>
          <rect x={labelX - 22} y={labelY - 12} width={44} height={20} rx={4} fill="#FBF8F3" stroke={color} strokeWidth={1} />
          <text x={labelX} y={labelY + 2} fontFamily="JetBrains Mono, monospace" fontSize={11} fontWeight={600} fill={color} textAnchor="middle">{label}</text>
          {sub && (
            <text x={labelX} y={labelY + 18} fontFamily="ui-sans-serif, system-ui" fontSize={10} fill="#7A6A45" textAnchor="middle">{sub}</text>
          )}
        </>
      )}
    </>
  );
}

// --- The flow diagram --------------------------------------------------------
function UserFlow() {
  // Board geometry — single huge artboard, two main rows.
  const W = 2480;
  const H = 1380;

  // Row 1 (happy path) y=120
  // Row 2 (branches)   y=620
  // Row 3 (failures)   y=1080

  const thumbW = 120 * 8 * 0.32;   // 307.2
  const thumbH = (22 + 34 * 17) * 0.32; // 192

  // Helper: compute right-edge midpoint / left-edge midpoint for a thumb at (x,y)
  const right = (x, y) => ({ x: x + thumbW + 4, y: y + thumbH / 2 });
  const left  = (x, y) => ({ x, y: y + thumbH / 2 });
  const top   = (x, y) => ({ x: x + thumbW / 2, y });
  const bot   = (x, y) => ({ x: x + thumbW / 2, y: y + thumbH + 4 });

  // Coordinates — happy path
  const p_splash    = { x:  60, y: 140 };
  const p_browse    = { x: 460, y: 140 };
  const p_picker    = { x: 860, y: 140 };
  const p_dl        = { x: 1260, y: 140 };
  const p_done      = { x: 1660, y: 140 };
  const p_quickdl   = { x: 1260, y: 360 };  // alt path from browse

  // Branches row
  const p_filter    = { x: 460, y: 700 };
  const p_nomatch   = { x: 860, y: 700 };
  const p_help      = { x: 1260, y: 700 };
  const p_settings  = { x: 1660, y: 700 };

  // Failures row
  const p_error     = { x:  60, y: 1100 };
  const p_compact   = { x: 1980, y: 700 };

  return (
    <div style={{
      width: W, height: H, position: "relative",
      background: "#FBF8F3",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ position: "absolute", left: 40, top: 28, right: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#8A7A55", textTransform: "uppercase" }}>thmbwal · user flow</div>
        <h2 style={{ fontSize: 28, margin: "6px 0 0", letterSpacing: -0.5, fontWeight: 700, color: "#1A1A1F" }}>
          How a user moves through thmbwal
        </h2>
        <p style={{ fontSize: 13, color: "#3A3A40", maxWidth: 900, lineHeight: 1.5, margin: "8px 0 0" }}>
          Three rows: <b>top</b> is the happy path from launch to a downloaded wallpaper. <b>Middle</b> is the side branches from the browse hub. <b>Bottom</b> is what happens when things go wrong. Arrows are labeled with the keystroke that triggers the move.
        </p>
      </div>

      {/* Row labels along left edge */}
      <RowLabel y={140 + thumbH / 2} text="HAPPY PATH" color="#1F8A5B" />
      <RowLabel y={700 + thumbH / 2} text="BRANCHES"   color="#874BFD" />
      <RowLabel y={1100 + thumbH / 2} text="FAILURE"    color="#C24A3A" />

      {/* Thumbnails — Happy Path */}
      <Thumb {...p_splash} label="① Splash" sub="auto · fetching RSS feed">
        <ScreenSplash theme="charm" />
      </Thumb>
      <Thumb {...p_browse} label="② Contact sheet · browse" sub="the hub · h/j/k/l navigates the grid" accent="#FF06B7">
        <CS_Default theme="charm" active={1} />
      </Thumb>
      <Thumb {...p_picker} label="③ Picker overlay" sub="resolutions grouped by aspect ratio">
        <CS_Picker theme="charm" />
      </Thumb>
      <Thumb {...p_dl} label="④ Downloading" sub="toast in header · grid still visible">
        <CS_Downloading theme="charm" />
      </Thumb>
      <Thumb {...p_done} label="⑤ Done · ● badge" sub="card now shows green ● downloaded">
        <CS_Default theme="charm" active={1} />
      </Thumb>

      {/* Alt: quick-download path from browse */}
      <Thumb {...p_quickdl} label="④′ Quick download" sub="d skips the picker, uses your display" scale={0.28}>
        <CS_Downloading theme="charm" />
      </Thumb>

      {/* Thumbnails — Branches */}
      <Thumb {...p_filter} label="Filter active" sub="slash prompt at bottom · dims non-matches">
        <CS_Filter theme="charm" />
      </Thumb>
      <Thumb {...p_nomatch} label="No matches" sub="empty state for filter">
        <CS_NoMatch theme="charm" />
      </Thumb>
      <Thumb {...p_help} label="Help overlay" sub="keybinding reference">
        <ScreenHelp theme="charm" />
      </Thumb>
      <Thumb {...p_settings} label="Settings" sub="lives alongside config.toml">
        <ScreenSettings theme="charm" />
      </Thumb>
      <Thumb {...p_compact} label="Compact terminal" sub="80×28 · grid reflows to 2×2" scale={0.30}>
        <CS_Compact theme="charm" active={0} />
      </Thumb>

      {/* Thumbnails — Failure */}
      <Thumb {...p_error} label="Feed unreachable" sub="r retries · c falls back to cache">
        <ScreenError theme="charm" />
      </Thumb>

      {/* SVG arrow layer */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, pointerEvents: "none" }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#3A3A40" />
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#1F8A5B" />
          </marker>
          <marker id="arrowhead-purple" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#874BFD" />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#C24A3A" />
          </marker>
        </defs>

        {/* Happy path arrows */}
        <Arrow from={right(p_splash.x, p_splash.y)} to={left(p_browse.x, p_browse.y)} label="auto" sub="when ready" color="#1F8A5B" />
        <Arrow from={right(p_browse.x, p_browse.y)} to={left(p_picker.x, p_picker.y)} label="↵" sub="open picker" color="#1F8A5B" />
        <Arrow from={right(p_picker.x, p_picker.y)} to={left(p_dl.x, p_dl.y)} label="↵" sub="confirm size" color="#1F8A5B" />
        <Arrow from={right(p_dl.x, p_dl.y)} to={left(p_done.x, p_done.y)} label="auto" sub="when complete" color="#1F8A5B" />

        {/* Quick download branch */}
        <path d={`M ${p_browse.x + thumbW/2 + 30} ${p_browse.y + thumbH + 4}
                  Q ${p_browse.x + thumbW/2 + 30} ${p_quickdl.y - 40},
                    ${p_quickdl.x + thumbW * 0.28 / 2 + 70} ${p_quickdl.y}`}
              fill="none" stroke="#1F8A5B" strokeWidth={1.5} markerEnd="url(#arrowhead-green)" strokeDasharray="5 4" />
        <rect x={p_browse.x + thumbW/2 + 8} y={p_browse.y + thumbH + 80} width={44} height={20} rx={4} fill="#FBF8F3" stroke="#1F8A5B" />
        <text x={p_browse.x + thumbW/2 + 30} y={p_browse.y + thumbH + 94} fontFamily="JetBrains Mono, monospace" fontSize={11} fontWeight={600} fill="#1F8A5B" textAnchor="middle">d</text>
        <text x={p_browse.x + thumbW/2 + 30} y={p_browse.y + thumbH + 112} fontFamily="ui-sans-serif" fontSize={10} fill="#1F8A5B" textAnchor="middle">quick d/l</text>

        {/* Esc / cancel arrows (loop back) */}
        <path d={`M ${p_picker.x + 20} ${p_picker.y + thumbH + 4}
                  Q ${p_picker.x + 20} ${p_picker.y + thumbH + 40},
                    ${p_browse.x + thumbW - 20} ${p_browse.y + thumbH + 4}
                  Q ${p_browse.x + thumbW - 20} ${p_browse.y + thumbH + 24},
                    ${p_browse.x + thumbW - 20} ${p_browse.y + thumbH + 4}`}
              fill="none" stroke="#3A3A40" strokeWidth={1.2} strokeDasharray="3 4" markerEnd="url(#arrowhead)" />
        <rect x={p_picker.x - 18} y={p_picker.y + thumbH + 22} width={36} height={18} rx={3} fill="#FBF8F3" stroke="#3A3A40" />
        <text x={p_picker.x} y={p_picker.y + thumbH + 34} fontFamily="JetBrains Mono, monospace" fontSize={10} fontWeight={600} fill="#3A3A40" textAnchor="middle">esc</text>

        {/* Branches — from browse going down */}
        <Arrow from={bot(p_browse.x, p_browse.y)} to={top(p_filter.x, p_filter.y)} label="/" sub="filter" color="#874BFD" />
        <Arrow from={right(p_filter.x, p_filter.y)} to={left(p_nomatch.x, p_nomatch.y)} label="typed" sub="no match" color="#874BFD" />

        {/* From browse hub to help & settings (long arcs) */}
        <path d={`M ${p_browse.x + thumbW + 4} ${p_browse.y + thumbH / 2 + 20}
                  Q ${(p_browse.x + p_help.x) / 2} ${p_help.y - 60},
                    ${p_help.x + thumbW / 2} ${p_help.y}`}
              fill="none" stroke="#874BFD" strokeWidth={1.5} markerEnd="url(#arrowhead-purple)" />
        <rect x={(p_browse.x + p_help.x) / 2 - 22} y={p_help.y - 80} width={44} height={20} rx={4} fill="#FBF8F3" stroke="#874BFD" />
        <text x={(p_browse.x + p_help.x) / 2} y={p_help.y - 66} fontFamily="JetBrains Mono, monospace" fontSize={11} fontWeight={600} fill="#874BFD" textAnchor="middle">?</text>
        <text x={(p_browse.x + p_help.x) / 2} y={p_help.y - 50} fontFamily="ui-sans-serif" fontSize={10} fill="#874BFD" textAnchor="middle">help</text>

        <path d={`M ${p_browse.x + thumbW + 4} ${p_browse.y + thumbH / 2 + 40}
                  Q ${(p_browse.x + p_settings.x) / 2} ${p_settings.y - 90},
                    ${p_settings.x + thumbW / 2} ${p_settings.y}`}
              fill="none" stroke="#874BFD" strokeWidth={1.5} markerEnd="url(#arrowhead-purple)" />
        <rect x={(p_browse.x + p_settings.x) / 2 - 22} y={p_settings.y - 110} width={44} height={20} rx={4} fill="#FBF8F3" stroke="#874BFD" />
        <text x={(p_browse.x + p_settings.x) / 2} y={p_settings.y - 96} fontFamily="JetBrains Mono, monospace" fontSize={11} fontWeight={600} fill="#874BFD" textAnchor="middle">,</text>
        <text x={(p_browse.x + p_settings.x) / 2} y={p_settings.y - 80} fontFamily="ui-sans-serif" fontSize={10} fill="#874BFD" textAnchor="middle">settings</text>

        {/* Failure path: splash → error */}
        <Arrow from={bot(p_splash.x, p_splash.y)} to={top(p_error.x, p_error.y)} label="net fail" color="#C24A3A" />
        <path d={`M ${p_error.x + thumbW + 4} ${p_error.y + thumbH / 2}
                  Q ${(p_error.x + p_browse.x) / 2} ${p_error.y + thumbH / 2 - 200},
                    ${p_browse.x + thumbW / 2 - 30} ${p_browse.y + thumbH + 4}`}
              fill="none" stroke="#C24A3A" strokeWidth={1.5} markerEnd="url(#arrowhead-red)" strokeDasharray="5 4" />
        <rect x={(p_error.x + p_browse.x) / 2 - 30} y={p_error.y + thumbH / 2 - 180} width={60} height={20} rx={4} fill="#FBF8F3" stroke="#C24A3A" />
        <text x={(p_error.x + p_browse.x) / 2} y={p_error.y + thumbH / 2 - 166} fontFamily="JetBrains Mono, monospace" fontSize={11} fontWeight={600} fill="#C24A3A" textAnchor="middle">r retry</text>
        <text x={(p_error.x + p_browse.x) / 2} y={p_error.y + thumbH / 2 - 150} fontFamily="ui-sans-serif" fontSize={10} fill="#C24A3A" textAnchor="middle">or c cached</text>
      </svg>

      {/* Legend */}
      <Legend />

      {/* Walkthrough captions on the side */}
      <Walkthrough />
    </div>
  );
}

function RowLabel({ y, text, color }) {
  return (
    <div style={{
      position: "absolute", left: 16, top: y - 8,
      writingMode: "vertical-rl", transform: "rotate(180deg)",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: 10, fontWeight: 700, letterSpacing: 3,
      color, textTransform: "uppercase",
    }}>{text}</div>
  );
}

function Legend() {
  const items = [
    { color: "#1F8A5B", text: "Happy path — what most users do" },
    { color: "#874BFD", text: "Branches — optional side trips" },
    { color: "#C24A3A", text: "Failure / recovery" },
    { color: "#3A3A40", text: "Esc / cancel — return to previous state", dashed: true },
  ];
  return (
    <div style={{
      position: "absolute", left: 40, bottom: 28, right: 40,
      display: "flex", gap: 28, fontSize: 12, color: "#1A1A1F",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      paddingTop: 16, borderTop: "1px solid #E6DECF",
    }}>
      <div style={{ fontWeight: 700, color: "#8A7A55", letterSpacing: 1.5, textTransform: "uppercase", fontSize: 10 }}>Legend</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={32} height={10}>
            <line x1={0} y1={5} x2={30} y2={5} stroke={it.color} strokeWidth={2}
              strokeDasharray={it.dashed ? "4 3" : undefined} />
            <path d="M 24 1 L 30 5 L 24 9 Z" fill={it.color} />
          </svg>
          <span>{it.text}</span>
        </div>
      ))}
    </div>
  );
}

function Walkthrough() {
  const steps = [
    ["①", "Launch", "Run thmbwal. The splash fetches the RSS feed, parses the months, and detects your display resolution. Auto-advances when ready (usually <1s)."],
    ["②", "Browse", "Land on the contact sheet — every month visible as an ASCII-art card. Move with h/j/k/l. The focused card grows a halo + month tab; the detail strip below it updates as you go."],
    ["③", "Pick", "Press ↵ to open the resolution picker — sizes are grouped by aspect ratio (16:9, ultrawide, 16:10, mobile). Your display's match is highlighted with a green ●."],
    ["④", "Download", "Press ↵ again to confirm. The picker dismisses, a download toast slides into the header, and you're back on the grid — you can keep browsing while the file lands in ~/Pictures."],
    ["⑤", "Done", "Toast disappears on completion. The downloaded card now wears a green ● badge so you can tell at a glance which months you've already pulled."],
  ];
  return (
    <div style={{
      position: "absolute", right: 60, top: 920, width: 460,
      background: "#FFFFFF", border: "1px solid #E6DECF", borderRadius: 8,
      padding: "20px 24px",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#8A7A55", textTransform: "uppercase", marginBottom: 12 }}>walkthrough · the happy path</div>
      {steps.map(([n, title, desc], i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 999,
            background: "#1F8A5B", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>{n}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1F" }}>{title}</div>
            <div style={{ fontSize: 12, color: "#3A3A40", lineHeight: 1.5, marginTop: 2, textWrap: "pretty" }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { UserFlow });
