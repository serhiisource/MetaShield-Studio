import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Fingerprint,
  Cpu,
  Clock,
  FileWarning,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { MetadataTag, VideoFileAnalysis } from '../types/metadata';

interface SanitizerModuleProps {
  sourceVideo: VideoFileAnalysis;
  targetTags: MetadataTag[];
  isSanitized: boolean;
  modifyMd5: boolean;
  previewNewMd5: string;
  onSanitizeAll: () => void;
  onRemoveSingleTag: (tagId: string) => void;
  onResetToOriginal: () => void;
}

export const SanitizerModule: React.FC<SanitizerModuleProps> = ({
  sourceVideo,
  targetTags,
  isSanitized,
  modifyMd5,
  previewNewMd5,
  onSanitizeAll,
  onRemoveSingleTag,
  onResetToOriginal,
}) => {
  const aiTags = targetTags.filter((t) => t.category === 'ai_marker');
  const softwareTags = targetTags.filter(
    (t) => t.category === 'software' && t.riskLevel === 'danger'
  );
  const timestampTags = targetTags.filter(
    (t) => t.category === 'timestamp' && t.riskLevel === 'danger'
  );
  const totalDangerCount = targetTags.filter((t) => t.riskLevel === 'danger').length;
  const hashChanged = isSanitized || modifyMd5;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              {totalDangerCount > 0 ? (
                <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
              )}
              <h2 className="text-base font-semibold text-zinc-100">
                Глубокий сканер угроз контейнера
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 break-words">
              Анализ бинарных атомов{' '}
              <span className="font-mono text-zinc-300">
                {sourceVideo.detectedAtoms.join(' · ')}
              </span>{' '}
              на триггеры теневого бана TikTok
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onResetToOriginal}
              className="px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
              title="Вернуть исходные метаданные файла"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сброс</span>
            </button>

            <button
              type="button"
              onClick={onSanitizeAll}
              className={`flex-1 sm:flex-initial justify-center px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                totalDangerCount === 0 && isSanitized
                  ? 'bg-emerald-500/15 text-[#10B981] border border-emerald-500/40'
                  : 'bg-[#10B981] text-zinc-950 hover:bg-[#00FF66] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>Очистить все плохие метаданные</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Threat Vector Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. File Hash Check */}
        <div
          className={`bg-[#121215] border rounded-xl p-4 transition-colors ${
            hashChanged
              ? 'border-emerald-500/30'
              : 'border-red-500/40 bg-red-950/10'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <Fingerprint
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  hashChanged ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              />
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-zinc-100">
                    1. Хэш-сумма файла (MD5 / SHA-256)
                  </span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span
                    className={`text-xs font-medium ${
                      hashChanged ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    {hashChanged
                      ? 'Хэш изменен (Дубликат исключен)'
                      : 'Риск дубликата (Совпадение слепка)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-3 py-2">
                    <div className="text-zinc-500 text-[11px]">Исходный MD5:</div>
                    <div className="text-[#EF4444] truncate" title={sourceVideo.md5Hash}>
                      {sourceVideo.md5Hash}
                    </div>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-3 py-2">
                    <div className="text-zinc-500 text-[11px]">Целевой MD5:</div>
                    <div
                      className={`truncate ${
                        hashChanged ? 'text-[#10B981]' : 'text-zinc-400'
                      }`}
                      title={hashChanged ? previewNewMd5 : sourceVideo.md5Hash}
                    >
                      {hashChanged ? previewNewMd5 : sourceVideo.md5Hash}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 truncate">
                  SHA-256: {sourceVideo.sha256Hash}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Generation Markers (C2PA / JUMBF / SynthID / ElevenLabs / OpenAI) */}
        <div
          className={`bg-[#121215] border rounded-xl p-4 transition-colors ${
            aiTags.length === 0
              ? 'border-zinc-800/80'
              : 'border-red-500/40 bg-red-950/10'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 w-full">
              <Cpu
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  aiTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">
                      2. Метки ИИ-генерации (C2PA / JUMBF / SynthID / OpenAI)
                    </span>
                    <span className="text-xs text-zinc-500">·</span>
                    <span
                      className={`text-xs font-medium ${
                        aiTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {aiTags.length === 0
                        ? 'Чисто (0 угроз)'
                        : `Найдено: ${aiTags.length}`}
                    </span>
                  </div>
                </div>

                {aiTags.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {aiTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between gap-3 bg-zinc-950/90 border border-red-500/30 rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-[#EF4444] font-semibold">
                              {tag.key}
                            </span>
                            <span className="text-zinc-600">=</span>
                            <span className="text-zinc-200 truncate">
                              {tag.value}
                            </span>
                          </div>
                          {tag.riskReason && (
                            <p className="text-[11px] text-red-400/90 mt-0.5">
                              {tag.riskReason}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveSingleTag(tag.id)}
                          aria-label={`Удалить метку ${tag.key}`}
                          className="px-2.5 py-1 text-xs font-medium text-red-300 hover:text-white bg-red-500/15 hover:bg-red-500/30 rounded transition-colors shrink-0"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    Криптографические манифесты C2PA, JUMBF и водяные знаки SynthID отсутствуют.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Third-Party Editing & Downloader Software (encoder / software) */}
        <div
          className={`bg-[#121215] border rounded-xl p-4 transition-colors ${
            softwareTags.length === 0
              ? 'border-zinc-800/80'
              : 'border-red-500/40 bg-red-950/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <FileWarning
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                softwareTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-zinc-100">
                  3. Сторонний софт монтажа и боты (encoder / software)
                </span>
                <span className="text-xs text-zinc-500">·</span>
                <span
                  className={`text-xs font-medium ${
                    softwareTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {softwareTags.length === 0
                    ? 'Следы монтажа удалены'
                    : `Угроз: ${softwareTags.length}`}
                </span>
              </div>

              {softwareTags.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {softwareTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between gap-3 bg-zinc-950/90 border border-red-500/30 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[#EF4444] font-semibold">
                            {tag.key}
                          </span>
                          <span className="text-zinc-600">=</span>
                          <span className="text-zinc-200 truncate">
                            {tag.value}
                          </span>
                        </div>
                        {tag.riskReason && (
                          <p className="text-[11px] text-red-400/90 mt-0.5">
                            {tag.riskReason}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveSingleTag(tag.id)}
                        aria-label={`Удалить софт-тег ${tag.key}`}
                        className="px-2.5 py-1 text-xs font-medium text-red-300 hover:text-white bg-red-500/15 hover:bg-red-500/30 rounded transition-colors shrink-0"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  Сигнатуры Lavf, Adobe Premiere, DaVinci Resolve и Telegram-ботов очищены.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Stale or Conflicting Timestamps */}
        <div
          className={`bg-[#121215] border rounded-xl p-4 transition-colors ${
            timestampTags.length === 0
              ? 'border-zinc-800/80'
              : 'border-red-500/40 bg-red-950/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <Clock
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                timestampTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-zinc-100">
                  4. Старые или конфликтующие таймстампы (creation_time)
                </span>
                <span className="text-xs text-zinc-500">·</span>
                <span
                  className={`text-xs font-medium ${
                    timestampTags.length === 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {timestampTags.length === 0
                    ? 'Синхронизировано'
                    : 'Конфликт даты'}
                </span>
              </div>

              {timestampTags.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {timestampTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between gap-3 bg-zinc-950/90 border border-red-500/30 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[#EF4444] font-semibold">
                            {tag.key}
                          </span>
                          <span className="text-zinc-600">=</span>
                          <span className="text-zinc-200 truncate">
                            {tag.value}
                          </span>
                        </div>
                        {tag.riskReason && (
                          <p className="text-[11px] text-red-400/90 mt-0.5">
                            {tag.riskReason}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveSingleTag(tag.id)}
                        aria-label={`Удалить устаревший таймстамп ${tag.key}`}
                        className="px-2.5 py-1 text-xs font-medium text-red-300 hover:text-white bg-red-500/15 hover:bg-red-500/30 rounded transition-colors shrink-0"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  Старые временные метки контейнера удалены или обновлены на текущее время.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
