#!/bin/bash
cd "$(dirname "$0")"

PIDFILE=".dev-server.pid"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "El servidor ya está corriendo (PID: $(cat "$PIDFILE"))"
  echo "http://localhost:3000"
  exit 0
fi

echo "Iniciando Millantu Cosméticos..."
nohup npm run dev > .dev-server.log 2>&1 &
echo $! > "$PIDFILE"

sleep 3

if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Servidor iniciado correctamente (PID: $(cat "$PIDFILE"))"
  echo "http://localhost:3000"
  echo "Admin: http://localhost:3000/admin"
else
  echo "Error al iniciar el servidor. Revisá .dev-server.log"
  cat .dev-server.log
  rm -f "$PIDFILE"
  exit 1
fi
