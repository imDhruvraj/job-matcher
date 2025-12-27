package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateJob(c *gin.Context) {
	var job Job
	c.BindJSON(&job)

	DB.Create(&job)
	c.JSON(http.StatusOK, gin.H{"message": "job created"})
}

func GetOptedCandidates(c *gin.Context) {
	jobID := c.Param("id")

	var apps []Application
	DB.Where("job_id = ? AND status = ?", jobID, "opted_in").Find(&apps)

	var candidates []Candidate
	for _, app := range apps {
		var cnd Candidate
		DB.First(&cnd, app.CandidateID)
		candidates = append(candidates, cnd)
	}

	c.JSON(http.StatusOK, candidates)
}
