#!/usr/bin/env bash
# nanomind-x installer. Run from the repository root after cloning.
# Installs dependencies, places the nanomind-x command, and smoke-tests
# the wiring against an empty temporary session dir (no live session,
# no network calls to X, nothing is posted).
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO"

NODE_MAJOR="$(node --version | sed -E 's/^v([0-9]+).*/\1/')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node 20+ is required (found $(node --version)). Install Node 24 and retry." >&2
  exit 1
fi
command -v npm >/dev/null || { echo "npm is required." >&2; exit 1; }

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

chmod +x nanomind-x.mjs engine/src/cli/index.js engine/src/mcp/server.js scripts/refresh-query-ids.mjs

# Place the nanomind-x command.
BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"
cat > "$BIN_DIR/nanomind-x" <<EOF
#!/usr/bin/env bash
exec node "$REPO/nanomind-x.mjs" "\$@"
EOF
chmod +x "$BIN_DIR/nanomind-x"

# Smoke test 1: usage output, no session read, no network.
set +e
node ./nanomind-x.mjs > /tmp/nanomind-x-smoke-usage.json 2>/dev/null
rc=$?
set -e
if [ "$rc" -ne 2 ]; then echo "Smoke test failed: usage exit was $rc, expected 2." >&2; exit 1; fi
grep -q '"code":"USAGE"' /tmp/nanomind-x-smoke-usage.json || { echo "Smoke test failed: no USAGE error." >&2; exit 1; }

# Smoke test 2: health against an empty temporary session dir. A fresh
# install has no session, so the only acceptable result is a clean AUTH
# failure (exit 4). This proves the wiring without touching a live session.
SMOKE_HOME="$(mktemp -d)"
trap 'rm -rf "$SMOKE_HOME" /tmp/nanomind-x-smoke-usage.json' EXIT
set +e
NANOMIND_X_HOME="$SMOKE_HOME" node ./nanomind-x.mjs health > /tmp/nanomind-x-smoke-health.json 2>/dev/null
rc=$?
set -e
if [ "$rc" -eq 4 ] && grep -q '"code":"AUTH"' /tmp/nanomind-x-smoke-health.json; then
  echo "Smoke test: health correctly reports no session (AUTH, exit 4)."
elif [ "$rc" -eq 0 ]; then
  echo "Smoke test: health passed (a session already exists in the default dir)."
else
  echo "Smoke test failed: health exit was $rc, expected 4 (AUTH) or 0." >&2
  cat /tmp/nanomind-x-smoke-health.json >&2
  exit 1
fi

echo
echo "nanomind-x installed."
echo "  command: $BIN_DIR/nanomind-x  (add $BIN_DIR to PATH if needed)"
echo "Next steps:"
echo "  1. nanomind-x-engine login --cookies-file <cookies.json>   (then delete the export)"
echo "  2. nanomind-x health"
echo "  3. nanomind-x search \"freemint bsc\" --mode latest --limit 5"
