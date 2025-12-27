package main

import "github.com/gin-gonic/gin"

func main() {
	// Initialize DB (with retry + automigrate)
	ConnectDatabase()

	r := gin.Default()

	// --------------------
	// AUTH (PUBLIC)
	// --------------------
	r.POST("/auth/google", GoogleLogin)

	// --------------------
	// PUBLIC READ ROUTES
	// --------------------
	r.GET("/candidate/:id/jobs", GetRecommendedJobs)

	// --------------------
	// PROTECTED ROUTES
	// --------------------
	auth := r.Group("/")
	auth.Use(AuthMiddleware())

	// --------------------
	// CANDIDATE-ONLY ROUTES
	// --------------------
	candidate := auth.Group("/")
	candidate.Use(RequireRole("candidate"))
	{
		candidate.POST("/candidate", CreateCandidate)
		candidate.POST("/candidate/resume", UploadResume)
		candidate.POST("/apply", ApplyJob)
	}

	// --------------------
	// COMPANY-ONLY ROUTES
	// --------------------
	company := auth.Group("/")
	company.Use(RequireRole("company"))
	{
		company.POST("/job", CreateJob)
		company.GET("/job/:id/candidates", GetOptedCandidates)
	}

	// --------------------
	// START SERVER
	// --------------------
	r.Run(":8080")
}