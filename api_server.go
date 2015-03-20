package main

import (
	"encoding/json"
	"fmt"
	"github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

const (
	staticDir = "public"
)

type Dependency struct {
}

type AppManifest struct {
	AppType     string
	CPUShares   int
	Deps        []Dependency
	Description string
	Instances   int
	JavaType    string
	MemoryLimit int
	Name        string
	RunCommands []string
}

type Container struct {
	Name           string
	ID             string
	Description    string
	Host           string
	Env            string
	PrimaryPort    int
	SecondaryPorts []int
	SSHPort        int
	DockerID       string
	Manifest       AppManifest
}

type Region struct {
	Name       string
	Containers []Container
}

type ShaInfo struct {
	ShaId   string
	Regions []Region
}

type Sha struct {
	ShaId   string
	Regions []string
}

type Environment struct {
	Name              string
	ContainersPerZone int32
	CPUShares         int32
	Memory            int32
	Dependencies      []string
	Shas              []Sha
}

type Application struct {
	Id   int
	Name string
	Envs []Environment
}

func staticServe(c *gin.Context) {
	static, err := rice.FindBox("./public")
	if err != nil {
		log.Fatal("Unable to get filepath")
	}
	original := c.Request.URL.Path
	c.Request.URL.Path = c.Params.ByName("filepath")
	fmt.Println("filepath is " + c.Params.ByName("filepath"))
	http.FileServer(static.HTTPBox()).ServeHTTP(c.Writer, c.Request)
	c.Request.URL.Path = original
}

func readJSON(filepath string) []byte {
	_, err := os.Stat(filepath)
	if err != nil {
		panic("file doesn't exists")
	}
	content, err := ioutil.ReadFile(filepath)
	if err != nil {
		panic("error reading file")
	}
	return []byte(content)
}

func main() {
	r := gin.Default()

	r.GET("/public/*filepath", staticServe)

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	r.GET("/apps", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var apps [2]Application

		filename := "public/jsons/apps.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &apps)

		c.JSON(200, apps)
	})

	r.GET("/shas/:id", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var data []ShaInfo
		var expectedSha ShaInfo

		filename := "public/jsons/shas.json"
		shaID := c.Params.ByName("id")
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &data)

		for _, sha := range data {
			if sha.ShaId == shaID {
				expectedSha = sha
				break
			}
		}
		c.JSON(200, expectedSha)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5000")
}
