import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  ShieldAlert,
  Sparkles,
  Copy,
  Sliders,
  FileVideo,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  GeoPreset,
  MetadataTag,
  ProcessedVideoResult,
  SeoMetadataConfig,
  SpoofPreset,
  UniqualizationConfig,
  VideoFileAnalysis,
} from './types/metadata';
import {
  GEO_PRESETS,
  SPOOF_PRESETS,
  applyCustomTimestampTag,
  applyFreshTimestampTag,
  applyGeoTag,
  applySeoMetadataTags,
  applySpoofPresetToTags,
  buildFfmpegCommand,
  buildModifiedMp4Binary,
  calculateTrustScore,
  classifyMetadataTag,
  cloneDonorMetadataTags,
  computeMd5Hex,
  computeSha256Hex,
  createDemoVideoBuffer,
  generateNativeAppleFilename,
  parseBinaryMp4Atoms,
  sanitizeMetadataTags,
} from './utils/metadataEngine';
import { processVideoWithEngine } from './utils/ffmpegRunner';
import { SanitizerModule } from './components/SanitizerModule';
import { SpooferModule } from './components/SpooferModule';
import { ClonerModule } from './components/ClonerModule';
import { UniqualizerModule } from './components/UniqualizerModule';
import { InspectorPanel } from './components/InspectorPanel';

