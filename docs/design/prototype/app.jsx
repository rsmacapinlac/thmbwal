// app.jsx — Assembles the design canvas with all variations and state screens.

const {
  DesignCanvas, DCSection, DCArtboard, DCPostIt,
  Term, Row, Span, Box, useTheme, THEMES, CELL_W, CELL_H, FONT,
  VariationA, VariationB, VariationC, VariationD,
  ScreenSplash, ScreenPicker, ScreenDownload, ScreenSettings, ScreenHelp, ScreenError, ScreenEmpty,
  CS_Default, CS_Compact, CS_Wide, CS_Filter, CS_Downloading, CS_Picker, CS_NoMatch, CS_Kitty,
  UserFlow,
} = window;

// --- Top "design reasoning" intro card ---------------------------------------
function IntroCard() {
  return (
    <div style={{
      width: 960, padding: "36px 44px",
      background: "#FBF8F3",
      border: "1px solid #E6DECF",
      borderRadius: 6,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: "#1A1A1F",
    }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: "#8A7A55", textTransform: "uppercase" }}>thmbwal · design exploration</div>
      <h1 style={{ fontSize: 38, lineHeight: 1.05, margin: "10px 0 14px", letterSpacing: -1, fontWeight: 700, textWrap: "balance" }}>
        Browse, pick, pull.<br/>
        <span style={{ color: "#8A7A55" }}>A TUI for Smashing Magazine wallpapers.</span>
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.55, maxWidth: 720, color: "#3A3A40", margin: "0 0 18px" }}>
        Four directions for the main browser, each rendered as a full terminal frame at 120×34. One is conventional (a lazygit-style two-pane). The other three push the medium — a contact sheet of ASCII-art thumbnails, a magazine spread with big editorial typography, and a horizontal film-strip timeline.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 16 }}>
        <Block t="Themes" v={["Charm default (pink/purple)", "Catppuccin Mocha (mauve/peach)", "Each variation rendered in both"]} />
        <Block t="Previews" v={["Kitty graphics where available", "ASCII art fallback (a key toggles)", "Five hand-crafted patterns"]} />
        <Block t="Interactions assumed" v={["j/k vim navigation", "Auto-detect display resolution", "Highlighted match across all screens"]} />
      </div>
      <div style={{ marginTop: 22, fontSize: 13, color: "#8A7A55", borderTop: "1px solid #E6DECF", paddingTop: 14, lineHeight: 1.6 }}>
        Scroll right →  variations sit side-by-side · double-click any artboard to focus it · the row below covers state screens (splash, resolution picker, downloads, settings, help, error, empty).
      </div>
    </div>
  );
}

function Block({ t, v }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#8A7A55", marginBottom: 8 }}>{t}</div>
      {v.map((x, i) => (
        <div key={i} style={{ fontSize: 14, lineHeight: 1.5, color: "#1A1A1F", display: "flex", gap: 8 }}>
          <span style={{ color: "#C8A050" }}>—</span><span>{x}</span>
        </div>
      ))}
    </div>
  );
}

