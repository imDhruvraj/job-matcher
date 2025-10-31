package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/your-org/job-matcher/backend/internal/db"
    "github.com/your-org/job-matcher/backend/internal/utils"
    "github.com/your-org/job-matcher/backend/internal/api"
)

func main() {
    // Load env
    cfg, err := utils.LoadConfig(".env")
    if err != nil {
        log.Fatalf("failed to load config: %v", err)
    }

    // Initialize logger
    logger := utils.NewLogger(cfg.Env)

    // Connect DB
    pg, err := db.NewPostgres(cfg.DatabaseURL, cfg.MaxDBConns)
    if err != nil {
        logger.Fatalf("failed to connect to db: %v", err)
    }
    defer pg.Close(context.Background())

    // Gin setup
    if cfg.Env != "production" {
        gin.SetMode(gin.DebugMode)
    } else {
        gin.SetMode(gin.ReleaseMode)
    }
    r := gin.New()
    r.Use(gin.Recovery())

    // API routes
    api.RegisterRoutes(r, pg, logger, cfg)

    srv := &http.Server{
        Addr:    fmt.Sprintf(":%d", cfg.Port),
        Handler: r,
    }

    go func() {
        logger.Infof("server starting on %d", cfg.Port)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatalf("listen: %s\n", err)
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt)
    <-quit
    logger.Info("shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        logger.Fatalf("server forced to shutdown: %v", err)
    }

    logger.Info("server exiting")
}
