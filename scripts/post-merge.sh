#!/bin/bash
set -e

pnpm install --frozen-lockfile
pnpm --filter db push

# Auto-sync to GitHub after every task merge.
# Replit is the source of truth; GitHub is a backup mirror.
# Token is passed as a one-shot URL so it is never written to .git/config.
if [ -z "$GITHUB_TOKEN" ]; then
  echo "WARNING: GITHUB_TOKEN is not set — GitHub sync skipped"
  exit 0
fi

PUSH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/vikash-kushwah/Content-Hub.git"

echo "Syncing to GitHub..."

# Try a fast-forward push first.
# If the remote has diverged (e.g. prior task-agent direct push created
# different commit objects), fall back to a force push so Replit always wins.
if git push "$PUSH_URL" HEAD:main --quiet 2>&1; then
  echo "GitHub sync complete (fast-forward)"
elif git push "$PUSH_URL" HEAD:main --force --quiet 2>&1; then
  echo "GitHub sync complete (force — remote had diverged history)"
else
  echo "ERROR: GitHub sync failed"
  exit 1
fi
