// states.jsx — Supporting state screens (splash, picker, download, settings, help, error, empty)
// Each is a complete Term frame. They share the conventional two-pane chrome
// so they slot into Variation A; the team can re-skin for B/C/D as needed.

const { Term, Row, Span, Box, BOX, StatusBar, AsciiArt, KittyPreview, useTheme, CELL_W, CELL_H } = window;

// --- Splash / loading --------------------------------------------------------
function ScreenSplash({ theme = "charm" }) {
  const t = window.THEMES[theme];
  // Big ASCII wordmark
  const LOGO = [
    "  ████████ ██   ██ ███    ███ ██████  ██     ██  █████  ██",
    "     ██    ██   ██ ████  ████ ██   ██ ██     ██ ██   ██ ██",
    "     ██    ███████ ██ ████ ██ ██████  ██  █  ██ ███████ ██",
    "     ██    ██   ██ ██  ██  ██ ██   ██ ██ ███ ██ ██   ██ ██",
    "     ██    ██   ██ ██      ██ ██████   ███ ███  ██   ██ ███████",
  ];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal">
      {LOGO.map((l, i) => (
        <Row key={i} y={10 + i} x={30}>
          <Span fg={t.primary} bold>{l}</Span>
        </Row>
      ))}
      <Row y={17} x={47}>
        <Span fg={t.subtle}>browse · pick · pull · </Span>
        <Span fg={t.secondary}>smashing wallpapers</Span>
      </Row>

      <Row y={22} x={48}>
        <Span fg={t.dim}>fetching the feed</Span>
        <Span fg={t.primary} bold>{" ▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱"}</Span>
      </Row>
      <Row y={23} x={48}>
        <Span fg={t.dim}>  smashingmagazine.com/category/wallpapers/index.xml</Span>
      </Row>
      <Row y={25} x={48}>
        <Span fg={t.accent}>✓</Span>
        <Span fg={t.subtle}>  config at ~/.config/thmbwal/config.toml</Span>
      </Row>
      <Row y={26} x={48}>
        <Span fg={t.accent}>✓</Span>
        <Span fg={t.subtle}>  display detected: 2560×1440 (QHD)</Span>
      </Row>
      <Row y={27} x={48}>
        <Span fg={t.dim}>◌  parsing 8 months · 168 entries</Span>
      </Row>

      <Row y={32} x={0}>
        <Span fg={t.dim}>{" ".repeat(50)}press q to quit</Span>
      </Row>
    </Term>
  );
}

// --- Resolution picker (overlay modal) ---------------------------------------
function ScreenPicker({ theme = "charm" }) {
  const t = window.THEMES[theme];
  const item = window.WALLPAPERS[0];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — pick a resolution">
      {/* dimmed background hint of the list */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }}>
        {window.WALLPAPERS.map((w, i) => (
          <Row key={i} y={3 + i * 3} x={2}>
            <Span fg={t.dim}>  {w.m}  {w.title}</Span>
          </Row>
        ))}
      </div>

      <Box x={28} y={4} w={64} h={26} color={t.primary} kind="round" />
      <Row y={4} x={31}>
        <Span fg={t.border}>─</Span>
        <Span fg={t.primary} bold> Pick a resolution </Span>
        <Span fg={t.border}>─</Span>
      </Row>

      <Row y={6} x={31}>
        <Span fg={t.text} bold>{item.title}</Span>
      </Row>
      <Row y={7} x={31}>
        <Span fg={t.dim}>{item.m}  ·  by {item.author}</Span>
      </Row>

      <Row y={9} x={31}>
        <Span fg={t.secondary} bold>group by aspect ratio</Span>
        <Span fg={t.dim}>  ·  </Span>
        <Span fg={t.accent}>● your display</Span>
      </Row>

      {/* Groups */}
      <ResGroup x={31} y={11} title="16:9 widescreen" items={[
        ["1280×720",  "HD"],
        ["1920×1080", "FHD"],
        ["2560×1440", "QHD", true],
        ["3840×2160", "4K UHD"],
      ]} />
      <ResGroup x={62} y={11} title="16:10" items={[
        ["1280×800",  "WXGA"],
        ["1440×900",  ""],
        ["1680×1050", "WSXGA+"],
        ["1920×1200", "WUXGA"],
      ]} />
      <ResGroup x={31} y={18} title="ultrawide" items={[
        ["2560×1080", "UW"],
        ["3440×1440", "UWQHD"],
        ["5120×1440", "DQHD"],
      ]} />
      <ResGroup x={62} y={18} title="mobile · tablet" items={[
        ["320×480",  "iPhone 4"],
        ["1024×768", "iPad"],
        ["2778×1284","iPhone 13"],
      ]} />

      <Row y={26} x={31}>
        <Span fg={t.dim}>{"─".repeat(58)}</Span>
      </Row>
      <Row y={27} x={31}>
        <Span fg={t.bg} bg={t.primary} bold>{" ↵ download "}</Span>
        <Span fg={t.subtle}>   2560×1440 → ~/Pictures/2024-12-window-of-christmas-2560x1440.png</Span>
      </Row>
      <Row y={28} x={31}>
        <Span fg={t.dim}>esc cancel  ·  tab next group  ·  / filter</Span>
      </Row>
    </Term>
  );
}

