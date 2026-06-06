// contact-sheet.jsx — Refined contact-sheet variation
// Selection model: halo on the focused card + a detail strip BELOW the grid
// (the "light-table" model — the strip shows full title, author, res count,
// matching-display info, and the next action).
// Navigation: h/j/k/l 2D grid (vim/lazygit).
// Filter: slash-prompt at the very bottom, vim-style. Non-matching cards dim.
// Three densities: compact 80×28 (2×2), standard 120×34 (4×2), wide 160×42 (6×3).

const { Term, Row, Span, Box, BOX, AsciiArt, KittyPreview, useTheme, THEMES, CELL_W, CELL_H, FONT, ASCII, WALLPAPERS } = window;

// Extra wallpapers for the wide grid (needs 18)
const WALLPAPERS_18 = [
  ...WALLPAPERS,
  { m: "Apr 2024", title: "Spring Awakening",         author: "Studio Mecho",   downloaded: false, art: "leaves", tone: "forest", resCount: 22 },
  { m: "Mar 2024", title: "Coffee & Code",            author: "Lívia Lénárt",   downloaded: false, art: "waves",  tone: "warm",   resCount: 18 },
  { m: "Feb 2024", title: "Polar Light",              author: "Iulia Manea",    downloaded: true,  art: "waves",  tone: "cool",   resCount: 24 },
  { m: "Jan 2024", title: "Hello, 2024",              author: "Ricardo Gimenes",downloaded: true,  art: "cosmic", tone: "plum",   resCount: 22 },
  { m: "Dec 2023", title: "Frostbloom",               author: "Vlad Gerasimov", downloaded: false, art: "leaves", tone: "cool",   resCount: 24 },
  { m: "Nov 2023", title: "Migrations",               author: "PopArt Studio",  downloaded: false, art: "city",   tone: "warm",   resCount: 20 },
  { m: "Oct 2023", title: "Night Market",             author: "Chiara Faes",    downloaded: false, art: "city",   tone: "cool",   resCount: 24 },
  { m: "Sep 2023", title: "Last Tide",                author: "Color Mean",     downloaded: false, art: "waves",  tone: "warm",   resCount: 22 },
  { m: "Aug 2023", title: "Botanical Hours",          author: "Skyform Lab",    downloaded: false, art: "leaves", tone: "forest", resCount: 20 },
  { m: "Jul 2023", title: "Quiet Afternoon",          author: "Lívia Lénárt",   downloaded: false, art: "waves",  tone: "warm",   resCount: 18 },
];

// --- A single card -----------------------------------------------------------
// w, h are in terminal cells. Card draws a rounded border, an ASCII art preview
// in the top region, then 3 rows of metadata. Active cards get a primary halo
// and a small month "tab" along the top edge. Dimmed cards are filter misses.
function Card({ x, y, w, h, item, active = false, dimmed = false, ascii = "art" }) {
  const t = useTheme();
  const borderColor = active ? t.primary : t.border;
  const titleColor = dimmed ? t.dim : (active ? t.text : t.subtle);
  const subColor   = dimmed ? t.dim : (active ? t.subtle : t.dim);
  const opacity = dimmed ? 0.32 : 1;

  // Preview area takes (h - 5) rows: 1 top border, h-5 ascii, 1 sep, 3 meta, 1 bottom
  const previewH = h - 5;
  const previewW = w - 2;
  const truncTitle = item.title.length > w - 4 ? item.title.slice(0, w - 5) + "…" : item.title;
  const truncAuthor = ("by " + item.author).length > w - 4
    ? ("by " + item.author).slice(0, w - 5) + "…"
    : "by " + item.author;
  const meta = `${item.m}  ·  ${item.resCount} res`;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <Box x={x} y={y} w={w} h={h} color={borderColor} kind="round" />

      {/* Preview: ascii or kitty mock */}
      {ascii === "art"
        ? <AsciiArt x={x + 1} y={y + 1} pattern={item.art} color={active ? t.text : t.subtle} w={previewW} h={previewH} />
        : <KittyPreview x={x + 1} y={y + 1} w={previewW} h={previewH} tone={item.tone} label="" />
      }

      {/* Soft separator between preview and meta */}
      <Row y={y + previewH + 1} x={x}>
        <Span fg={borderColor}>├</Span>
        <Span fg={borderColor}>{"─".repeat(w - 2)}</Span>
        <Span fg={borderColor}>┤</Span>
      </Row>

      {/* Meta rows */}
      <Row y={y + previewH + 2} x={x + 2}>
        <Span fg={titleColor} bold>{truncTitle}</Span>
        {item.downloaded && <Span fg={t.accent}>  ●</Span>}
      </Row>
      <Row y={y + previewH + 3} x={x + 2}>
        <Span fg={subColor} italic>{truncAuthor}</Span>
      </Row>
      <Row y={y + previewH + 4} x={x + 2}>
        <Span fg={t.dim}>{item.m}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={active ? t.secondary : t.dim} bold={active}>{item.resCount} res</Span>
      </Row>

      {/* Active "tab" — embedded into the top border, like a folder tab */}
      {active && (
        <Row y={y} x={x + 2}>
          <Span fg={t.bg} bg={t.primary} bold>{` ${item.m} `}</Span>
        </Row>
      )}
    </div>
  );
}

