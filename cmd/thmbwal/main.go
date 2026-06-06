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
	logFile, err := os.OpenFile("thmbwal.log", os.O_CREATE | os.O_WRONLY | os.O_APPEND, 0644)
	if err != nil {
		log.SetOutput(os.Stderr)
		log.SetPrefix("thmbwal: ")
		log.Fatalf("could not open logfile: %v", err)
	}
	defer logFile.Close()

	log.SetOutput(logFile)
	log.SetPrefix("thmbwal: ")

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("could not load config: %v", err)
	}
	log.Printf("config returned: %v", cfg)

	feed, err := smashingmagazinerss.Fetch()
	if err != nil {
		log.Fatalf("could not fetch RSS: %v", err)
	}

	for _, wp := range feed {
		log.Printf("Wallpaper: %+v, # of Resolutions: %+v \n", wp.Title, len(wp.Resolutions))
	}

	model := tui.New(feed)
	p := tea.NewProgram(model)
	if _, err := p.Run(); err != nil {
		log.Fatalf("Error in Bubbletea: %v", err)
	}
}
