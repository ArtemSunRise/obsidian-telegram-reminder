## 🔔 Obsidian Telegram Reminder

Плагин для Obsidian, отправляющий напоминания в Telegram на основе задач в формате:

```
- [ ] Тестовая задача (@2025-06-29 StartTime:: 13:10)
```

---

### ⚙️ Установка через BRAT

1. Установи плагин [BRAT (Beta Reviewers Auto-update Tool)](https://github.com/TfTHacker/obsidian42-brat)
2. Открой Obsidian → Settings → Community Plugins → BRAT
3. Нажми **Add Plugin → Add GitHub Repo**
4. Вставь:
   ```
   ArtemSunRise/obsidian-telegram-reminder
   ```
5. Нажми **Validate** → **Add Plugin**
6. Включи плагин в списке установленных

---

### 🚀 Как это работает

- Сканируются все `.md` файлы в папке `tasks/` (включая подкаталоги)
- Парсятся задачи, содержащие `(@YYYY-MM-DD StartTime:: HH:MM)`
- Каждая задача сохраняется в базу и будет отправлена в Telegram в нужное время
- Логи отправляются в Telegram каждые 5 секунд

---

### 💻 Локальный запуск (Telegram-бот)

1. Установи зависимости:

```bash
pip install -r requirements.txt
```

2. Создай `.env` файл и добавь:

```
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

3. Запусти:

```bash
python main.py
```

---

### 🛠 Разработка плагина

#### Сборка:

```bash
npm install
npm run build
```

#### Структура проекта:

```
.
├── main.ts           # Плагин для Obsidian
├── main.py           # Бот Telegram
├── manifest.json     # Манифест плагина
├── versions.json     # Для BRAT
├── README.md
└── main.js           # Скомпилированный плагин
```

---

### ⬆️ Push в GitHub:

```bash
git pull --rebase origin main
git push origin main
```
