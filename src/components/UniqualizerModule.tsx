import React from 'react';
import {
  Sliders,
  Hash,
  Maximize2,
  FlipHorizontal,
  SunMedium,
  Volume2,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { UniqualizationConfig } from '../types/metadata';

interface UniqualizerModuleProps {
  config: UniqualizationConfig;
  onChange: (updated: UniqualizationConfig) => void;
  onEnableRecommendedPreset: () => void;
}

export const UniqualizerModule: React.FC<UniqualizerModuleProps> = ({
  config,
  onChange,
  onEnableRecommendedPreset,
}) => {
  const toggleKey = (key: keyof UniqualizationConfig) => {
    onChange({
      ...config,
      [key]: !config[key],
    });
  };

  const items: Array<{
    key: keyof UniqualizationConfig;
    title: string;
    subtitle: string;
    ffmpegFlag: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'modifyMd5',
      title: '1. Изменение MD5 и SHA-256 хэша (Zero-Byte & Atom Rebuild)',
      subtitle:
        'Пересборка структуры контейнера и инжекция уникального атома free без потери качества видеопотока.',
      ffmpegFlag: '-movflags +faststart+use_metadata_tags [free atom pad]',
      icon: <Hash className="w-4 h-4 text-[#10B981]" />,
    },
    {
      key: 'microCropZoom',
      title: '2. Микро-масштабирование кадра (Crop / Zoom на 1.5%)',
      subtitle:
        'Полностью сбивает перцептивный визуальный слепок (pHash) нейросети TikTok, оставаясь незаметным для зрителя.',
      ffmpegFlag: '-vf "crop=iw*0.985:ih*0.985"',
      icon: <Maximize2 className="w-4 h-4 text-[#10B981]" />,
    },
    {
      key: 'horizontalFlip',
      title: '3. Опциональное горизонтальное отзеркаливание (Horizontal Flip)',
      subtitle:
        'Зеркальное отражение геометрии кадра (рекомендуется для роликов без текста на экране).',
      ffmpegFlag: '-vf "hflip"',
      icon: <FlipHorizontal className="w-4 h-4 text-[#10B981]" />,
    },
    {
      key: 'colorShift',
      title: '4. Невидимый сдвиг цветокоррекции (EQ Matrix Shift)',
      subtitle:
        'Изменяет гистограмму каждого кадра: Brightness +0.01, Contrast 1.01, Saturation 1.02.',
      ffmpegFlag: '-vf "eq=brightness=0.01:contrast=1.01:saturation=1.02"',
      icon: <SunMedium className="w-4 h-4 text-[#10B981]" />,
    },
    {
      key: 'audioProtect',
      title: '5. Очистка аудио-слепка (Pitch +1% & Ultrasonic Cut)',
      subtitle:
        'Сдвиг высоты тона/скорости на 1% и срез ультразвуковых частот >18.5 kHz (удаление акустических водяных меток).',
      ffmpegFlag: '-af "asetrate=44100*1.01,aresample=44100,lowpass=f=18500"',
      icon: <Volume2 className="w-4 h-4 text-[#10B981]" />,
    },
    {
      key: 'tiktokStandardize',
      title: '6. Стандартизация рендера под алгоритм TikTok',
      subtitle:
        'Форсирует эталонный поток: 1080x1920 (9:16), 60 FPS, кодек H.264 (High@L4.2), битрейт 12 Mbps.',
      ffmpegFlag: '-vf "scale=1080:1920,fps=60" -c:v libx264 -b:v 12M',
      icon: <Film className="w-4 h-4 text-[#10B981]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#10B981] shrink-0" />
            <h2 className="text-base font-semibold text-zinc-100">
              Глубокая уникализация видео и аудио (Anti-pHash & MD5)
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Обход алгоритмов компьютерного зрения и аудио-детекции дубликатов TikTok через фильтры FFmpeg
          </p>
        </div>

        <button
          type="button"
          onClick={onEnableRecommendedPreset}
          className="w-full sm:w-auto justify-center px-3.5 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] text-zinc-950 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Включить оптимальный Anti-pHash</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const active = config[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleKey(item.key)}
              className={`bg-[#121215] border rounded-xl p-3.5 sm:p-4 cursor-pointer transition-all flex items-start justify-between gap-3 sm:gap-4 overflow-hidden ${
                active
                  ? 'border-[#10B981]/60 bg-emerald-500/[0.04] shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                  : 'border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-sm font-medium text-zinc-100">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400">{item.subtitle}</p>
                  <div className="pt-1">
                    <code className="inline-block max-w-full break-all text-[11px] font-mono text-emerald-400/90 bg-zinc-950 border border-zinc-800/90 px-2 py-0.5 rounded">
                      {item.ffmpegFlag}
                    </code>
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label={item.title}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleKey(item.key);
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 mt-1 ${
                  active ? 'bg-[#10B981]' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-zinc-950 transition-transform ${
                    active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
