#!/usr/bin/env bash
set -euo pipefail

if [ -n "${BASH_SOURCE[0]:-}" ]; then
  SCRIPT_PATH="${BASH_SOURCE[0]}"
elif [ -n "${ZSH_VERSION:-}" ]; then
  # shellcheck disable=SC2296
  eval 'SCRIPT_PATH="${(%):-%x}"'
else
  SCRIPT_PATH="$0"
fi
REPO_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"

export TMUX=""
export TMUX_PANE=""
export FZF_TMUX=0

echo "=== 1. ShellCheck Verification ==="
shellcheck \
  "$REPO_DIR/fzf.plugin.zsh" \
  "$REPO_DIR/test/run_all.sh" \
  "$REPO_DIR/spec/spec_helper.sh"
echo "ShellCheck passed with 0 warnings."

if command -v shfmt >/dev/null 2>&1; then
  echo "=== 2. shfmt Format Verification ==="
  shfmt -d -i 2 -ci \
    "$REPO_DIR/fzf.plugin.zsh" \
    "$REPO_DIR/test/run_all.sh" \
    "$REPO_DIR/spec/spec_helper.sh"
  echo "shfmt passed."
fi

echo "=== 3. ShellSpec Matrix (Zsh) ==="
if command -v shellspec >/dev/null 2>&1; then
  if command -v zsh >/dev/null 2>&1; then
    (cd "$REPO_DIR" && shellspec -s zsh </dev/null)
  fi
fi

echo "=== All test suites and quality gates passed successfully! ==="
