package db

import (
    "context"
    "time"

    "github.com/jackc/pgx/v5/stdlib"
    "database/sql"
    "fmt"
)

func NewPostgres(databaseURL string, maxConns int) (*sql.DB, error) {
    db, err := sql.Open("pgx", databaseURL)
    if err != nil {
        return nil, err
    }
    db.SetConnMaxLifetime(time.Hour)
    db.SetMaxOpenConns(maxConns)
    db.SetMaxIdleConns(maxConns / 2)

    // quick ping
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := db.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("ping db: %w", err)
    }
    return db, nil
}