// --- Theme tokens card -------------------------------------------------------
function ThemeTokens({ theme }) {
  const t = THEMES[theme];
  const swatches = [
    ["bg",        t.bg],
    ["surface",   t.surface],
    ["surface2",  t.surface2],
    ["border",    t.border],
    ["text",      t.text],
    ["subtle",    t.subtle],
    ["dim",       t.dim],
    ["primary",   t.primary],
    ["secondary", t.secondary],
    ["accent",    t.accent],
    ["warn",      t.warn],
    ["info",      t.info],
    ["err",       t.err],
  ];
  return (
    <div style={{
      width: 460, padding: 24,
      background: t.surface, color: t.text,
      border: `1px solid ${t.border}`, borderRadius: 6,
      fontFamily: FONT, fontSize: 12,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
        <span style={{ color: t.primary, fontSize: 18, fontWeight: 700 }}>▌</span>
        <span style={{ color: t.text, fontWeight: 700, fontSize: 16 }}>{t.name}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 18 }}>
        {swatches.map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: 6, background: t.bg, borderRadius: 3 }}>
            <span style={{ width: 18, height: 18, borderRadius: 3, background: c, border: `1px solid ${t.border}` }} />
            <span style={{ color: t.subtle }}>{k}</span>
            <span style={{ color: t.dim, marginLeft: "auto", fontSize: 10 }}>{c}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <div>
          <span style={{ color: t.bg, background: t.primary, padding: "2px 8px", fontWeight: 600 }}>{" NORMAL "}</span>
          <span style={{ color: t.subtle, background: t.surface2, padding: "2px 8px" }}>{"  j/k  "}</span>
          <span style={{ color: t.subtle, background: t.surface2, padding: "2px 8px" }}>{"  ↵ pick  "}</span>
        </div>
        <div style={{ color: t.dim }}>border line · <span style={{ color: t.border }}>───────────────</span></div>
        <div>
          <span style={{ color: t.primary, fontWeight: 700 }}>primary</span>{" · "}
          <span style={{ color: t.secondary, fontWeight: 700 }}>secondary</span>{" · "}
          <span style={{ color: t.accent }}>accent</span>{" · "}
          <span style={{ color: t.warn }}>warn</span>{" · "}
          <span style={{ color: t.err }}>err</span>{" · "}
          <span style={{ color: t.info }}>info</span>
        </div>
        <div style={{ color: t.dim, fontSize: 11 }}>
          Box drawing chars:&nbsp;
          <span style={{ color: t.border }}>╭─╮│╰╯├┤┬┴┼</span>
        </div>
      </div>
    </div>
  );
}

