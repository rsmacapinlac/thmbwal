package tui

import (
	"strings"

	"charm.land/lipgloss/v2"
)

func (m appModel) renderWallpapers() string {

	selectedStyle := lipgloss.NewStyle().Reverse(true)
	normalStyle := lipgloss.NewStyle()

	var output strings.Builder
	for index, wp := range m.wallpapers {
		if (index == m.selectedItem) {
			output.WriteString(selectedStyle.Render(wp.Title) + "\n")	
		} else {
			output.WriteString(normalStyle.Render(wp.Title) + "\n")	
		}
		output.WriteString(wp.PostDate.Format("2006-01-02") + "\n")
		output.WriteString("\n")
	}
	return output.String()
}
