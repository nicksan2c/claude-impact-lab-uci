#!/bin/sh
# Start (or restart) the local web server for the html/ folder.
#   ./serve.sh          start on port 8123 and open the browser
#   ./serve.sh 9000     use another port
#   ./serve.sh stop     stop the server on port 8123 (or: ./serve.sh stop 9000)
#   NO_OPEN=1 ./serve.sh   start without opening the browser
set -e
cd "$(dirname "$0")"

PORT=8123
if [ "$1" = "stop" ]; then
  [ -n "$2" ] && PORT=$2
  PIDS=$(lsof -ti tcp:$PORT || true)
  if [ -n "$PIDS" ]; then kill $PIDS; echo "Stopped server on port $PORT."; else echo "Nothing running on port $PORT."; fi
  exit 0
fi
[ -n "$1" ] && PORT=$1

# Restart: stop whatever is already listening on the port.
PIDS=$(lsof -ti tcp:$PORT || true)
if [ -n "$PIDS" ]; then
  echo "Stopping old server on port $PORT..."
  kill $PIDS
  sleep 1
fi

echo "Serving html/ at http://localhost:$PORT  (Ctrl+C to stop)"
[ -z "$NO_OPEN" ] && (sleep 1 && open "http://localhost:$PORT") >/dev/null 2>&1 &
exec python3 -m http.server "$PORT" --directory html
