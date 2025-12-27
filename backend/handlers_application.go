package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ApplyJob(c *gin.Context) {
	var app Application
	c.BindJSON(&app)

	DB.Create(&app)
	c.JSON(http.StatusOK, gin.H{"message": "application saved"})
}
