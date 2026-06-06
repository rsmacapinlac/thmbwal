# Learning Log

This log records meaningful progress in the repository and documents changes to the mentoring prompt that support learning.

Entries before this file existed were reconstructed from `git log` and commit diffs.

## 2026-05-15

**Topics:** project foundation, config defaults, TOML, initial mentoring rules

- Started `thmbwal` as a Go command-line application with a `cmd/` entry point and `internal/` packages.
- Added the first config-loading scaffold in `internal/config`.
- Added TOML support with `github.com/BurntSushi/toml`.
- Moved config loading toward returning a `Config` value plus an error instead of only printing from inside the config package.
- Began using OS-specific config paths and a default save directory under `~/Pictures`.
- Added `AGENTS.md` to establish the key learning constraint: AI should teach, mentor, comment, and scaffold, but not write the application code directly.
- Why it matters: the repository began with both technical structure and a learning structure. The config work also introduced an important Go pattern: packages return values and errors explicitly, while the command entry point decides how to report or exit.

## 2026-05-16

**Topics:** RSS source, network fetching, command path correction

- Added an initial RSS fetch package.
- Moved the command path from `cmd/tmbwal` to `cmd/thmbwal`.
- Added first-run config documentation to the project guidance.
- Introduced HTTP fetching and status-code checking for the Smashing Magazine wallpaper RSS feed.
- Why it matters: this was the first move from local scaffolding into real external data, and it introduced Go's explicit handling of network errors and response cleanup.

## 2026-05-19

**Topics:** domain modeling, source package separation, README extraction, teaching style refinement

- Restructured RSS parsing into `internal/source/smashingmagazinerss`.
- Added `internal/wallpaper` with core domain types: `Wallpaper` and `Resolution`.
- Added XML parsing, HTML parsing with `goquery`, resolution extraction, and publication-date parsing.
- Added a README so project purpose, commands, and architecture live outside the assistant prompt.
- Refined `AGENTS.md` to emphasize progressive disclosure, plain-English explanations, pseudocode before real code, and focused questions only when needed.
- Why it matters: this separated external source details from core domain concepts and improved the learning environment by separating assistant behavior from project documentation.

## 2026-05-28

**Topics:** Bubble Tea foundation, parser correction, TUI scaffolding

- Added Bubble Tea v2 and created the first `internal/tui` model scaffold.
- Wired fetched wallpaper data into a Bubble Tea program.
- Corrected README package naming from `internal/ui` to `internal/tui`.
- Fixed the earlier parsing assumption that one RSS item maps directly to one wallpaper.
- Updated parsing so a single post can produce multiple wallpaper records grouped by title, each with its own list of resolutions.
- Temporarily paused the TUI to inspect parsed wallpaper and resolution counts through logging.
- Added `strings.Builder` in the TUI view scaffold instead of repeatedly concatenating strings.
- Why it matters: this introduced Bubble Tea's `Init` / `Update` / `View` model and captured a real domain-modeling lesson: shape code around the data as it actually exists, not around the first convenient assumption.

## 2026-05-31

**Topics:** prompt refinement, TUI re-enabled

- Updated `AGENTS.md` wording to reinforce the assistant as a teacher and mentor.
- Added permission for assistant-driven documentation updates, including `AGENTS.md`, as long as the developer is informed.
- Re-enabled the Bubble Tea TUI after validating the feed parsing path.
- Why it matters: the project moved back from diagnostic command output toward the intended interactive app, while also tightening the rules for learning-focused assistance.

## 2026-06-06

**Topics:** TUI debugging, design direction, Bubble Tea alternate screen, learning log setup, learning-log prompt refinement