// --- Header bar shared by contact-sheet states -------------------------------
function CSHeader({ y = 1, crumbs = ["Contact sheet"], count = "168 wallpapers · 8 months", width = 120 }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> thmbwal </Span>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <Span fg={t.dim}> › </Span>
            <Span fg={i === crumbs.length - 1 ? t.secondary : t.subtle}>{c}</Span>
          </React.Fragment>
        ))}
        <Span fg={t.dim}>{" ".repeat(Math.max(1, width - 14 - crumbs.join(" › ").length - count.length - 4))}</Span>
        <Span fg={t.dim}>{count}</Span>
      </Row>
      <Row y={y + 1} x={0}>
        <Span fg={t.border}>{"─".repeat(width)}</Span>
      </Row>
    </>
  );
}

// --- The light-table detail strip --------------------------------------------
// Sits below the grid, ~4 rows tall, full width minus 4. Shows the active
// wallpaper's full metadata + a primary CTA + the auto-detected resolution.
function DetailStrip({ y, item, width = 120, detected = "2560×1440" }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={0}>
        <Span fg={t.border}>{"─".repeat(width)}</Span>
      </Row>
      <Row y={y + 1} x={2}>
        <Span fg={t.dim}>FOCUSED</Span>
        <Span fg={t.dim}>   </Span>
        <Span fg={t.text} bold>{item.title}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.subtle} italic>by {item.author}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.subtle}>{item.m}</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.secondary}>{item.resCount} resolutions</Span>
        {item.downloaded && (<>
          <Span fg={t.dim}>  ·  </Span>
          <Span fg={t.accent}>● downloaded</Span>
        </>)}
      </Row>
      <Row y={y + 2} x={2}>
        <Span fg={t.bg} bg={t.primary} bold>{`  ↵  pick resolution  `}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{`  d  quick: ${detected}  `}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{`  o  open in finder  `}</Span>
        <Span fg={t.dim}>     match for your display: </Span>
        <Span fg={t.accent} bold>● {detected}</Span>
      </Row>
    </>
  );
}

// --- Footer status bar -------------------------------------------------------
function CSFooter({ y, width = 120, mode = "GRID" }) {
  const t = useTheme();
  const accent = mode === "FILTER" ? t.warn : t.primary;
  const keys = mode === "FILTER"
    ? [["↵", "apply"], ["esc", "clear"], ["tab", "complete"]]
    : [["h j k l", "navigate"], ["↵", "pick"], ["d", "download"], ["/", "filter"], [".", "settings"], ["?", "help"], ["q", "quit"]];
  return (
    <Row y={y} x={0}>
      <Span fg={t.bg} bg={accent} bold>{` ${mode} `}</Span>
      {keys.map(([k, l], i) => (
        <Span key={i} fg={t.subtle} bg={t.surface2}>{`  ${k} ${l}  `}</Span>
      ))}
    </Row>
  );
}

