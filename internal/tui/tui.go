package tui

import (
	"strings"

	"thmbwal/internal/wallpaper"

	"charm.land/bubbles/v2/viewport"
	tea "charm.land/bubbletea/v2"
)

type appModel struct {
	wallpapers   []wallpaper.Wallpaper
	selectedItem int
	terminalWidth int
	terminalHeight int

	viewport viewport.Model
}

func New(feed []wallpaper.Wallpaper) *appModel {
	model := appModel{
		wallpapers:   feed,
		selectedItem: 0,
		terminalWidth: 0,
		terminalHeight: 0,
		viewport: viewport.New(),
	}
	return &model
}

func (m appModel) Init() tea.Cmd {
	return nil
}

func (m appModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
		case tea.KeyPressMsg:
			switch msg.String() {
				case "ctrl+c", "q":
					return m, tea.Quit
				case "j": 
					m.selectedItem ++
					if m.selectedItem >= len(m.wallpapers) {
						m.selectedItem = 0
					}
					m.viewport.SetContent(m.renderWallpapers())
					m.viewport.SetYOffset(m.selectedItem * 3)
				case "k": 
					m.selectedItem --
					if m.selectedItem < 0 {
						m.selectedItem = len(m.wallpapers) - 1
					}
					m.viewport.SetContent(m.renderWallpapers())
					m.viewport.SetYOffset(m.selectedItem * 3)
			}
		case tea.WindowSizeMsg:
			m.terminalWidth = msg.Width
			m.terminalHeight = msg.Height
			m.viewport.SetHeight(m.terminalHeight - 2)
			m.viewport.SetWidth(m.terminalWidth)
			m.viewport.SetContent(m.renderWallpapers())
	}
	return m, nil
}

func (m appModel) View() tea.View {

	var output strings.Builder

	output.WriteString(m.renderHeader())
	output.WriteString("\n")
	output.WriteString(m.viewport.View())

	view := tea.NewView(output.String())
	view.AltScreen = true

	return view 
}
