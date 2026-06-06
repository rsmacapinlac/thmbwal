// variations.jsx — The four main-browser variations
// Each exports a React component rendering a complete Term frame.
// Window content area: 120 cols × 34 rows = 960×578px.

const { Term, Row, Span, Box, BOX, StatusBar, AsciiArt, KittyPreview, useTheme, CELL_W, CELL_H } = window;

// Shared wallpaper data — same set across variations so users can compare apples-to-apples
const WALLPAPERS = [
  { m: "Dec 2024", title: "Window of Christmas",        author: "Chiara Faes",     downloaded: true,  art: "window", tone: "warm",   resCount: 18 },
  { m: "Nov 2024", title: "Autumn Library",             author: "PopArt Studio",   downloaded: false, art: "leaves", tone: "warm",   resCount: 22 },
  { m: "Oct 2024", title: "Night Walk",                 author: "Ricardo Gimenes", downloaded: false, art: "city",   tone: "cool",   resCount: 24 },
  { m: "Sep 2024", title: "Listening to Leaves Fall",   author: "Cerb. Studios",   downloaded: true,  art: "leaves", tone: "forest", resCount: 20 },
  { m: "Aug 2024", title: "Cosmic Dance",               author: "LibraFire Team",  downloaded: false, art: "cosmic", tone: "plum",   resCount: 22 },
  { m: "Jul 2024", title: "Sunset Tides",               author: "Color Mean",      downloaded: false, art: "waves",  tone: "warm",   resCount: 24 },
  { m: "Jun 2024", title: "Solstice Bloom",             author: "Vlad Gerasimov",  downloaded: false, art: "leaves", tone: "forest", resCount: 20 },
  { m: "May 2024", title: "Pebble Garden",              author: "Skyform Lab",     downloaded: true,  art: "waves",  tone: "cool",   resCount: 18 },
];

const RES = [
  ["320×480",   "iPhone 4"],
  ["640×480",   "VGA"],
  ["800×600",   "SVGA"],
  ["1024×768",  "XGA"],
  ["1152×864",  ""],
  ["1280×720",  "HD"],
  ["1280×800",  "WXGA"],
  ["1280×960",  ""],
  ["1366×768",  ""],
  ["1440×900",  ""],
  ["1600×1200", "UXGA"],
  ["1680×1050", "WSXGA+"],
  ["1920×1080", "FHD"],
  ["1920×1200", "WUXGA"],
  ["2560×1440", "QHD"],
  ["2560×1600", "WQXGA"],
  ["3440×1440", "UWQHD"],
  ["3840×2160", "4K UHD"],
  ["5120×1440", "DQHD"],
  ["5120×2880", "5K"],
];

// Detected resolution we highlight as the match
const DETECTED = "2560×1440";

// --- Variation A — Two-pane (conventional, lazygit / gh-dash inspired) -------
function VariationA({ theme = "charm" }) {
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — Smashing wallpapers">
      <HeaderBar theme={theme} crumbs={["Browse", "Dec 2024"]} count={"8 months · 168 wallpapers"} />

      {/* LEFT — list pane */}
      <PaneBorder x={0} y={3} w={38} h={28} title="Months" hi={0} />
      {WALLPAPERS.map((w, i) => <ListRow key={i} y={5 + i * 3} item={w} active={i === 0} />)}

      {/* RIGHT — details pane */}
      <PaneBorder x={38} y={3} w={82} h={28} title="Preview" />
      <PreviewBlock x={40} y={5} w={48} h={18} item={WALLPAPERS[0]} />

      <DetailsBlock x={90} y={5} item={WALLPAPERS[0]} />

      {/* Footer / status */}
      <FooterBar y={32} />
    </Term>
  );
}

// ---------- Shared little chrome bits ----------------------------------------

function HeaderBar({ crumbs = [], count = "" }) {
  const t = useTheme();
  return (
    <>
      <Row y={0} x={1}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> thmbwal </Span>
        <Span fg={t.dim}>· smashingmagazine.com/category/wallpapers</Span>
      </Row>
      <Row y={1} x={1}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Span fg={t.dim}> › </Span>}
            <Span fg={i === crumbs.length - 1 ? t.secondary : t.subtle}>{c}</Span>
          </React.Fragment>
        ))}
        <Span fg={t.dim}>{" ".repeat(Math.max(1, 80 - crumbs.join(" › ").length))}{count}</Span>
      </Row>
      <Row y={2} x={0}>
        <Span fg={t.border}>{"─".repeat(120)}</Span>
      </Row>
    </>
  );
}

