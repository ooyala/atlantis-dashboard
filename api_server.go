package main

import (
	"fmt"
	"github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

const (
	staticDir = "public"
)

type Person struct {
	Name    string   `json:name`
	Hobbies []string `json:hobbies`
}

type Environment struct {
	Name         string
	Container    int32
	CPU_Shares   int32
	Memory       int32
	Dependencies []string
	Sha          []string
}

type Application struct {
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

func main() {
	r := gin.Default()

	r.GET("/public/*filepath", staticServe)

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	r.GET("/apps", func(c *gin.Context) {
		var app [2]Application

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		app[0] = Application{"Delphi-UI", []Environment{
			{"staging", 20, 5, 512, []string{"Minerva", "Helios", "CMK"}, []string{
				"adf56a4d", "bad2313a", "basd313a",
			}},
			{"production", 3, 5, 256, []string{"Minerva", "Helios", "CMK"}, []string{
				"n2326a4d", "k4543313", "osgf313a",
			}},
			{"next-staging", 5, 10, 256, []string{"Minerva", "Helios", "CMK"}, []string{
				"pasdfa4d", "t232fd31", "basd313a",
			}},
		}}
		app[1] = Application{"Ooyala-Live", []Environment{
			{"staging", 5, 3, 256, []string{"Redis", "Helios", "CMK"}, []string{
				"abasdf23", "l242afsf", "pa23131a",
			}},
			{"production", 10, 10, 512, []string{"Redis", "Helios", "CMK"}, []string{
				"madsfdf2", "qerwerfs", "kasdf131",
			}},
		}}
		c.JSON(200, &app)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5000")
}
