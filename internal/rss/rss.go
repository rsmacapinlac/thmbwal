package rss

import (
	"fmt"
	"io"
	"net/http"
)

const SmashingMagazineWallpaperRSS = "https://www.smashingmagazine.com/category/wallpapers/index.xml"

type Item struct {
}

type Feed struct {
	Items []Item
}

func Parse(r io.Reader) (*Feed, error) {
	return nil, nil
}

func Fetch() (*Feed, error) {
	resp, err := http.Get(SmashingMagazineWallpaperRSS)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Could not fetch RSS, unexpected status: %s", resp.Status)
	}
	/*
		body, err := io.ReadAll(resp.Body)
	  fmt.Printf("%s",body)
	*/
	return Parse(resp.Body)
}