function ResGroup({ x, y, title, items }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={x}>
        <Span fg={t.dim}>{title}</Span>
      </Row>
      {items.map((r, i) => {
        const matched = r[2];
        return (
          <Row key={i} y={y + 1 + i} x={x}>
            <Span fg={matched ? t.accent : t.dim}>{matched ? "● " : "  "}</Span>
            <Span fg={matched ? t.text : t.subtle} bold={matched}>{r[0].padEnd(11)}</Span>
            <Span fg={t.dim}>{r[1]}</Span>
          </Row>
        );
      })}
    </>
  );
}

// --- Download progress -------------------------------------------------------
function ScreenDownload({ theme = "charm" }) {
  const t = window.THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — downloading">
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> downloads</Span>
        <Span fg={t.dim}>  ·  3 active  ·  2 queued  ·  saving to ~/Pictures</Span>
      </Row>
      <Row y={2} x={0}>
        <Span fg={t.border}>{"─".repeat(120)}</Span>
      </Row>

      <DLRow y={4}  item={window.WALLPAPERS[0]} res="2560×1440" state="active"   pct={62} speed="2.1 MB/s" eta="0:04" bytes="3.8 / 6.1 MB" />
      <DLRow y={8}  item={window.WALLPAPERS[2]} res="3840×2160" state="active"   pct={28} speed="1.4 MB/s" eta="0:18" bytes="3.2 / 11.4 MB" />
      <DLRow y={12} item={window.WALLPAPERS[4]} res="1920×1080" state="active"   pct={94} speed="2.8 MB/s" eta="0:01" bytes="3.7 / 3.9 MB" />
      <DLRow y={16} item={window.WALLPAPERS[5]} res="2560×1440" state="queued"   pct={0}  speed="—"       eta="—"    bytes="—" />
      <DLRow y={20} item={window.WALLPAPERS[6]} res="3440×1440" state="queued"   pct={0}  speed="—"       eta="—"    bytes="—" />

      <Row y={24} x={2}>
        <Span fg={t.dim}>completed today</Span>
      </Row>
      <Row y={25} x={2}>
        <Span fg={t.accent}>✓</Span>
        <Span fg={t.subtle}>  Pebble Garden  </Span>
        <Span fg={t.dim}>2560×1440  ·  4.2 MB  ·  ~/Pictures/2024-05-pebble-garden-2560x1440.png</Span>
      </Row>
      <Row y={26} x={2}>
        <Span fg={t.accent}>✓</Span>
        <Span fg={t.subtle}>  Listening to Leaves Fall  </Span>
        <Span fg={t.dim}>2560×1440  ·  3.6 MB</Span>
      </Row>

      <Row y={32} x={0}>
        <Span fg={t.bg} bg={t.primary} bold>{" DOWNLOADS "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  p pause  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  r resume  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  x cancel  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  o open in finder  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  esc back  "}</Span>
      </Row>
    </Term>
  );
}

function DLRow({ y, item, res, state, pct, speed, eta, bytes }) {
  const t = useTheme();
  const barW = 96;
  const filled = Math.round((pct / 100) * barW);
  const bar = "▰".repeat(filled) + "▱".repeat(barW - filled);
  const color = state === "queued" ? t.dim : pct > 90 ? t.accent : t.primary;
  return (
    <>
      <Row y={y} x={2}>
        <Span fg={state === "queued" ? t.dim : t.text} bold>{item.title}</Span>
        <Span fg={t.dim}>  ·  {res}  ·  {item.m}</Span>
        <Span fg={t.dim}>{" ".repeat(Math.max(1, 60 - item.title.length - res.length - item.m.length - 8))}</Span>
        <Span fg={state === "queued" ? t.dim : t.subtle}>{state === "queued" ? "queued" : `${pct}%`}</Span>
        <Span fg={t.dim}>  ·  {speed}  ·  eta {eta}</Span>
      </Row>
      <Row y={y + 1} x={2}>
        <Span fg={color}>{bar}</Span>
      </Row>
      <Row y={y + 2} x={2}>
        <Span fg={t.dim}>  {bytes}  ·  ~/Pictures/{item.m.toLowerCase().replace(" ", "-")}-{item.title.toLowerCase().replace(/\s+/g, "-")}-{res.replace("×","x")}.png</Span>
      </Row>
    </>
  );
}

