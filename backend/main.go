package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	// --------------------
	// DATABASE
	// --------------------
	ConnectDatabase()

	// --------------------
	// ROUTER
	// --------------------
	r := gin.Default()

	// --------------------
	// CORS (CRITICAL FIX)
	// --------------------
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// --------------------
	// AUTH (PUBLIC)
	// --------------------
	r.POST("/auth/google", GoogleLogin)

	// --------------------
	// PUBLIC READ ROUTES
	// --------------------
	r.GET("/candidate/:id/jobs", GetRecommendedJobs)

	// --------------------
	// PROTECTED ROUTES (JWT)
	// --------------------
	auth := r.Group("/")
	auth.Use(AuthMiddleware())

	// --------------------
	// CANDIDATE ROUTES
	// --------------------
	candidate := auth.Group("/")
	candidate.Use(RequireRole("candidate"))
	{
		candidate.POST("/candidate", CreateCandidate)
		candidate.POST("/candidate/resume", UploadResume)
		candidate.POST("/apply", ApplyJob)
	}

	// --------------------
	// COMPANY ROUTES
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
