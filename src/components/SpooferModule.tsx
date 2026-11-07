import React, { useEffect, useRef, useState } from 'react';
import {
  Smartphone,
  MapPin,
  Clock,
  Search,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Shuffle,
  CalendarClock,
  Upload,
  Target,
} from 'lucide-react';
import {
  GeoPreset,
  MetadataTag,
  SeoMetadataConfig,
  SpoofPreset,
} from '../types/metadata';
import {
  AUDIENCE_SEO_PRESETS,
  GEO_PRESETS,
  SPOOF_PRESETS,
  formatDmsCoordinates,
  formatIso6709,
  parseIso6709ToCoords,
  parseUploadedKeywordsPayload,
  randomizeGeoCoords,
} from '../utils/metadataEngine';

interface SpooferModuleProps {
  targetTags: MetadataTag[];
  activePresetId: string | null;
  selectedGeoId: string;
  customGeoIso: string;
  seoConfig: SeoMetadataConfig;
  onSelectPreset: (preset: SpoofPreset) => void;
  onSelectGeoPreset: (geo: GeoPreset) => void;
  onApplyCustomGeo: (iso6709: string, label?: string) => void;
  onApplyFreshTimestamp: (offsetMinutes: number) => void;
  onApplyCustomTimestamp: (localDateTime: string, tzOffset: string) => void;
  onUpdateSeoConfig: (seo: SeoMetadataConfig) => void;
  onUpdateTagValue: (tagId: string, newKey: string, newValue: string) => void;
  onDeleteTag: (tagId: string) => void;
  onAddCustomTag: (key: string, value: string) => void;
}

const TIMEZONE_OPTIONS = [
  { value: '+01:00', label: 'UTC+01:00 (Мюнхен / Берлин)' },
  { value: '+02:00', label: 'UTC+02:00 (Европа CEST)' },
  { value: '+00:00', label: 'UTC+00:00 (Лондон / UTC)' },
  { value: '-05:00', label: 'UTC-05:00 (Нью-Йорк EST)' },
  { value: '-08:00', label: 'UTC-08:00 (Лос-Анджелес PST)' },
  { value: '+03:00', label: 'UTC+03:00 (Москва / Стамбул)' },
  { value: '+04:00', label: 'UTC+04:00 (Дубай)' },
  { value: '+05:00', label: 'UTC+05:00 (Алматы / Ташкент)' },
];