// --- Settings / config -------------------------------------------------------
function ScreenSettings({ theme = "charm" }) {
  const t = window.THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — settings">
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> settings</Span>
        <Span fg={t.dim}>  ·  ~/.config/thmbwal/config.toml</Span>
      </Row>
      <Row y={2} x={0}>
        <Span fg={t.border}>{"─".repeat(120)}</Span>
      </Row>

      {/* Left — settings list */}
      <SettingItem y={5}  label="save_dir"        value="~/Pictures/wallpapers" type="path"   active />
      <SettingItem y={8}  label="default_res"     value="auto (2560×1440)"      type="resolution" hint="detected from your display" />
      <SettingItem y={11} label="overwrite"       value="ask"                   type="enum"   options="ask · skip · overwrite" />
      <SettingItem y={14} label="ascii_preview"   value="enabled"               type="toggle" hint="falls back to ASCII when kitty graphics unavailable" />
      <SettingItem y={17} label="theme"           value="charm"                 type="theme"  options="charm · catppuccin · gruvbox · solarized" />
      <SettingItem y={20} label="cache"           value="7 days · 4.1 MB"       type="cache"  hint="press c to clear" />

      {/* Right — preview / current config.toml */}
      <Box x={75} y={4} w={43} h={24} color={t.border} kind="round" title="config.toml" />
      <Row y={6}  x={77}><Span fg={t.dim}># thmbwal — generated on first run</Span></Row>
      <Row y={8}  x={77}><Span fg={t.info}>save_dir</Span><Span fg={t.text}> = </Span><Span fg={t.accent}>"~/Pictures/wallpapers"</Span></Row>
      <Row y={9}  x={77}><Span fg={t.info}>default_res</Span><Span fg={t.text}> = </Span><Span fg={t.accent}>"auto"</Span></Row>
      <Row y={10} x={77}><Span fg={t.info}>overwrite</Span><Span fg={t.text}> = </Span><Span fg={t.accent}>"ask"</Span></Row>
      <Row y={11} x={77}><Span fg={t.info}>ascii_preview</Span><Span fg={t.text}> = </Span><Span fg={t.secondary}>true</Span></Row>
      <Row y={12} x={77}><Span fg={t.info}>theme</Span><Span fg={t.text}> = </Span><Span fg={t.accent}>"charm"</Span></Row>
      <Row y={14} x={77}><Span fg={t.dim}>[cache]</Span></Row>
      <Row y={15} x={77}><Span fg={t.info}>max_age</Span><Span fg={t.text}> = </Span><Span fg={t.warn}>"7d"</Span></Row>
      <Row y={16} x={77}><Span fg={t.info}>dir</Span><Span fg={t.text}>     = </Span><Span fg={t.accent}>"~/.cache/thmbwal"</Span></Row>
      <Row y={18} x={77}><Span fg={t.dim}>[display]</Span></Row>
      <Row y={19} x={77}><Span fg={t.info}>auto_detect</Span><Span fg={t.text}> = </Span><Span fg={t.secondary}>true</Span></Row>
      <Row y={20} x={77}><Span fg={t.info}>override</Span><Span fg={t.text}>    = </Span><Span fg={t.dim}>""</Span></Row>
      <Row y={23} x={77}><Span fg={t.accent}>✓ </Span><Span fg={t.subtle}>changes save automatically</Span></Row>

      <Row y={32} x={0}>
        <Span fg={t.bg} bg={t.primary} bold>{" SETTINGS "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  j/k move  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ↵ edit  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  c clear cache  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  R reset to defaults  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  esc back  "}</Span>
      </Row>
    </Term>
  );
}

