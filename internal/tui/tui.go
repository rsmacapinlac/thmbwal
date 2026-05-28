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
	}
	return m, nil
}

func (m appModel) View() tea.View {

	var output strings.Builder
	output.WriteString("This is my title \n\n")

	for _, item := range m.wallpapers {
		/*
		Inefficient, because each time it creates a new string
		s += item.Title + "\n"
		*/
		output.WriteString(item.Title + "\n")
	}

	return tea.NewView(output.String())
}