// --- Compute card geometry for a given density --------------------------------
function gridGeom({ width, cols, padX = 2, gutter = 1 }) {
  const inner = width - 2 * padX;
  const cardW = Math.floor((inner - gutter * (cols - 1)) / cols);
  return { cardW, padX, gutter };
}

// --- The main contact-sheet renderer (re-used by every state) -----------------
function ContactGrid({ width, height, theme, cols, rows, cardH, active, filter, hideDetail, hideHeader, dimSet, items = WALLPAPERS, headerCrumbs, headerCount }) {
  const t = THEMES[theme];
  const { cardW, padX, gutter } = gridGeom({ width, cols });
  const gridStartY = hideHeader ? 1 : 3;

  return (
    <>
      {!hideHeader && <CSHeader y={1} width={width} crumbs={headerCrumbs || ["Contact sheet"]} count={headerCount || `${items.length} months shown`} />}

      {items.slice(0, cols * rows).map((w, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = padX + c * (cardW + gutter);
        const y = gridStartY + r * (cardH + 1);
        const isDimmed = dimSet ? !dimSet.includes(i) : false;
        return (
          <Card
            key={i}
            x={x} y={y} w={cardW} h={cardH}
            item={w}
            active={i === active && !isDimmed}
            dimmed={isDimmed}
          />
        );
      })}
    </>
  );
}

// ============================================================================
// Variants
// ============================================================================

// Standard 120×34, default browse, with detail strip
function CS_Default({ theme = "charm", active = 1 }) {
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — contact sheet">
      <ContactGrid width={120} height={34} theme={theme} cols={4} rows={2} cardH={13} active={active}
        items={WALLPAPERS} headerCount={`${WALLPAPERS.length} months · ${WALLPAPERS.reduce((s,w)=>s+w.resCount,0)} wallpapers`} />
      <DetailStrip y={29} item={WALLPAPERS[active]} width={120} />
      <CSFooter y={33} width={120} />
    </Term>
  );
}

// Compact 80×28 — 2×2 cards, no detail strip (just inline meta)
function CS_Compact({ theme = "charm", active = 0 }) {
  return (
    <Term cols={80} rows={28} theme={theme} title="thmbwal — compact 80×28">
      <ContactGrid width={80} height={28} theme={theme} cols={2} rows={2} cardH={11} active={active} items={WALLPAPERS.slice(0, 4)}
        headerCount="4 of 8 months · h/l pages" />
      <DetailStrip y={25} item={WALLPAPERS[active]} width={80} />
    </Term>
  );
}

// Wide 160×42 — 6×3 cards
function CS_Wide({ theme = "charm", active = 7 }) {
  return (
    <Term cols={160} rows={42} theme={theme} title="thmbwal — wide 160×42">
      <ContactGrid width={160} height={42} theme={theme} cols={6} rows={3} cardH={11} active={active}
        items={WALLPAPERS_18}
        headerCount={`${WALLPAPERS_18.length} months · ${WALLPAPERS_18.reduce((s,w)=>s+w.resCount,0)} wallpapers`} />
      <DetailStrip y={37} item={WALLPAPERS_18[active]} width={160} />
      <CSFooter y={41} width={160} />
    </Term>
  );
}

