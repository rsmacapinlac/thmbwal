package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

const AppName = "thmbwal"
const SmashingMagazineWallpaperRSS = "https://www.smashingmagazine.com/category/wallpapers/index.xml"

type Config struct {
	SaveDir string `toml:"save_dir"`
}

func BuildDefault() (*Config) {
	
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Errorf("set home folder %v", err)
	}
	saveDir := filepath.Join(homeDir, "Pictures")

	cfg := Config{
		SaveDir: saveDir,
	}

	return &cfg
}

func Load() (*Config, error) {
	configDir, err := os.UserConfigDir()
	cfg := BuildDefault()

	/*
	if err != nil {
		return nil, fmt.Errorf("could not find config dir: %v", err)
	}
	*/

	configPath := filepath.Join(configDir, AppName, "config.toml")
	_, err = os.Stat(configPath)
	if err != nil {
		// doesn't exist
		os.MkdirAll(filepath.Dir(configPath), 0o755)
		tmpPath := configPath + ".tmp"
		// open a file for writing with cfg
		f, err := os.Create(tmpPath)
		if err != nil {
			return nil, fmt.Errorf("create temp config: %v", err)
		}
		
		// EncodeTOML
	  err = toml.NewEncoder(f).Encode(cfg)
		if err != nil {
			return nil, fmt.Errorf("write config: %v", err)
		}

		// Close the file
		defer f.Close()

		// Rename tmpPath to ConfigPath
		os.Rename(tmpPath, configPath)
	}

	/*
	_, err = toml.DecodeFile(configPath, &cfg)
	if err != nil {
		return nil, fmt.Errorf("could not decode config file: %v", err)
	}
	*/

	return cfg, err
}
