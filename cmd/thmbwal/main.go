package main

import (
	"log"
	"os"
	"thmbwal/internal/config"
	"thmbwal/internal/source/smashingmagazinerss"
	/*
	"thmbwal/internal/tui"

	tea "charm.land/bubbletea/v2"
	*/
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

	for _, wp := range feed {
		log.Printf("Wallpaper: %+v, # of Resolutions: %+v \n", wp.Title, len(wp.Resolutions))
	}
	/*
	model := tui.New(feed)
	p := tea.NewProgram(model)
	if _, err := p.Run(); err != nil {
		log.Fatalf("Error in Bubbletea: %v", err)
		os.Exit(1)
	}
	*/
}
