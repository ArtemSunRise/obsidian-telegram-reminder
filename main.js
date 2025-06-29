"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // main.ts
  var import_obsidian = __require("obsidian");
  var import_child_process = __require("child_process");
  var fs = __toESM(__require("fs"));
  var path = __toESM(__require("path"));
  var TelegramReminderPlugin = class extends import_obsidian.Plugin {
    constructor() {
      super(...arguments);
      this.botProcess = null;
    }
    async onload() {
      await this.copyMainPyIfMissing();
      this.addCommand({
        id: "start-telegram-bot",
        name: "\u{1F7E2} \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C Telegram-\u0431\u043E\u0442\u0430",
        callback: () => this.runPythonBot()
      });
      this.addCommand({
        id: "stop-telegram-bot",
        name: "\u{1F534} \u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C Telegram-\u0431\u043E\u0442\u0430",
        callback: () => this.stopPythonBot()
      });
      this.addRibbonIcon("bell", "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C Telegram-\u0431\u043E\u0442\u0430", () => this.runPythonBot());
    }
    async copyMainPyIfMissing() {
      const vaultPath = this.app.vault.adapter.basePath;
      const dest = path.join(vaultPath, "main.py");
      const src = path.join(this.manifest.dir, "main.py");
      if (!fs.existsSync(dest)) {
        try {
          fs.copyFileSync(src, dest);
          new import_obsidian.Notice("\u2705 main.py \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u043A\u043E\u0440\u0435\u043D\u044C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430");
        } catch (e) {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F main.py", e);
          new import_obsidian.Notice("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F main.py");
        }
      }
    }
    runPythonBot() {
      if (this.botProcess) {
        new import_obsidian.Notice("\u26A0\uFE0F \u0411\u043E\u0442 \u0443\u0436\u0435 \u0437\u0430\u043F\u0443\u0449\u0435\u043D");
        return;
      }
      const vaultPath = this.app.vault.adapter.basePath;
      const python = process.platform === "win32" ? "python" : "python3";
      this.botProcess = (0, import_child_process.exec)(`${python} main.py`, { cwd: vaultPath });
      this.botProcess.stdout.on("data", (data) => console.log("[bot]", data.toString()));
      this.botProcess.stderr.on("data", (data) => console.error("[bot.err]", data.toString()));
      this.botProcess.on("exit", (code) => {
        this.botProcess = null;
        console.log("[bot] exited", code);
        new import_obsidian.Notice("\u{1F534} Telegram-\u0431\u043E\u0442 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D");
      });
      new import_obsidian.Notice("\u{1F680} Telegram-\u0431\u043E\u0442 \u0437\u0430\u043F\u0443\u0449\u0435\u043D");
    }
    stopPythonBot() {
      if (this.botProcess) {
        this.botProcess.kill();
        this.botProcess = null;
        new import_obsidian.Notice("\u{1F534} Telegram-\u0431\u043E\u0442 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D");
      } else {
        new import_obsidian.Notice("\u26A0\uFE0F \u0411\u043E\u0442 \u043D\u0435 \u0437\u0430\u043F\u0443\u0449\u0435\u043D");
      }
    }
    onunload() {
      this.stopPythonBot();
    }
  };
})();
