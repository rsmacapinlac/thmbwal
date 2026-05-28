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

func parseContent(content string, dt time.Time) []wallpaper.Wallpaper {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(content))
	if err != nil {
		return nil
	}

	wallpapersByTitle := map[string]wallpaper.Wallpaper{}
 
	re := regexp.MustCompile(`\d+x\d+`)
	doc.Find("a[title]").Each(func(i int, s *goquery.Selection) {

		title, _ := s.Attr("title") 
		href, _ := s.Attr("href")


		if re.MatchString(title) {
			resolution := strings.Split(re.FindString(title), "x")
			baseTitle := strings.TrimSuffix(title, " - " + resolution[0]+"x"+resolution[1])
			width, _ := strconv.Atoi(resolution[0])
			height, _ := strconv.Atoi(resolution[1])

			// fmt.Printf("%s (%s) (%sx%s)\n", title, href, width, height)
			// fmt.Printf("baseTitle: %s\n", baseTitle)

			wp, exists := wallpapersByTitle[baseTitle]
			if !exists {
				wp = wallpaper.Wallpaper{
					Title: baseTitle,
					PostDate: dt,
				}
			}
			tmpResolution := wallpaper.Resolution{
				Height: height,
				Width:  width,
				Url:    href,
			}
			wp.Resolutions = append(wp.Resolutions, tmpResolution)
			wallpapersByTitle[baseTitle] = wp
		}
	})

	wallpapers := []wallpaper.Wallpaper{}
	for _, wp := range wallpapersByTitle {
		wallpapers = append(wallpapers, wp)
	}
	return wallpapers
}

func Parse(r io.Reader) ([]wallpaper.Wallpaper, error) {
	decoder := xml.NewDecoder(r)
	feed := rss{}
	err := decoder.Decode(&feed)
	if err != nil {
		return nil, err
	}

	wallpapers := []wallpaper.Wallpaper{}
	for _, item := range feed.Channel.Items {

		// reading a post, which contains multiple wallpapers

		pubDateTime, err := time.Parse("Mon, 02 Jan 2006 15:04:05 -0700", item.PubDate)
		if err != nil {
			return nil, err
		}

		// reading a post, which contains multiple wallpapers
		tmpWallpapers := []wallpaper.Wallpaper{}
		tmpWallpapers = parseContent(item.Content, pubDateTime)

		wallpapers = append(wallpapers, tmpWallpapers...)
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

	return Parse(resp.Body)
}
