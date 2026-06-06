package tui

import (
	// "charm.land/lipgloss/v2"

	"strings"

	"thmbwal/internal/wallpaper"

	tea "charm.land/bubbletea/v2"
)

type appModel struct {
	wallpapers   []wallpaper.Wallpaper
	selectedItem int
	terminalWidth int
}

func New(feed []wallpaper.Wallpaper) *appModel {
	model := appModel{
		wallpapers:   feed,
		selectedItem: 0,
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
			}
		case tea.WindowSizeMsg:
			m.terminalWidth = msg.Width
	}
	return m, nil
}

func (m appModel) View() tea.View {

	var output strings.Builder

	output.WriteString(m.renderHeader())
	// output.WriteString("This is my title \n\n")
	// output.WriteString(fmt.Sprintf("Termminal Width: %d\n", m.terminalWidth))
	output.WriteString("\n\n")

	/*
	for _, item := range m.wallpapers {
		output.WriteString(item.Title + "\n")
	}
	*/
	view := tea.NewView(output.String())
	view.AltScreen = true

	return view 
}
