package utils

import (
    "errors"
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

type Config struct {
    Env         string
    Port        int
    DatabaseURL string
    JWTSecret   string
    MaxDBConns  int
    S3Bucket    string
}

func LoadConfig(envPath string) (*Config, error) {
    _ = godotenv.Load(envPath) // ignore error; env may be provided by host

    env := getEnv("APP_ENV", "development")
    port := getEnvAsInt("PORT", 8080)
    dbURL := os.Getenv("DATABASE_URL")
    jwtSecret := os.Getenv("JWT_SECRET")
    maxDB := getEnvAsInt("MAX_DB_CONNS", 10)

    if dbURL == "" {
        return nil, errors.New("DATABASE_URL not set")
    }
    if jwtSecret == "" {
        return nil, errors.New("JWT_SECRET not set")
    }

    return &Config{
        Env:         env,
        Port:        port,
        DatabaseURL: dbURL,
        JWTSecret:   jwtSecret,
        MaxDBConns:  maxDB,
        S3Bucket:    os.Getenv("S3_BUCKET"),
    }, nil
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}

func getEnvAsInt(name string, fallback int) int {
    if v := os.Getenv(name); v != "" {
        if i, err := strconv.Atoi(v); err == nil {
            return i
        }
    }
    return fallback
}
