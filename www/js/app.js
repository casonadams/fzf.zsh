(() => {
  "use strict";

  const themeToggle = document.getElementById("themeToggle");
  const getPreferredTheme = () => {
    const saved = localStorage.getItem("fzf:site-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fzf:site-theme", theme);
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  const mockFiles = [
    {
      path: "src/main.rs",
      lines: [
        { num: 1, type: "comment", text: "// Application entry point" },
        { num: 2, type: "keyword", text: "use std::io::Result;" },
        { num: 3, type: "normal", text: "" },
        { num: 4, type: "keyword", text: "fn main() -> Result<()> {" },
        { num: 5, type: "func", text: '    println!("Initialized fzf engine!");' },
        { num: 6, type: "keyword", text: "    Ok(())" },
        { num: 7, type: "keyword", text: "}" }
      ]
    },
    {
      path: "fzf.plugin.zsh",
      lines: [
        { num: 1, type: "comment", text: "#!/usr/bin/env zsh" },
        { num: 2, type: "keyword", text: "_fzf_init() {" },
        { num: 3, type: "func", text: '  eval \'_fzf_plugin_dir="${${(%):-%x}:A:h}"\'' },
        { num: 4, type: "normal", text: '  export BAT_THEME="ansi"' },
        { num: 5, type: "keyword", text: "}" },
        { num: 6, type: "func", text: '_fzf_init "$@"' }
      ]
    },
    {
      path: "README.md",
      lines: [
        { num: 1, type: "comment", text: "# fzf.zsh" },
        { num: 2, type: "normal", text: "" },
        { num: 3, type: "string", text: "⚡ An ultra-fast, modern fzf plugin for Zsh." },
        { num: 4, type: "keyword", text: "## Quickstart with zload" },
        { num: 5, type: "normal", text: "zload casonadams/fzf.zsh" }
      ]
    },
    {
      path: "test/run_all.sh",
      lines: [
        { num: 1, type: "comment", text: "#!/usr/bin/env bash" },
        { num: 2, type: "keyword", text: "set -euo pipefail" },
        { num: 3, type: "func", text: "shellcheck fzf.plugin.zsh" },
        { num: 4, type: "func", text: "shellspec -s zsh" }
      ]
    },
    {
      path: "spec/fzf_plugin_spec.sh",
      lines: [
        { num: 1, type: "comment", text: "# shellcheck shell=sh" },
        { num: 2, type: "keyword", text: "Describe 'fzf.plugin.zsh'" },
        { num: 3, type: "keyword", text: "  It 'sets default environment variables'" },
        { num: 4, type: "func", text: "    The status should be success" },
        { num: 5, type: "keyword", text: "  End" }
      ]
    },
    {
      path: "config/settings.json",
      lines: [
        { num: 1, type: "normal", text: "{" },
        { num: 2, type: "string", text: '  "fuzzy": true,' },
        { num: 3, type: "string", text: '  "preview": "right:50%",' },
        { num: 4, type: "normal", text: '  "height": "40%"' },
        { num: 5, type: "normal", text: "}" }
      ]
    },
    {
      path: ".github/workflows/ci.yml",
      lines: [
        { num: 1, type: "keyword", text: "name: CI" },
        { num: 2, type: "keyword", text: "on: [push, pull_request]" },
        { num: 3, type: "keyword", text: "jobs:" },
        { num: 4, type: "func", text: "  test: runs-on: ubuntu-latest" }
      ]
    }
  ];

  const mockHistory = [
    {
      cmd: "git log --oneline --graph --decorate -n 15",
      details: { timestamp: "2026-09-27 14:32:10", exitCode: 0, duration: "18ms" }
    },
    {
      cmd: "zload casonadams/fzf.zsh",
      details: { timestamp: "2026-09-27 14:30:05", exitCode: 0, duration: "12ms" }
    },
    {
      cmd: "fd --type f --strip-cwd-prefix --hidden",
      details: { timestamp: "2026-09-27 14:28:44", exitCode: 0, duration: "6ms" }
    },
    {
      cmd: "bat --style=numbers --color=always fzf.plugin.zsh",
      details: { timestamp: "2026-09-27 14:26:12", exitCode: 0, duration: "9ms" }
    },
    {
      cmd: "./test/run_all.sh",
      details: { timestamp: "2026-09-27 14:25:01", exitCode: 0, duration: "340ms" }
    },
    {
      cmd: "shellspec -s zsh",
      details: { timestamp: "2026-09-27 14:22:50", exitCode: 0, duration: "150ms" }
    },
    {
      cmd: "eza --tree --level=2 --color=always",
      details: { timestamp: "2026-09-27 14:20:19", exitCode: 0, duration: "14ms" }
    }
  ];

  const mockDirs = [
    {
      dir: "src",
      tree: ["src", "├── main.rs", "├── lib.rs", "└── engine/", "    └── matcher.rs"]
    },
    {
      dir: "spec",
      tree: ["spec", "├── spec_helper.sh", "└── fzf_plugin_spec.sh"]
    },
    {
      dir: "test",
      tree: ["test", "└── run_all.sh"]
    },
    {
      dir: ".github/workflows",
      tree: [".github/workflows", "├── ci.yml", "└── pages.yml"]
    },
    {
      dir: "www/css",
      tree: ["www/css", "└── style.css"]
    },
    {
      dir: "www/js",
      tree: ["www/js", "└── app.js"]
    }
  ];

  function fuzzyMatch(pattern, text) {
    if (!pattern) return { match: true, score: 0, indices: [] };
    const p = pattern.toLowerCase();
    const t = text.toLowerCase();
    let pIdx = 0;
    const indices = [];

    for (let tIdx = 0; tIdx < t.length; tIdx++) {
      if (t[tIdx] === p[pIdx]) {
        indices.push(tIdx);
        pIdx++;
        if (pIdx === p.length) break;
      }
    }

    if (pIdx === p.length) {
      return { match: true, score: 100 - (text.length - pattern.length), indices };
    }
    return { match: false, score: -1, indices: [] };
  }

  function highlightMatches(text, indices) {
    if (!indices || indices.length === 0) return document.createTextNode(text);
    const fragment = document.createDocumentFragment();
    let lastIdx = 0;

    indices.forEach((idx) => {
      if (idx > lastIdx) {
        fragment.appendChild(document.createTextNode(text.substring(lastIdx, idx)));
      }
      const span = document.createElement("span");
      span.className = "fzf-item-match";
      span.textContent = text[idx];
      fragment.appendChild(span);
      lastIdx = idx + 1;
    });

    if (lastIdx < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIdx)));
    }
    return fragment;
  }

  let currentMode = "files";
  let activeIndex = 0;
  let filteredItems = [];
  let previewVisible = true;

  const fzfInput = document.getElementById("fzfInput");
  const fzfList = document.getElementById("fzfList");
  const fzfStats = document.getElementById("fzfStats");
  const fzfPreview = document.getElementById("fzfPreview");
  const modeTabs = document.querySelectorAll(".mode-tab");

  function getActiveDataset() {
    if (currentMode === "files") {
      return mockFiles.map((f) => ({ key: f.path, data: f }));
    } else if (currentMode === "history") {
      return mockHistory.map((h) => ({ key: h.cmd, data: h }));
    } else {
      return mockDirs.map((d) => ({ key: d.dir, data: d }));
    }
  }

  function updateFiltering() {
    const query = fzfInput ? fzfInput.value.trim() : "";
    const dataset = getActiveDataset();

    if (!query) {
      filteredItems = dataset.map((item) => ({ ...item, indices: [] }));
    } else {
      filteredItems = dataset
        .map((item) => {
          const res = fuzzyMatch(query, item.key);
          return { ...item, match: res.match, indices: res.indices, score: res.score };
        })
        .filter((item) => item.match)
        .sort((a, b) => b.score - a.score);
    }

    if (activeIndex >= filteredItems.length) {
      activeIndex = Math.max(0, filteredItems.length - 1);
    }

    renderList();
    renderPreview();
    updateStats(dataset.length);
  }

  function updateStats(total) {
    if (fzfStats) {
      fzfStats.textContent = `${filteredItems.length}/${total}`;
    }
  }

  function renderList() {
    if (!fzfList) return;
    fzfList.innerHTML = "";

    if (filteredItems.length === 0) {
      const empty = document.createElement("div");
      empty.className = "fzf-item";
      empty.style.color = "var(--text-muted)";
      empty.textContent = "  No matches found";
      fzfList.appendChild(empty);
      return;
    }

    filteredItems.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = `fzf-item ${idx === activeIndex ? "active" : ""}`;

      const indicator = document.createElement("span");
      indicator.className = "fzf-item-indicator";
      indicator.textContent = idx === activeIndex ? ">" : " ";

      const textWrapper = document.createElement("span");
      textWrapper.className = "fzf-item-text";
      textWrapper.appendChild(highlightMatches(item.key, item.indices));

      row.appendChild(indicator);
      row.appendChild(textWrapper);

      row.addEventListener("click", () => {
        activeIndex = idx;
        renderList();
        renderPreview();
      });

      fzfList.appendChild(row);
    });
  }

  function renderPreview() {
    if (!fzfPreview) return;
    if (!previewVisible) {
      fzfPreview.style.display = "none";
      return;
    }
    fzfPreview.style.display = "block";
    fzfPreview.innerHTML = "";

    const activeItem = filteredItems[activeIndex];
    if (!activeItem) {
      fzfPreview.textContent = "Nothing selected";
      return;
    }

    const header = document.createElement("div");
    header.className = "fzf-preview-header";

    if (currentMode === "files") {
      header.textContent = `bat: ${activeItem.key}`;
      fzfPreview.appendChild(header);

      const codeContainer = document.createElement("div");
      codeContainer.className = "code-preview";

      activeItem.data.lines.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.className = "code-line";

        const numEl = document.createElement("span");
        numEl.className = "line-num";
        numEl.textContent = line.num;

        const contentEl = document.createElement("span");
        contentEl.className = `line-content syn-${line.type}`;
        contentEl.textContent = line.text;

        lineEl.appendChild(numEl);
        lineEl.appendChild(contentEl);
        codeContainer.appendChild(lineEl);
      });
      fzfPreview.appendChild(codeContainer);
    } else if (currentMode === "history") {
      header.textContent = `history info: command details`;
      fzfPreview.appendChild(header);

      const box = document.createElement("div");
      box.style.lineHeight = "1.8";
      box.innerHTML = `
        <div><strong style="color:var(--accent-purple)">Command:</strong> <code>${activeItem.key}</code></div>
        <div><strong style="color:var(--accent-blue)">Executed:</strong> ${activeItem.data.details.timestamp}</div>
        <div><strong style="color:var(--accent-green)">Exit Code:</strong> ${activeItem.data.details.exitCode} (Success)</div>
        <div><strong style="color:var(--accent-amber)">Duration:</strong> ${activeItem.data.details.duration}</div>
      `;
      fzfPreview.appendChild(box);
    } else {
      header.textContent = `eza --tree: ${activeItem.key}`;
      fzfPreview.appendChild(header);

      const treeBox = document.createElement("div");
      treeBox.style.whiteSpace = "pre";
      treeBox.style.color = "var(--accent-blue)";
      treeBox.textContent = activeItem.data.tree.join("\n");
      fzfPreview.appendChild(treeBox);
    }
  }

  if (fzfInput) {
    fzfInput.addEventListener("input", () => {
      activeIndex = 0;
      updateFiltering();
    });

    fzfInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
        e.preventDefault();
        if (filteredItems.length > 0) {
          activeIndex = (activeIndex + 1) % filteredItems.length;
          renderList();
          renderPreview();
        }
      } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
        e.preventDefault();
        if (filteredItems.length > 0) {
          activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
          renderList();
          renderPreview();
        }
      } else if (e.key === "?") {
        if (e.target.value.length === 0) {
          e.preventDefault();
          previewVisible = !previewVisible;
          renderPreview();
        }
      }
    });
  }

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      modeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentMode = tab.dataset.mode || "files";
      if (fzfInput) fzfInput.value = "";
      activeIndex = 0;
      updateFiltering();
    });
  });

  const cfgSearch = document.getElementById("cfgSearch");
  const cfgDirPreview = document.getElementById("cfgDirPreview");
  const cfgFilePreview = document.getElementById("cfgFilePreview");
  const cfgBatTheme = document.getElementById("cfgBatTheme");
  const cfgHeight = document.getElementById("cfgHeight");
  const cfgPreviewPos = document.getElementById("cfgPreviewPos");
  const cfgDisableComp = document.getElementById("cfgDisableComp");
  const cfgDisableKeys = document.getElementById("cfgDisableKeys");
  const configOutput = document.getElementById("configOutput");
  const copyConfigBtn = document.getElementById("copyConfigBtn");

  function generateConfigSnippet() {
    if (!configOutput) return;
    const searchTool = cfgSearch ? cfgSearch.value : "fd";
    const dirTool = cfgDirPreview ? cfgDirPreview.value : "eza";
    const fileTool = cfgFilePreview ? cfgFilePreview.value : "bat";
    const theme = cfgBatTheme ? cfgBatTheme.value : "ansi";
    const height = cfgHeight ? cfgHeight.value : "40%";
    const previewPos = cfgPreviewPos ? cfgPreviewPos.value : "right";
    const disableComp = cfgDisableComp ? cfgDisableComp.checked : false;
    const disableKeys = cfgDisableKeys ? cfgDisableKeys.checked : false;

    let searchCmd = "fd --type f --strip-cwd-prefix --hidden --follow --exclude .git";
    if (searchTool === "rg") {
      searchCmd = "rg --files --hidden --follow --glob '!.git/*'";
    } else if (searchTool === "find") {
      searchCmd = "find . -type f";
    }

    let filePreviewCmd = "bat --style=numbers --color=always {} 2>/dev/null || cat {}";
    if (fileTool === "cat") {
      filePreviewCmd = "cat {}";
    }

    let dirPreviewCmd = "eza --tree --level=2 --color=always {} 2>/dev/null || tree -L 2 -a -C {} 2>/dev/null || ls -la {}";
    if (dirTool === "tree") {
      dirPreviewCmd = "tree -L 2 -a -C {} 2>/dev/null || ls -la {}";
    } else if (dirTool === "ls") {
      dirPreviewCmd = "ls -la {}";
    }

    const previewCombined = `([[ -f {} ]] && (${filePreviewCmd})) || ([[ -d {} ]] && (${dirPreviewCmd}))`;

    const lines = [
      "# ~/.zshrc — fzf.zsh configuration",
      `export BAT_THEME="${theme}"`,
      `export FZF_TMUX_HEIGHT="${height}"`,
      `export FZF_PREVIEW_COMMAND='${previewCombined}'`,
      `export FZF_DEFAULT_COMMAND="${searchCmd}"`,
      `export FZF_DEFAULT_OPTS="--color=16 --reverse --inline-info --cycle --height=${height} --tiebreak=index --bind '?:toggle-preview,tab:down,btab:up' --preview '\\$FZF_PREVIEW_COMMAND' --preview-window=${previewPos}"`
    ];

    if (disableComp) {
      lines.push('export DISABLE_FZF_AUTO_COMPLETION="true"');
    }
    if (disableKeys) {
      lines.push('export DISABLE_FZF_KEY_BINDINGS="true"');
    }

    lines.push("");
    lines.push("# Load plugin via zload");
    lines.push("zload casonadams/fzf.zsh");

    configOutput.textContent = lines.join("\n");
  }

  [cfgSearch, cfgDirPreview, cfgFilePreview, cfgBatTheme, cfgHeight, cfgPreviewPos, cfgDisableComp, cfgDisableKeys].forEach((el) => {
    if (el) {
      el.addEventListener("change", generateConfigSnippet);
      el.addEventListener("input", generateConfigSnippet);
    }
  });

  if (copyConfigBtn) {
    copyConfigBtn.addEventListener("click", () => {
      if (!configOutput) return;
      navigator.clipboard.writeText(configOutput.textContent).then(() => {
        const originalText = copyConfigBtn.innerHTML;
        copyConfigBtn.innerHTML = `<span>Copied!</span>`;
        setTimeout(() => {
          copyConfigBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  const heroInstallTabs = document.querySelectorAll(".install-box [data-install-tab]");
  const heroInstallCode = document.getElementById("installCode");
  const heroInstallCopyBtn = document.getElementById("installCopyBtn");

  const heroInstallSnippets = {
    zload: "zload casonadams/fzf.zsh",
    zinit: "zinit light casonadams/fzf.zsh",
    omz: "git clone https://github.com/casonadams/fzf.zsh ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf",
    antidote: "casonadams/fzf.zsh",
    manual: "source ~/.fzf.zsh/fzf.plugin.zsh"
  };

  if (heroInstallTabs.length && heroInstallCode && heroInstallCopyBtn) {
    heroInstallTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        heroInstallTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const key = tab.dataset.installTab || "zload";
        const cmd = heroInstallSnippets[key] || heroInstallSnippets.zload;

        heroInstallCode.textContent = cmd;
        heroInstallCopyBtn.dataset.copy = cmd;
      });
    });

    heroInstallCopyBtn.addEventListener("click", () => {
      const text = heroInstallCopyBtn.dataset.copy || heroInstallCode.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        const originalHtml = heroInstallCopyBtn.innerHTML;
        heroInstallCopyBtn.innerHTML = `<span>Copied!</span>`;
        setTimeout(() => {
          heroInstallCopyBtn.innerHTML = originalHtml;
        }, 2000);
      });
    });
  }

  const installTabs = document.querySelectorAll("[data-target]");
  const installPanels = document.querySelectorAll(".install-panel");

  installTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      installTabs.forEach((t) => t.classList.remove("active"));
      installPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.dataset.target;
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  updateFiltering();
  generateConfigSnippet();
})();
