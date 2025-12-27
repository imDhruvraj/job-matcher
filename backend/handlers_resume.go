package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadResume(c *gin.Context) {
	candidateID := c.PostForm("candidate_id")
	id, err := strconv.Atoi(candidateID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid candidate_id"})
		return
	}

	file, err := c.FormFile("resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resume file required"})
		return
	}

	// Ensure directory exists
	uploadDir := "storage/resumes"
	os.MkdirAll(uploadDir, os.ModePerm)

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("candidate_%d_resume%s", id, ext)
	fullPath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, fullPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save resume"})
		return
	}

	// Update DB
	DB.Model(&Candidate{}).
		Where("id = ?", id).
		Update("resume_path", fullPath)

	c.JSON(http.StatusOK, gin.H{
		"message":     "resume uploaded successfully",
		"resume_path": fullPath,
	})
}