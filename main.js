const { Plugin, Notice } = require("obsidian");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

class TelegramReminderPlugin extends Plugin {
  constructor() {
    super(...arguments);
    this.botProcess = null;
  }

  async onload() {
    await this.copyMainPyIfMissing();
    this.addCommand({
      id: "start-telegram-bot",
      name: "🟢 Запустить Telegram-бота",
      callback: () => this.runPythonBot(),
    });
    this.addCommand({
      id: "stop-telegram-bot",
      name: "🔴 Остановить Telegram-бота",
      callback: () => this.stopPythonBot(),
    });
    this.addRibbonIcon("bell", "Запустить Telegram-бота", () => this.runPythonBot());
  }

  async copyMainPyIfMissing() {
    const vaultPath = this.app.vault.adapter.basePath;
    const dest = path.join(vaultPath, "main.py");
    const src = path.join(this.manifest.dir, "main.py");
    if (!fs.existsSync(dest)) {
      try {
        fs.copyFileSync(src, dest);
        new Notice("✅ main.py скопирован в корень хранилища");
      } catch (e) {
        console.error("Ошибка копирования main.py", e);
        new Notice("❌ Ошибка копирования main.py");
      }
    }
  }

  runPythonBot() {
    if (this.botProcess) {
      new Notice("⚠️ Бот уже запущен");
      return;
    }
    const vaultPath = this.app.vault.adapter.basePath;
    const python = process.platform === "win32" ? "python" : "python3";
    this.botProcess = exec(`${python} main.py`, { cwd: vaultPath });

    this.botProcess.stdout.on("data", (data) => console.log("[bot]", data.toString()));
    this.botProcess.stderr.on("data", (data) => console.error("[bot.err]", data.toString()));
    this.botProcess.on("exit", (code) => {
      this.botProcess = null;
      console.log("[bot] exited", code);
      new Notice("🔴 Telegram-бот остановлен");
    });

    new Notice("🚀 Telegram-бот запущен");
  }

  stopPythonBot() {
    if (this.botProcess) {
      this.botProcess.kill();
      this.botProcess = null;
      new Notice("🔴 Telegram-бот остановлен");
    } else {
      new Notice("⚠️ Бот не запущен");
    }
  }

  onunload() {
    this.stopPythonBot();
  }
}

module.exports = TelegramReminderPlugin;