export const SpooferModule: React.FC<SpooferModuleProps> = ({
  targetTags,
  activePresetId,
  selectedGeoId,
  customGeoIso,
  seoConfig,
  onSelectPreset,
  onSelectGeoPreset,
  onApplyCustomGeo,
  onApplyFreshTimestamp,
  onApplyCustomTimestamp,
  onUpdateSeoConfig,
  onUpdateTagValue,
  onDeleteTag,
  onAddCustomTag,
}) => {
  const [newTagKey, setNewTagKey] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [tagError, setTagError] = useState('');

  // Geo manual & jitter state
  const [geoInput, setGeoInput] = useState(customGeoIso);
  const [latInput, setLatInput] = useState('48.1371');
  const [lonInput, setLonInput] = useState('11.5754');
  const [altInput, setAltInput] = useState('519');
  const [jitterRadiusKm, setJitterRadiusKm] = useState<number>(1.5);
  const [lastJitterInfo, setLastJitterInfo] = useState<{
    presetName: string;
    distanceKm: number;
  } | null>(null);

  // Manual date-time state (defaulting to current local time formatted for datetime-local)
  const [manualDateTime, setManualDateTime] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;
  });
  const [manualTz, setManualTz] = useState('+01:00');

  // Target audience keywords loader state
  const [selectedAudiencePresetId, setSelectedAudiencePresetId] = useState('');
  const [bulkKeywordsInput, setBulkKeywordsInput] = useState('');
  const [loadedKeywordsStatus, setLoadedKeywordsStatus] = useState<string | null>(
    null
  );
  const keywordFileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyAudiencePreset = (presetId: string) => {
    setSelectedAudiencePresetId(presetId);
    const found = AUDIENCE_SEO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setBulkKeywordsInput(found.keywords);
    onUpdateSeoConfig({
      title: found.title,
      keywords: found.keywords,
      description: found.description,
      comment: found.comment,
    });
    const count = found.keywords.split(',').filter(Boolean).length;
    setLoadedKeywordsStatus(
      `Загружен пак «${found.label}» (${count} ключей для ЦА ${found.audienceRegion})`
    );
  };

  const handleApplyBulkKeywords = (rawText: string, sourceLabel = 'Вручную') => {
    const parsed = parseUploadedKeywordsPayload(rawText);
    if (parsed.count === 0) return;

    const nextSeo: SeoMetadataConfig = {
      title: parsed.suggestedTitle || seoConfig.title || `Original ${parsed.keywords.split(',')[0]?.trim() || 'Video'} 2026`,
      keywords: parsed.keywords,
      description:
        parsed.suggestedDescription ||
        seoConfig.description ||
        `Target audience tags: ${parsed.keywords}`,
      comment:
        parsed.suggestedComment ||
        seoConfig.comment ||
        'Captured with Native Camera Pipeline',
    };
    onUpdateSeoConfig(nextSeo);
    setBulkKeywordsInput(parsed.keywords);
    setLoadedKeywordsStatus(
      `${sourceLabel}: вшито ${parsed.count} ключевых слов в контейнер для алгоритма рекомендаций TikTok`
    );
  };

  const handleKeywordFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    handleApplyBulkKeywords(text, `Файл ${file.name}`);
    e.target.value = '';
  };

  useEffect(() => {
    setGeoInput(customGeoIso);
    const parsed = parseIso6709ToCoords(customGeoIso);
    if (parsed) {
      setLatInput(String(parsed.lat));
      setLonInput(String(parsed.lon));
      setAltInput(String(parsed.alt));
    }
  }, [customGeoIso]);

  const handleLatLonAltChange = (
    nextLatStr: string,
    nextLonStr: string,
    nextAltStr: string
  ) => {
    setLatInput(nextLatStr);
    setLonInput(nextLonStr);
    setAltInput(nextAltStr);
    setLastJitterInfo(null);
    const lat = parseFloat(nextLatStr);
    const lon = parseFloat(nextLonStr);
    const alt = parseFloat(nextAltStr);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      const formatted = formatIso6709(lat, lon, Number.isNaN(alt) ? 15 : alt);
      setGeoInput(formatted);
    }
  };

  const handleRandomizeGeo = () => {
    const selectedPreset = GEO_PRESETS.find((g) => g.id === selectedGeoId);
    const parsedLat = parseFloat(latInput);
    const parsedLon = parseFloat(lonInput);
    const parsedAlt = parseFloat(altInput);

    // Always anchor randomization around the currently selected geo-preset if one is active
    const safeLat = selectedPreset
      ? selectedPreset.lat
      : Number.isNaN(parsedLat)
      ? 48.1371
      : parsedLat;
    const safeLon = selectedPreset
      ? selectedPreset.lon
      : Number.isNaN(parsedLon)
      ? 11.5754
      : parsedLon;
    const safeAlt = selectedPreset
      ? selectedPreset.alt
      : Number.isNaN(parsedAlt)
      ? 519
      : parsedAlt;

    const randomized = randomizeGeoCoords(
      safeLat,
      safeLon,
      safeAlt,
      jitterRadiusKm
    );
    const presetLabel = selectedPreset
      ? selectedPreset.city
      : 'Ручные координаты';

    setLatInput(String(randomized.lat));
    setLonInput(String(randomized.lon));
    setAltInput(String(randomized.alt));
    setGeoInput(randomized.iso6709);
    setLastJitterInfo({
      presetName: presetLabel,
      distanceKm: randomized.distanceKm,
    });
    onApplyCustomGeo(
      randomized.iso6709,
      `${presetLabel} (Рандом ${randomized.distanceKm} км в радиусе 1–2 км) -> ${randomized.dms}`
    );
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const k = newTagKey.trim();
    const v = newTagValue.trim();
    if (!k || !v) {
      setTagError('Введите ключ (key) и значение (value) тега');
      return;
    }
    setTagError('');
    onAddCustomTag(k, v);
    setNewTagKey('');
    setNewTagValue('');
  };

  const currentLatNum = parseFloat(latInput);
  const currentLonNum = parseFloat(lonInput);
  const dmsPreview =
    !Number.isNaN(currentLatNum) && !Number.isNaN(currentLonNum)
      ? formatDmsCoordinates(currentLatNum, currentLonNum)
      : '—';

  return (
    <div className="space-y-5">
      {/* 1. One-Click Device Presets */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-3.5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#10B981] shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-100">
              1. Готовые пресеты устройств (В один клик)
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Apple QuickTime / Google Pixel / ByteDance
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {SPOOF_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`w-full text-left p-3 sm:p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-500/10 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.18)]'
                    : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-zinc-100">
                      {preset.name}
                    </span>
                    <span className="text-xs text-zinc-500">·</span>
                    <span className="text-xs font-mono text-[#10B981]">
                      .{preset.recommendedExt}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 break-words">
                    {preset.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono text-[11px] text-zinc-400">
                    {preset.tags.slice(0, 3).map((t) => (
                      <span key={t.key} className="truncate max-w-full">
                        <span className="text-zinc-500">{t.key}=</span>
                        <span className="text-emerald-300">{t.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#10B981] text-zinc-950'
                      : 'border border-zinc-700 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Geo-Spoofing, Manual Lat/Lon & Geo-Jitter + 3. Manual & Fresh Timestamp */}
      <div className="grid grid-cols-1 gap-4">
        {/* Geo-Spoofing & Randomizer Card */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
              <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                2. Гео-спуфинг, Ручная локация и Рандомизация (GPS ISO-6709 / DMS)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400 break-all sm:break-normal">
              DMS: <strong className="text-emerald-400">{dmsPreview}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Preset Selector */}
            <div className="md:col-span-5 min-w-0 space-y-1.5">
              <label
                htmlFor="geo-preset-select"
                className="block text-xs text-zinc-400 truncate"
              >
                Готовые пресеты локаций (Мюнхен и др.):
              </label>
              <select
                id="geo-preset-select"
                value={selectedGeoId}
                onChange={(e) => {
                  const found = GEO_PRESETS.find((g) => g.id === e.target.value);
                  if (found) {
                    setGeoInput(found.iso6709);
                    setLatInput(String(found.lat));
                    setLonInput(String(found.lon));
                    setAltInput(String(found.alt));
                    setManualTz(found.defaultTz);
                    setLastJitterInfo(null);
                    onSelectGeoPreset(found);
                  }
                }}
                className="w-full min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-[#10B981]"
              >
                <option value="">— Выберите страну / город —</option>
                {GEO_PRESETS.map((geo) => (
                  <option key={geo.id} value={geo.id}>
                    {geo.city.includes(geo.country)
                      ? `${geo.city} (${geo.lat}, ${geo.lon})`
                      : `${geo.country} — ${geo.city} (${geo.regionCode})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Geo-Jitter (Randomizer) Controls */}
            <div className="md:col-span-7 min-w-0 space-y-1.5">
              <label
                htmlFor="geo-jitter-radius"
                className="block text-xs text-zinc-400 truncate"
              >
                Рандомизация выбранного гео-пресета (1–2 км):
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
                <select
                  id="geo-jitter-radius"
                  value={jitterRadiusKm}
                  onChange={(e) => setJitterRadiusKm(parseFloat(e.target.value))}
                  className="w-full sm:w-auto sm:flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#10B981]"
                >
                  <option value={1.5}>1–2 км (Вокруг пресета)</option>
                  <option value={0.3}>±300 м (Соседние улицы)</option>
                  <option value={3.5}>±3.5 км (Округ города)</option>
                  <option value={7.0}>±7.0 км (Пригород)</option>
                </select>
                <button
                  type="button"
                  onClick={handleRandomizeGeo}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[#10B981] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Shuffle className="w-3.5 h-3.5 shrink-0" />
                  <span>Рандомизировать (1–2 км)</span>
                </button>
              </div>
            </div>
          </div>

          {lastJitterInfo && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-mono">
              <span>
                Базовый пресет: <strong>{lastJitterInfo.presetName}</strong>
              </span>
              <span>
                Смещение: <strong>+{lastJitterInfo.distanceKm} км</strong> от центра
              </span>
            </div>
          )}

          {/* Manual Lat / Lon / Alt Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label htmlFor="geo-lat-input" className="block text-xs text-zinc-400 mb-1">
                Широта (Latitude)
              </label>
              <input
                id="geo-lat-input"
                type="number"
                step="0.0001"
                value={latInput}
                onChange={(e) =>
                  handleLatLonAltChange(e.target.value, lonInput, altInput)
                }
                placeholder="48.1371"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label htmlFor="geo-lon-input" className="block text-xs text-zinc-400 mb-1">
                Долгота (Longitude)
              </label>
              <input
                id="geo-lon-input"
                type="number"
                step="0.0001"
                value={lonInput}
                onChange={(e) =>
                  handleLatLonAltChange(latInput, e.target.value, altInput)
                }
                placeholder="11.5754"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label htmlFor="geo-alt-input" className="block text-xs text-zinc-400 mb-1">
                Высота над ур. моря (м)
              </label>
              <input
                id="geo-alt-input"
                type="number"
                step="1"
                value={altInput}
                onChange={(e) =>
                  handleLatLonAltChange(latInput, lonInput, e.target.value)
                }
                placeholder="519"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Direct ISO-6709 string + Apply */}
          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="custom-iso6709-input"
              className="block text-xs text-zinc-400"
            >
              Итоговая строка ISO-6709 (можно редактировать вручную):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="custom-iso6709-input"
                type="text"
                value={geoInput}
                onChange={(e) => {
                  setGeoInput(e.target.value);
                  const parsed = parseIso6709ToCoords(e.target.value);
                  if (parsed) {
                    setLatInput(String(parsed.lat));
                    setLonInput(String(parsed.lon));
                    setAltInput(String(parsed.alt));
                  }
                }}
                placeholder="+48.1371+011.5754+519.00/"
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#10B981]"
              />
              <button
                type="button"
                onClick={() =>
                  onApplyCustomGeo(geoInput, `Ручные координаты (${dmsPreview})`)
                }
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] text-zinc-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Вшить ГЕО
              </button>
            </div>
          </div>
        </div>

        {/* 3. Custom & Automatic Timestamp Card */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#10B981] shrink-0" />
              <h3 className="text-sm font-semibold text-zinc-100">
                3. Ручная установка времени и Генератор свежего таймстампа
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              creation_time + quicktime.creationdate
            </span>
          </div>

          {/* Manual Date-Time & Timezone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-5 min-w-0">
              <label
                htmlFor="manual-datetime-input"
                className="block text-xs text-zinc-400 mb-1"
              >
                Своя дата и время съемки:
              </label>
              <input
                id="manual-datetime-input"
                type="datetime-local"
                step="1"
                value={manualDateTime}
                onChange={(e) => setManualDateTime(e.target.value)}
                className="w-full min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="sm:col-span-4 min-w-0">
              <label
                htmlFor="manual-tz-select"
                className="block text-xs text-zinc-400 mb-1"
              >
                Часовой пояс камеры:
              </label>
              <select
                id="manual-tz-select"
                value={manualTz}
                onChange={(e) => setManualTz(e.target.value)}
                className="w-full min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#10B981]"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={() => onApplyCustomTimestamp(manualDateTime, manualTz)}
                className="w-full px-3 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] text-zinc-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                <span>Выставить время</span>
              </button>
            </div>
          </div>

          {/* Quick Timestamp Presets */}
          <div className="pt-2 border-t border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-zinc-400">
              Быстрая синхронизация перед публикацией:
            </span>
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onApplyFreshTimestamp(0)}
                className="px-3 py-2 sm:py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-lg transition-colors whitespace-nowrap text-center"
              >
                Текущий момент
              </button>
              <button
                type="button"
                onClick={() => onApplyFreshTimestamp(5)}
                className="px-3 py-2 sm:py-1.5 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[#10B981] rounded-lg transition-colors whitespace-nowrap text-center"
              >
                За 5 мин до выгрузки
              </button>
              <button
                type="button"
                onClick={() => {
                  const randomMins = Math.floor(6 + Math.random() * 29);
                  onApplyFreshTimestamp(randomMins);
                }}
                className="px-3 py-2 sm:py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Shuffle className="w-3 h-3 text-[#10B981] shrink-0" />
                <span>Рандом (-6…-35 мин)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Container SEO Metadata & Target Audience Keyword Loader */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#10B981] shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">
              4. Ключевые слова для целевой аудитории и SEO контейнера
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Индексация ниши в moov.udta.meta
          </span>
        </div>

        {/* Ready-made Audience Keyword Presets + File Upload (.TXT / .CSV / .JSON) */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-lg p-3.5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
            <div className="md:col-span-7 min-w-0 space-y-1">
              <label
                htmlFor="audience-seo-preset"
                className="block text-xs text-zinc-400"
              >
                Готовые наборы ключевых слов по нишам и ГЕО (в 1 клик):
              </label>
              <select
                id="audience-seo-preset"
                value={selectedAudiencePresetId}
                onChange={(e) => handleApplyAudiencePreset(e.target.value)}
                className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-[#10B981]"
              >
                <option value="">
                  — Выберите готовую нишу / целевую аудиторию —
                </option>
                {AUDIENCE_SEO_PRESETS.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.label} [{pack.audienceRegion}]
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5 min-w-0">
              <input
                ref={keywordFileInputRef}
                type="file"
                accept=".txt,.csv,.json,text/plain,application/json,text/csv"
                className="hidden"
                onChange={(e) => void handleKeywordFileChange(e)}
              />
              <button
                type="button"
                onClick={() => keywordFileInputRef.current?.click()}
                className="w-full px-3 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>Загрузить ключи (.TXT / .CSV / .JSON)</span>
              </button>
            </div>
          </div>

          {/* Bulk Keyword / Hashtag Paste Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="bulk-keywords-textarea"
              className="block text-xs text-zinc-400"
            >
              Поле загрузки готовых ключевых слов или #хэштегов (через запятую, пробел или с новой строки):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                id="bulk-keywords-textarea"
                rows={2}
                value={bulkKeywordsInput}
                onChange={(e) => setBulkKeywordsInput(e.target.value)}
                placeholder="Вставьте готовые ключевые слова или #хэштеги (напр.: #münchen #bayern, skincare, glassskin, viralproducts)..."
                className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#10B981] resize-y"
              />
              <button
                type="button"
                onClick={() =>
                  handleApplyBulkKeywords(bulkKeywordsInput, 'Пакетный список')
                }
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-[#10B981] hover:bg-[#00FF66] text-zinc-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>Вшить ключи ЦА</span>
              </button>
            </div>
          </div>

          {loadedKeywordsStatus && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-mono">
              {loadedKeywordsStatus}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="seo-title" className="block text-xs text-zinc-400 mb-1">
              Заголовок ролика в метаданных (title)
            </label>
            <input
              id="seo-title"
              type="text"
              value={seoConfig.title}
              onChange={(e) =>
                onUpdateSeoConfig({ ...seoConfig, title: e.target.value })
              }
              placeholder="Напр.: München Lifestyle & Alltag Tipps 2026"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 sm:py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div>
            <label htmlFor="seo-keywords" className="block text-xs text-zinc-400 mb-1">
              Активные теги аудитории (keywords)
            </label>
            <input
              id="seo-keywords"
              type="text"
              value={seoConfig.keywords}
              onChange={(e) =>
                onUpdateSeoConfig({ ...seoConfig, keywords: e.target.value })
              }
              placeholder="münchen, deutschland, fypde, lifestyle"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 sm:py-1.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div>
            <label htmlFor="seo-description" className="block text-xs text-zinc-400 mb-1">
              Описание для индексации (description)
            </label>
            <input
              id="seo-description"
              type="text"
              value={seoConfig.description}
              onChange={(e) =>
                onUpdateSeoConfig({ ...seoConfig, description: e.target.value })
              }
              placeholder="Original vertical 4K 120fps mobile clip"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 sm:py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#10B981]"
            />
          </div>
          <div>
            <label htmlFor="seo-comment" className="block text-xs text-zinc-400 mb-1">
              Комментарий контейнера (comment)
            </label>
            <input
              id="seo-comment"
              type="text"
              value={seoConfig.comment}
              onChange={(e) =>
                onUpdateSeoConfig({ ...seoConfig, comment: e.target.value })
              }
              placeholder="Captured with iPhone Native Camera"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 sm:py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>
      </div>

      {/* 5. Custom Key-Value Editor */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-3.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100 truncate">
              5. Кастомный Key-Value Редактор EXIF / QuickTime тегов
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400 shrink-0">
            Активно: {targetTags.length}
          </span>
        </div>

        {/* Existing editable tags list */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {targetTags.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              Контейнер полностью пуст. Выберите пресет выше или добавьте свой тег.
            </div>
          ) : (
            targetTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-800/80 rounded-lg px-2.5 py-1.5"
              >
                <input
                  type="text"
                  aria-label={`Ключ тега ${tag.key}`}
                  value={tag.key}
                  onChange={(e) =>
                    onUpdateTagValue(tag.id, e.target.value, tag.value)
                  }
                  className={`w-2/5 min-w-0 bg-transparent font-mono text-xs focus:outline-none focus:bg-zinc-900 px-1.5 py-0.5 rounded ${
                    tag.riskLevel === 'danger'
                      ? 'text-[#EF4444]'
                      : 'text-emerald-400'
                  }`}
                />
                <span className="text-zinc-600 font-mono text-xs">=</span>
                <input
                  type="text"
                  aria-label={`Значение тега ${tag.key}`}
                  value={tag.value}
                  onChange={(e) =>
                    onUpdateTagValue(tag.id, tag.key, e.target.value)
                  }
                  className="flex-1 min-w-0 bg-transparent font-mono text-xs text-zinc-200 focus:outline-none focus:bg-zinc-900 px-1.5 py-0.5 rounded"
                />
                <button
                  type="button"
                  onClick={() => onDeleteTag(tag.id)}
                  aria-label={`Удалить строку ${tag.key}`}
                  className="p-1 text-zinc-500 hover:text-[#EF4444] transition-colors shrink-0"
                  title="Удалить тег"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Custom Tag Form */}
        <form onSubmit={handleAddTagSubmit} className="pt-1 space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTagKey}
              onChange={(e) => setNewTagKey(e.target.value)}
              placeholder="Ключ (напр. com.apple.quicktime.artist)"
              className="sm:w-5/12 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
            />
            <input
              type="text"
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
              placeholder="Значение (напр. Apple Camera Original)"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#10B981]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-[#10B981] border border-emerald-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Добавить свой тег</span>
            </button>
          </div>
          {tagError && <p className="text-xs text-[#EF4444]">{tagError}</p>}
        </form>
      </div>
    </div>
  );
};
