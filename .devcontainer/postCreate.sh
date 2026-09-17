#!/usr/bin/env bash
# Install the Oracle MCP server's dependencies inside the dev container.
set -euo pipefail

cd "$(dirname "$0")/../mcp"
npm install

echo "MCP server dependencies installed. The Oracle HR database is seeded and ready."
