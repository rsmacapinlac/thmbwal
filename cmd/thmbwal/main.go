package main

import (
	"log"
	"os"
	"thmbwal/internal/config"
	"thmbwal/internal/source/smashingmagazinerss"
	"thmbwal/internal/tui"

	tea "charm.land/bubbletea/v2"
)

func main() {
	log.SetOutput(os.Stderr)
	log.SetPrefix("thmbwal: ")

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("could not load config: %v", err)
		os.Exit(1)
	}
	log.Printf("config returned: %v", cfg)

	feed, err := smashingmagazinerss.Fetch()
	if err != nil {
		log.Fatalf("could not fetch RSS: %v", err)
	}
	// log.Printf("%s", feed)

	model := tui.New(feed)
	p := tea.NewProgram(model)
	if _, err := p.Run(); err != nil {
		log.Fatalf("Error in Bubbletea: %v", err)
		os.Exit(1)
	}
}
