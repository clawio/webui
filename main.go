package main

import (
	"log"
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(assetFS()))
	log.Println("Connet to http://localhost:1503 with a browser")
	log.Fatal(http.ListenAndServe(":1503", nil))
}
