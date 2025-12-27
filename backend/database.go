package main

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DB_URL")

	var db *gorm.DB
	var err error

	for i := 1; i <= 15; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Println("Database connected")
			break
		}

		log.Printf("Database not ready (attempt %d/15). Retrying...\n", i)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("Could not connect to database after retries")
	}

	DB = db

	err = DB.AutoMigrate(
		&User{},
		&Candidate{},
		&Company{},
		&Job{},
		&Application{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed")
	}

	log.Println("Database migrated successfully")
}
