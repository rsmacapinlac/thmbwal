package main

import (
	"fmt"
	"log"
	"os"
	"thmbwal/internal/config"
)

func main() {
	log.SetOutput(os.Stderr)
	log.SetPrefix("thmbwal: ")

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("could not load config: %v", err)
		os.Exit(1)
	}

	fmt.Println(cfg)
}
