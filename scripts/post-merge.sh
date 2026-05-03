#!/bin/bash
set -e

pnpm install --frozen-lockfile
pnpm --filter db push

# Auto-sync to GitHub after every task merge
if [ -n "$GITHUB_TOKEN" ]; then
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/vikash-kushwah/Content-Hub.git"
  git push origin HEAD:main --quiet
  echo "GitHub sync complete"
else
  echo "GITHUB_TOKEN not set — skipping GitHub push"
fi
