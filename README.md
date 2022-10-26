# fzf.zsh

This plugin tries to find [fzf](https://github.com/junegunn/fzf) based on where
it's been installed, and enables its fuzzy auto-completion and key bindings.

This plugin will not install `fzf` for you.  This needs to be done before using.

To use it, add `fzf.zsh` to the plugins in your zshrc file. The following is an example using zinit:

```zsh
zinit wait lucid for \
  OMZL::key-bindings.zsh \
  OMZL::history.zsh \
  OMZP::git \
  casonadams/alacritty-shell \
  casonadams/fzf.zsh \
  ;
```

## Settings

All these settings should go in your zshrc file, before the plugin is loaded.

### `FZF_BASE`

Set to fzf installation directory path:

```zsh
export FZF_BASE=/path/to/fzf/install/dir
```

### `FZF_DEFAULT_COMMAND`

Set default command to use when input is tty:

```zsh
export FZF_DEFAULT_COMMAND='<your fzf default command>'
```

If not set, the plugin will try to set it to these, in the order in which they're found:

- [`fd`](https://github.com/sharkdp/fd)
- [`rg`](https://github.com/BurntSushi/ripgrep)

The plugin default settings lets one toggle the preview window using `?`

### `DISABLE_FZF_AUTO_COMPLETION`

Set whether to load fzf auto-completion:

```zsh
DISABLE_FZF_AUTO_COMPLETION="true"
```

### `DISABLE_FZF_KEY_BINDINGS`

Set whether to disable key bindings (CTRL-T, CTRL-R, ALT-C):

```zsh
DISABLE_FZF_KEY_BINDINGS="true"
```
