# shellcheck shell=bash
_fzf_init() {
  local _fzf_plugin_dir=""
  if [ -n "${ZSH_VERSION:-}" ]; then
    # shellcheck disable=SC2296
    eval '_fzf_plugin_dir="${${(%):-%x}:A:h}"'
  else
    _fzf_plugin_dir="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd)"
  fi

  local _fzf_comp_file="" _fzf_key_file=""
  local -a _fzf_candidates=(
    "${FZF_BASE:-}"
    "/opt/homebrew/opt/fzf"
    "/usr/local/opt/fzf"
    "${HOME:-}/.fzf"
    "/usr/share/fzf"
    "/usr/share/doc/fzf"
    "/etc/zsh_completion.d"
    "${_fzf_plugin_dir}/shell"
    "${_fzf_plugin_dir}"
  )

  local _dir
  for _dir in "${_fzf_candidates[@]}"; do
    if [ -z "$_dir" ] || [ ! -d "$_dir" ]; then
      continue
    fi

    if ! command -v fzf >/dev/null 2>&1; then
      if [ -x "$_dir/bin/fzf" ]; then
        PATH="$_dir/bin:$PATH"
        export PATH
      fi
    fi

    if [ -z "$_fzf_comp_file" ]; then
      if [ -f "$_dir/shell/completion.zsh" ]; then
        _fzf_comp_file="$_dir/shell/completion.zsh"
      elif [ -f "$_dir/completion.zsh" ]; then
        _fzf_comp_file="$_dir/completion.zsh"
      fi
    fi

    if [ -z "$_fzf_key_file" ]; then
      if [ -f "$_dir/shell/key-bindings.zsh" ]; then
        _fzf_key_file="$_dir/shell/key-bindings.zsh"
      elif [ -f "$_dir/key-bindings.zsh" ]; then
        _fzf_key_file="$_dir/key-bindings.zsh"
      fi
    fi

    if [ -n "$_fzf_comp_file" ] && [ -n "$_fzf_key_file" ]; then
      break
    fi
  done

  if [ -z "$_fzf_comp_file" ] && [ -f "${_fzf_plugin_dir}/shell/completion.zsh" ]; then
    _fzf_comp_file="${_fzf_plugin_dir}/shell/completion.zsh"
  fi
  if [ -z "$_fzf_key_file" ] && [ -f "${_fzf_plugin_dir}/shell/key-bindings.zsh" ]; then
    _fzf_key_file="${_fzf_plugin_dir}/shell/key-bindings.zsh"
  fi

  if [ -n "${ZSH_VERSION:-}" ] && command -v fzf >/dev/null 2>&1; then
    if [[ -o interactive ]] && [ "${DISABLE_FZF_AUTO_COMPLETION:-}" != "true" ]; then
      if [ -n "$_fzf_comp_file" ] && [ -f "$_fzf_comp_file" ]; then
        # shellcheck source=/dev/null
        source "$_fzf_comp_file" 2>/dev/null
      fi
    fi

    if [ "${DISABLE_FZF_KEY_BINDINGS:-}" != "true" ]; then
      if [ -n "$_fzf_key_file" ] && [ -f "$_fzf_key_file" ]; then
        # shellcheck source=/dev/null
        source "$_fzf_key_file"
      fi
    fi
  fi

  if [ -z "${BAT_THEME:-}" ]; then
    export BAT_THEME="ansi"
  fi

  if [ -z "${FZF_PREVIEW_COMMAND:-}" ]; then
    export FZF_PREVIEW_COMMAND='([[ -f {} ]] && (bat --style=numbers --color=always {} 2>/dev/null || cat {})) || ([[ -d {} ]] && (tree -C -L 2 {} 2>/dev/null || eza --tree --level=2 --color=always {} 2>/dev/null || ls -la {}))'
  fi

  if [ -z "${FZF_DEFAULT_COMMAND:-}" ]; then
    if command -v fd >/dev/null 2>&1; then
      export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --follow --exclude .git"
    elif command -v rg >/dev/null 2>&1; then
      export FZF_DEFAULT_COMMAND="rg --files --hidden --follow --glob '!.git/*'"
    else
      export FZF_DEFAULT_COMMAND="find . -type f"
    fi
  fi

  if [ -z "${FZF_CTRL_T_COMMAND:-}" ]; then
    if command -v fd >/dev/null 2>&1; then
      export FZF_CTRL_T_COMMAND="fd --strip-cwd-prefix --hidden --follow --exclude .git"
    elif command -v rg >/dev/null 2>&1; then
      export FZF_CTRL_T_COMMAND="rg --files --hidden --follow --glob '!.git/*'"
    fi
  fi

  if [ -z "${FZF_ALT_C_COMMAND:-}" ]; then
    if command -v fd >/dev/null 2>&1; then
      export FZF_ALT_C_COMMAND="fd --type d --strip-cwd-prefix --hidden --follow --exclude .git"
    fi
  fi

  if [ -z "${FZF_DEFAULT_OPTS:-}" ]; then
    export FZF_DEFAULT_OPTS="--color=16 --reverse --inline-info --cycle --height=${FZF_TMUX_HEIGHT:-40%} --tiebreak=index --bind 'ctrl-/:toggle-preview,alt-?:toggle-preview,tab:down,btab:up' --preview '${FZF_PREVIEW_COMMAND}' --preview-window 'right,50%,border-left,<80(down,50%)'"
  fi

  if [ -z "${FZF_CTRL_T_OPTS:-}" ]; then
    export FZF_CTRL_T_OPTS="--preview '${FZF_PREVIEW_COMMAND}' --preview-window 'right,50%,border-left,<80(down,50%)' --bind 'ctrl-/:toggle-preview,alt-?:toggle-preview'"
  fi

  if [ -z "${FZF_CTRL_R_OPTS:-}" ]; then
    export FZF_CTRL_R_OPTS="--preview 'echo {}' --preview-window 'down:3:hidden:wrap' --bind 'ctrl-/:toggle-preview,alt-?:toggle-preview'"
  fi

  if [ -z "${FZF_ALT_C_OPTS:-}" ]; then
    export FZF_ALT_C_OPTS="--preview '([[ -d {} ]] && (tree -C -L 2 {} 2>/dev/null || eza --tree --level=2 --color=always {} 2>/dev/null || ls -la {}))' --preview-window 'right,50%,border-left,<80(down,50%)' --bind 'ctrl-/:toggle-preview,alt-?:toggle-preview'"
  fi
}
_fzf_init "$@"
unset -f _fzf_init 2>/dev/null || true