function PaneBorder({ x, y, w, h, title, hi = false }) {
  const t = useTheme();
  return <Box x={x} y={y} w={w} h={h} color={hi ? t.primary : t.border} title={title} titleColor={hi ? t.primary : t.subtle} />;
}

function ListRow({ y, item, active }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={2}>
        <Span fg={active ? t.primary : t.dim}>{active ? "▌" : " "}</Span>
        <Span fg={active ? t.text : t.subtle} bold={active}>  {item.m}</Span>
        <Span fg={item.downloaded ? t.accent : t.dim}>{item.downloaded ? "  ●" : "  ○"}</Span>
      </Row>
      <Row y={y + 1} x={2}>
        <Span fg={t.dim}>     </Span>
        <Span fg={active ? t.subtle : t.dim}>{item.title.slice(0, 28)}</Span>
      </Row>
    </>
  );
}

function PreviewBlock({ x, y, w, h, item }) {
  const t = useTheme();
  return (
    <>
      <KittyPreview x={x} y={y} w={w} h={h} tone={item.tone} label="kitty graphics protocol" />
      {/* ASCII fallback overlay note */}
      <Row y={y + h + 1} x={x}>
        <Span fg={t.dim}>↳ </Span>
        <Span fg={t.subtle}>ascii fallback ready</Span>
        <Span fg={t.dim}> · press </Span>
        <Span fg={t.info} bold>a</Span>
        <Span fg={t.dim}> to toggle</Span>
      </Row>
    </>
  );
}

function DetailsBlock({ x, y, item }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={x}>
        <Span fg={t.text} bold>{item.title}</Span>
      </Row>
      <Row y={y + 1} x={x}>
        <Span fg={t.dim}>by </Span>
        <Span fg={t.subtle}>{item.author}</Span>
      </Row>
      <Row y={y + 2} x={x}>
        <Span fg={t.dim}>{item.m}  ·  {item.resCount} resolutions</Span>
      </Row>

      <Row y={y + 4} x={x}>
        <Span fg={t.secondary} bold>Resolutions</Span>
      </Row>
      <Row y={y + 5} x={x}>
        <Span fg={t.dim}>───────────────────────────</Span>
      </Row>
      {RES.slice(0, 16).map((r, i) => {
        const matched = r[0] === DETECTED;
        return (
          <Row key={i} y={y + 6 + i} x={x}>
            <Span fg={matched ? t.accent : t.dim}>{matched ? "▶ " : "  "}</Span>
            <Span fg={matched ? t.text : t.subtle} bold={matched}>{r[0].padEnd(11)}</Span>
            <Span fg={matched ? t.accent : t.dim}>{r[1].padEnd(8)}</Span>
            {matched && <Span fg={t.accent}> ← your display</Span>}
          </Row>
        );
      })}
    </>
  );
}

function FooterBar({ y }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={0}>
        <Span fg={t.border}>{"─".repeat(120)}</Span>
      </Row>
      <Row y={y + 1} x={0}>
        <Span fg={t.bg} bg={t.primary} bold>{" NORMAL "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  j/k move "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ↵ pick resolution "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  d download "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  / filter "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  a ascii "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  , settings "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ? help "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  q quit "}</Span>
      </Row>
    </>
  );
}

// --- Variation B — Contact sheet grid ----------------------------------------
// All wallpapers as a grid of small ASCII-art cards. Selected card has a halo.
function VariationB({ theme = "charm" }) {
  const t = THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — contact sheet">
      <HeaderBar crumbs={["Contact sheet"]} count="168 wallpapers · 8 months" />
      {WALLPAPERS.map((w, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return <ContactCard key={i} x={2 + col * 29} y={4 + row * 13} item={w} active={i === 1} />;
      })}
      <FooterBar y={32} />
    </Term>
  );
}

