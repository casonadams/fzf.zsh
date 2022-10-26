local FZF_DIR=$(dirname "${(%):-%x}")

# Auto-completion
if [[ -o interactive && "${DISABLE_FZF_AUTO_COMPLETION}" != "true" ]]; then
  source "${FZF_DIR}/shell/completion.zsh" 2> /dev/null
fi

# Key bindings
if [[ "${DISABLE_FZF_KEY_BINDINGS}" != "true" ]]; then
  source "${FZF_DIR}/shell/key-bindings.zsh"
fi

# Bat theme
if [[ -z "$BAT_THEME" ]]; then
  export BAT_THEME="ansi"
fi

if [[ -z "$FZF_PREVIEW_COMMAND" ]]; then
  export FZF_PREVIEW_COMMAND='([[ -f {} ]] && (bat --style=numbers --color=always {} || cat {})) \
    || ([[ -d {} ]] && (tree -L 2 -a -C {} | less || echo {} 2> /dev/null | head -200))'
fi

if [[ -z "$FZF_DEFAULT_COMMAND" ]]; then
  export FZF_DEFAULT_COMMAND="fd --type f || rg --files || find ."
fi

if [[ -z "$FZF_DEFAULT_OPTS" ]]; then
  export FZF_DEFAULT_OPTS="\
  --color=16 \
  --reverse \
  --inline-info \
  --cycle \
  --height=${FZF_TMUX_HEIGHT:-40%} \
  --tiebreak=index \
  --bind '?:toggle-preview,tab:down,btab:up' \
  --preview '([[ -f {} ]] && (bat --style=numbers --color=always {} || cat {})) || ([[ -d {} ]] && (tree -L 2 -a -C {} | less || echo {} 2> /dev/null | head -200))' \
  --preview-window=right \
  "
fi
