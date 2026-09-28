# fzf.zsh

[![CI](https://github.com/casonadams/fzf.zsh/actions/workflows/ci.yml/badge.svg)](https://github.com/casonadams/fzf.zsh/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue.svg)](https://casonadams.github.io/fzf.zsh/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Shell: Zsh](https://img.shields.io/badge/shell-zsh-informational.svg)](https://www.zsh.org/)
[![Powered by zload](https://img.shields.io/badge/powered%20by-zload-52e096.svg)](https://github.com/casonadams/zload)

**An ultra-fast, modern fzf plugin for Zsh with progressive CLI tool discovery, rich preview defaults, and first-class zload integration.**

`fzf.zsh` automatically detects your [fzf](https://github.com/junegunn/fzf) installation (Homebrew Apple Silicon/Intel, standard package managers, `~/.fzf`, `$FZF_BASE`, or bundled fallbacks) and configures fuzzy completions, interactive keybindings, and progressive preview pipelines without configuration boilerplate.

👉 **[Live Interactive Showcase & Config Generator](https://casonadams.github.io/fzf.zsh/)**

---

## Prerequisites

`fzf.zsh` automates your shell integration and preview pipelines, but requires the [`fzf`](https://github.com/junegunn/fzf) binary installed on your machine.

### Companion CLI Binaries

The plugin progressively leverages modern CLI utilities for blazing fast search and syntax-highlighted previews, with graceful automatic fallback chains:

| Binary | Status | Role | Fallback Chain | Quick Install |
| :--- | :--- | :--- | :--- | :--- |
| [`fzf`](https://github.com/junegunn/fzf) | **Required** | Core interactive fuzzy finder | — | `brew install fzf` / `apt install fzf` |
| [`fd`](https://github.com/sharkdp/fd) | **Recommended** | High-performance file traversal | `fd` &gt; `rg` &gt; `find` | `brew install fd` / `apt install fd-find` |
| [`bat`](https://github.com/sharkdp/bat) | **Recommended** | Syntax-highlighted code preview | `bat` &gt; `cat` | `brew install bat` / `apt install bat` |
| [`eza`](https://github.com/eza-community/eza) | **Recommended** | Colorized directory tree preview | `eza` &gt; `tree` &gt; `ls` | `brew install eza` / `apt install eza` |
| [`ripgrep`](https://github.com/BurntSushi/ripgrep) | Fallback | Fast search when `fd` is absent | `fd` &gt; `rg` &gt; `find` | `brew install ripgrep` / `apt install ripgrep` |
| [`tree`](https://gitlab.com/OldManProgrammer/unix-tree) | Fallback | Tree preview when `eza` is absent | `eza` &gt; `tree` &gt; `ls` | `brew install tree` / `apt install tree` |

If optional tools are omitted, `fzf.zsh` falls back to built-in POSIX utilities (`find`, `cat`, `ls`) with zero manual configuration.

---

## Features

- **Intelligent Path Discovery**: Automatically checks `$FZF_BASE`, Homebrew (`/opt/homebrew`, `/usr/local`), `$HOME/.fzf`, system package directories (`/usr/share/fzf`), and vendored fallbacks.
- **Progressive CLI Fallbacks**:
  - File search: [`fd`](https://github.com/sharkdp/fd) &gt; [`rg`](https://github.com/BurntSushi/ripgrep) &gt; `find`
  - File preview: [`bat`](https://github.com/sharkdp/bat) &gt; `cat`
  - Directory preview: [`eza`](https://github.com/eza-community/eza) &gt; `tree` &gt; `ls`
- **Dynamic Preview Toggle**: Press `?` in any fzf menu to toggle the preview window on or off.
- **Robust Quality Gates**: 100% ShellCheck compliant (0 warnings), standardized `shfmt` (-i 2 -ci), and automated ShellSpec BDD testing matrix under Zsh.
- **Zero Configuration Required**: Sensible, battle-tested defaults out of the box while remaining 100% backward compatible with existing user overrides.

---

## Installation

### With [zload](https://github.com/casonadams/zload) (Recommended)

Add to your `~/.zshrc`:

```zsh
zload casonadams/fzf.zsh
```

### With [zinit](https://github.com/zdharma-continuum/zinit)

Add to your `~/.zshrc`:

```zsh
zinit wait lucid for \
  OMZL::key-bindings.zsh \
  OMZL::history.zsh \
  OMZP::git \
  casonadams/fzf.zsh
```

### With Oh My Zsh

Clone into your custom plugins directory:

```sh
git clone https://github.com/casonadams/fzf.zsh.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf
```

Add `fzf` to your plugin array in `~/.zshrc`:

```zsh
plugins=(... fzf)
```

### With Antidote

Add to your `~/.zsh_plugins.txt`:

```text
casonadams/fzf.zsh
```

### Manual

Clone the repository and source it in `~/.zshrc`:

```sh
git clone https://github.com/casonadams/fzf.zsh.git ~/.fzf.zsh
```

```zsh
source ~/.fzf.zsh/fzf.plugin.zsh
```

---

## Keybindings & Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `CTRL-T` | File & Directory Selector | Interactively fuzzy search files and directories; paste path into command line |
| `CTRL-R` | Command History Search | Fuzzy search previously executed commands; paste selection into line buffer |
| `ALT-C` | Change Directory | Fuzzy search directories and `cd` directly into the selection |
| `?` | Toggle Preview | In interactive fzf menu, dynamically show/hide the preview pane |
| `Tab` / `Shift-Tab` | Multi-select | Toggle multi-item selection in supported widgets |

---

## Configuration Settings

All environment variables can be customized in your `~/.zshrc` prior to sourcing the plugin:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `FZF_BASE` | *(auto-detected)* | Explicit path to fzf installation directory |
| `FZF_DEFAULT_COMMAND` | `fd ...` &gt; `rg ...` &gt; `find .` | Default command used for filesystem traversal |
| `FZF_PREVIEW_COMMAND` | `bat` &gt; `cat` / `eza` &gt; `tree` &gt; `ls` | Progressive command string used in preview windows |
| `FZF_DEFAULT_OPTS` | `--color=16 --reverse ...` | Default command-line flags passed to fzf invocations |
| `BAT_THEME` | `"ansi"` | Theme passed to `bat` for syntax highlighting |
| `FZF_TMUX_HEIGHT` | `40%` | Height used when running inside tmux panes |
| `DISABLE_FZF_AUTO_COMPLETION` | `false` | When set to `"true"`, skips loading fzf completion definitions |
| `DISABLE_FZF_KEY_BINDINGS` | `false` | When set to `"true"`, skips binding `CTRL-T`, `CTRL-R`, and `ALT-C` |

### Custom Configuration Example

```zsh
# ~/.zshrc
export BAT_THEME="Nord"
export FZF_TMUX_HEIGHT="50%"
export FZF_DEFAULT_COMMAND="fd --type f --strip-cwd-prefix --hidden --exclude .git"

zload casonadams/fzf.zsh
```

---

## Development & Testing

Run the unified test suite locally:

```sh
./test/run_all.sh
```

The test runner verifies:
1. **ShellCheck**: 0 warnings across project scripts.
2. **shfmt**: Standardized 2-space indentation formatting (`shfmt -d -i 2 -ci`).
3. **ShellSpec**: Automated BDD specification tests executed directly under Zsh.

---

## License

Released under the [MIT License](LICENSE).