function ContactCard({ x, y, item, active }) {
  const t = useTheme();
  const color = active ? t.primary : t.border;
  return (
    <>
      <Box x={x} y={y} w={28} h={12} color={color} kind="round" />
      <AsciiArt x={x + 1} y={y + 1} pattern={item.art} color={active ? t.text : t.subtle} w={26} h={8} />
      <Row y={y + 9} x={x + 2}>
        <Span fg={active ? t.text : t.subtle} bold>{item.title.slice(0, 24)}</Span>
      </Row>
      <Row y={y + 10} x={x + 2}>
        <Span fg={t.dim}>{item.m}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.dim}>{item.resCount} res</Span>
        {item.downloaded && <Span fg={t.accent}>  ●</Span>}
      </Row>
      {active && (
        <Row y={y} x={x + 1}>
          <Span fg={t.primary} bold>{` ${item.m} `}</Span>
        </Row>
      )}
    </>
  );
}

// --- Variation C — Magazine spread (full-bleed editorial) --------------------
function VariationC({ theme = "charm" }) {
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — spread view">
      <MagazineSpread item={WALLPAPERS[4]} idx={5} total={8} />
    </Term>
  );
}

function MagazineSpread({ item, idx, total }) {
  const t = useTheme();
  return (
    <>
      {/* Full-bleed kitty preview taking the left two-thirds */}
      <KittyPreview x={0} y={0} w={74} h={32} tone={item.tone} label="" />
      <AsciiArt x={2} y={2} pattern={item.art} color="rgba(255,255,255,0.85)" />

      {/* Right column — editorial typography */}
      <Row y={1} x={76}>
        <Span fg={t.primary} bold>━━━━━━</Span>
        <Span fg={t.dim}>  ISSUE {String(idx).padStart(2, "0")} / {String(total).padStart(2, "0")}</Span>
      </Row>
      <Row y={3} x={76}>
        <Span fg={t.dim}>{item.m.toUpperCase()}</Span>
      </Row>

      {/* Big title — split across two lines for drama */}
      <Row y={5} x={76}>
        <Span fg={t.text} bold style={{ fontSize: 22, letterSpacing: -0.5, lineHeight: "26px" }}>{item.title.split(" ")[0]}</Span>
      </Row>
      <Row y={7} x={76}>
        <Span fg={t.text} bold style={{ fontSize: 22, letterSpacing: -0.5, lineHeight: "26px" }}>{item.title.split(" ").slice(1).join(" ")}</Span>
      </Row>

      <Row y={11} x={76}>
        <Span fg={t.subtle}>by </Span>
        <Span fg={t.secondary} italic>{item.author}</Span>
      </Row>
      <Row y={12} x={76}>
        <Span fg={t.dim}>{item.resCount} resolutions available</Span>
      </Row>

      <Row y={15} x={76}>
        <Span fg={t.dim}>YOUR DISPLAY</Span>
      </Row>
      <Row y={16} x={76}>
        <Span fg={t.accent} bold style={{ fontSize: 18 }}>{DETECTED}</Span>
      </Row>
      <Row y={17} x={76}>
        <Span fg={t.dim}>QHD · 16:9</Span>
      </Row>

      <Row y={20} x={76}>
        <Span fg={t.bg} bg={t.primary} bold>{`  ↵  DOWNLOAD  `}</Span>
      </Row>
      <Row y={21} x={76}>
        <Span fg={t.dim}>  saves to ~/Pictures</Span>
      </Row>

      <Row y={23} x={76}>
        <Span fg={t.dim}>OTHER RESOLUTIONS</Span>
      </Row>
      <Row y={24} x={76}>
        <Span fg={t.subtle}>r </Span>
        <Span fg={t.dim}>browse all 22 sizes</Span>
      </Row>

      {/* Navigator dots */}
      <Row y={28} x={76}>
        {Array.from({ length: total }).map((_, i) => (
          <Span key={i} fg={i === idx - 1 ? t.primary : t.dim}>{i === idx - 1 ? "●" : "·"} </Span>
        ))}
      </Row>
      <Row y={29} x={76}>
        <Span fg={t.dim}>h/l prev/next  ·  g grid  ·  q quit</Span>
      </Row>

      {/* Vignette edge between image and text */}
      <div style={{
        position: "absolute", left: 74 * CELL_W, top: 0, bottom: 0, width: 2 * CELL_W,
        background: `linear-gradient(90deg, rgba(0,0,0,0.6), transparent)`,
        pointerEvents: "none",
      }} />
    </>
  );
}

// --- Variation D — Film strip / timeline -------------------------------------
function VariationD({ theme = "charm" }) {
  const t = THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — timeline">
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> 2024</Span>
        <Span fg={t.dim}>  archive of smashingmagazine wallpapers, by month</Span>
      </Row>

      {/* Filmstrip — horizontal scroll of months */}
      <FilmStrip y={3} active={3} />

      {/* Big preview area for the focused month */}
      <BigPreview y={13} item={WALLPAPERS[3]} />

      <FooterBar y={32} />
    </Term>
  );
}

