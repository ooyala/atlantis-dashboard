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
		var app [3]Application

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		app[0] = Application{"app1", []Environment{{"env1", 1, 2, 3, []string{"redis", "sql", "heroku"}, []int16{10, 11, 12}},
			{"env12", 4, 5, 6, []string{"redis1", "sql1", "heroku1"}, []int16{101, 102, 103}}}}
		app[1] = Application{"app2", []Environment{{"env2", 1, 2, 3, []string{"redis2", "sql2", "heroku2"}, []int16{20, 21, 22}},
			{"env21", 4, 5, 6, []string{"redis21", "sql22", "heroku23"}, []int16{201, 202, 203}}}}
		app[2] = Application{"app3", []Environment{{"env3", 1, 2, 3, []string{"redis3", "sql3", "heroku3"}, []int16{30, 31, 32}},
			{"env31", 4, 5, 6, []string{"redis31", "sql32", "heroku33"}, []int16{301, 302, 303}}}}
		c.JSON(200, &app)
	})

	r.GET("/envs", func(c *gin.Context) {
		var pe [7]Person

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		pe[0] = Person{"john", []string{"a", "b", "c"}}
		pe[1] = Person{"john1", []string{"a1", "b1", "c1"}}
		pe[2] = Person{"john2", []string{"a2", "b2", "c2"}}
		pe[3] = Person{"john3", []string{"a2", "b2", "c2"}}
		pe[4] = Person{"john4", []string{"a2", "b2", "c2"}}
		pe[5] = Person{"john5", []string{"a2", "b2", "c2"}}

		c.JSON(200, &pe)
	})

	fmt.Println("Listening on port 5000")
	// this must be last line
	r.Run(":5000")
}
