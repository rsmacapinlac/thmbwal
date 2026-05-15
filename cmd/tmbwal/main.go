package main

import (
	"fmt"
	"thmbwal/internal/config"
)

func main() {
	config.Load("helloworld")
	fmt.Println("test")
}
