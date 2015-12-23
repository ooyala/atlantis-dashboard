package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strings"
)

const (
	staticDir = "/public/"
	chars     = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
)

var (
	port           = 5001
	metadataFile   = "metadata.json"
	urlJSONMapping map[string]interface{}
	filename       string
	content        []byte
)

type status struct {
	Status string
}

type taskId struct {
	ID string
}

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
	staticHTTP.Handle(staticDir, http.StripPrefix(staticDir, http.FileServer(http.Dir(strings.Trim(staticDir, "/")))))
	http.ListenAndServe(fmt.Sprint(":", port), nil)
}

func handleNonGetRequest(w http.ResponseWriter, r *http.Request) {
	var (
		appUrl        = regexp.MustCompile(`/apps/[a-zA-Z]+`)
		ipgroupUrl    = regexp.MustCompile(`/ipgroups/[a-zA-Z]+`)
		managerUrl    = regexp.MustCompile(`/managers/[a-zA-Z]+`)
		routerUrl     = regexp.MustCompile(`/routers/[a-zA-Z]+`)
		supervisorUrl = regexp.MustCompile(`/supervisors/[a-zA-Z]+`)
	)

	if appUrl.MatchString(r.URL.String()) || ipgroupUrl.MatchString(r.URL.String()) {
		buff, _ := json.Marshal(status{Status: "OK"})
		w.Write(buff)
	} else if managerUrl.MatchString(r.URL.String()) || routerUrl.MatchString(r.URL.String()) ||
		supervisorUrl.MatchString(r.URL.String()) {
		result := make([]byte, 20)
		for i := 0; i < 20; i++ {
			result[i] = chars[rand.Intn(len(chars))]
		}
		buff, _ := json.Marshal(taskId{ID: string(result)})
		w.Write(buff)
	}
}

// Handler
func handler(w http.ResponseWriter, r *http.Request) {
	var taskUrl = regexp.MustCompile(`/tasks/[a-zA-Z]+`)

	if r.Method == "GET" && taskUrl.MatchString(r.URL.String()) {
		buff, _ := json.Marshal(status{Status: "DONE"})
		w.Write(buff)
	} else if r.Method != "GET" {
		handleNonGetRequest(w, r)
	} else {
		if strings.Contains(r.URL.Path, staticDir) {
			staticHTTP.ServeHTTP(w, r)
		} else {
			r.Header.Set("Content-Type", "application/json")
			filePATH := urlJSONMapping[r.URL.Path]
			if filePATH != nil {
				content = readJSON(filePATH.(string))
				w.Write(content)
			} else {
				http.NotFound(w, r)
			}
		}
	}
}
