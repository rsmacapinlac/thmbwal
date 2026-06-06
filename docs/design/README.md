# thmbwal design reference

This folder preserves the Claude Design prototype and the implementation notes for the TUI direction.

## Primary direction

The selected direction is the **Contact sheet** layout: a grid of wallpaper cards with ASCII-style previews, focused-card details, and keyboard-first navigation.

## Local prototype files

The design bundle is stored in [`prototype/`](prototype/).

Important files:

- [`prototype/thmbwal-prototype.html`](prototype/thmbwal-prototype.html) — interactive contact-sheet prototype
- [`prototype/prototype.jsx`](prototype/prototype.jsx) — main prototype behavior and layout
- [`prototype/tui.jsx`](prototype/tui.jsx) — terminal frame, themes, box drawing, ASCII helpers
- [`prototype/chat1.md`](prototype/chat1.md) — original design conversation/context

The original shared API link was:

<https://api.anthropic.com/v1/design/h/ddjaW2P5j0Lj28Ob43rq1Q?open_file=thmbwal-prototype.html>

The local files are preferred because external links can expire or become inaccessible.

## Header reference

The prototype header uses a compact breadcrumb row plus a divider:

```text
▌ thmbwal › Contact sheet                                  12 months · 252 wallpapers
────────────────────────────────────────────────────────────────────────────────────────
```

During downloads, the same header area becomes a status/toast row:

```text
▌ thmbwal › Contact sheet     ⤓ downloading  Cosmic Dance · 2560×1440 · 45% ▰▰▰▰▱▱▱
────────────────────────────────────────────────────────────────────────────────────────
```

For the first Go implementation, prefer the static header first:

1. Left marker: `▌`
2. App name: `thmbwal`
3. Breadcrumb: `› Contact sheet`
4. Right-aligned count
5. Full-width divider line

## Theme notes

Prototype theme tokens:

- Charm default
  - background `#0E0E12`
  - surface `#16161D`
  - border `#2A2A38`
  - primary pink `#FF06B7`
  - secondary purple `#874BFD`
  - accent green `#43BF6D`
- Catppuccin Mocha
  - background `#1E1E2E`
  - surface `#181825`
  - border `#45475A`
  - primary mauve `#CBA6F7`
  - secondary pink `#F5C2E7`
  - accent green `#A6E3A1`

## Interaction reference

- `h/j/k/l` — move around the contact sheet
- `Enter` — pick resolution
- `d` — quick download detected resolution
- `/` — filter
- `t` — toggle theme
- `,` — settings
- `?` — help
- `q` — quit