type ActiveModuleTab = 'sanitizer' | 'spoofer' | 'cloner' | 'uniqualizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveModuleTab>('sanitizer');
  const [sourceVideo, setSourceVideo] = useState<VideoFileAnalysis | null>(null);
  const [targetTags, setTargetTags] = useState<MetadataTag[]>([]);
  const [isSanitized, setIsSanitized] = useState(false);

  // Module 2 (Spoofer) state
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [selectedGeoId, setSelectedGeoId] = useState<string>('de_munich');
  const [customGeoIso, setCustomGeoIso] = useState<string>('+48.1371+011.5754+519.00/');
  const [seoConfig, setSeoConfig] = useState<SeoMetadataConfig>({
    title: '',
    comment: '',
    description: '',
    keywords: '',
  });

  // Module 3 (Cloner) state
  const [donorVideo, setDonorVideo] = useState<VideoFileAnalysis | null>(null);
  const [selectedDonorTagIds, setSelectedDonorTagIds] = useState<string[]>([]);
  const [cloneSuccessBanner, setCloneSuccessBanner] = useState(false);

  // Module 4 (Anti-pHash & MD5 Uniqualization) state
  const [uniqualization, setUniqualization] = useState<UniqualizationConfig>({
    modifyMd5: false,
    microCropZoom: false,
    horizontalFlip: false,
    colorShift: false,
    audioProtect: false,
    tiktokStandardize: false,
  });

  // Export & Terminal state
  const [outputExt, setOutputExt] = useState<'MOV' | 'MP4'>('MOV');
  const [outputSeed, setOutputSeed] = useState<number>(3829);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[system] MetaShield Studio инициализирован. Парсер бинарных атомов MP4/MOV (ftyp, moov, udta, meta, c2pa) готов.',
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedResult, setProcessedResult] =
    useState<ProcessedVideoResult | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showMobileInspector, setShowMobileInspector] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);

  const appendLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-60), msg]);
  };

  // Load initial toxic sample video so the user can immediately inspect and test
  const loadBufferAsTargetVideo = async (
    buffer: ArrayBuffer,
    fileName: string,
    isDemo = false,
    demoId?: string,
    lastModified?: number
  ) => {
    const parsed = parseBinaryMp4Atoms(buffer, fileName, lastModified);
    const md5Hash = computeMd5Hex(buffer);
    const sha256Hash = await computeSha256Hex(buffer);

    const analysis: VideoFileAnalysis = {
      ...parsed,
      md5Hash,
      sha256Hash,
      isDemo,
      demoId,
    };

    setSourceVideo(analysis);
    setTargetTags(analysis.tags);
    setIsSanitized(false);
    setActivePresetId(null);
    setProcessedResult(null);
    setProcessingProgress(0);
    setCloneSuccessBanner(false);

    const dangerCount = analysis.tags.filter((t) => t.riskLevel === 'danger').length;
    appendLog(
      `[scanner] Загружен файл '${fileName}' (${(
        buffer.byteLength / 1024
      ).toFixed(1)} KB) | MD5: ${md5Hash} | Найдено угроз: ${dangerCount}`
    );
  };

  const loadDonorBuffer = async (
    buffer: ArrayBuffer,
    fileName: string,
    isDemo = false
  ) => {
    const parsed = parseBinaryMp4Atoms(buffer, fileName);
    const md5Hash = computeMd5Hex(buffer);
    const sha256Hash = await computeSha256Hex(buffer);
    const donor: VideoFileAnalysis = {
      ...parsed,
      md5Hash,
      sha256Hash,
      isDemo,
    };
    setDonorVideo(donor);
    setSelectedDonorTagIds(donor.tags.map((t) => t.id));
    setCloneSuccessBanner(false);
    appendLog(
      `[cloner] Загружен эталонный видео-донор '${fileName}' (${donor.tags.length} трастовых EXIF/QuickTime тегов).`
    );
  };

  useEffect(() => {
    const initialSample = createDemoVideoBuffer('dirty_ai_premiere');
    void loadBufferAsTargetVideo(
      initialSample.buffer,
      initialSample.fileName,
      true,
      'dirty_ai_premiere'
    );

    const initialDonor = createDemoVideoBuffer('donor_iphone_17');
    void loadDonorBuffer(initialDonor.buffer, initialDonor.fileName, true);
  }, []);

  const handleRealFileUpload = async (file: File, asDonor = false) => {
    const arrayBuffer = await file.arrayBuffer();
    if (asDonor) {
      await loadDonorBuffer(arrayBuffer, file.name, false);
    } else {
      await loadBufferAsTargetVideo(
        arrayBuffer,
        file.name,
        false,
        undefined,
        file.lastModified
      );
    }
  };

  // Module 1: Sanitizer handlers
  const handleSanitizeAll = () => {
    if (!sourceVideo) return;
    const cleaned = sanitizeMetadataTags(targetTags);
    setTargetTags(cleaned);
    setIsSanitized(true);
    setUniqualization((prev) => ({ ...prev, modifyMd5: true }));
    setProcessedResult(null);
    appendLog(
      '[sanitizer] Выполнена полная очистка контейнера (-map_metadata -1 -map_chapters -1). Удалены C2PA, JUMBF, Lavf и старые таймстампы.'
    );
  };

  const handleRemoveSingleTag = (tagId: string) => {
    const removed = targetTags.find((t) => t.id === tagId);
    const next = targetTags.filter((t) => t.id !== tagId);
    setTargetTags(next);
    if (next.filter((t) => t.riskLevel === 'danger').length === 0) {
      setIsSanitized(true);
    }
    setProcessedResult(null);
    if (removed) {
      appendLog(`[sanitizer] Удален токсичный тег: ${removed.key}=${removed.value}`);
    }
  };

  const handleResetToOriginal = () => {
    if (!sourceVideo) return;
    setTargetTags(sourceVideo.tags);
    setIsSanitized(false);
    setActivePresetId(null);
    setSelectedGeoId('');
    setUniqualization({
      modifyMd5: false,
      microCropZoom: false,
      horizontalFlip: false,
      colorShift: false,
      audioProtect: false,
      tiktokStandardize: false,
    });
    setProcessedResult(null);
    appendLog('[system] Настройки и метаданные сброшены к исходному состоянию файла.');
  };

  // Module 2: Spoofer handlers
  const handleSelectSpoofPreset = (preset: SpoofPreset) => {
    const baseClean = sanitizeMetadataTags(targetTags);
    const withPreset = applySpoofPresetToTags(baseClean, preset);
    setTargetTags(withPreset);
    setIsSanitized(true);
    setActivePresetId(preset.id);
    setOutputExt(preset.recommendedExt);
    setUniqualization((prev) => ({ ...prev, modifyMd5: true }));
    setProcessedResult(null);
    appendLog(
      `[spoofer] Применен трастовый пресет устройства: ${preset.name} (.${preset.recommendedExt})`
    );
  };

  const handleSelectGeoPreset = (geo: GeoPreset) => {
    setSelectedGeoId(geo.id);
    setCustomGeoIso(geo.iso6709);
    const updated = applyGeoTag(
      targetTags,
      geo.iso6709,
      `${geo.country} — ${geo.city}`
    );
    setTargetTags(updated);
    setProcessedResult(null);
    appendLog(
      `[spoofer] Внедрены GPS координаты ISO-6709 (${geo.country}, ${geo.city}): ${geo.iso6709}`
    );
  };

  const handleApplyCustomGeo = (iso6709: string, label?: string) => {
    setCustomGeoIso(iso6709);
    const updated = applyGeoTag(
      targetTags,
      iso6709,
      label || 'Кастомные координаты ISO-6709'
    );
    setTargetTags(updated);
    setProcessedResult(null);
    appendLog(
      `[spoofer] Установлены GPS координаты (${label || 'Вручную'}): ${iso6709}`
    );
  };

  const handleApplyFreshTimestamp = (offsetMinutes: number) => {
    const updated = applyFreshTimestampTag(targetTags, offsetMinutes);
    setTargetTags(updated);
    setProcessedResult(null);
    appendLog(
      `[spoofer] Обновлен creation_time контейнера (смещение -${offsetMinutes} мин от текущего времени).`
    );
  };

  const handleApplyCustomTimestamp = (
    localDateTime: string,
    tzOffset: string
  ) => {
    const updated = applyCustomTimestampTag(targetTags, localDateTime, tzOffset);
    setTargetTags(updated);
    setProcessedResult(null);
    appendLog(
      `[spoofer] Выставлено пользовательское время съемки: ${localDateTime} (${tzOffset})`
    );
  };

  const handleUpdateSeoConfig = (nextSeo: SeoMetadataConfig) => {
    setSeoConfig(nextSeo);
    const updated = applySeoMetadataTags(targetTags, nextSeo);
    setTargetTags(updated);
    setProcessedResult(null);
  };

  const handleUpdateTagValue = (
    tagId: string,
    newKey: string,
    newValue: string
  ) => {
    setTargetTags((prev) =>
      prev.map((t) => {
        if (t.id !== tagId) return t;
        const classified = classifyMetadataTag(newKey, newValue);
        return {
          ...t,
          key: newKey,
          value: newValue,
          category: classified.category,
          riskLevel: classified.riskLevel,
          riskReason: classified.riskReason,
        };
      })
    );
    setProcessedResult(null);
  };

  const handleDeleteTag = (tagId: string) => {
    setTargetTags((prev) => prev.filter((t) => t.id !== tagId));
    setProcessedResult(null);
  };

  const handleAddCustomTag = (key: string, value: string) => {
    const classified = classifyMetadataTag(key, value);
    const newTag: MetadataTag = {
      id: `custom_${Date.now()}`,
      key,
      value,
      category: classified.category,
      riskLevel: classified.riskLevel,
      riskReason: classified.riskReason,
      sourceAtom: classified.sourceAtom,
    };
    setTargetTags((prev) => [...prev, newTag]);
    setProcessedResult(null);
    appendLog(`[editor] Добавлен кастомный тег: ${key}=${value}`);
  };

  // Module 3: Cloner handlers
  const handleToggleDonorTag = (tagId: string) => {
    setSelectedDonorTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSelectAllDonorTags = (selectAll: boolean) => {
    if (!donorVideo) return;
    setSelectedDonorTagIds(selectAll ? donorVideo.tags.map((t) => t.id) : []);
  };

  const handleCloneToTarget = () => {
    if (!donorVideo) return;
    const cloned = cloneDonorMetadataTags(donorVideo.tags, selectedDonorTagIds);
    setTargetTags(cloned);
    setIsSanitized(true);
    setOutputExt('MOV');
    setUniqualization((prev) => ({ ...prev, modifyMd5: true }));
    setCloneSuccessBanner(true);
    setProcessedResult(null);
    appendLog(
      `[cloner] Клонировано ${cloned.length} эталонных тегов из '${donorVideo.fileName}' в целевое видео.`
    );
  };

  // Module 4: Uniqualizer preset handler
  const handleEnableRecommendedUniq = () => {
    setUniqualization({
      modifyMd5: true,
      microCropZoom: true,
      horizontalFlip: false,
      colorShift: true,
      audioProtect: true,
      tiktokStandardize: true,
    });
    setProcessedResult(null);
    appendLog(
      '[anti-phash] Включен рекомендуемый профиль глубокой уникализации видео и аудио (Crop 1.5%, EQ Shift, Audio Pitch +1%, 1080x1920@60fps).'
    );
  };

  // One-click full turbo optimization from top bar
  const handleOneClickFullProtect = () => {
    if (!sourceVideo) return;
    const iphone16 = SPOOF_PRESETS[0];
    const nyc = GEO_PRESETS[0];
    let tags = sanitizeMetadataTags(targetTags);
    tags = applySpoofPresetToTags(tags, iphone16);
    tags = applyGeoTag(tags, nyc.iso6709, `${nyc.country} — ${nyc.city}`);
    tags = applyFreshTimestampTag(tags, 5);
    setTargetTags(tags);
    setIsSanitized(true);
    setActivePresetId(iphone16.id);
    setSelectedGeoId(nyc.id);
    setCustomGeoIso(nyc.iso6709);
    setOutputExt('MOV');
    setUniqualization({
      modifyMd5: true,
      microCropZoom: true,
      horizontalFlip: false,
      colorShift: true,
      audioProtect: true,
      tiktokStandardize: true,
    });
    setProcessedResult(null);
    appendLog(
      '[turbo] Применена комплексная защита: Очистка C2PA/Lavf + Пресет iPhone 17 Pro (iOS 27.2 · Build 24B115 · 4K 120fps) + GPS DE-Munich + Свежий таймстамп + Anti-pHash (Trust Score 100%).'
    );
  };

  if (!sourceVideo) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-100 flex items-center justify-center p-6">
        <div className="text-sm font-mono text-zinc-400">
          Инициализация бинарного анализатора MetaShield Studio...
        </div>
      </div>
    );
  }

  const outputFileName = generateNativeAppleFilename(outputExt, outputSeed);
  const trustScore = calculateTrustScore(
    targetTags,
    isSanitized,
    uniqualization
  );
  const { command: ffmpegCommand } = buildFfmpegCommand(
    sourceVideo.fileName,
    outputFileName,
    isSanitized,
    targetTags,
    uniqualization
  );

  // Compute deterministic preview MD5 of the modified binary
  const previewModifiedBytes = buildModifiedMp4Binary(
    sourceVideo.rawBuffer,
    isSanitized,
    targetTags,
    uniqualization,
    outputSeed
  );
  const previewBuffer = previewModifiedBytes.buffer.slice(
    previewModifiedBytes.byteOffset,
    previewModifiedBytes.byteOffset + previewModifiedBytes.byteLength
  ) as ArrayBuffer;
  const previewNewMd5 =
    isSanitized ||
    uniqualization.modifyMd5 ||
    targetTags.length !== sourceVideo.tags.length
      ? computeMd5Hex(previewBuffer)
      : sourceVideo.md5Hash;

  const handleRunProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(5);
    try {
      const result = await processVideoWithEngine({
        sourceVideo,
        outputFileName,
        isSanitized,
        targetTags,
        uniqualization,
        onLog: appendLog,
        onProgress: setProcessingProgress,
      });
      setProcessedResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadProcessed = async () => {
    let result = processedResult;
    if (!result) {
      setIsProcessing(true);
      setProcessingProgress(10);
      try {
        result = await processVideoWithEngine({
          sourceVideo,
          outputFileName,
          isSanitized,
          targetTags,
          uniqualization,
          onLog: appendLog,
          onProgress: setProcessingProgress,
        });
        setProcessedResult(result);
      } finally {
        setIsProcessing(false);
      }
    }

    if (result) {
      const a = document.createElement('a');
      a.href = result.blobUrl;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      appendLog(`[export] Файл ${result.fileName} выгружен пользователю.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col overflow-x-hidden">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4 Navigation Links) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur border-b border-zinc-800/80 px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('sanitizer');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 whitespace-nowrap shrink-0"
        >
          MetaShield Studio
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveTab('sanitizer')}
            className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'sanitizer'
                ? 'text-[#10B981] border-b border-[#10B981]'
                : ''
            }`}
          >
            Сканер угроз
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spoofer')}
            className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'spoofer'
                ? 'text-[#10B981] border-b border-[#10B981]'
                : ''
            }`}
          >
            Инжектор EXIF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cloner')}
            className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'cloner'
                ? 'text-[#10B981] border-b border-[#10B981]'
                : ''
            }`}
          >
            Клон Донора
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('uniqualizer')}
            className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'uniqualizer'
                ? 'text-[#10B981] border-b border-[#10B981]'
                : ''
            }`}
          >
            Anti-pHash
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleOneClickFullProtect}
            className="px-3 sm:px-4 py-2 text-xs font-semibold text-zinc-950 bg-[#10B981] hover:bg-[#00FF66] rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Полная защита в 1 клик</span>
          </button>
        </div>
      </header>

      {/* Main Studio Split Layout: single-column on <768px, 12-col split on >=768px */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT WORKSPACE COLUMN (7 cols on >=768px): Upload Zone + 4 Modules */}
          <div className="md:col-span-7 space-y-4 sm:space-y-5 min-w-0">
            {/* Drag & Drop Target Video Zone + Instant Sample Selector */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleRealFileUpload(file, false);
              }}
              className={`bg-[#121215] border rounded-xl p-4 sm:p-5 transition-all overflow-hidden ${
                isDraggingOver
                  ? 'border-[#00FF66] bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'border-zinc-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <FileVideo className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <h1 className="text-sm font-semibold text-zinc-100 truncate max-w-full">
                        {sourceVideo.fileName}
                      </h1>
                      <span className="text-xs text-zinc-500">·</span>
                      <span className="text-xs font-mono text-[#10B981]">
                        {(sourceVideo.fileSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-400 mt-0.5 font-mono">
                      <span>{sourceVideo.resolution}</span>
                      <span>·</span>
                      <span>{sourceVideo.fps} FPS</span>
                      <span>·</span>
                      <span>{sourceVideo.videoCodec}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <input
                    ref={mainFileInputRef}
                    type="file"
                    accept=".mp4,.mov,video/mp4,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleRealFileUpload(file, false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => mainFileInputRef.current?.click()}
                    className="w-full sm:w-auto justify-center px-3.5 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Загрузить .MP4 / .MOV</span>
                  </button>
                </div>
              </div>

              {/* Demo Video Sample Switcher for Quick Testing */}
              <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-zinc-400">
                  Тестовые бинарные контейнеры (или перетащите свой файл):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const s = createDemoVideoBuffer('dirty_ai_premiere');
                      void loadBufferAsTargetVideo(
                        s.buffer,
                        s.fileName,
                        true,
                        'dirty_ai_premiere'
                      );
                    }}
                    className={`px-2.5 py-1.5 sm:py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                      sourceVideo.demoId === 'dirty_ai_premiere'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-medium'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    AI Sora + Premiere + C2PA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const s = createDemoVideoBuffer('tiktok_repost');
                      void loadBufferAsTargetVideo(
                        s.buffer,
                        s.fileName,
                        true,
                        'tiktok_repost'
                      );
                    }}
                    className={`px-2.5 py-1.5 sm:py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                      sourceVideo.demoId === 'tiktok_repost'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-medium'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Скачанный Репост (Lavf)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const s = createDemoVideoBuffer('donor_iphone_17');
                      void loadBufferAsTargetVideo(
                        s.buffer,
                        s.fileName,
                        true,
                        'donor_iphone_17'
                      );
                    }}
                    className={`px-2.5 py-1.5 sm:py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                      sourceVideo.demoId === 'donor_iphone_17'
                        ? 'bg-emerald-500/20 text-[#10B981] border border-emerald-500/40 font-medium'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Чистый iPhone 17 Pro (iOS 27.2)
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Module Tabs Selector */}
            <div
              role="tablist"
              aria-label="Модули обработки метаданных"
              className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#121215] border border-zinc-800/80 rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'sanitizer'}
                onClick={() => setActiveTab('sanitizer')}
                className={`px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'sanitizer'
                    ? 'bg-[#10B981] text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>1. Sanitizer</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'spoofer'}
                onClick={() => setActiveTab('spoofer')}
                className={`px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'spoofer'
                    ? 'bg-[#10B981] text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>2. Spoofer</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'cloner'}
                onClick={() => setActiveTab('cloner')}
                className={`px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'cloner'
                    ? 'bg-[#10B981] text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Copy className="w-3.5 h-3.5 shrink-0" />
                <span>3. Cloner</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'uniqualizer'}
                onClick={() => setActiveTab('uniqualizer')}
                className={`px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'uniqualizer'
                    ? 'bg-[#10B981] text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>4. Anti-pHash</span>
              </button>
            </div>

            {/* Active Module Content */}
            <div>
              {activeTab === 'sanitizer' && (
                <SanitizerModule
                  sourceVideo={sourceVideo}
                  targetTags={targetTags}
                  isSanitized={isSanitized}
                  modifyMd5={uniqualization.modifyMd5}
                  previewNewMd5={previewNewMd5}
                  onSanitizeAll={handleSanitizeAll}
                  onRemoveSingleTag={handleRemoveSingleTag}
                  onResetToOriginal={handleResetToOriginal}
                />
              )}

              {activeTab === 'spoofer' && (
                <SpooferModule
                  targetTags={targetTags}
                  activePresetId={activePresetId}
                  selectedGeoId={selectedGeoId}
                  customGeoIso={customGeoIso}
                  seoConfig={seoConfig}
                  onSelectPreset={handleSelectSpoofPreset}
                  onSelectGeoPreset={handleSelectGeoPreset}
                  onApplyCustomGeo={handleApplyCustomGeo}
                  onApplyFreshTimestamp={handleApplyFreshTimestamp}
                  onApplyCustomTimestamp={handleApplyCustomTimestamp}
                  onUpdateSeoConfig={handleUpdateSeoConfig}
                  onUpdateTagValue={handleUpdateTagValue}
                  onDeleteTag={handleDeleteTag}
                  onAddCustomTag={handleAddCustomTag}
                />
              )}

              {activeTab === 'cloner' && (
                <ClonerModule
                  donorVideo={donorVideo}
                  targetVideo={sourceVideo}
                  selectedDonorTagIds={selectedDonorTagIds}
                  cloneSuccessBanner={cloneSuccessBanner}
                  onUploadDonorFile={(f) => void handleRealFileUpload(f, true)}
                  onLoadDemoDonor={() => {
                    const d = createDemoVideoBuffer('donor_iphone_17');
                    void loadDonorBuffer(d.buffer, d.fileName, true);
                  }}
                  onUploadTargetFile={(f) =>
                    void handleRealFileUpload(f, false)
                  }
                  onToggleDonorTag={handleToggleDonorTag}
                  onSelectAllDonorTags={handleSelectAllDonorTags}
                  onCloneToTarget={handleCloneToTarget}
                />
              )}

              {activeTab === 'uniqualizer' && (
                <UniqualizerModule
                  config={uniqualization}
                  onChange={(next) => {
                    setUniqualization(next);
                    setProcessedResult(null);
                  }}
                  onEnableRecommendedPreset={handleEnableRecommendedUniq}
                />
              )}
            </div>
            {/* Mobile Inspector Toggle Button (<768px only) */}
            <div className="md:hidden pt-1">
              <button
                type="button"
                data-testid="mobile-inspector-toggle"
                aria-expanded={showMobileInspector}
                aria-controls="workspace-inspector-panel"
                onClick={() => setShowMobileInspector((prev) => !prev)}
                className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                  showMobileInspector
                    ? 'bg-emerald-500/15 border-[#10B981] text-[#00FF66] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-[#121215] hover:bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {showMobileInspector ? (
                    <EyeOff className="w-4 h-4 text-[#00FF66] shrink-0" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#10B981] shrink-0" />
                  )}
                  <span>
                    {showMobileInspector ? 'Hide Inspector' : 'Show Inspector'}
                  </span>
                  <span className="text-zinc-400 font-normal">
                    ({showMobileInspector ? 'Скрыть инспектор' : 'Инспектор и экспорт'})
                  </span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    trustScore.score >= 80
                      ? 'bg-emerald-500/20 text-[#00FF66]'
                      : trustScore.score >= 50
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  Trust: {trustScore.score}%
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT WORKSPACE COLUMN (5 cols on >=768px; toggled via 'Show Inspector' on <768px) */}
          <div
            id="workspace-inspector-panel"
            className={`${
              showMobileInspector ? 'block' : 'hidden'
            } md:block md:col-span-5 min-w-0`}
          >
            <InspectorPanel
              sourceVideo={sourceVideo}
              targetTags={targetTags}
              isSanitized={isSanitized}
              previewNewMd5={previewNewMd5}
              previewNewSha256={sourceVideo.sha256Hash}
              trustScore={trustScore}
              ffmpegCommand={ffmpegCommand}
              terminalLogs={terminalLogs}
              outputFileName={outputFileName}
              outputExt={outputExt}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              processedResult={processedResult}
              onChangeOutputExt={(ext) => {
                setOutputExt(ext);
                setProcessedResult(null);
              }}
              onRegenerateFileName={() => {
                setOutputSeed(Math.floor(1000 + Math.random() * 8999));
                setProcessedResult(null);
              }}
              onRunProcessing={() => void handleRunProcessing()}
              onDownloadProcessed={() => void handleDownloadProcessed()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
