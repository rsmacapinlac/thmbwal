package tui

import (
	"fmt"
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
	s := "Hello world! I am alive in Bubbletea!"
	return tea.NewView(s)
}
