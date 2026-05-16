package main

import (
	"log"
	"os"
	"thmbwal/internal/config"
	"thmbwal/internal/rss"
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

	feed, err := rss.Fetch()
	if err != nil {
		log.Fatalf("could not fetch RSS: %v", err)
	}
	log.Printf("%s", feed)

}
