# shellcheck shell=sh disable=SC1091

Describe 'fzf.plugin.zsh'
  setup_env() {
    TMUX=""
    TMUX_PANE=""
    FZF_TMUX=0
    export TMUX TMUX_PANE FZF_TMUX
  }
  BeforeEach 'setup_env'

  Describe 'default configuration initialization'
    init_defaults() {
      unset FZF_DEFAULT_COMMAND FZF_DEFAULT_OPTS FZF_PREVIEW_COMMAND BAT_THEME FZF_CTRL_T_OPTS FZF_CTRL_R_OPTS FZF_ALT_C_OPTS
      . ./fzf.plugin.zsh
      echo "BAT_THEME=$BAT_THEME"
      echo "HAS_DEFAULT_COMMAND=${FZF_DEFAULT_COMMAND:+yes}"
      echo "HAS_DEFAULT_OPTS=${FZF_DEFAULT_OPTS:+yes}"
      echo "HAS_PREVIEW_COMMAND=${FZF_PREVIEW_COMMAND:+yes}"
      echo "HAS_CTRL_T_OPTS=${FZF_CTRL_T_OPTS:+yes}"
      echo "HAS_CTRL_R_OPTS=${FZF_CTRL_R_OPTS:+yes}"
      echo "HAS_ALT_C_OPTS=${FZF_ALT_C_OPTS:+yes}"
    }

    It 'sets default environment variables when unset'
      When call init_defaults
      The status should be success
      The output should include 'BAT_THEME=ansi'
      The output should include 'HAS_DEFAULT_COMMAND=yes'
      The output should include 'HAS_DEFAULT_OPTS=yes'
      The output should include 'HAS_PREVIEW_COMMAND=yes'
      The output should include 'HAS_CTRL_T_OPTS=yes'
      The output should include 'HAS_CTRL_R_OPTS=yes'
      The output should include 'HAS_ALT_C_OPTS=yes'
    End

    check_opts() {
      unset FZF_DEFAULT_OPTS
      . ./fzf.plugin.zsh
      echo "$FZF_DEFAULT_OPTS"
    }

    It 'configures key default fzf options'
      When call check_opts
      The status should be success
      The output should include '--color=16'
      The output should include '--reverse'
      The output should include '--inline-info'
      The output should include '--cycle'
      The output should include 'ctrl-/:toggle-preview'
    End
  End

  Describe 'user configuration preservation'
    preserve_overrides() {
      BAT_THEME="custom-theme"
      FZF_DEFAULT_COMMAND="echo custom-cmd"
      FZF_DEFAULT_OPTS="--inline-info --height=50%"
      FZF_PREVIEW_COMMAND="cat {}"
      export BAT_THEME FZF_DEFAULT_COMMAND FZF_DEFAULT_OPTS FZF_PREVIEW_COMMAND

      . ./fzf.plugin.zsh
      echo "BAT_THEME=$BAT_THEME"
      echo "FZF_DEFAULT_COMMAND=$FZF_DEFAULT_COMMAND"
      echo "FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS"
      echo "FZF_PREVIEW_COMMAND=$FZF_PREVIEW_COMMAND"
    }

    It 'preserves user-defined variables'
      When call preserve_overrides
      The status should be success
      The output should include 'BAT_THEME=custom-theme'
      The output should include 'FZF_DEFAULT_COMMAND=echo custom-cmd'
      The output should include 'FZF_DEFAULT_OPTS=--inline-info --height=50%'
      The output should include 'FZF_PREVIEW_COMMAND=cat {}'
    End
  End

  Describe 'FZF_BASE discovery'
    load_custom_fzf_base() {
      mock_dir="$SHELLSPEC_TMPBASE/custom_fzf"
      mkdir -p "$mock_dir/shell"
      echo 'export CUSTOM_FZF_BASE_LOADED="yes"' > "$mock_dir/shell/key-bindings.zsh"
      FZF_BASE="$mock_dir"
      export FZF_BASE
      . ./fzf.plugin.zsh
      echo "CUSTOM_LOADED=${CUSTOM_FZF_BASE_LOADED:-no}"
    }

    It 'loads scripts from FZF_BASE when specified'
      When call load_custom_fzf_base
      The status should be success
      The output should include 'CUSTOM_LOADED=yes'
    End
  End

  Describe 'disable flags'
    check_disable_bindings() {
      mock_dir="$SHELLSPEC_TMPBASE/disabled_bindings"
      mkdir -p "$mock_dir/shell"
      echo 'export BINDINGS_LOADED="yes"' > "$mock_dir/shell/key-bindings.zsh"
      FZF_BASE="$mock_dir"
      DISABLE_FZF_KEY_BINDINGS="true"
      export FZF_BASE DISABLE_FZF_KEY_BINDINGS
      . ./fzf.plugin.zsh
      echo "BINDINGS_LOADED=${BINDINGS_LOADED:-no}"
    }

    It 'respects DISABLE_FZF_KEY_BINDINGS'
      When call check_disable_bindings
      The status should be success
      The output should include 'BINDINGS_LOADED=no'
    End

    check_disable_completion() {
      mock_dir="$SHELLSPEC_TMPBASE/disabled_comp"
      mkdir -p "$mock_dir/shell"
      echo 'export COMP_LOADED="yes"' > "$mock_dir/shell/completion.zsh"
      FZF_BASE="$mock_dir"
      DISABLE_FZF_AUTO_COMPLETION="true"
      export FZF_BASE DISABLE_FZF_AUTO_COMPLETION
      . ./fzf.plugin.zsh
      echo "COMP_LOADED=${COMP_LOADED:-no}"
    }

    It 'respects DISABLE_FZF_AUTO_COMPLETION'
      When call check_disable_completion
      The status should be success
      The output should include 'COMP_LOADED=no'
    End
  End

  Describe 'missing fzf binary handling'
    check_missing_binary() {
      PATH="/usr/bin:/bin"
      export PATH
      . ./fzf.plugin.zsh
      echo "STATUS_OK"
    }

    It 'does not crash when fzf is not in PATH'
      When call check_missing_binary
      The status should be success
      The output should include 'STATUS_OK'
    End
  End
End
