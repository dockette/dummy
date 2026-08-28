#!/usr/bin/env sh
# Smoke test against a running container. Usage: MCP_URL=http://127.0.0.1:13000 ./tests/smoke.sh
set -eu

MCP_URL="${MCP_URL:-http://127.0.0.1:3000}"
HEADERS='-H Content-Type:application/json -H Accept:application/json,text/event-stream'

call() {
    # shellcheck disable=SC2086
    curl -sS $HEADERS -X POST "${MCP_URL}/mcp" -d "$1"
}

echo "> wait for ${MCP_URL}/health"
i=0
until curl -fsS "${MCP_URL}/health" > /dev/null 2>&1; do
    i=$((i + 1))
    if [ "$i" -ge 30 ]; then
        echo "! server did not start" >&2
        exit 1
    fi
    sleep 1
done

echo "> initialize"
INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0.0"}}}'
call "$INIT" | grep -q '"serverInfo"' || { echo "! initialize failed" >&2; exit 1; }

echo "> tools/list"
LIST='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
TOOLS=$(call "$LIST")
echo "$TOOLS" | grep -q '"whoami"' || { echo "! whoami tool missing" >&2; exit 1; }
echo "$TOOLS" | grep -q '"time"' || { echo "! time tool missing" >&2; exit 1; }

echo "> tools/call whoami"
WHOAMI='{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"whoami","arguments":{}}}'
call "$WHOAMI" | grep -q '"smoke"' || { echo "! whoami did not return MCP_WHO" >&2; exit 1; }

echo "> tools/call time"
TIME='{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"time","arguments":{}}}'
call "$TIME" | grep -qE '[0-9]{4}-[0-9]{2}-[0-9]{2}T' || { echo "! time did not return a timestamp" >&2; exit 1; }

echo "> ok"
