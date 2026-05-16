package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

const AppName = "thmbwal"

type Config struct {
	SaveDir string `toml:"save_dir"`
}

func BuildDefault() (*Config, error) {

	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Errorf("set home folder %v", err)
	}
	saveDir := filepath.Join(homeDir, "Pictures")

	cfg := Config{
		SaveDir: saveDir,
	}

	return &cfg, err
}

func WriteDefaultConfig(configPath string, cfg *Config) error {
	err := os.MkdirAll(filepath.Dir(configPath), 0o755)
	if err != nil {
		return fmt.Errorf("create config dir: %v", err)
	}
	tmpPath := configPath + ".tmp"
	// open a file for writing with cfg
	f, err := os.Create(tmpPath)
	if err != nil {
		return fmt.Errorf("create temp config: %v", err)
	}
	// Close the file
	defer f.Close()

	// EncodeTOML
	if err := toml.NewEncoder(f).Encode(cfg); err != nil {
		return fmt.Errorf("write config: %v", err)
	}

	// Rename tmpPath to ConfigPath
	if err := os.Rename(tmpPath, configPath); err != nil {
		return fmt.Errorf("write config: %v", err)
	}

	// All succeeded, no errors
	return nil
}

func Load() (*Config, error) {
	configDir, err := os.UserConfigDir()
	cfg, err := BuildDefault()
	if err != nil {
		return nil, fmt.Errorf("could not build the default object: %v", err)
	}

	configPath := filepath.Join(configDir, AppName, "config.toml")
	_, err = os.Stat(configPath)
	if err != nil {
		if err := WriteDefaultConfig(configPath, cfg); err != nil {
			return nil, fmt.Errorf("could not write default config file: %v", err)
		}
		err = nil
	}

	_, err = toml.DecodeFile(configPath, &cfg)
	if err != nil {
		fmt.Printf("test")
		return nil, fmt.Errorf("could not decode config file: %v", err)
	}

	return cfg, err
}