function SettingItem({ y, label, value, type, hint, options, active }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={2}>
        <Span fg={active ? t.primary : t.dim}>{active ? "▌ " : "  "}</Span>
        <Span fg={t.dim}>{type.padEnd(11)}</Span>
        <Span fg={active ? t.text : t.subtle} bold>{label}</Span>
      </Row>
      <Row y={y + 1} x={2}>
        <Span fg={t.dim}>{"             "}</Span>
        <Span fg={active ? t.accent : t.subtle}>{value}</Span>
      </Row>
      {(hint || options) && (
        <Row y={y + 2} x={2}>
          <Span fg={t.dim}>{"             "}{hint || options}</Span>
        </Row>
      )}
    </>
  );
}

// --- Help overlay ------------------------------------------------------------
function ScreenHelp({ theme = "charm" }) {
  const t = window.THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — help">
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, pointerEvents: "none" }}>
        {window.WALLPAPERS.map((w, i) => (
          <Row key={i} y={3 + i * 3} x={2}><Span fg={t.dim}>  {w.m}  {w.title}</Span></Row>
        ))}
      </div>
      <Box x={10} y={2} w={100} h={30} color={t.primary} kind="round" />
      <Row y={2} x={13}>
        <Span fg={t.border}>─</Span>
        <Span fg={t.primary} bold> Keybindings </Span>
        <Span fg={t.border}>─</Span>
      </Row>

      <HelpGroup x={13} y={4} title="navigate" rows={[
        ["j / ↓",   "move down"],
        ["k / ↑",   "move up"],
        ["g G",     "top / bottom"],
        ["h / l",   "prev / next month"],
        ["ctrl+u/d","page up / down"],
      ]} />
      <HelpGroup x={45} y={4} title="actions" rows={[
        ["↵",       "pick resolution"],
        ["d",       "download now (uses your display)"],
        ["D",       "download all displays"],
        ["o",       "reveal in file manager"],
        ["space",   "multi-select for batch"],
      ]} />
      <HelpGroup x={78} y={4} title="search · view" rows={[
        ["/",       "fuzzy filter titles"],
        ["a",       "toggle ascii preview"],
        ["v",       "cycle layouts (list/grid/spread)"],
        ["1-4",     "jump to layout"],
        ["esc",     "clear filter · close overlay"],
      ]} />

      <HelpGroup x={13} y={14} title="downloads" rows={[
        ["tab",       "open downloads pane"],
        ["p / r",     "pause / resume"],
        ["x",         "cancel"],
        ["ctrl+r",    "retry failed"],
      ]} />
      <HelpGroup x={45} y={14} title="settings" rows={[
        [",",         "open settings"],
        ["t",         "cycle theme"],
        ["c",         "clear cache"],
        ["R",         "reset config to defaults"],
      ]} />
      <HelpGroup x={78} y={14} title="general" rows={[
        ["?",         "this screen"],
        ["q / ctrl+c","quit"],
        ["",          ""],
        ["",          ""],
      ]} />

      <Row y={25} x={13}>
        <Span fg={t.dim}>{"─".repeat(94)}</Span>
      </Row>
      <Row y={26} x={13}>
        <Span fg={t.secondary} bold>tip </Span>
        <Span fg={t.subtle}>thmbwal reads ~/.config/thmbwal/config.toml — see </Span>
        <Span fg={t.info} underline>settings</Span>
        <Span fg={t.subtle}> ( , ) to edit.</Span>
      </Row>
      <Row y={27} x={13}>
        <Span fg={t.secondary} bold>tip </Span>
        <Span fg={t.subtle}>resolutions matching your display are highlighted in </Span>
        <Span fg={t.accent}>green</Span>
        <Span fg={t.subtle}> with a </Span>
        <Span fg={t.accent}>●</Span>
        <Span fg={t.subtle}>.</Span>
      </Row>
      <Row y={29} x={13}>
        <Span fg={t.dim}>thmbwal v0.1.0  ·  feed: smashingmagazine.com/category/wallpapers</Span>
      </Row>
    </Term>
  );
}

function HelpGroup({ x, y, title, rows }) {
  const t = useTheme();
  return (
    <>
      <Row y={y} x={x}>
        <Span fg={t.secondary} bold>{title}</Span>
      </Row>
      {rows.map((r, i) => (
        <Row key={i} y={y + 1 + i} x={x}>
          <Span fg={t.warn} bold>{r[0].padEnd(12)}</Span>
          <Span fg={t.subtle}>{r[1]}</Span>
        </Row>
      ))}
    </>
  );
}

