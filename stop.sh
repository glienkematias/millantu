#!/bin/bash
cd "$(dirname "$0")"

PIDFILE=".dev-server.pid"

if [ ! -f "$PIDFILE" ]; then
  echo "No hay servidor corriendo."
  exit 0
fi

PID=$(cat "$PIDFILE")

if kill -0 "$PID" 2>/dev/null; then
  echo "Deteniendo servidor (PID: $PID)..."
  kill "$PID" 2>/dev/null
  sleep 1
  kill -9 "$PID" 2>/dev/null
  rm -f "$PIDFILE"
  echo "Servidor detenido."
else
  echo "El servidor ya no está corriendo."
  rm -f "$PIDFILE"
fi
