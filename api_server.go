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
	Sha          []int16
}

type Application struct {
	Name string
	Env  []Environment
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

		app[0] = Application{"Delphi-UI", []Environment{{"staging", 1, 2, 3, []string{"redis", "sql", "heroku"}, []int16{10, 11, 12}},
			{"production", 4, 5, 6, []string{"redis1", "sql1", "heroku1"}, []int16{101, 102, 103}}}}
		app[1] = Application{"Ooyala-Live", []Environment{{"staging", 1, 2, 3, []string{"redis2", "sql2", "heroku2"}, []int16{20, 21, 22}},
			{"production", 4, 5, 6, []string{"redis21", "sql22", "heroku23"}, []int16{201, 202, 203}}}}
		c.JSON(200, &app)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5000")
}
