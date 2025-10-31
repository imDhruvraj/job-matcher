package utils

import (
    "log"
)

type Logger struct {
    *log.Logger
    env string
}

func NewLogger(env string) *Logger {
    l := log.Default()
    return &Logger{Logger: l, env: env}
}

func (l *Logger) Info(args ...interface{}) {
    l.Println("[INFO]", args)
}

func (l *Logger) Infof(format string, args ...interface{}) {
    l.Printf("[INFO] "+format+"\n", args...)
}

func (l *Logger) Fatalf(format string, args ...interface{}) {
    l.Printf("[FATAL] "+format+"\n", args...)
    panic("fatal")
}

func (l *Logger) Fatal(args ...interface{}) {
    l.Println("[FATAL]", args)
    panic("fatal")
}
