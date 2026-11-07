import React, { useRef } from 'react';
import {
  Copy,
  Upload,
  CheckSquare,
  Square,
  FileVideo,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { VideoFileAnalysis } from '../types/metadata';

interface ClonerModuleProps {
  donorVideo: VideoFileAnalysis | null;
  targetVideo: VideoFileAnalysis;
  selectedDonorTagIds: string[];
  cloneSuccessBanner: boolean;
  onUploadDonorFile: (file: File) => void;
  onLoadDemoDonor: () => void;
  onUploadTargetFile: (file: File) => void;
  onToggleDonorTag: (tagId: string) => void;
  onSelectAllDonorTags: (selectAll: boolean) => void;
  onCloneToTarget: () => void;
}

export const ClonerModule: React.FC<ClonerModuleProps> = ({
  donorVideo,
  targetVideo,
  selectedDonorTagIds,
  cloneSuccessBanner,
  onUploadDonorFile,
  onLoadDemoDonor,
  onUploadTargetFile,
  onToggleDonorTag,
  onSelectAllDonorTags,
  onCloneToTarget,
}) => {
  const donorInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handleDonorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onUploadDonorFile(f);
  };

  const handleTargetDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onUploadTargetFile(f);
  };

  return (
    <div className="space-y-5">
      {/* Dual Drag & Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zone A: Donor Video */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDonorDrop}
          className="bg-[#121215] border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#10B981]">
                ЗОНА А · ЭТАЛОН
              </span>
              <span className="text-xs text-zinc-400">Источник траста</span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">
              «Видео-Донор» (Эталон)
            </h3>
            <p className="text-xs text-zinc-400">
              Загрузите оригинальный ролик с реального iPhone или залетевший в реки исходник.
            </p>
          </div>

          {donorVideo ? (
            <div className="bg-zinc-950/90 border border-emerald-500/30 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs font-mono text-zinc-100 truncate">
                  {donorVideo.fileName}
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap gap-x-2">
                <span>Атомы: {donorVideo.detectedAtoms.join(', ')}</span>
                <span>·</span>
                <span className="text-[#10B981]">
                  Тегов: {donorVideo.tags.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950/60 border border-dashed border-zinc-800 rounded-lg p-4 text-center">
              <p className="text-xs text-zinc-400">
                Перетащите .MOV / .MP4 донора сюда
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <input
              ref={donorInputRef}
              type="file"
              accept=".mp4,.mov,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadDonorFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => donorInputRef.current?.click()}
              className="flex-1 px-3 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>Выбрать файл-донор</span>
            </button>
            <button
              type="button"
              onClick={onLoadDemoDonor}
              className="px-3 py-2 text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[#10B981] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              title="Загрузить эталонный слепок iPhone 17 Pro (iOS 27.2)"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Эталон iPhone 17 Pro</span>
            </button>
          </div>
        </div>

        {/* Zone B: Target Video */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleTargetDrop}
          className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                ЗОНА Б · РЕЦИПИЕНТ
              </span>
              <span className="text-xs text-zinc-400">Целевой файл</span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">
              «Целевое Видео» (Реципиент)
            </h3>
            <p className="text-xs text-zinc-400">
              Видеоролик для публикации, куда будут инжектированы чистые теги донора.
            </p>
          </div>

          <div className="bg-zinc-950/90 border border-zinc-800 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-zinc-300 shrink-0" />
              <span className="text-xs font-mono text-zinc-100 truncate">
                {targetVideo.fileName}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap gap-x-2">
              <span>MD5: {targetVideo.md5Hash.slice(0, 12)}...</span>
              <span>·</span>
              <span>{targetVideo.resolution}</span>
            </div>
          </div>

          <div className="pt-1">
            <input
              ref={targetInputRef}
              type="file"
              accept=".mp4,.mov,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadTargetFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => targetInputRef.current?.click()}
              className="w-full px-3 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Заменить целевое видео</span>
            </button>
          </div>
        </div>
      </div>

      {/* Donor Metadata Selection Table */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Таблица безопасных EXIF / QuickTime / MP4-тегов донора
            </h3>
            <p className="text-xs text-zinc-400">
              Отметьте галочками теги (модель камеры, софт, цветовое пространство, ГЕО), которые нужно перенести
            </p>
          </div>

          {donorVideo && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSelectAllDonorTags(true)}
                className="px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded transition-colors whitespace-nowrap"
              >
                Выбрать все
              </button>
              <button
                type="button"
                onClick={() => onSelectAllDonorTags(false)}
                className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded transition-colors whitespace-nowrap"
              >
                Снять все
              </button>
            </div>
          )}
        </div>

        {donorVideo ? (
          <div className="overflow-x-auto border border-zinc-800/80 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/90 text-[11px] font-mono text-zinc-400">
                  <th className="py-2.5 px-3 w-10">Выбор</th>
                  <th className="py-2.5 px-3">Ключ (EXIF / QuickTime Atom)</th>
                  <th className="py-2.5 px-3">Значение донора</th>
                  <th className="py-2.5 px-3">Структура атома</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs font-mono">
                {donorVideo.tags.map((tag) => {
                  const checked = selectedDonorTagIds.includes(tag.id);
                  return (
                    <tr
                      key={tag.id}
                      onClick={() => onToggleDonorTag(tag.id)}
                      className={`cursor-pointer transition-colors ${
                        checked
                          ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                          : 'bg-zinc-950/40 hover:bg-zinc-900/60 opacity-60'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          aria-label={`Выбрать тег донора ${tag.key}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDonorTag(tag.id);
                          }}
                          className="text-[#10B981] focus:outline-none"
                        >
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-[#10B981]" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-600" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-medium">
                        {tag.key}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-100">{tag.value}</td>
                      <td className="py-2.5 px-3 text-zinc-500">
                        {tag.sourceAtom || 'moov.udta.meta'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-zinc-800 rounded-lg space-y-2">
            <p className="text-xs text-zinc-400">
              Видео-донор еще не выбрано. Загрузите свой файл или нажмите «Эталон iPhone 16».
            </p>
            <button
              type="button"
              onClick={onLoadDemoDonor}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/15 text-[#10B981] border border-emerald-500/40 rounded-lg hover:bg-emerald-500/25 transition-colors"
            >
              Загрузить эталон iPhone 16 Pro Max (.MOV)
            </button>
          </div>
        )}

        {cloneSuccessBanner && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#10B981]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Старые токсичные метаданные реципиента удалены. Выбранные теги донора успешно инжектированы в целевое видео!
            </span>
          </div>
        )}

        <button
          type="button"
          disabled={!donorVideo || selectedDonorTagIds.length === 0}
          onClick={onCloneToTarget}
          className="w-full py-2.5 px-4 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Copy className="w-4 h-4" />
          <span>Перенести метаданные в целевое видео</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
