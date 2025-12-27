package main

import (
	"context"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type GoogleLoginRequest struct {
	Token string `json:"token"`
	Role  string `json:"role"` // candidate | company
}

func GoogleLogin(c *gin.Context) {
	var req GoogleLoginRequest
	c.BindJSON(&req)

	payload, err := idtoken.Validate(context.Background(), req.Token, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid google token"})
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)

	var user User
	result := DB.Where("email = ?", email).First(&user)

	if result.Error != nil {
		user = User{
			Email:    email,
			Name:     name,
			Role:     req.Role,
			Provider: "google",
		}
		DB.Create(&user)
	}

	jwtToken, _ := GenerateJWT(user.ID, user.Role)

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}
