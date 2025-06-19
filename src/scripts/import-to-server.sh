#!/bin/bash

# === Настройки ===
SERVER=""
CONTAINER="polyglotter-app"
IMPORT_SCRIPT="node src/scripts/importPhrases.js"

# === Параметры ===
FILENAME=${1:-pl-en-dataset.csv}
LOCAL_CSV="./src/scripts/$FILENAME"
LOCAL_JS="./src/scripts/importPhrases.js"

REMOTE_CSV="/tmp/$FILENAME"
REMOTE_JS="/tmp/importPhrases.js"

CONTAINER_CSV="/app/src/scripts/$FILENAME"
CONTAINER_JS="/app/src/scripts/importPhrases.js"

# === Проверка, существует ли локальный CSV ===
if [ ! -f "$LOCAL_CSV" ]; then
    echo "❌ Локальный CSV-файл не найден: $LOCAL_CSV"
    exit 1
fi

# === Проверка, существует ли локальный JS ===
if [ ! -f "$LOCAL_JS" ]; then
    echo "❌ Локальный JS-файл не найден: $LOCAL_JS"
    exit 1
fi

# === 1. Копируем CSV и JS на сервер ===
echo "📤 Копируем CSV и скрипт на сервер..."
scp "$LOCAL_CSV" "$LOCAL_JS" "$SERVER:/tmp/"

# === 2. Копируем файлы в контейнер ===
echo "📦 Копируем файлы в контейнер $CONTAINER..."
ssh "$SERVER" "
    docker cp $REMOTE_CSV $CONTAINER:$CONTAINER_CSV &&
    docker cp $REMOTE_JS $CONTAINER:$CONTAINER_JS
"

# === 3. Запускаем импорт ===
echo "🚀 Запускаем импорт в контейнере..."
ssh "$SERVER" "docker exec $CONTAINER $IMPORT_SCRIPT"

echo "✅ Импорт завершён."
