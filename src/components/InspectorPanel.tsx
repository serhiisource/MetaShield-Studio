import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Terminal,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  RefreshCw,
  Copy,
  Check,
  ArrowLeftRight,
} from 'lucide-react';
import {
  MetadataTag,
  ProcessedVideoResult,
  TrustScoreBreakdown,
  VideoFileAnalysis,
} from '../types/metadata';

interface InspectorPanelProps {
  sourceVideo: VideoFileAnalysis;
  targetTags: MetadataTag[];
  isSanitized: boolean;
  previewNewMd5: string;
  previewNewSha256: string;
  trustScore: TrustScoreBreakdown;
  ffmpegCommand: string;
  terminalLogs: string[];
  outputFileName: string;
  outputExt: 'MOV' | 'MP4';
  isProcessing: boolean;
  processingProgress: number;
  processedResult: ProcessedVideoResult | null;
  onChangeOutputExt: (ext: 'MOV' | 'MP4') => void;
  onRegenerateFileName: () => void;
  onRunProcessing: () => void;
  onDownloadProcessed: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  sourceVideo,
  targetTags,
  isSanitized,
  previewNewMd5,
  previewNewSha256,
  trustScore,
  ffmpegCommand,
  terminalLogs,
  outputFileName,
  outputExt,
  isProcessing,
  processingProgress,
  processedResult,
  onChangeOutputExt,
  onRegenerateFileName,
  onRunProcessing,
  onDownloadProcessed,
}) => {
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText(ffmpegCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  const activeNewMd5 = processedResult ? processedResult.md5Hash : previewNewMd5;
  const activeNewSha256 = processedResult
    ? processedResult.sha256Hash
    : previewNewSha256;

  // Build unified Diff Rows: show active targetTags first so newly spoofed iPhone/GPS tags are immediately visible, followed by removed toxic tags
  const allKeys = Array.from(
    new Set([
      ...targetTags.map((t) => t.key),
      ...sourceVideo.tags.map((t) => t.key),
    ])
  );

  const scoreColor =
    trustScore.score >= 80
      ? 'text-[#10B981]'
      : trustScore.score >= 50
      ? 'text-amber-400'
      : 'text-[#EF4444]';

  const barBgColor =
    trustScore.score >= 80
      ? 'bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.45)]'
      : trustScore.score >= 50
      ? 'bg-amber-400'
      : 'bg-[#EF4444]';

  return (
    <div className="space-y-5">
      {/* 1. TikTok Trust Score Card */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {trustScore.score >= 75 ? (
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
              )}
              <h2 className="text-base font-semibold text-zinc-100">
                TikTok Trust Score
              </h2>
            </div>
            <p className="text-xs text-zinc-400">{trustScore.statusLabel}</p>
          </div>

          <div className="text-right">
            <span
              data-testid="trust-score-value"
              className={`text-3xl font-bold font-mono tabular-nums ${scoreColor}`}
            >
              {trustScore.score}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className={`h-full transition-all duration-300 rounded-full ${barBgColor}`}
            style={{ width: `${trustScore.score}%` }}
          />
        </div>

        {/* Breakdown items */}
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          {trustScore.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 text-xs bg-zinc-950/70 border border-zinc-800/60 rounded-lg px-3 py-1.5"
            >
              <span className="text-zinc-300">{item.reason}</span>
              <span
                className={`font-mono font-semibold shrink-0 tabular-nums ${
                  item.type === 'bonus' ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {item.points > 0 ? `+${item.points}%` : `${item.points}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Diff Table ("До / После") */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Инспектор сравнения «До / После» (Diff View)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Атомов: {sourceVideo.detectedAtoms.length} · Полей: {allKeys.length + 2}
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-800/80 rounded-lg max-h-[420px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-zinc-950 border-b border-zinc-800 z-10">
              <tr className="text-[11px] font-mono text-zinc-400">
                <th className="py-2.5 px-3 w-1/4">Поле / EXIF-Ключ</th>
                <th className="py-2.5 px-3 w-[37.5%]">
                  ДО (Исходный контейнер)
                </th>
                <th className="py-2.5 px-3 w-[37.5%] text-[#10B981]">
                  ПОСЛЕ (Чистый / Спуфинг)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
              {/* Row 1: File Name */}
              <tr className="bg-zinc-950/40">
                <td className="py-2 px-3 text-zinc-400">file_name</td>
                <td className="py-2 px-3 text-zinc-400 truncate max-w-[180px]">
                  {sourceVideo.fileName}
                </td>
                <td className="py-2 px-3 text-[#10B981] font-semibold">
                  {outputFileName}
                </td>
              </tr>

              {/* Row 2: MD5 Hash */}
              <tr className="bg-zinc-950/40">
                <td className="py-2 px-3 text-zinc-400">md5_checksum</td>
                <td
                  className="py-2 px-3 text-[#EF4444] truncate max-w-[180px]"
                  title={sourceVideo.md5Hash}
                >
                  {sourceVideo.md5Hash.slice(0, 16)}...
                </td>
                <td
                  className="py-2 px-3 text-[#10B981] font-semibold truncate max-w-[180px]"
                  title={activeNewMd5}
                >
                  {activeNewMd5.slice(0, 16)}...
                </td>
              </tr>

              {/* Dynamic Metadata Tags Diff */}
              {allKeys.map((key) => {
                const beforeTag = sourceVideo.tags.find((t) => t.key === key);
                const afterTag = targetTags.find((t) => t.key === key);

                return (
                  <tr key={key} className="hover:bg-zinc-900/40 transition-colors">
                    <td
                      className="py-2 px-3 text-zinc-300 truncate max-w-[150px]"
                      title={key}
                    >
                      {key}
                    </td>
                    <td
                      className={`py-2 px-3 truncate max-w-[190px] ${
                        !beforeTag
                          ? 'text-zinc-600 italic'
                          : beforeTag.riskLevel === 'danger'
                          ? 'text-[#EF4444] bg-red-950/15'
                          : 'text-zinc-400'
                      }`}
                      title={beforeTag?.value || 'Отсутствует'}
                    >
                      {beforeTag ? beforeTag.value : '—'}
                    </td>
                    <td
                      className={`py-2 px-3 truncate max-w-[190px] ${
                        !afterTag
                          ? 'text-zinc-500 line-through'
                          : afterTag.riskLevel === 'danger'
                          ? 'text-[#EF4444]'
                          : 'text-[#10B981] bg-emerald-950/15 font-medium'
                      }`}
                      title={afterTag?.value || 'Удалено (-map_metadata -1)'}
                    >
                      {afterTag
                        ? afterTag.value
                        : isSanitized
                        ? '[УДАЛЕНО]'
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Native iPhone Export & Processing Action Card */}
      <div className="bg-[#121215] border border-emerald-500/30 rounded-xl p-4 sm:p-5 space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Сборка и экспорт с нативным именем камеры iPhone
            </h3>
            <p className="text-xs text-zinc-400">
              Генерация чистого контейнера с новым MD5/SHA-256 и вшитыми атомами QuickTime
            </p>
          </div>

          {/* Native Filename Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1 shrink-0">
            <span className="px-2.5 py-1 text-xs font-mono font-semibold text-[#10B981]">
              {outputFileName}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onRegenerateFileName}
                aria-label="Сгенерировать новый номер IMG"
                className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
                title="Сгенерировать новый номер IMG_XXXX"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center border-l border-zinc-800 pl-1">
                <button
                  type="button"
                  onClick={() => onChangeOutputExt('MOV')}
                  className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                    outputExt === 'MOV'
                      ? 'bg-[#10B981] text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  .MOV
                </button>
                <button
                  type="button"
                  onClick={() => onChangeOutputExt('MP4')}
                  className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                    outputExt === 'MP4'
                      ? 'bg-[#10B981] text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  .MP4
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar when processing or completed */}
        {(isProcessing || processedResult) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">
                {isProcessing
                  ? 'Выполнение конвейера FFmpeg & пересборка атомов...'
                  : `Контейнер ${processedResult?.fileName} готов к выгрузке`}
              </span>
              <span className="text-[#10B981] tabular-nums">
                {processingProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-[#10B981] transition-all duration-200"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            {processedResult && (
              <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap gap-x-3 pt-0.5 break-all">
                <span>
                  Новый MD5:{' '}
                  <strong className="text-[#10B981]">
                    {processedResult.md5Hash}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  SHA-256: {processedResult.sha256Hash.slice(0, 20)}...
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onRunProcessing}
            className="w-full py-2.5 px-3 sm:px-4 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-[#10B981] rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {isProcessing
                ? 'Обработка контейнера...'
                : 'Запустить обработку FFmpeg'}
            </span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onDownloadProcessed}
            className="w-full py-2.5 px-3 sm:px-4 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] text-zinc-950 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">Скачать готовый файл ({outputFileName})</span>
          </button>
        </div>
      </div>

      {/* 4. Collapsible Live FFmpeg Terminal */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden">
        <div
          onClick={() => setTerminalOpen(!terminalOpen)}
          className="px-3.5 sm:px-4 py-3 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between gap-2 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="text-xs font-mono font-semibold text-zinc-200 truncate">
              Live FFmpeg Terminal & CLI Pipeline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyCommand();
              }}
              className="px-2.5 py-1 text-[11px] font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded flex items-center gap-1 transition-colors"
            >
              {copiedCmd ? (
                <>
                  <Check className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[#10B981]">Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Копировать CLI</span>
                </>
              )}
            </button>
            <button
              type="button"
              aria-label="Свернуть или развернуть терминал"
              className="text-zinc-400 hover:text-zinc-100 p-1"
            >
              {terminalOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {terminalOpen && (
          <div className="p-4 bg-[#09090B] font-mono text-xs space-y-3">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/90 overflow-x-auto">
              <div className="text-[11px] text-zinc-500 mb-1">
                Сгенерированная команда FFmpeg (Real-Time):
              </div>
              <code
                data-testid="ffmpeg-command-output"
                className="text-[#00FF66] break-all leading-relaxed"
              >
                {ffmpegCommand}
              </code>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 text-[11px] leading-relaxed pr-1">
              {terminalLogs.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith('$')
                      ? 'text-[#00FF66] font-semibold'
                      : line.includes('[done]') || line.includes('[success]')
                      ? 'text-[#10B981]'
                      : 'text-zinc-400'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
