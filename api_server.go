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

type DependencyDetails struct {
	Name   string
	Status string
	Host   string
	Port   int
}

type Dependency struct {
	Deps   []DependencyDetails
	Status string
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
	Dependencies      []DependencyDetails
}

type Application struct {
	Apps   []string
	Status string
}

type AppDetails struct {
	Id   int
	Name string
	Envs []Environment
}

type AppInfo struct {
	App    AppDetails
	Status string
}

type EnvInfo struct {
	Name string
	Shas []Sha
}

type Envs struct {
	Envs   []string
	Status string
}

type Supervisors struct {
	Supervisors []string
	Status      string
}

type managerRegion struct {
	Dev  []string
	Deva []string
}

type Managers struct {
	Managers managerRegion
	Status   string
}

type routerZone struct {
	Dev  []string
	Deva []string
}

type Routers struct {
	Routers routerZone
	Status  string
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

		var apps Application

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

	r.GET("/instance_data/:instance_id", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var data []ShaInfo
		var expectedContainer Container

		filename := "public/jsons/shas.json"
		instanceId := c.Params.ByName("instance_id")
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &data)

		for _, sha := range data {
			var regions = sha.Regions
			for _, reg := range regions {
				var containers = reg.Containers
				for _, con := range containers {
					if con.ID == instanceId {
						expectedContainer = con
						break
					}
				}
			}
		}
		c.JSON(200, expectedContainer)
	})

	r.GET("/deps", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var deps Dependency

		filename := "public/jsons/deps.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &deps)
		c.JSON(200, deps)
	})

	r.GET("/apps/:app_name", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var data [2]AppInfo
		var expectedInfo AppInfo

		filename := "public/jsons/app_info.json"
		appName := c.Params.ByName("app_name")
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &data)

		for _, app := range data {
			if app.App.Name == appName {
				expectedInfo = app
				break
			}
		}
		c.JSON(200, expectedInfo)
	})

	r.GET("/apps/:app_name/envs/:env_name", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var envInfo EnvInfo
		appName := c.Params.ByName("app_name")
		envName := c.Params.ByName("env_name")
		filename := "public/jsons/" + appName + "_" + envName + ".json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &envInfo)

		c.JSON(200, envInfo)
	})

	r.GET("/envs", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var envs Envs

		filename := "public/jsons/envs.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &envs)

		c.JSON(200, envs)
	})

	r.GET("/supervisors", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var supervisors Supervisors

		filename := "public/jsons/supervisors.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &supervisors)

		c.JSON(200, supervisors)
	})

	r.GET("/managers", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var managers Managers

		filename := "public/jsons/managers.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &managers)

		c.JSON(200, managers)
	})

	r.GET("/routers", func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		var routers Routers

		filename := "public/jsons/routers.json"
		content := readJSON(filename)
		json.Unmarshal([]byte(content), &routers)

		c.JSON(200, routers)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5001")
}