// --- App ---------------------------------------------------------------------
function App() {
  return (
    <DesignCanvas>
      {/* ───────── USER FLOW ───────── */}
      <DCSection id="flow" title="✦ User flow" subtitle="How a user moves through thmbwal — launch to downloaded wallpaper, plus branches and failure recovery. Arrows are labeled with the keystroke that triggers each move.">
        <DCArtboard id="flow-board" label="Wireflow · keystroke-labeled" width={2480} height={1380}>
          <UserFlow />
        </DCArtboard>
      </DCSection>

      {/* ───────── REFINED CONTACT SHEET (chosen direction) ───────── */}
      <DCSection id="csRefined" title="★ Contact sheet — refined" subtitle="Picked direction. Cards now show ASCII preview + title + author + resolution count. Selection: focused card gets a halo + month tab, full detail strip appears below the grid (light-table model). Navigation: h/j/k/l 2D vim grid. Filter: slash-prompt at the bottom. Three densities reflow to terminal width.">
        <DCArtboard id="cs-std-charm" label="Standard · 120×34 · Charm" width={976} height={620}>
          <CS_Default theme="charm" active={1} />
        </DCArtboard>
        <DCArtboard id="cs-std-catp"  label="Standard · 120×34 · Catppuccin" width={976} height={620}>
          <CS_Default theme="catppuccin" active={1} />
        </DCArtboard>
        <DCArtboard id="cs-compact"   label="Compact · 80×28 · narrow terminals" width={660} height={520}>
          <CS_Compact theme="charm" active={0} />
        </DCArtboard>
        <DCArtboard id="cs-wide"      label="Wide · 160×42 · fullscreen / tmux" width={1300} height={760}>
          <CS_Wide theme="charm" active={7} />
        </DCArtboard>
        <DCArtboard id="cs-filter"    label="Filter active · slash prompt" width={976} height={620}>
          <CS_Filter theme="charm" />
        </DCArtboard>
        <DCArtboard id="cs-nomatch"   label="Filter · no matches" width={976} height={620}>
          <CS_NoMatch theme="charm" />
        </DCArtboard>
        <DCArtboard id="cs-downloading" label="Download in flight · toast bar" width={976} height={620}>
          <CS_Downloading theme="charm" />
        </DCArtboard>
        <DCArtboard id="cs-picker"    label="Picker overlay · grouped by aspect" width={976} height={620}>
          <CS_Picker theme="charm" />
        </DCArtboard>
        <DCArtboard id="cs-kitty"     label="Kitty graphics fallback" width={976} height={620}>
          <CS_Kitty theme="charm" active={1} />
        </DCArtboard>
      </DCSection>

      {/* Intro + system tokens */}
      <DCSection id="overview" title="01 — Overview" subtitle="Design reasoning, themes, and shared tokens for thmbwal.">
        <DCArtboard id="intro" label="Brief" width={960} height={420}>
          <IntroCard />
        </DCArtboard>
        <DCArtboard id="theme-charm" label="Theme · Charm" width={460} height={420}>
          <ThemeTokens theme="charm" />
        </DCArtboard>
        <DCArtboard id="theme-catppuccin" label="Theme · Catppuccin" width={460} height={420}>
          <ThemeTokens theme="catppuccin" />
        </DCArtboard>
      </DCSection>

      {/* Variation A */}
      <DCSection id="varA" title="A — Two-pane (conventional)" subtitle="Lazygit/gh-dash idiom. Months on the left, big preview + resolutions on the right. The safe, by-the-book direction.">
        <DCArtboard id="A-charm"  label="A · Charm"      width={976} height={620}>
          <VariationA theme="charm" />
        </DCArtboard>
        <DCArtboard id="A-catp"   label="A · Catppuccin" width={976} height={620}>
          <VariationA theme="catppuccin" />
        </DCArtboard>
      </DCSection>

      {/* Variation B */}
      <DCSection id="varB" title="B — Contact sheet" subtitle="A photographer's contact sheet. Every wallpaper visible at once as a small ASCII-art card. The current month gets a highlighted halo. Built for the kitty-less case — ASCII does the heavy lifting.">
        <DCArtboard id="B-charm" label="B · Charm"      width={976} height={620}>
          <VariationB theme="charm" />
        </DCArtboard>
        <DCArtboard id="B-catp"  label="B · Catppuccin" width={976} height={620}>
          <VariationB theme="catppuccin" />
        </DCArtboard>
      </DCSection>

      {/* Variation C */}
      <DCSection id="varC" title="C — Magazine spread" subtitle="One wallpaper at a time, full-bleed. A big editorial title block sits beside the image. Vim-style h/l to flip 'pages'. Treats wallpapers like the publication they came from.">
        <DCArtboard id="C-charm" label="C · Charm"      width={976} height={620}>
          <VariationC theme="charm" />
        </DCArtboard>
        <DCArtboard id="C-catp"  label="C · Catppuccin" width={976} height={620}>
          <VariationC theme="catppuccin" />
        </DCArtboard>
      </DCSection>

      {/* Variation D */}
      <DCSection id="varD" title="D — Film strip timeline" subtitle="Horizontal scrolling row of thumbnails up top — a film strip with perforations — and a big preview underneath. Emphasises 'archive' over 'list'.">
        <DCArtboard id="D-charm" label="D · Charm"      width={976} height={620}>
          <VariationD theme="charm" />
        </DCArtboard>
        <DCArtboard id="D-catp"  label="D · Catppuccin" width={976} height={620}>
          <VariationD theme="catppuccin" />
        </DCArtboard>
      </DCSection>

      {/* State screens */}
      <DCSection id="states" title="02 — State screens" subtitle="Splash, resolution picker, download progress, settings, help, error, empty. Drawn against the conventional shell (Variation A) — re-skinnable for B/C/D.">
        <DCArtboard id="s-splash"   label="Splash · first run"     width={976} height={620}>
          <ScreenSplash theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-picker"   label="Pick resolution (modal)" width={976} height={620}>
          <ScreenPicker theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-download" label="Downloads in progress"  width={976} height={620}>
          <ScreenDownload theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-settings" label="Settings"               width={976} height={620}>
          <ScreenSettings theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-help"     label="Help overlay (?)"        width={976} height={620}>
          <ScreenHelp theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-error"    label="Error · feed unreachable" width={976} height={620}>
          <ScreenError theme="charm" />
        </DCArtboard>
        <DCArtboard id="s-empty"    label="Empty · no filter matches" width={976} height={620}>
          <ScreenEmpty theme="charm" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