// With filter active — slash prompt at bottom, non-matching cards dimmed
function CS_Filter({ theme = "charm" }) {
  const t = THEMES[theme];
  // Filter: "winter" — pretend matches 0 (Window of Christmas) and 4 (Cosmic Dance)
  // because those have wintery vibe? For demo, mark a few as matches.
  // Let's filter on "autumn" -> matches 1 (Autumn Library), 3 (Listening to Leaves Fall), 6 (Solstice Bloom)
  const matches = [1, 3, 6];
  const active = 1;
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — /filter">
      <ContactGrid width={120} height={34} theme={theme} cols={4} rows={2} cardH={13} active={active} items={WALLPAPERS}
        dimSet={matches}
        headerCrumbs={["Contact sheet", "filter"]}
        headerCount={`${matches.length} of ${WALLPAPERS.length} match · 60 wallpapers`} />
      <DetailStrip y={29} item={WALLPAPERS[active]} width={120} />
      {/* Vim-style slash prompt at very bottom */}
      <Row y={33} x={0}>
        <Span fg={t.bg} bg={t.warn} bold>{" /FILTER "}</Span>
        <Span fg={t.warn}> /</Span>
        <Span fg={t.text}>autumn</Span>
        <Span fg={t.primary} style={{ animation: "none" }}>▎</Span>
        <Span fg={t.dim}>     try: </Span>
        <Span fg={t.subtle}>autumn </Span>
        <Span fg={t.dim}>· </Span>
        <Span fg={t.subtle}>cosmic </Span>
        <Span fg={t.dim}>· </Span>
        <Span fg={t.subtle}>2024 </Span>
        <Span fg={t.dim}>· </Span>
        <Span fg={t.subtle}>4k</Span>
      </Row>
    </Term>
  );
}

// With download-in-flight — toast strip at top + small badge on active card
function CS_Downloading({ theme = "charm" }) {
  const t = THEMES[theme];
  const active = 1;
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — downloading">
      {/* Replace the header bar with a download toast bar */}
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> thmbwal</Span>
        <Span fg={t.dim}> › </Span>
        <Span fg={t.subtle}>Contact sheet</Span>
        <Span fg={t.dim}>{"     "}</Span>
        <Span fg={t.bg} bg={t.accent} bold>{` ⤓ downloading `}</Span>
        <Span fg={t.subtle}>  Autumn Library · 2560×1440 · </Span>
        <Span fg={t.accent} bold>62%</Span>
        <Span fg={t.dim}>  ▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱  </Span>
        <Span fg={t.dim}>eta 0:04 · 2.1 MB/s</Span>
      </Row>
      <Row y={2} x={0}><Span fg={t.border}>{"─".repeat(120)}</Span></Row>

      <ContactGrid width={120} height={34} theme={theme} cols={4} rows={2} cardH={13} active={active} items={WALLPAPERS}
        hideHeader headerCount="" />

      <DetailStrip y={29} item={WALLPAPERS[active]} width={120} />
      <CSFooter y={33} width={120} />
    </Term>
  );
}

