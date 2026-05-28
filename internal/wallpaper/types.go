package wallpaper

import (
	"time"
)

type Wallpaper struct {
	Title       string
	PostDate    time.Time
	Resolutions []Resolution
}

type Resolution struct {
	Height int
	Width  int
	Url    string
}
