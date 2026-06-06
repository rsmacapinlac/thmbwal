package tui

import (
	"fmt"
	"strings"
)

func (m appModel) renderLeft() string {
	// TODO: Smashing Magazine should be dynamic and based off the source being pulled from (currently hardcoded to smashing magazine)
	left := "▌ thmbwal › Smashing Magazine"
	return left
}

func (m appModel) renderRight() string {
	wallpaperCount := len(m.wallpapers)
	return fmt.Sprintf("%d wallpapers, m.selectedItem: %d", wallpaperCount, m.selectedItem)
}

func (m appModel) renderHeader() string {
	left := m.renderLeft()
	right := m.renderRight()

	width := m.terminalWidth
	if width == 0 {
		width = 80
	}

	middlePadLen := width - (len(left) + len(right))
	/*
	if middlePadLen < 1 {
		middlePadLen = 1
	}
	*/
	middlePadLen = max(middlePadLen, 1)

	middlePad := strings.Repeat(" ", middlePadLen)

	header := left + middlePad + right
	header = header + "\n"
	header = header + strings.Repeat("─", width)

	return header
}
