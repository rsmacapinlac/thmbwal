package config

import (
	"fmt"
	"os"
)

type Config struct {
	SaveDir string
}

func Load(configDir string) {
	homedir, err := os.UserConfigDir()
	if (err != nil) {
		fmt.Println("Something errored out")
	}

	fmt.Println(homedir)
}
