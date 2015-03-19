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

type Sha struct {
	ShaId   string
	Regions []string
}

type Environment struct {
	Name         string
	Container    int32
	CPU_Shares   int32
	Memory       int32
	Dependencies []string
	Shas         []Sha
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

func main() {
	r := gin.Default()

	r.GET("/public/*filepath", staticServe)

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	r.GET("/apps", func(c *gin.Context) {
		var app [2]Application

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		app[0] = Application{1, "Delphi-UI", []Environment{
			{"staging", 20, 5, 512, []string{"Minerva", "Helios", "CMK"}, []Sha{
				{"adf56a4d", []string{"us-east-1a"}}, {"bad2313a", []string{"us-east-1a", "us-east-1d"}},
				{"basd313a", []string{"us-east-1a", "us-east-1d", "us-east-1e"}}},
			},
			{"production", 3, 5, 256, []string{"Minerva", "Helios", "CMK"}, []Sha{
				{"n2326a4d", []string{"us-east-1a", "us-east-1c"}}, {"k4543313", []string{"us-east-1e"}},
				{"osgf313a", []string{"us-east-1a", "us-east-1e"}}},
			},
			{"next-staging", 5, 10, 256, []string{"Minerva", "Helios", "CMK"}, []Sha{
				{"pasdfa4d", []string{"us-east-1a", "us-east-1d", "us-east-1e"}},
				{"t232fd31", []string{"us-east-1e"}}, {"basd313a", []string{"us-east-1a"}}},
			},
		}}
		app[1] = Application{2, "Ooyala-Live", []Environment{
			{"staging", 5, 3, 256, []string{"Redis", "Helios", "CMK"}, []Sha{
				{"abasdf23", []string{"us-west-1c", "us-west-1e"}}, {"l242afsf", []string{"us-west-1b"}},
				{"pa23131a", []string{"us-west-1a"}}},
			},
			{"production", 10, 10, 512, []string{"Redis", "Helios", "CMK"}, []Sha{
				{"madsfdf2", []string{"us-west-1c", "us-west-1d", "us-west-1e"}},
				{"qerwerfs", []string{"us-west-1b"}}, {"kasdf131", []string{"us-west-1a"}}},
			},
		}}
		c.JSON(200, &app)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5000")
}
