import sys
import os
import re
import asyncio
import glob
from datetime import datetime
from telegram import Bot
from telegram.constants import ParseMode

# ==== WINDOWS UTF-8 FIX ====
if os.name == "nt":
    sys.stdout.reconfigure(encoding='utf-8')

# ==== CONFIG ====
TELEGRAM_TOKEN = '7868190531:AAH2F9F32O5IU4j_jaLn_JzrdzzPZPWB5Cg'
CHAT_ID = -1002748499741
TASKS_FOLDER = './tasks'
CHECK_INTERVAL = 5
# ================

PATTERN = r'- \[ \] (.*?) \(?@(\d{4}-\d{2}-\d{2}) StartTime:: (\d{2}:\d{2})\)?'
task_db = {}  # {(file_path, line_number): (text, datetime)}

def parse_file_and_update_db(file_path):
    updated_tasks = {}

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"❗ Ошибка чтения {file_path}: {e}")
        return

    for i, line in enumerate(lines):
        match = re.search(PATTERN, line)
        if match:
            text = match.group(1).strip()
            date, time = match.group(2), match.group(3)
            try:
                dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
                task_key = (file_path, i)
                updated_tasks[task_key] = (text, dt)
            except Exception as e:
                print(f"❗ Ошибка парсинга в {file_path}:{i}: {e}")

    for key in list(task_db.keys()):
        if key[0] == file_path:
            del task_db[key]

    task_db.update(updated_tasks)


def refresh_all_tasks():
    for file_path in glob.glob(os.path.join(TASKS_FOLDER, '**', '*.md'), recursive=True):
        parse_file_and_update_db(file_path)

async def send_telegram_message(bot, text):
    try:
        await bot.send_message(chat_id=CHAT_ID, text=text, parse_mode=ParseMode.HTML)
    except Exception as e:
        print(f"❗ Ошибка отправки: {e}")

async def main_loop():
    bot = Bot(token=TELEGRAM_TOKEN)
    sent_tasks = set()

    print("✅ Бот запущен. Слежение за задачами...")

    while True:
        refresh_all_tasks()
        now = datetime.now()

        log_lines = [f"🕓 {now.strftime('%H:%M:%S')} | Задач в БД: {len(task_db)}"]
        for (file_path, line_num), (text, dt) in sorted(task_db.items(), key=lambda x: x[1][1]):
            status = "✅ ОТПРАВЛЕНО" if (file_path, line_num) in sent_tasks else "⏳ ОЖИДАНИЕ"
            filename = os.path.basename(file_path)
            log_lines.append(
                f"{status} | 📄 {filename} : {line_num + 1} | ⏰ {dt.strftime('%H:%M')} | {text}"
            )

            if now >= dt and (file_path, line_num) not in sent_tasks:
                await send_telegram_message(bot, f"🔔 Напоминание\n📄 *{filename}* : *{line_num + 1}*\n{text}")
                print(f"✅ Отправлено: {text}")
                sent_tasks.add((file_path, line_num))

        await send_telegram_message(bot, "\n".join(log_lines))
        await asyncio.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    asyncio.run(main_loop())
