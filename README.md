# thmbwal

A TUI application for browsing and downloading wallpapers.

## About

This is a personal project built to learn Go. Development is AI-assisted — see [AGENTS.md](AGENTS.md) for details on how AI is used in this project.

## Features

- Browse wallpapers by month
- Select a resolution
- Download the selected wallpaper to a configured folder

On first run, the app creates a config file at `~/.config/thmbwal/config.toml` with a default `save_dir` of `~/Pictures`.

## Commands

```bash
go mod download            # download dependencies, useful before the first run
go run ./cmd/thmbwal       # run the app
go build ./cmd/thmbwal     # build binary
go test ./...              # run all tests
go test ./internal/config  # run tests for a specific package
```

## Architecture

`thmbwal` is a terminal UI tool (using [Bubbletea](https://github.com/charmbracelet/bubbletea)) that reads RSS feeds and renders their content.

Entry point is `cmd/thmbwal/main.go`. Internal packages live under `internal/` and are not importable by outside projects.

Package structure:
- `internal/config` — config loading
- `internal/source/smashingmagazinerss` — RSS feed fetching and XML/HTML parsing
- `internal/wallpaper` — core domain types
- `internal/ui` — Bubbletea model (Init/Update/View)

## Module

Module name is `thmbwal` (not a full GitHub URL). Internal imports follow the pattern `thmbwal/internal/<package>`.
