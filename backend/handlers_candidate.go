package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateCandidate(c *gin.Context) {
	var body Candidate
	c.BindJSON(&body)

	DB.Create(&body)
	c.JSON(http.StatusOK, gin.H{"message": "candidate created"})
}

func GetRecommendedJobs(c *gin.Context) {
	candidateID := c.Param("id")

	var candidate Candidate
	if err := DB.First(&candidate, candidateID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "candidate not found"})
		return
	}

	var jobs []Job
	DB.Find(&jobs)

	var matched []Job
	candidateSkills := strings.Split(candidate.Skills, ",")

	for _, job := range jobs {
		if candidate.Experience < job.MinExperience {
			continue
		}

		for _, cs := range candidateSkills {
			if strings.Contains(job.Skills, cs) {
				matched = append(matched, job)
				break
			}
		}
	}

	c.JSON(http.StatusOK, matched)
}