function FilmStrip({ y, active }) {
  const t = useTheme();
  // Render film perforations top + bottom around a row of thumbnails
  return (
    <>
      {/* Top perforations */}
      <Row y={y} x={0}>
        <Span fg={t.dim}>{"  ▢   ".repeat(20)}</Span>
      </Row>

      {/* Thumbnails strip */}
      {WALLPAPERS.map((w, i) => {
        const cw = 14;
        const x = 2 + i * cw;
        const isActive = i === active;
        return (
          <React.Fragment key={i}>
            <KittyPreview x={x} y={y + 1} w={cw - 1} h={5} tone={w.tone} label="" />
            {isActive && <Box x={x - 1} y={y} w={cw + 1} h={8} color={t.primary} kind="sharp" />}
            <Row y={y + 6} x={x}>
              <Span fg={isActive ? t.text : t.subtle} bold={isActive}>{w.m}</Span>
            </Row>
            <Row y={y + 7} x={x}>
              <Span fg={t.dim}>{w.title.slice(0, 12)}</Span>
            </Row>
          </React.Fragment>
        );
      })}

      {/* Bottom perforations */}
      <Row y={y + 8} x={0}>
        <Span fg={t.dim}>{"  ▢   ".repeat(20)}</Span>
      </Row>
    </>
  );
}

function BigPreview({ y, item }) {
  const t = useTheme();
  return (
    <>
      {/* Big ASCII preview on the left */}
      <Box x={0} y={y} w={50} h={18} color={t.border} kind="round" title="preview · ascii"/>
      <AsciiArt x={6} y={y + 1} pattern={item.art} color={t.subtle} />

      {/* Right side — metadata + resolutions */}
      <Row y={y + 1} x={52}>
        <Span fg={t.dim}>NOW SHOWING</Span>
      </Row>
      <Row y={y + 2} x={52}>
        <Span fg={t.text} bold style={{ fontSize: 16 }}>{item.title}</Span>
      </Row>
      <Row y={y + 4} x={52}>
        <Span fg={t.subtle}>by </Span>
        <Span fg={t.secondary}>{item.author}</Span>
      </Row>
      <Row y={y + 5} x={52}>
        <Span fg={t.dim}>{item.m}  ·  {item.resCount} resolutions</Span>
      </Row>

      <Row y={y + 7} x={52}>
        <Span fg={t.dim}>──────────────────────────────────────────────────────────────</Span>
      </Row>

      <Row y={y + 8} x={52}>
        <Span fg={t.secondary} bold>YOUR DISPLAY</Span>
        <Span fg={t.dim}>     auto-detected</Span>
      </Row>
      <Row y={y + 9} x={52}>
        <Span fg={t.accent} bold>▶ 2560×1440  </Span>
        <Span fg={t.dim}>QHD · 27" iMac</Span>
      </Row>
      <Row y={y + 10} x={52}>
        <Span fg={t.dim}>  ↵ download — saves to ~/Pictures</Span>
      </Row>

      <Row y={y + 12} x={52}>
        <Span fg={t.dim}>NEARBY SIZES</Span>
      </Row>
      <Row y={y + 13} x={52}>
        <Span fg={t.subtle}>  1920×1080</Span>
        <Span fg={t.dim}>   FHD</Span>
        <Span fg={t.subtle}>      3440×1440</Span>
        <Span fg={t.dim}>   UWQHD</Span>
      </Row>
      <Row y={y + 14} x={52}>
        <Span fg={t.subtle}>  2560×1600</Span>
        <Span fg={t.dim}>   WQXGA</Span>
        <Span fg={t.subtle}>     3840×2160</Span>
        <Span fg={t.dim}>   4K UHD</Span>
      </Row>

      <Row y={y + 16} x={52}>
        <Span fg={t.dim}>r </Span>
        <Span fg={t.subtle}>all resolutions</Span>
        <Span fg={t.dim}>   h/l </Span>
        <Span fg={t.subtle}>prev / next</Span>
      </Row>
    </>
  );
}

Object.assign(window, { VariationA, VariationB, VariationC, VariationD, WALLPAPERS, RES, DETECTED });