- Redirected logs to `thmbwal.log` while working on the TUI.
- Removed redundant `os.Exit` calls after `log.Fatalf`, since `Fatalf` already exits.
- Added `.gitignore` entry for `thmbwal.log`.
- Added design references under `docs/design`, including a saved Claude Design prototype.
- Added `internal/tui/header.go` and started rendering a header with terminal-width awareness.
- Clarified that in Bubble Tea v2, full-screen takeover is declared from `View()` by setting `view.AltScreen = true`.
- Added instructions in `AGENTS.md` for maintaining a learning log.
- Moved the learning log into `docs/learning-log.md` so `AGENTS.md` stays focused on assistant behavior.
- Populated the learning log from git history.
- Refined `AGENTS.md` so the learning log uses one top-level entry per day, with multiple topics grouped under that date.
- Why it matters: full-screen TUI work benefits from file-based logging and documented design direction. The learning-log changes also make the record easier to scan by preserving a daily narrative instead of fragmenting one day into multiple entries.

---

**Topics:** wallpaper display roadmap, Bubble Tea viewport, terminal image rendering

Planned the progressive path for building wallpaper display and selection in the TUI:

1. **Viewport** — embed a `viewport.Model` from the Bubbles library inside `appModel` to get a scrollable container. Teaches how BubbleTea components compose: your model delegates work to a child model.
2. **Single-column text tiles** — render each wallpaper as a short text block (title, date) stacked vertically and passed to the viewport as content. Teaches turning `[]wallpaper.Wallpaper` into a rendered string.
3. **Selection** — use the existing `selectedItem int` field. In `View()`, check if an item's index matches `selectedItem` and render it differently (cursor marker or lipgloss highlight). Key handling in `Update()` moves the cursor within bounds.
4. **Image display** — deferred as a separate milestone after selection is clean. Three real options exist in order of complexity: Unicode block characters (works everywhere, low fidelity), Sixel graphics (ANSI escape codes, supported in most modern terminals), Kitty graphics protocol (highest quality, Kitty-specific). Text metadata is a valid tile representation in the meantime.

Open question before starting: confirm whether `go.mod` includes a Bubbles package compatible with Bubble Tea v2, since they are separate packages.

- Why it matters: established a sequenced learning path where each step teaches one concept before layering the next. Image display complexity is scoped out of the immediate milestone to avoid over-reaching.

---

**Topics:** viewport wiring, wallpaper rendering, selection, lipgloss styling, BubbleTea update cycle

Completed the viewport, content rendering, and selection milestone:

- Added `charm.land/bubbles/v2` to the project. Learned that Bubbles is a separate module from BubbleTea and must be version-matched.
- Embedded `viewport.Model` inside `appModel` as a child component. Learned that BubbleTea components compose by delegation — the parent carries the child's state and calls its methods.
- Learned that `viewport.New` in v2 uses the functional options pattern (`WithWidth`, `WithHeight`) rather than positional arguments, and that `Width`/`Height` are getter methods, not assignable fields — use `SetWidth`/`SetHeight`.
- Built `renderWallpapers()` in its own file (`internal/tui/wallpapers.go`). Learned Go's time formatting: uses a reference date as the layout template rather than format codes like `%Y`.
- Learned the distinction between fresh rendering and stateful components: the header re-renders from model state every cycle; the viewport stores content internally and only updates when `SetContent()` is called explicitly.
- Wired `j`/`k` navigation with bounds clamping and auto-scroll via `SetYOffset(selectedItem * 3)`. Learned that `SetContent` must be called before `SetYOffset`, or the offset is overwritten.
- Debugged a viewport cut-off issue: the header separator had no trailing newline, so the first wallpaper title was hidden behind it. Fixed by adding `\n` between header and viewport in `View()`.
- Added lipgloss reverse-video highlight for the selected item. Learned that lipgloss styles are immutable — methods return a new style and do not modify in place.
- Learned Go's `for index, value := range` syntax as the idiomatic way to get both index and value, replacing a manual counter.

- Why it matters: the full viewport → render → selection → styling sequence is now complete. Each step built on the last without skipping ahead, and several real Go concepts landed naturally through debugging rather than being introduced in the abstract.