// --- Error state -------------------------------------------------------------
function ScreenError({ theme = "charm" }) {
  const t = window.THEMES[theme];
  // Big sad cloud ASCII
  const CLOUD = [
    "          ░░░░░░░░░░░░░░░░░",
    "      ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░",
    "   ░▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓░",
    "  ▓▓░░  ░  ╳   ╳     ░░  ░▓▓",
    "  ▓░░░░░░░░░░░░░░░░░░░░░░░░▓",
    "  ▓░░░░░░░░  ▔▔▔▔▔  ░░░░░░▓░",
    "   ▓▓░░░░░░░░░░░░░░░░░░░░▓▓ ",
    "      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ",
  ];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — error">
      {CLOUD.map((l, i) => (
        <Row key={i} y={6 + i} x={42}>
          <Span fg={t.err}>{l}</Span>
        </Row>
      ))}
      <Row y={16} x={48}>
        <Span fg={t.text} bold style={{ fontSize: 18 }}>couldn't fetch the feed.</Span>
      </Row>
      <Row y={19} x={36}>
        <Span fg={t.dim}>GET </Span>
        <Span fg={t.subtle}>https://www.smashingmagazine.com/category/wallpapers/index.xml</Span>
      </Row>
      <Row y={20} x={36}>
        <Span fg={t.err} bold>✗ </Span>
        <Span fg={t.subtle}>dial tcp: lookup smashingmagazine.com: no such host</Span>
      </Row>
      <Row y={22} x={36}>
        <Span fg={t.dim}>check your connection, then:</Span>
      </Row>
      <Row y={23} x={36}>
        <Span fg={t.bg} bg={t.primary} bold>{"  r  retry  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  c  open cached browse  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ,  settings  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  q  quit  "}</Span>
      </Row>

      <Row y={26} x={36}>
        <Span fg={t.dim}>last successful fetch: </Span>
        <Span fg={t.subtle}>2 hours ago</Span>
        <Span fg={t.dim}>  ·  cached: </Span>
        <Span fg={t.subtle}>8 months, 168 wallpapers</Span>
      </Row>
      <Row y={27} x={36}>
        <Span fg={t.dim}>log: </Span>
        <Span fg={t.subtle}>~/.local/state/thmbwal/last-error.log</Span>
      </Row>
    </Term>
  );
}

// --- Empty state -------------------------------------------------------------
function ScreenEmpty({ theme = "charm" }) {
  const t = window.THEMES[theme];
  return (
    <Term cols={120} rows={34} theme={theme} title="thmbwal — empty">
      <Row y={1} x={2}>
        <Span fg={t.primary} bold>▌</Span>
        <Span fg={t.text} bold> browse</Span>
        <Span fg={t.dim}>  ·  filter: </Span>
        <Span fg={t.warn}>"chiaroscuro"</Span>
      </Row>
      <Row y={2} x={0}><Span fg={t.border}>{"─".repeat(120)}</Span></Row>

      {/* Minimalist art — a single dot in negative space */}
      <Row y={11} x={59}>
        <Span fg={t.dim}>·</Span>
      </Row>
      <Row y={13} x={50}>
        <Span fg={t.subtle} bold style={{ fontSize: 16 }}>nothing matches that filter.</Span>
      </Row>
      <Row y={15} x={48}>
        <Span fg={t.dim}>try a different word, or browse the full archive.</Span>
      </Row>

      <Row y={18} x={50}>
        <Span fg={t.bg} bg={t.primary} bold>{"  esc  clear filter  "}</Span>
      </Row>
      <Row y={19} x={50}>
        <Span fg={t.subtle}>     </Span>
        <Span fg={t.dim}>or </Span>
        <Span fg={t.info}>/ </Span>
        <Span fg={t.dim}>edit · </Span>
        <Span fg={t.info}>g </Span>
        <Span fg={t.dim}>top of list</Span>
      </Row>

      <Row y={24} x={2}>
        <Span fg={t.dim}>recent searches</Span>
      </Row>
      <Row y={25} x={2}>
        <Span fg={t.subtle}>  autumn</Span>
        <Span fg={t.dim}>      24 results</Span>
        <Span fg={t.subtle}>     cosmic</Span>
        <Span fg={t.dim}>     6 results</Span>
        <Span fg={t.subtle}>     winter</Span>
        <Span fg={t.dim}>     31 results</Span>
      </Row>

      <Row y={32} x={0}>
        <Span fg={t.bg} bg={t.primary} bold>{" FILTER "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  esc clear  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ↵ apply  "}</Span>
        <Span fg={t.subtle} bg={t.surface2}>{"  ? help  "}</Span>
      </Row>
    </Term>
  );
}

Object.assign(window, { ScreenSplash, ScreenPicker, ScreenDownload, ScreenSettings, ScreenHelp, ScreenError, ScreenEmpty });
