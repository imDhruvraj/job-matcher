package main

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"unique"`
	Name     string
	Role     string // candidate | company
	Provider string // google
}

type Candidate struct {
	gorm.Model
	UserID     uint
	Skills     string
	Experience int
	ResumePath string
}

type Company struct {
	gorm.Model
	UserID uint
	Name   string
}

type Job struct {
	gorm.Model
	CompanyID     uint
	Title         string
	Skills        string
	MinExperience int
}

type Application struct {
	gorm.Model
	CandidateID uint
	JobID       uint
	Status      string
}
