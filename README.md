# MetaShield Studio

**MetaShield Studio** — веб-приложение для глубокой очистки бинарных контейнеров `MP4 / MOV`, спуфинга `EXIF / QuickTime / Apple PLIST` метаданных, клонирования слепков с эталонных устройств и микро-уникализации видео (`Anti-pHash` & `MD5 / SHA-256`) под алгоритмы TikTok.

---

## Возможности

1. **Sanitizer (Глубокий сканер угроз)**
   - Бинарный анализ атомов `ftyp`, `moov`, `mvhd`, `trak`, `mdia`, `udta`, `meta`, `ilst`, `uuid`, `jumb`, `c2pa`.
   - Обнаружение и удаление меток генераторов (`C2PA`, `JUMBF`, `SynthID`), следов программ монтажа (`Lavf`, `Adobe Premiere`, `DaVinci Resolve`), сигнатур загрузчиков и устаревших `creation_time`.
2. **Spoofer (Инжектор EXIF / QuickTime / GPS)**
   - Готовые пресеты нативных камер: **iPhone 17 Pro (iOS 27.2 · 4K 120fps · Build 24B115)**, **iPhone 16 Pro Max**, **iPhone 15 Pro**, **Google Pixel 9 (4K 60fps)**, **CapCut Official Export**.
   - Гео-спуфинг (`ISO-6709` и `DMS GPSCoordinates`) с пресетами городов (Мюнхен, Берлин, Нью-Йорк, Лос-Анджелес, Лондон, Алматы, Дубай), ручным вводом координат и микро-рандомизацией в радиусе **1–2 км** вокруг выбранного пресета.
   - Ручная и быстрая синхронизация времени съемки (`creation_time` UTC + `com.apple.quicktime.creationdate` с часовым поясом камеры).
   - Инжекция SEO-метаданных контейнера (`title`, `keywords`, `description`, `comment`) и кастомный редактор `Key-Value`.
3. **Cloner (Клонирование метаданных с видео-донора)**
   - Перенос трастовых атомов и тегов с оригинального файла камеры (`Видео-Донора`) в целевой ролик.
4. **Anti-pHash & MD5 Uniqualizer**
   - Пересборка структуры атомов и инъекция `free`-бокса для получения нового `MD5` и `SHA-256` без потери качества.
   - Фильтры `FFmpeg` для обхода визуального и аудио-слепка: микро-кроп `1.5%`, сдвиг матрицы `EQ`, защита аудио (`Pitch +1%` + `Lowpass 18.5 kHz`) и стандартизация потока `1080x1920 @ 60fps`.

---

## Быстрый старт (Локальное развертывание)

### Требования
- **Node.js** `18.18+` / `20 LTS` / `22 LTS`
- **npm** `9+`

### Установка и запуск в режиме разработки

```bash
git clone https://github.com/serhiisource/MetaShield-Studio.git
cd metashield-studio
npm install
npm run dev
```

Откройте в браузере: `http://localhost:3000`

> В `vite.config.ts` и `server.ts` настроены заголовки `Cross-Origin-Opener-Policy: same-origin` и `Cross-Origin-Embedder-Policy: credentialless` для работы `SharedArrayBuffer` и WebAssembly-ядра `@ffmpeg/ffmpeg`.

### Production-сборка

```bash
npm run build
npm run start
```

---

## Скрипты проекта

| Команда | Описание |
| :--- | :--- |
| `npm run dev` | Запуск dev-сервера Vite на `http://localhost:3000` |
| `npm run build` | Сборка клиентского бандла в `dist/` |
| `npm run start` | Запуск production-сервера Express (`server.ts`) на порту `3000` |
| `npm run test` | Запуск unit-тестов движка метаданных (`node:test`) |
| `npm run lint` | Проверка типов TypeScript (`tsc --noEmit`) |

---

## Лицензия
MIT
