package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

const (
	staticDir = "/public/"
)

var (
	port           = 5001
	metadataFile   = "metadata.json"
	urlJSONMapping map[string]interface{}
	filename       string
	content        []byte
)

func readJSON(filepath string) []byte {
	jsonDir := strings.Trim(staticDir, "/") + "/jsons/"
	jsonPath := jsonDir + filepath

	_, err := os.Stat(jsonPath)
	if err != nil {
		panic("file doesn't exists")
	}
	content, err := ioutil.ReadFile(jsonPath)
	if err != nil {
		panic("error reading file")
	}
	return []byte(content)
}

func createMetadata(fn string) {
	var data interface{}

	content, err := ioutil.ReadFile(fn)
	if err != nil {
		panic(err)
	}
	if err := json.Unmarshal(content, &data); err != nil {
		panic(err)
	}
	var ok bool
	urlJSONMapping, ok = data.(map[string]interface{})
	if !ok {
		panic(err)
	}
}

// New ServerMux to serve static content
var staticHTTP = http.NewServeMux()

func main() {
	if len(os.Args) == 2 {
		metadataFile = os.Args[1]
	}
	createMetadata(metadataFile)

	log.Printf("Listening to port %d ...", port)
	http.HandleFunc("/", handler)
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("favicon"))
	})
	staticHTTP.Handle(staticDir, http.StripPrefix(staticDir, http.FileServer(http.Dir(strings.Trim(staticDir, "/")))))
	http.ListenAndServe(fmt.Sprint(":", port), nil)
}

// Handler
func handler(w http.ResponseWriter, r *http.Request) {
	if strings.Contains(r.URL.Path, staticDir) {
		staticHTTP.ServeHTTP(w, r)
	} else {
		r.Header.Set("Content-Type", "application/json")
		filename = (urlJSONMapping[r.URL.Path]).(string)
		content = readJSON(filename)
		w.Write(content)
	}
}