// With picker overlay (modal) — the grid behind dims slightly
function CS_Picker({ theme = "charm" }) {
  const t = THEMES[theme];
  const active = 1;
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — pick resolution">
      <div style={{ opacity: 0.28 }}>
        <ContactGrid width={120} height={34} theme={theme} cols={4} rows={2} cardH={13} active={active} items={WALLPAPERS} />
      </div>
      {/* Dim wash */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7))`,
        pointerEvents: "none",
      }} />

      {/* Modal */}
      <Box x={26} y={5} w={68} h={24} color={t.primary} kind="round" fill={t.surface} />
      <Row y={5} x={29}>
        <Span fg={t.border}>─</Span>
        <Span fg={t.primary} bold> Pick a resolution </Span>
        <Span fg={t.border}>─</Span>
      </Row>
      <Row y={7} x={29}>
        <Span fg={t.text} bold>{WALLPAPERS[active].title}</Span>
      </Row>
      <Row y={8} x={29}>
        <Span fg={t.dim}>by {WALLPAPERS[active].author} · {WALLPAPERS[active].m} · {WALLPAPERS[active].resCount} resolutions</Span>
      </Row>

      <Row y={10} x={29}><Span fg={t.secondary} bold>16:9 widescreen</Span></Row>
      <Row y={11} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1280×720    HD</Span></Row>
      <Row y={12} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1920×1080   FHD</Span></Row>
      <Row y={13} x={29}><Span fg={t.accent} bold>● 2560×1440</Span><Span fg={t.accent}>   QHD</Span><Span fg={t.dim}>   ← your display</Span></Row>
      <Row y={14} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>3840×2160   4K UHD</Span></Row>

      <Row y={10} x={62}><Span fg={t.secondary} bold>ultrawide</Span></Row>
      <Row y={11} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>2560×1080   UW</Span></Row>
      <Row y={12} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>3440×1440   UWQHD</Span></Row>
      <Row y={13} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>5120×1440   DQHD</Span></Row>

      <Row y={16} x={29}><Span fg={t.secondary} bold>16:10</Span></Row>
      <Row y={17} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1280×800    WXGA</Span></Row>
      <Row y={18} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1440×900</Span></Row>
      <Row y={19} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1680×1050   WSXGA+</Span></Row>
      <Row y={20} x={29}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1920×1200   WUXGA</Span></Row>

      <Row y={16} x={62}><Span fg={t.secondary} bold>mobile / tablet</Span></Row>
      <Row y={17} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>320×480     iPhone 4</Span></Row>
      <Row y={18} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>1024×768    iPad</Span></Row>
      <Row y={19} x={62}><Span fg={t.dim}>  </Span><Span fg={t.subtle}>2778×1284   iPhone 13</Span></Row>

      <Row y={22} x={29}><Span fg={t.dim}>{"─".repeat(62)}</Span></Row>
      <Row y={23} x={29}>
        <Span fg={t.bg} bg={t.primary} bold>{` ↵ download `}</Span>
        <Span fg={t.subtle}>  2560×1440 → ~/Pictures/2024-11-autumn-library-2560x1440.png</Span>
      </Row>
      <Row y={25} x={29}>
        <Span fg={t.dim}>esc cancel  ·  j/k move  ·  tab next group  ·  / filter sizes</Span>
      </Row>
    </Term>
  );
}

// No match — like ScreenEmpty but in contact-sheet language
function CS_NoMatch({ theme = "charm" }) {
  const t = THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — no matches">
      <CSHeader y={1} width={120} crumbs={["Contact sheet", "filter"]} count="0 of 8 match" />

      {/* All cards fully dimmed in the grid */}
      <div style={{ opacity: 0.22 }}>
        {WALLPAPERS.map((w, i) => {
          const cardW = 28, gutter = 1;
          const c = i % 4, r = Math.floor(i / 4);
          const x = 2 + c * (cardW + gutter);
          const y = 3 + r * 14;
          return <Card key={i} x={x} y={y} w={cardW} h={13} item={w} dimmed />;
        })}
      </div>

      {/* Empty-state message floating in the middle */}
      <Row y={15} x={45}><Span fg={t.subtle} bold style={{ fontSize: 16 }}>nothing matches "chiaroscuro".</Span></Row>
      <Row y={17} x={42}><Span fg={t.dim}>edit the filter, or press esc to see everything again.</Span></Row>

      {/* Slash prompt at bottom */}
      <Row y={33} x={0}>
        <Span fg={t.bg} bg={t.err} bold>{" /FILTER "}</Span>
        <Span fg={t.err}> /</Span>
        <Span fg={t.text}>chiaroscuro</Span>
        <Span fg={t.primary}>▎</Span>
        <Span fg={t.dim}>     0 matches</Span>
      </Row>
    </Term>
  );
}

// Density variant: 4×2 but with KITTY graphics previews instead of ASCII
// — showing how the same layout looks in a graphics-capable terminal.
function CS_Kitty({ theme = "charm", active = 1 }) {
  const cardW = 28, gutter = 1, cardH = 13;
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — kitty graphics">
      <CSHeader y={1} width={120} crumbs={["Contact sheet", "kitty"]} count="kitty graphics protocol · 168 wallpapers" />
      {WALLPAPERS.map((w, i) => {
        const c = i % 4, r = Math.floor(i / 4);
        const x = 2 + c * (cardW + gutter);
        const y = 3 + r * (cardH + 1);
        return <Card key={i} x={x} y={y} w={cardW} h={cardH} item={w} active={i === active} ascii="kitty" />;
      })}
      <DetailStrip y={29} item={WALLPAPERS[active]} width={120} />
      <CSFooter y={33} width={120} />
    </Term>
  );
}

Object.assign(window, {
  CS_Default, CS_Compact, CS_Wide, CS_Filter, CS_Downloading, CS_Picker, CS_NoMatch, CS_Kitty,
  WALLPAPERS_18, Card,
});
