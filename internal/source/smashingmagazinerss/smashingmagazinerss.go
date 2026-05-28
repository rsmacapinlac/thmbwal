package smashingmagazinerss

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"thmbwal/internal/wallpaper"

	"github.com/PuerkitoBio/goquery"
)

const SmashingMagazineWallpaperRSS = "https://www.smashingmagazine.com/category/wallpapers/index.xml"

type rss struct {
	Channel channel `xml:"channel"`
}

type channel struct {
	Items []rssItem `xml:"item"`
}

type rssItem struct {
	Title   string `xml:"title"`
	PubDate string `xml:"pubDate"`
	Content string `xml:"http://purl.org/rss/1.0/modules/content/ encoded"`
}

func parseContent(content string) ([]wallpaper.Resolution, error) {
	// h, err := html.Parse(strings.NewReader(content))

	resolutions := []wallpaper.Resolution{}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(content))
	if err != nil {
		return nil, err
	}

	re := regexp.MustCompile(`\d+x\d+`)
	doc.Find("a[title]").Each(func(i int, s *goquery.Selection) {
		title, _ := s.Attr("title")
		href, _ := s.Attr("href")
		if re.MatchString(title) {
			resolution := strings.Split(re.FindString(title), "x")
			width, _ := strconv.Atoi(resolution[0])
			height, _ := strconv.Atoi(resolution[1])
			// fmt.Printf("%s (%s) (%sx%s)\n", title, href, width, height)
			tmpResolution := wallpaper.Resolution{
				Height: height,
				Width:  width,
				Url:    href,
			}
			resolutions = append(resolutions, tmpResolution)

		}
	})
	return resolutions, nil
}

func Parse(r io.Reader) ([]wallpaper.Wallpaper, error) {
	decoder := xml.NewDecoder(r)
	feed := rss{}
	err := decoder.Decode(&feed)
	if err != nil {
		return nil, err
	}
	// fmt.Printf("%s", feed)
	// fmt.Printf("%s\n", feed.Channel.Items[0].Title)

	// initialize wallpaper array?
	wallpapers := []wallpaper.Wallpaper{}

	for _, item := range feed.Channel.Items {
		pubDateTime, err := time.Parse("Mon, 02 Jan 2006 15:04:05 -0700", item.PubDate)
		if err != nil {
			return nil, err
		}

		// parse the html coming back?
		resolutions, err := parseContent(item.Content)
		if err != nil {
			return nil, err
		}

		wallpaper := wallpaper.Wallpaper{
			Title:       item.Title,
			PostDate:    pubDateTime,
			Resolutions: resolutions,
		}
		// fmt.Printf("%d: %s\n", idx, wallpaper.Title)
		wallpapers = append(wallpapers, wallpaper)
	}
	return wallpapers, nil
}

func Fetch() ([]wallpaper.Wallpaper, error) {
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
