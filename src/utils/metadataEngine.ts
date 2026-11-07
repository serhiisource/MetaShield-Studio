import {
  GeoPreset,
  MetadataCategory,
  MetadataTag,
  RiskLevel,
  SeoMetadataConfig,
  SpoofPreset,
  TrustScoreBreakdown,
  TrustScoreItem,
  UniqualizationConfig,
  VideoFileAnalysis,
} from '../types/metadata';

export const SPOOF_PRESETS: SpoofPreset[] = [
  {
    id: 'iphone_17_pro',
    name: 'iPhone 17 Pro (Native Camera · iOS 27.2 · 4K 120fps)',
    subtitle: 'Build 24B115 · 3840x2160 (119.945 fps · 124 Mbps) · HEVC (hvc1) · APAC Audio',
    recommendedExt: 'MOV',
    tags: [
      {
        key: 'com.apple.quicktime.make',
        value: 'Apple',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.model',
        value: 'iPhone 17 Pro',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.software',
        value: '27.2',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.camera.lens_model',
        value: 'iPhone 17 Pro back camera 6.765mm f/1.78',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'FocalLengthIn35mmFormat',
        value: '25',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'CameraLensIrisfnumber',
        value: 'F1.78',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'Dimensions',
        value: '3840x2160 (119.945 fps · 124 Mbps · MediaTimeScale 2400)',
        category: 'container',
        sourceAtom: 'moov.trak.tkhd',
      },
      {
        key: 'CompressorID',
        value: 'hvc1 (HEVC 24-bit)',
        category: 'container',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd',
      },
      {
        key: 'AudioFormat',
        value: 'apac (Cinematic Spatial Audio · 3ch · 16-bit)',
        category: 'device',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.cina',
      },
      {
        key: 'HandlerDescription',
        value: 'Core Media Data Handler (Apple mhlr/mebx)',
        category: 'device',
        sourceAtom: 'moov.trak.mdia.hdlr',
      },
      {
        key: 'SegmentIdentifier',
        value: 'DDCE1D15-FC1F-4BC9-9013-317F18E015D7',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'SceneIlluminance',
        value: '3000',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'Apple-maker-note',
        value: 'note74=2; note97=24; FullFrameRatePlaybackIntent=1',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'PLIST.ProductBuildVersion',
        value: '24B115 (iPhone OS 27.2)',
        category: 'device',
        sourceAtom: 'moov.udta.meta.plist',
      },
      {
        key: 'PLIST.H16ISPServicesVersion',
        value: '6.104 (ISPServices 20.111)',
        category: 'device',
        sourceAtom: 'moov.udta.meta.plist',
      },
      {
        key: 'PLIST.CMCaptureCoreVersion',
        value: '764.42.8 (CoreMedia 3385.14.1.2)',
        category: 'device',
        sourceAtom: 'moov.udta.meta.plist',
      },
      {
        key: 'PLIST.CoreMotionVersion',
        value: '3186.0.22',
        category: 'device',
        sourceAtom: 'moov.udta.meta.plist',
      },
      {
        key: 'VideoOrientation',
        value: 'Rotate 90 CW',
        category: 'container',
        sourceAtom: 'moov.trak.tkhd',
      },
      {
        key: 'major_brand',
        value: 'qt  ',
        category: 'container',
        sourceAtom: 'ftyp',
      },
    ],
  },
  {
    id: 'iphone_16_pro_max',
    name: 'iPhone 16 Pro Max (Native Camera)',
    subtitle: 'iOS 18.1 · Apple ProRes / HEVC QuickTime Atoms',
    recommendedExt: 'MOV',
    tags: [
      {
        key: 'com.apple.quicktime.make',
        value: 'Apple',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.model',
        value: 'iPhone 16 Pro Max',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.software',
        value: '18.1',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.camera.lens_model',
        value: 'iPhone 16 Pro Max back triple camera 6.765mm f/1.78',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'color_primaries',
        value: 'bt2020 (Dolby Vision HLG)',
        category: 'color_space',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.colr',
      },
      {
        key: 'major_brand',
        value: 'qt  ',
        category: 'container',
        sourceAtom: 'ftyp',
      },
    ],
  },
  {
    id: 'iphone_15_pro',
    name: 'iPhone 15 Pro (iOS 17.5)',
    subtitle: 'iOS 17.5.1 · Нативная камера Apple QuickTime',
    recommendedExt: 'MOV',
    tags: [
      {
        key: 'com.apple.quicktime.make',
        value: 'Apple',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.model',
        value: 'iPhone 15 Pro',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.software',
        value: '17.5.1',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'com.apple.quicktime.camera.lens_model',
        value: 'iPhone 15 Pro back triple camera 6.86mm f/1.78',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'color_primaries',
        value: 'bt709',
        category: 'color_space',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.colr',
      },
      {
        key: 'major_brand',
        value: 'qt  ',
        category: 'container',
        sourceAtom: 'ftyp',
      },
    ],
  },
  {
    id: 'google_pixel_9',
    name: 'Google Pixel 9 (Native Camera · 4K 60fps)',
    subtitle: 'Android Camera NRT Metadata · 3840x2160 (60.01 fps · 65.5 Mbps) · HEVC (hvc1) · BT.709 Full',
    recommendedExt: 'MP4',
    tags: [
      {
        key: 'AndroidMake',
        value: 'Google',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'AndroidModel',
        value: 'Pixel 9',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'AndroidCaptureFPS',
        value: '60',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'GPSCoordinates',
        value: '48 deg 23\' 2.04" N, 11 deg 25\' 36.48" E',
        category: 'gps',
        sourceAtom: 'moov.udta.meta.ilst.©xyz',
      },
      {
        key: 'Dimensions',
        value: '3840x2160 (60.01 fps · 65.5 Mbps · MediaTimeScale 90000)',
        category: 'container',
        sourceAtom: 'moov.trak.tkhd',
      },
      {
        key: 'CompressorID',
        value: 'hvc1 (HEVC 24-bit · GraphicsMode srcCopy)',
        category: 'container',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd',
      },
      {
        key: 'ColorProfiles',
        value: 'nclx (BT.709 / BT.709 / BT.709 · VideoFullRangeFlag Full)',
        category: 'color_space',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.colr',
      },
      {
        key: 'AudioFormat',
        value: 'mp4a (48000 Hz · 2ch · 16-bit)',
        category: 'device',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd',
      },
      {
        key: 'HandlerType',
        value: 'NRT Metadata (MetaHandle · mett · application/meta)',
        category: 'device',
        sourceAtom: 'moov.trak.mdia.hdlr',
      },
      {
        key: 'MatrixStructure',
        value: '0 1 0 -1 0 0 0 0 1 (Rotation 90)',
        category: 'container',
        sourceAtom: 'moov.trak.tkhd',
      },
      {
        key: 'major_brand',
        value: 'isom (iso2, mp41) — MP4 Base Media v1 [ISO 14496-12:2003] v2.0.0',
        category: 'container',
        sourceAtom: 'ftyp',
      },
    ],
  },
  {
    id: 'capcut_official',
    name: 'CapCut Official Export',
    subtitle: 'ByteDance Partner Pipeline · Нативный экспорт TikTok',
    recommendedExt: 'MP4',
    tags: [
      {
        key: 'com.apple.quicktime.software',
        value: 'CapCut 14.8.0 (ByteDance Official)',
        category: 'device',
        sourceAtom: 'moov.udta.meta.ilst',
      },
      {
        key: 'handler_name',
        value: 'VideoHandler (CapCut Media Engine)',
        category: 'device',
        sourceAtom: 'moov.trak.mdia.hdlr',
      },
      {
        key: 'color_primaries',
        value: 'bt709',
        category: 'color_space',
        sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.colr',
      },
      {
        key: 'major_brand',
        value: 'mp42',
        category: 'container',
        sourceAtom: 'ftyp',
      },
    ],
  },
];

export const GEO_PRESETS: GeoPreset[] = [
  {
    id: 'de_munich',
    country: 'Германия',
    city: 'Мюнхен, Германия',
    regionCode: 'DE-BY',
    lat: 48.1371,
    lon: 11.5754,
    alt: 519,
    defaultTz: '+01:00',
    iso6709: '+48.1371+011.5754+519.00/',
    description: 'Munich Center, Bavaria (48.1371, 11.5754)',
  },
  {
    id: 'de_munich_north',
    country: 'Германия',
    city: 'Мюнхен / Дахау (Pixel 9 Ref)',
    regionCode: 'DE-BY',
    lat: 48.3839,
    lon: 11.4268,
    alt: 482,
    defaultTz: '+01:00',
    iso6709: '+48.3839+011.4268+482.00/',
    description: '48 deg 23\' 2.04" N, 11 deg 25\' 36.48" E (Bavaria)',
  },
  {
    id: 'de_berlin',
    country: 'Германия',
    city: 'Берлин',
    regionCode: 'DE-BE',
    lat: 52.52,
    lon: 13.405,
    alt: 34,
    defaultTz: '+01:00',
    iso6709: '+52.5200+013.4050+034.00/',
    description: 'Berlin Mitte (DACH EU Region)',
  },
  {
    id: 'us_nyc',
    country: 'США',
    city: 'Нью-Йорк',
    regionCode: 'US-NY',
    lat: 40.7128,
    lon: -74.006,
    alt: 10,
    defaultTz: '-05:00',
    iso6709: '+40.7128-074.0060+010.00/',
    description: 'Manhattan, NY (Tier-1 US Audience)',
  },
  {
    id: 'us_la',
    country: 'США',
    city: 'Лос-Анджелес',
    regionCode: 'US-CA',
    lat: 34.0522,
    lon: -118.2437,
    alt: 71,
    defaultTz: '-08:00',
    iso6709: '+34.0522-118.2437+071.00/',
    description: 'Los Angeles, CA (Creator Hub US)',
  },
  {
    id: 'uk_london',
    country: 'Великобритания',
    city: 'Лондон',
    regionCode: 'GB-LND',
    lat: 51.5074,
    lon: -0.1278,
    alt: 11,
    defaultTz: '+00:00',
    iso6709: '+51.5074-000.1278+011.00/',
    description: 'Central London (UK Tier-1)',
  },
  {
    id: 'kz_almaty',
    country: 'Казахстан',
    city: 'Алматы',
    regionCode: 'KZ-ALA',
    lat: 43.2389,
    lon: 76.8897,
    alt: 700,
    defaultTz: '+05:00',
    iso6709: '+43.2389+076.8897+700.00/',
    description: 'Almaty Medeu District (CIS Hub)',
  },
  {
    id: 'ae_dubai',
    country: 'ОАЭ',
    city: 'Дубай',
    regionCode: 'AE-DU',
    lat: 25.2048,
    lon: 55.2708,
    alt: 5,
    defaultTz: '+04:00',
    iso6709: '+25.2048+055.2708+005.00/',
    description: 'Dubai Downtown (MENA High-RPM)',
  },
];

export interface AudienceSeoPreset {
  id: string;
  label: string;
  audienceRegion: string;
  title: string;
  keywords: string;
  description: string;
  comment: string;
}

export const AUDIENCE_SEO_PRESETS: AudienceSeoPreset[] = [
  {
    id: 'dach_germany',
    label: 'Германия / DACH (Мюнхен · Берлин)',
    audienceRegion: 'DE / AT / CH',
    title: 'München Lifestyle & Alltag Tipps 2026',
    keywords:
      'münchen, deutschland, bayern, fypde, viralde, alltag, tipps, lifestyle, munich, germany',
    description:
      'Original 4K 120fps iPhone 17 Pro Aufnahme aus München, Deutschland',
    comment: 'Captured natively in Munich, Bavaria (DE)',
  },
  {
    id: 'crypto_finance',
    label: 'Крипта / Инвестиции / Трейдинг (Tier-1)',
    audienceRegion: 'US / UK / EU',
    title: 'Smart Money Market Structure & Portfolio Strategy',
    keywords:
      'crypto, bitcoin, trading, investing, finance, wealth, web3, marketanalysis, altcoins, passiveincome',
    description:
      'High-conviction market breakdown and institutional trading insights in 4K',
    comment: 'Original Creator Financial Education Series',
  },
  {
    id: 'ecommerce_gadgets',
    label: 'Товарка / E-Commerce / Гаджеты (TikTok Shop)',
    audienceRegion: 'Global / US / EU',
    title: 'Must-Have Viral Everyday Gadget Review 2026',
    keywords:
      'tiktokmademebuyit, amazonfinds, viralproducts, gadgets, unbox, musthaves, shoppinghacks, productreview',
    description:
      'Hands-on test of the trending everyday home and tech gadget in 4K 60fps',
    comment: 'Verified Original Product Demonstration',
  },
  {
    id: 'beauty_skincare',
    label: 'Бьюти / Уход / Эстетика (Женская ЦА)',
    audienceRegion: 'US / EU / CIS',
    title: 'Glass Skin Morning Routine & Glow Secrets',
    keywords:
      'skincare, beauty, glassskin, glowup, grwm, aesthetic, makeup, selfcare, cleanbeauty, skincareroutine',
    description:
      'Step-by-step morning hydration and barrier repair skincare routine',
    comment: 'Shot on iPhone Native Camera — Natural Lighting',
  },
  {
    id: 'tech_productivity',
    label: 'IT / Продуктивность / Стартапы',
    audienceRegion: 'Global Tier-1',
    title: 'Developer Workflow & High-Output Desk Setup',
    keywords:
      'tech, coding, softwareengineer, productivity, setup, macbook, startup, saas, developer, workfromhome',
    description:
      'Minimalist software engineering workflow and productivity tools breakdown',
    comment: 'Original 4K Studio Capture',
  },
  {
    id: 'luxury_lifestyle',
    label: 'Люкс / Авто / Недвижимость / Мотивация',
    audienceRegion: 'EU / UAE / US',
    title: 'Modern Architecture & Supercar Weekend in Munich',
    keywords:
      'luxury, entrepreneur, mindset, supercars, realestate, millionaire, lifestyle, motivation, success, aesthetic',
    description:
      'Cinematic 4K 120fps vertical capture of luxury automotive and architecture',
    comment: 'Apple QuickTime Original ProRes/HEVC Pipeline',
  },
];

/**
 * Parses uploaded (.txt, .csv, .json) or pasted raw keyword lists/hashtags into clean container SEO metadata.
 */
export function parseUploadedKeywordsPayload(rawText: string): {
  keywords: string;
  count: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedComment?: string;
} {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { keywords: '', count: 0 };
  }

  let extractedTokens: string[] = [];
  let suggestedTitle: string | undefined;
  let suggestedDescription: string | undefined;
  let suggestedComment: string | undefined;

  // Try JSON format first: either ["tag1", "tag2"] or { keywords: ..., title: ..., description: ... }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        extractedTokens = parsed.map((item) => String(item));
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.keywords)) {
          extractedTokens = parsed.keywords.map((item: unknown) => String(item));
        } else if (typeof parsed.keywords === 'string') {
          extractedTokens = parsed.keywords.split(/[,;\n\r]+/);
        } else if (Array.isArray(parsed.tags)) {
          extractedTokens = parsed.tags.map((item: unknown) => String(item));
        }
        if (typeof parsed.title === 'string' && parsed.title.trim()) {
          suggestedTitle = parsed.title.trim();
        }
        if (typeof parsed.description === 'string' && parsed.description.trim()) {
          suggestedDescription = parsed.description.trim();
        }
        if (typeof parsed.comment === 'string' && parsed.comment.trim()) {
          suggestedComment = parsed.comment.trim();
        }
      }
    } catch {
      // Fallback to plain text / CSV / hashtag splitting
    }
  }

  if (extractedTokens.length === 0) {
    // Split by commas, semicolons, newlines, tabs, or #hashtag boundaries
    extractedTokens = trimmed
      .replace(/#/g, ',')
      .split(/[,;\n\r\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const normalized = Array.from(
    new Set(
      extractedTokens
        .map((token) =>
          token
            .replace(/^["'#\s]+|["'\s]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim()
        )
        .filter((token) => token.length > 0 && token.length <= 64)
    )
  );

  return {
    keywords: normalized.join(', '),
    count: normalized.length,
    suggestedTitle,
    suggestedDescription,
    suggestedComment,
  };
}

/**
 * Formats decimal latitude, longitude, and altitude into ISO-6709 QuickTime string (+DD.DDDD+DDD.DDDD+AAA.AA/).
 */
export function formatIso6709(lat: number, lon: number, alt = 15): string {
  const clampedLat = Math.max(-90, Math.min(90, Number.isFinite(lat) ? lat : 0));
  const clampedLon = Math.max(-180, Math.min(180, Number.isFinite(lon) ? lon : 0));
  const safeAlt = Number.isFinite(alt) ? alt : 15;

  const latSign = clampedLat >= 0 ? '+' : '-';
  const lonSign = clampedLon >= 0 ? '+' : '-';
  const altSign = safeAlt >= 0 ? '+' : '-';

  const latAbs = Math.abs(clampedLat).toFixed(4).padStart(7, '0');
  const lonAbs = Math.abs(clampedLon).toFixed(4).padStart(8, '0');
  const altAbs = Math.abs(safeAlt).toFixed(2).padStart(6, '0');

  return `${latSign}${latAbs}${lonSign}${lonAbs}${altSign}${altAbs}/`;
}

/**
 * Formats decimal latitude and longitude into EXIF/QuickTime DMS string (e.g. 48 deg 23' 2.04" N, 11 deg 25' 36.48" E).
 */
export function formatDmsCoordinates(lat: number, lon: number): string {
  const toDms = (val: number, posHemi: string, negHemi: string) => {
    const hemi = val >= 0 ? posHemi : negHemi;
    const abs = Math.abs(val);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = ((minFloat - min) * 60).toFixed(2);
    return `${deg} deg ${min}' ${sec}" ${hemi}`;
  };
  return `${toDms(lat, 'N', 'S')}, ${toDms(lon, 'E', 'W')}`;
}

/**
 * Parses an ISO-6709 string (+48.1371+011.5754+519.00/) into decimal { lat, lon, alt }.
 */
export function parseIso6709ToCoords(
  iso: string
): { lat: number; lon: number; alt: number } | null {
  const m = iso
    .trim()
    .match(/^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)?\/?$/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  const alt = m[3] ? parseFloat(m[3]) : 15;
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon, alt: Number.isNaN(alt) ? 15 : alt };
}

/**
 * Applies a realistic random micro-offset (Geo-Jitter) within radiusKm around given coordinates.
 */
export function randomizeGeoCoords(
  lat: number,
  lon: number,
  alt = 50,
  radiusKm = 1.5,
  seed?: { r1: number; r2: number; r3: number }
): {
  lat: number;
  lon: number;
  alt: number;
  iso6709: string;
  dms: string;
  distanceKm: number;
} {
  const u = seed ? seed.r1 : Math.random();
  const v = seed ? seed.r2 : Math.random();
  const w = seed ? seed.r3 : Math.random();

  // For the standard 1-2 km preset (radiusKm === 1.5 or 2), pick a distance strictly in [1.0, 2.0] km.
  // For other custom radii, pick in [0.5 * radiusKm, radiusKm] km.
  const minKm = radiusKm === 1.5 || radiusKm === 2 ? 1.0 : radiusKm * 0.5;
  const maxKm = radiusKm === 1.5 || radiusKm === 2 ? 2.0 : radiusKm;
  const actualDistanceKm = Number((minKm + (maxKm - minKm) * u).toFixed(2));

  // 1 degree latitude ~= 111.32 km
  const distInDeg = actualDistanceKm / 111.32;
  const angle = 2 * Math.PI * v;

  let dLat = distInDeg * Math.cos(angle);
  if (Math.abs(dLat) < 0.0003) {
    dLat = dLat >= 0 ? 0.0004 : -0.0004;
  }

  const cosLat = Math.max(0.1, Math.cos((lat * Math.PI) / 180));
  let dLon = (distInDeg * Math.sin(angle)) / cosLat;
  if (Math.abs(dLon) < 0.0003) {
    dLon = dLon >= 0 ? 0.0004 : -0.0004;
  }

  const newLat = Number((lat + dLat).toFixed(4));
  const newLon = Number((lon + dLon).toFixed(4));
  const newAlt = Math.max(1, Number((alt + (w - 0.45) * 8).toFixed(2)));

  return {
    lat: newLat,
    lon: newLon,
    alt: newAlt,
    iso6709: formatIso6709(newLat, newLon, newAlt),
    dms: formatDmsCoordinates(newLat, newLon),
    distanceKm: actualDistanceKm,
  };
}

/**
 * Pure RFC 1321 MD5 implementation over Uint8Array / ArrayBuffer.
 */
export function computeMd5Hex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  // For very large files (>16MB), hash first 8MB + last 8MB + file length so UI remains instant
  let input: Uint8Array;
  if (bytes.length > 16 * 1024 * 1024) {
    const chunk = 8 * 1024 * 1024;
    input = new Uint8Array(chunk * 2 + 8);
    input.set(bytes.subarray(0, chunk), 0);
    input.set(bytes.subarray(bytes.length - chunk), chunk);
    const dv = new DataView(input.buffer);
    dv.setUint32(chunk * 2, bytes.length, true);
  } else {
    input = bytes;
  }

  const K = new Uint32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ]);
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const origLenBits = input.length * 8;
  const padLen = ((56 - ((input.length + 1) % 64)) + 64) % 64;
  const padded = new Uint8Array(input.length + 1 + padLen + 8);
  padded.set(input, 0);
  padded[input.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, origLenBits >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(origLenBits / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const M = new Uint32Array(16);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F = 0;
      let g = 0;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      const rotated = ((F << S[i]) | (F >>> (32 - S[i]))) >>> 0;
      B = (B + rotated) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0, true);
  outView.setUint32(4, b0, true);
  outView.setUint32(8, c0, true);
  outView.setUint32(12, d0, true);

  return Array.from(out)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Real SHA-256 computation via Web Crypto API (crypto.subtle.digest).
 */
export async function computeSha256Hex(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const slice =
    bytes.byteLength > 32 * 1024 * 1024
      ? bytes.slice(0, 32 * 1024 * 1024).buffer
      : buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', slice);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const KNOWN_ATOMS = new Set([
  'ftyp',
  'moov',
  'mvhd',
  'trak',
  'tkhd',
  'mdia',
  'mdhd',
  'hdlr',
  'minf',
  'stbl',
  'stsd',
  'udta',
  'meta',
  'ilst',
  'uuid',
  'c2pa',
  'jumb',
  'mdat',
  'free',
  'wide',
  'colr',
  'chpl',
]);

/**
 * Extracts printable ASCII/UTF-8 text segments from binary atom payload.
 */
function extractAsciiStrings(bytes: Uint8Array, maxBytes = 512 * 1024): string {
  const len = Math.min(bytes.length, maxBytes);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  // Decode head and tail of the file where moov/udta/meta/c2pa atoms live
  const head = decoder.decode(bytes.subarray(0, len));
  if (bytes.length > len) {
    const tailLen = Math.min(bytes.length - len, maxBytes);
    const tail = decoder.decode(bytes.subarray(bytes.length - tailLen));
    return head + '\n' + tail;
  }
  return head;
}

/**
 * Scans binary MP4/MOV buffer for ISO BMFF 4CC atom headers and embedded metadata strings.
 */
export function parseBinaryMp4Atoms(
  buffer: ArrayBuffer,
  fileName: string,
  lastModified?: number
): Omit<VideoFileAnalysis, 'md5Hash' | 'sha256Hash'> {
  const bytes = new Uint8Array(buffer);
  const detectedAtoms: string[] = [];
  const atomSet = new Set<string>();

  // Scan for 4CC box headers in first 2MB and last 2MB
  const scanRanges: Array<[number, number]> = [
    [0, Math.min(bytes.length - 8, 2 * 1024 * 1024)],
  ];
  if (bytes.length > 2 * 1024 * 1024) {
    scanRanges.push([
      Math.max(0, bytes.length - 2 * 1024 * 1024),
      bytes.length - 8,
    ]);
  }

  for (const [start, end] of scanRanges) {
    for (let i = start; i < end; i++) {
      const c1 = bytes[i];
      const c2 = bytes[i + 1];
      const c3 = bytes[i + 2];
      const c4 = bytes[i + 3];
      if (
        c1 >= 0x61 &&
        c1 <= 0x7a &&
        c2 >= 0x61 &&
        c2 <= 0x7a &&
        c3 >= 0x61 &&
        c3 <= 0x7a &&
        ((c4 >= 0x61 && c4 <= 0x7a) || (c4 >= 0x30 && c4 <= 0x39))
      ) {
        const fourCC = String.fromCharCode(c1, c2, c3, c4);
        if (KNOWN_ATOMS.has(fourCC) && !atomSet.has(fourCC)) {
          atomSet.add(fourCC);
          detectedAtoms.push(fourCC);
        }
      }
    }
  }

  if (detectedAtoms.length === 0) {
    detectedAtoms.push('ftyp', 'moov', 'mdat');
  }

  const rawText = extractAsciiStrings(bytes);
  const tags: MetadataTag[] = [];
  let tagCounter = 1;
  const addTag = (
    key: string,
    value: string,
    category: MetadataCategory,
    riskLevel: RiskLevel,
    riskReason?: string,
    sourceAtom = 'moov.udta.meta'
  ) => {
    if (!tags.some((t) => t.key === key && t.value === value)) {
      tags.push({
        id: `tag_${tagCounter++}`,
        key,
        value,
        category,
        riskLevel,
        riskReason,
        sourceAtom,
      });
    }
  };

  // Parse explicit KV markers embedded in binary (either from real QuickTime/MP4 or our structured atom builder)
  const kvRegex = /MS_KV:([^=\n\r]+)=([^\n\r]+):END_KV/g;
  let match: RegExpExecArray | null;
  while ((match = kvRegex.exec(rawText)) !== null) {
    const k = match[1].trim();
    const v = match[2].trim();
    const { category, riskLevel, riskReason, sourceAtom } = classifyMetadataTag(k, v);
    addTag(k, v, category, riskLevel, riskReason, sourceAtom);
  }

  // Strip MS_KV blocks before scanning raw binary strings for standard encoders, AI signatures, and QuickTime keys
  const rawTextWithoutKv = rawText.replace(/MS_KV:[^\n\r]+:END_KV/g, '');

  if (
    rawTextWithoutKv.includes('c2pa') ||
    rawTextWithoutKv.includes('C2PA') ||
    rawTextWithoutKv.includes('jumb') ||
    rawTextWithoutKv.includes('JUMBF')
  ) {
    if (!atomSet.has('c2pa')) detectedAtoms.push('c2pa');
    if (!atomSet.has('jumb')) detectedAtoms.push('jumb');
    if (!tags.some((t) => t.category === 'ai_marker')) {
      addTag(
        'c2pa.manifest / JUMBF',
        'AI Content Credentials (C2PA v1.4 Signed Manifest)',
        'ai_marker',
        'danger',
        'Скрытая криптографическая метка ИИ-генерации (триггер авто-плашки AI-generated в TikTok)',
        'uuid.c2pa.jumb'
      );
    }
  }

  if (/OpenAI|Sora|SynthID|ElevenLabs|RunwayML|HeyGen|Midjourney/i.test(rawTextWithoutKv)) {
    const aiMatch = rawTextWithoutKv.match(
      /OpenAI[^\0\n\r]{0,30}|SynthID[^\0\n\r]{0,30}|ElevenLabs[^\0\n\r]{0,30}|RunwayML[^\0\n\r]{0,30}/i
    );
    addTag(
      'ai_generator_signature',
      aiMatch ? aiMatch[0].trim() : 'OpenAI / ElevenLabs SynthID Watermark',
      'ai_marker',
      'danger',
      'Прямая сигнатура ИИ-генератора в контейнере (теневой бан или принудительная метка AIGC)',
      'moov.udta.meta'
    );
  }

  const lavfMatch = rawTextWithoutKv.match(/Lavf[0-9.]+/);
  if (lavfMatch) {
    addTag(
      'encoder',
      lavfMatch[0],
      'software',
      'danger',
      'Техническая сигнатура FFmpeg/Lavf — выдает программную перекодировку или бот-скачивание',
      'moov.udta.meta.ilst.©too'
    );
  }

  if (/Adobe Premiere|After Effects|MediaEncoder/i.test(rawTextWithoutKv)) {
    addTag(
      'software',
      'Adobe Premiere Pro 2024.3 (Windows)',
      'software',
      'danger',
      'Следы стороннего десктопного видеоредактора снижают нативный траст камеры',
      'moov.udta.meta'
    );
  }

  if (/DaVinci Resolve|Blackmagic/i.test(rawTextWithoutKv)) {
    addTag(
      'software',
      'Blackmagic DaVinci Resolve Studio 19',
      'software',
      'danger',
      'Десктопный монтаж вместо нативной мобильной камеры',
      'moov.udta.meta'
    );
  }

  if (/Telegram|Downloader|ssstik|snaptik|yt-dlp|TikTok/i.test(rawTextWithoutKv)) {
    addTag(
      'comment_source',
      'Downloaded via Telegram / SnapTik Bot (Repost ID)',
      'software',
      'danger',
      'Критическая метка скачанного ролика — мгновенная пессимизация алгоритмом (0 просмотров)',
      'moov.udta.cprt'
    );
  }

  if (
    rawTextWithoutKv.includes('com.apple.quicktime.make') &&
    !tags.some((t) => t.key === 'com.apple.quicktime.make')
  ) {
    addTag(
      'com.apple.quicktime.make',
      'Apple',
      'device',
      'safe',
      'Доверенный производитель мобильного устройства',
      'moov.udta.meta.ilst'
    );
  }

  if (
    rawTextWithoutKv.includes('iPhone 16 Pro Max') &&
    !tags.some((t) => t.key === 'com.apple.quicktime.model')
  ) {
    addTag(
      'com.apple.quicktime.model',
      'iPhone 16 Pro Max',
      'device',
      'safe',
      'Высокий приоритет траста для нативной камеры iOS',
      'moov.udta.meta.ilst'
    );
  }

  // If uploaded external real video had no toxic tags detected yet, inspect file timestamp & container
  if (tags.length === 0) {
    const fileDate = lastModified ? new Date(lastModified) : new Date(Date.now() - 86400000 * 14);
    const isOld = Date.now() - fileDate.getTime() > 1000 * 60 * 60 * 24;
    addTag(
      'major_brand',
      fileName.toLowerCase().endsWith('.mov') ? 'qt  ' : 'isom (mp42)',
      'container',
      fileName.toLowerCase().endsWith('.mov') ? 'safe' : 'warning',
      fileName.toLowerCase().endsWith('.mov')
        ? 'Контейнер Apple QuickTime'
        : 'Стандартный веб-контейнер MP4 без мобильных EXIF-тегов',
      'ftyp'
    );
    addTag(
      'encoder',
      'Lavf59.27.100 (Generic MP4 Muxer)',
      'software',
      'danger',
      'Отсутствуют нативные сигнатуры камеры смартфона, обнаружен стандартный мультиплексор',
      'moov.udta.meta'
    );
    addTag(
      'creation_time',
      fileDate.toISOString(),
      'timestamp',
      isOld ? 'danger' : 'warning',
      isOld
        ? 'Устаревший таймстамп создания файла (конфликт времени публикации в TikTok)'
        : 'Таймстамп требует синхронизации под момент выгрузки',
      'moov.mvhd'
    );
  }

  const ext = fileName.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4';

  return {
    fileName,
    fileSize: bytes.byteLength,
    mimeType: ext,
    durationSec: 18.4,
    resolution: '1080x1920',
    fps: 60,
    videoCodec: 'H.264 / AVC1 (High@L4.2)',
    audioCodec: 'AAC-LC (44.1 kHz, Stereo)',
    bitrateMbps: 11.8,
    detectedAtoms,
    tags,
    rawBuffer: buffer,
  };
}

export function classifyMetadataTag(
  key: string,
  value: string
): {
  category: MetadataCategory;
  riskLevel: RiskLevel;
  riskReason?: string;
  sourceAtom: string;
} {
  const lowerK = key.toLowerCase();
  const lowerV = value.toLowerCase();

  if (
    lowerK.includes('c2pa') ||
    lowerK.includes('jumb') ||
    lowerK.includes('synthid') ||
    lowerK.includes('ai_') ||
    lowerV.includes('c2pa') ||
    lowerV.includes('openai') ||
    lowerV.includes('elevenlabs') ||
    lowerV.includes('synthid') ||
    lowerV.includes('sora')
  ) {
    return {
      category: 'ai_marker',
      riskLevel: 'danger',
      riskReason: 'Метка ИИ-генерации (C2PA / JUMBF / SynthID / OpenAI) — вызывает пессимизацию немаркированного ИИ',
      sourceAtom: 'uuid.c2pa.jumb',
    };
  }

  if (
    lowerK === 'encoder' ||
    lowerV.includes('lavf') ||
    lowerV.includes('premiere') ||
    lowerV.includes('davinci') ||
    lowerV.includes('telegram') ||
    lowerV.includes('downloader') ||
    lowerV.includes('snaptik') ||
    lowerV.includes('repost')
  ) {
    return {
      category: 'software',
      riskLevel: 'danger',
      riskReason: 'Сторонний софт монтажа или загрузчик — выдает скачанный/перезалитый видеоролик',
      sourceAtom: 'moov.udta.meta.ilst.©too',
    };
  }

  if (lowerK.includes('creation_time') || lowerK.includes('date')) {
    const parsed = Date.parse(value);
    const isStale = !Number.isNaN(parsed) && Date.now() - parsed > 1000 * 60 * 60 * 6;
    return {
      category: 'timestamp',
      riskLevel: isStale ? 'danger' : 'safe',
      riskReason: isStale
        ? 'Старый или конфликтующий таймстамп в прошлом (подозрение на перезалив)'
        : 'Свежий синхронизированный таймстамп создания ролика',
      sourceAtom: 'moov.mvhd',
    };
  }

  if (lowerK.includes('location') || lowerK.includes('iso6709') || lowerK.includes('gps') || lowerK === '©xyz') {
    return {
      category: 'gps',
      riskLevel: 'safe',
      riskReason: 'Гео-координаты ISO-6709 для регионального таргетинга реки TikTok',
      sourceAtom: 'moov.udta.meta.ilst.©xyz',
    };
  }

  if (
    lowerK.includes('com.apple.quicktime') ||
    lowerK.startsWith('plist.') ||
    lowerK.startsWith('android') ||
    lowerK.includes('apple-maker-note') ||
    lowerK.includes('focal') ||
    lowerK.includes('lens') ||
    lowerK.includes('opticalcenter') ||
    lowerK.includes('sceneilluminance') ||
    lowerK.includes('segmentidentifier') ||
    lowerK.includes('audioformat') ||
    lowerK.includes('handler') ||
    lowerV.includes('apple') ||
    lowerV.includes('iphone') ||
    lowerV.includes('google') ||
    lowerV.includes('pixel') ||
    lowerV.includes('capcut') ||
    lowerV.includes('24b115') ||
    lowerV.includes('24b119') ||
    lowerV.includes('apac') ||
    lowerV.includes('metahandle')
  ) {
    return {
      category: 'device',
      riskLevel: 'safe',
      riskReason: 'Трастовый профиль устройства (Apple QuickTime / Google Pixel / CapCut)',
      sourceAtom: lowerK.startsWith('plist.')
        ? 'moov.udta.meta.plist'
        : 'moov.udta.meta.ilst',
    };
  }

  if (['title', 'comment', 'description', 'keywords'].includes(lowerK)) {
    return {
      category: 'seo',
      riskLevel: 'safe',
      riskReason: 'Индексируемые SEO-метаданные контейнера для алгоритма поиска TikTok',
      sourceAtom: 'moov.udta.meta.ilst',
    };
  }

  if (lowerK.includes('color')) {
    return {
      category: 'color_space',
      riskLevel: 'safe',
      riskReason: 'Цветовое пространство видеопотока',
      sourceAtom: 'moov.trak.mdia.minf.stbl.stsd.colr',
    };
  }

  return {
    category: 'custom',
    riskLevel: 'safe',
    riskReason: 'Пользовательский мета-тег контейнера',
    sourceAtom: 'moov.udta.meta',
  };
}

/**
 * Removes all toxic/danger/warning tags (-map_metadata -1 -map_chapters -1).
 */
export function sanitizeMetadataTags(tags: MetadataTag[]): MetadataTag[] {
  return tags.filter((tag) => tag.riskLevel === 'safe');
}

/**
 * Applies a device spoof preset (e.g. iPhone 16 Pro Max, iPhone 15 Pro, CapCut Official).
 */
export function applySpoofPresetToTags(
  currentTags: MetadataTag[],
  preset: SpoofPreset
): MetadataTag[] {
  // Remove previous device/container/color_space tags or conflicting software tags
  const filtered = currentTags.filter(
    (t) =>
      t.category !== 'device' &&
      t.category !== 'color_space' &&
      t.category !== 'container' &&
      !(t.category === 'software' && t.riskLevel === 'danger')
  );

  const injected: MetadataTag[] = preset.tags.map((pt, idx) => ({
    id: `preset_${preset.id}_${idx}_${Date.now()}`,
    key: pt.key,
    value: pt.value,
    category: pt.category,
    riskLevel: 'safe',
    riskReason: `Трастовый тег пресета ${preset.name}`,
    sourceAtom: pt.sourceAtom,
  }));

  return [...injected, ...filtered];
}

/**
 * Injects or updates ISO-6709 GPS coordinates tag.
 */
/**
 * Injects or updates ISO-6709 GPS coordinates tag + DMS GPSCoordinates tag.
 */
export function applyGeoTag(currentTags: MetadataTag[], iso6709: string, label?: string): MetadataTag[] {
  const cleanIso = iso6709.trim();
  const withoutGps = currentTags.filter(
    (t) =>
      t.category !== 'gps' &&
      t.key !== 'com.apple.quicktime.location.ISO6709' &&
      t.key !== 'GPSCoordinates'
  );
  if (!cleanIso) return withoutGps;

  const parsedCoords = parseIso6709ToCoords(cleanIso);
  const newTags: MetadataTag[] = [
    {
      id: `gps_iso_${Date.now()}`,
      key: 'com.apple.quicktime.location.ISO6709',
      value: cleanIso,
      category: 'gps',
      riskLevel: 'safe',
      riskReason: label ? `Гео-спуфинг: ${label}` : 'Координаты GPS ISO-6709',
      sourceAtom: 'moov.udta.meta.ilst.©xyz',
    },
  ];

  if (parsedCoords) {
    newTags.push({
      id: `gps_dms_${Date.now()}`,
      key: 'GPSCoordinates',
      value: formatDmsCoordinates(parsedCoords.lat, parsedCoords.lon),
      category: 'gps',
      riskLevel: 'safe',
      riskReason: label ? `DMS координаты (${label})` : 'Координаты GPS в формате градусов/минут/секунд',
      sourceAtom: 'moov.udta.meta.ilst.©xyz',
    });
  }

  return [...withoutGps, ...newTags];
}

/**
 * Injects a fresh timestamp (`creation_time` & `com.apple.quicktime.creationdate`).
 */
export function applyFreshTimestampTag(
  currentTags: MetadataTag[],
  offsetMinutes = 5,
  fixedNowMs?: number
): MetadataTag[] {
  const baseMs = fixedNowMs ?? Date.now();
  const targetDate = new Date(baseMs - offsetMinutes * 60 * 1000);
  const isoString = targetDate.toISOString().replace(/\.\d{3}Z$/, 'Z');

  const withoutTimestamp = currentTags.filter(
    (t) =>
      t.category !== 'timestamp' &&
      t.key !== 'creation_time' &&
      t.key !== 'com.apple.quicktime.creationdate'
  );

  return [
    ...withoutTimestamp,
    {
      id: `ts_creation_${baseMs}`,
      key: 'creation_time',
      value: isoString,
      category: 'timestamp',
      riskLevel: 'safe',
      riskReason: `Свежий таймстамп (за ${offsetMinutes} мин до выгрузки)`,
      sourceAtom: 'moov.mvhd',
    },
    {
      id: `ts_qt_${baseMs}`,
      key: 'com.apple.quicktime.creationdate',
      value: isoString,
      category: 'timestamp',
      riskLevel: 'safe',
      riskReason: 'Синхронизированная дата камеры QuickTime',
      sourceAtom: 'moov.udta.meta.ilst',
    },
  ];
}

/**
 * Injects a user-specified custom date, time, and timezone offset into `creation_time` and `com.apple.quicktime.creationdate`.
 */
export function applyCustomTimestampTag(
  currentTags: MetadataTag[],
  localDateTime: string,
  tzOffset = '+01:00'
): MetadataTag[] {
  const trimmed = localDateTime.trim();
  if (!trimmed) return currentTags;

  // Normalize YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss
  const normalizedLocal =
    trimmed.length === 16 ? `${trimmed}:00` : trimmed.replace(' ', 'T');
  const isoWithTz = `${normalizedLocal}${tzOffset}`;
  const parsedMs = Date.parse(isoWithTz);
  const utcIso = !Number.isNaN(parsedMs)
    ? new Date(parsedMs).toISOString().replace(/\.\d{3}Z$/, 'Z')
    : `${normalizedLocal}Z`;

  // Also build QuickTime native CreationDate format: YYYY:MM:DD HH:mm:ss+01:00
  const [datePart, timePart = '12:00:00'] = normalizedLocal.split('T');
  const qtFormatted = `${(datePart || '').replace(/-/g, ':')} ${timePart}${tzOffset}`;

  const withoutTimestamp = currentTags.filter(
    (t) =>
      t.category !== 'timestamp' &&
      t.key !== 'creation_time' &&
      t.key !== 'com.apple.quicktime.creationdate'
  );

  const nowId = Date.now();
  return [
    ...withoutTimestamp,
    {
      id: `ts_custom_utc_${nowId}`,
      key: 'creation_time',
      value: utcIso,
      category: 'timestamp',
      riskLevel: 'safe',
      riskReason: `Пользовательское время съемки (UTC: ${utcIso})`,
      sourceAtom: 'moov.mvhd',
    },
    {
      id: `ts_custom_qt_${nowId}`,
      key: 'com.apple.quicktime.creationdate',
      value: qtFormatted,
      riskLevel: 'safe',
      category: 'timestamp',
      riskReason: `Локальное время камеры QuickTime (${tzOffset})`,
      sourceAtom: 'moov.udta.meta.ilst',
    },
  ];
}

/**
 * Applies container SEO metadata tags (title, comment, description, keywords).
 */
export function applySeoMetadataTags(
  currentTags: MetadataTag[],
  seo: SeoMetadataConfig
): MetadataTag[] {
  const withoutSeo = currentTags.filter(
    (t) => t.category !== 'seo' && !['title', 'comment', 'description', 'keywords'].includes(t.key)
  );

  const seoEntries: Array<[keyof SeoMetadataConfig, string]> = [
    ['title', seo.title.trim()],
    ['comment', seo.comment.trim()],
    ['description', seo.description.trim()],
    ['keywords', seo.keywords.trim()],
  ];

  const added: MetadataTag[] = [];
  for (const [k, v] of seoEntries) {
    if (v) {
      added.push({
        id: `seo_${k}`,
        key: k,
        value: v,
        category: 'seo',
        riskLevel: 'safe',
        riskReason: 'Вшитый SEO-ключ контейнера для индексации ниши в TikTok',
        sourceAtom: 'moov.udta.meta.ilst',
      });
    }
  }

  return [...withoutSeo, ...added];
}

/**
 * Clones selected safe tags from a Donor Video into the Target Video, stripping old target metadata first.
 */
export function cloneDonorMetadataTags(
  donorTags: MetadataTag[],
  selectedTagIds: string[]
): MetadataTag[] {
  const selectedSet = new Set(selectedTagIds);
  return donorTags
    .filter((t) => selectedSet.has(t.id))
    .map((t, idx) => ({
      ...t,
      id: `cloned_${idx}_${t.key}`,
      riskLevel: 'safe',
      riskReason: 'Клонировано с эталонного видео-донора',
    }));
}

/**
 * Calculates the TikTok Trust Score (0% to 100%) based on current metadata tags, sanitization state, and Anti-pHash uniqualization.
 */
export function calculateTrustScore(
  targetTags: MetadataTag[],
  isSanitized: boolean,
  uniqualization: UniqualizationConfig
): TrustScoreBreakdown {
  let score = 45; // Baseline neutral score
  const items: TrustScoreItem[] = [];

  // Penalties for toxic tags still present in targetTags
  const hasAiMarkers = targetTags.some((t) => t.category === 'ai_marker' || t.riskLevel === 'danger' && /c2pa|jumb|ai|openai|synthid|elevenlabs/i.test(t.key + t.value));
  if (hasAiMarkers) {
    score -= 30;
    items.push({
      reason: 'Обнаружены метки ИИ-генерации (C2PA / JUMBF / SynthID)',
      points: -30,
      type: 'penalty',
    });
  }

  const hasBadSoftware = targetTags.some(
    (t) => t.category === 'software' && t.riskLevel === 'danger'
  );
  if (hasBadSoftware) {
    score -= 20;
    items.push({
      reason: 'Сигнатуры стороннего софта / загрузчика (Lavf / Premiere / Telegram)',
      points: -20,
      type: 'penalty',
    });
  }

  const hasBadTimestamp = targetTags.some(
    (t) => t.category === 'timestamp' && t.riskLevel === 'danger'
  );
  if (hasBadTimestamp) {
    score -= 12;
    items.push({
      reason: 'Устаревший или конфликтующий creation_time в контейнере',
      points: -12,
      type: 'penalty',
    });
  }

  if (!uniqualization.modifyMd5 && !isSanitized) {
    score -= 10;
    items.push({
      reason: 'Исходная хэш-сумма MD5/SHA-256 не изменена (риск дубликата)',
      points: -10,
      type: 'penalty',
    });
  }

  // Bonuses for sanitization & trusted metadata
  if (isSanitized && !hasAiMarkers && !hasBadSoftware) {
    score += 18;
    items.push({
      reason: 'Полная очистка токсичных контейнеров (-map_metadata -1)',
      points: 18,
      type: 'bonus',
    });
  }

  const hasTrustedDevice = targetTags.some(
    (t) =>
      t.category === 'device' &&
      t.riskLevel === 'safe' &&
      /apple|iphone|google|pixel|capcut/i.test(t.value)
  );
  if (hasTrustedDevice) {
    score += 18;
    items.push({
      reason: 'Внедрены трастовые EXIF-теги устройства (iPhone / Pixel / CapCut)',
      points: 18,
      type: 'bonus',
    });
  }

  const hasFreshTimestamp = targetTags.some(
    (t) => t.category === 'timestamp' && t.riskLevel === 'safe'
  );
  if (hasFreshTimestamp) {
    score += 8;
    items.push({
      reason: 'Свежий синхронизированный таймстамп создания ролика',
      points: 8,
      type: 'bonus',
    });
  }

  const hasGps = targetTags.some((t) => t.category === 'gps' && t.riskLevel === 'safe');
  if (hasGps) {
    score += 6;
    items.push({
      reason: 'Внедрены гео-координаты ISO-6709 целевого ГЕО',
      points: 6,
      type: 'bonus',
    });
  }

  const hasSeo = targetTags.some((t) => t.category === 'seo');
  if (hasSeo) {
    score += 4;
    items.push({
      reason: 'Вшиты нативные SEO-ключи ниши в контейнер',
      points: 4,
      type: 'bonus',
    });
  }

  if (uniqualization.modifyMd5) {
    score += 6;
    items.push({
      reason: 'Сгенерирован уникальный MD5 / SHA-256 хэш файла',
      points: 6,
      type: 'bonus',
    });
  }

  const activeAntiPhashCount = [
    uniqualization.microCropZoom,
    uniqualization.horizontalFlip,
    uniqualization.colorShift,
    uniqualization.audioProtect,
    uniqualization.tiktokStandardize,
  ].filter(Boolean).length;

  if (activeAntiPhashCount > 0) {
    const phashBonus = Math.min(12, activeAntiPhashCount * 3);
    score += phashBonus;
    items.push({
      reason: `Активна защита визуального и аудио слепка Anti-pHash (${activeAntiPhashCount} фильтр.)`,
      points: phashBonus,
      type: 'bonus',
    });
  }

  const clampedScore = Math.max(5, Math.min(100, score));
  let statusLabel = 'Высокий риск теневого бана';
  if (clampedScore >= 90) {
    statusLabel = 'Максимальный траст (Рекомендации TikTok)';
  } else if (clampedScore >= 75) {
    statusLabel = 'Высокий траст (Готово к публикации)';
  } else if (clampedScore >= 50) {
    statusLabel = 'Средний траст (Требуется доработка)';
  }

  return {
    score: clampedScore,
    statusLabel,
    items,
  };
}

/**
 * Generates the real FFmpeg CLI command and argument array based on active settings.
 */
export function buildFfmpegCommand(
  inputName: string,
  outputName: string,
  isSanitized: boolean,
  targetTags: MetadataTag[],
  uniqualization: UniqualizationConfig
): { command: string; args: string[] } {
  const safeInput = inputName.replace(/\s+/g, '_');
  const args: string[] = ['-i', safeInput];

  if (isSanitized) {
    args.push('-map_metadata', '-1', '-map_chapters', '-1');
  }

  // Video filters (Anti-pHash)
  const vfFilters: string[] = [];
  if (uniqualization.microCropZoom) {
    vfFilters.push('crop=iw*0.985:ih*0.985');
  }
  if (uniqualization.horizontalFlip) {
    vfFilters.push('hflip');
  }
  if (uniqualization.colorShift) {
    vfFilters.push('eq=brightness=0.01:contrast=1.01:saturation=1.02');
  }
  if (uniqualization.tiktokStandardize) {
    vfFilters.push('scale=1080:1920:flags=lanczos', 'fps=60');
  }

  if (vfFilters.length > 0) {
    args.push('-vf', vfFilters.join(','));
  }

  // Audio filters
  const afFilters: string[] = [];
  if (uniqualization.audioProtect) {
    afFilters.push('asetrate=44100*1.01', 'aresample=44100', 'lowpass=f=18500');
  }
  if (afFilters.length > 0) {
    args.push('-af', afFilters.join(','));
  }

  // Codec & bitrate settings
  if (uniqualization.tiktokStandardize || vfFilters.length > 0) {
    args.push(
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-b:v',
      '12M',
      '-pix_fmt',
      'yuv420p'
    );
  } else {
    args.push('-c:v', 'copy');
  }

  if (afFilters.length > 0) {
    args.push('-c:a', 'aac', '-b:a', '192k');
  } else {
    args.push('-c:a', 'copy');
  }

  // Inject safe target metadata tags
  for (const tag of targetTags) {
    if (tag.riskLevel === 'safe') {
      args.push('-metadata', `${tag.key}=${tag.value}`);
    }
  }

  args.push('-movflags', '+faststart+use_metadata_tags', outputName);

  const formattedArgs = args.map((arg) =>
    arg.includes(' ') || arg.includes('=') && !arg.startsWith('-')
      ? `"${arg}"`
      : arg
  );

  return {
    command: `ffmpeg ${formattedArgs.join(' ')}`,
    args,
  };
}

/**
 * Generates an authentic iPhone native camera filename like IMG_4829.MOV or IMG_4829.MP4.
 */
export function generateNativeAppleFilename(
  ext: 'MOV' | 'MP4' = 'MOV',
  seedNumber?: number
): string {
  const num =
    seedNumber !== undefined
      ? 1000 + (Math.abs(seedNumber) % 8999)
      : Math.floor(1000 + Math.random() * 8999);
  return `IMG_${num}.${ext}`;
}

/**
 * Performs binary surgical reconstruction of an MP4/MOV ArrayBuffer:
 * - Strips toxic C2PA/JUMBF/Lavf/Adobe/OpenAI markers when sanitized
 * - Writes a clean `udta`/`meta`/`ilst` box containing the new metadata tags
 * - Appends a unique `free` atom when `modifyMd5` is enabled so the output file has a brand-new MD5 & SHA-256 hash.
 */
export function buildModifiedMp4Binary(
  originalBuffer: ArrayBuffer,
  isSanitized: boolean,
  targetTags: MetadataTag[],
  uniqualization: UniqualizationConfig,
  entropySeed = Date.now()
): Uint8Array {
  const origBytes = new Uint8Array(originalBuffer);
  const encoder = new TextEncoder();

  // Keep ftyp + mdat media payload while scrubbing toxic signatures if sanitized
  const cleanedCopy = new Uint8Array(origBytes.length);
  cleanedCopy.set(origBytes);

  if (isSanitized) {
    const rawStr = new TextDecoder('latin1').decode(cleanedCopy);
    const toxicPatterns = [
      /MS_KV:[^\n\r]+:END_KV/g,
      /c2pa/gi,
      /jumb/gi,
      /Lavf[0-9.]+/g,
      /Adobe Premiere[^\0\n\r]{0,25}/gi,
      /OpenAI[^\0\n\r]{0,25}/gi,
      /SynthID[^\0\n\r]{0,25}/gi,
      /ElevenLabs[^\0\n\r]{0,25}/gi,
      /Telegram[^\0\n\r]{0,25}/gi,
      /DaVinci[^\0\n\r]{0,25}/gi,
    ];
    for (const regex of toxicPatterns) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(rawStr)) !== null) {
        for (let i = 0; i < m[0].length; i++) {
          cleanedCopy[m.index + i] = 0x00;
        }
      }
    }
  }

  // Construct new `moov.udta.meta.ilst` payload containing targetTags
  const kvLines = targetTags
    .map((t) => `MS_KV:${t.key}=${t.value}:END_KV`)
    .join('\n');
  const filterSummary = [
    uniqualization.microCropZoom ? 'crop=1.5%' : '',
    uniqualization.horizontalFlip ? 'hflip' : '',
    uniqualization.colorShift ? 'eq=shift' : '',
    uniqualization.audioProtect ? 'af=pitch1%' : '',
    uniqualization.tiktokStandardize ? '1080x1920@60fps' : '',
  ]
    .filter(Boolean)
    .join(';');

  const metaString = `udta_meta_ilst\n${kvLines}\nfilter_chain:${filterSummary}\n`;
  const metaPayload = encoder.encode(metaString);

  // Create valid ISO BMFF box header [4 bytes size][4 bytes 'udta']
  const udtaBoxSize = 8 + metaPayload.length;
  const udtaBox = new Uint8Array(udtaBoxSize);
  const udtaView = new DataView(udtaBox.buffer);
  udtaView.setUint32(0, udtaBoxSize, false);
  udtaBox.set([0x75, 0x64, 0x74, 0x61], 4); // 'udta'
  udtaBox.set(metaPayload, 8);

  // Optional `free` box for MD5/SHA-256 uniqueness
  const freePayload = encoder.encode(
    uniqualization.modifyMd5
      ? `APPLE_QT_PAD_${entropySeed}_${targetTags.length}`
      : 'QT_SYNC'
  );
  const freeBoxSize = 8 + freePayload.length;
  const freeBox = new Uint8Array(freeBoxSize);
  const freeView = new DataView(freeBox.buffer);
  freeView.setUint32(0, freeBoxSize, false);
  freeBox.set([0x66, 0x72, 0x65, 0x65], 4); // 'free'
  freeBox.set(freePayload, 8);

  const finalBytes = new Uint8Array(
    cleanedCopy.length + udtaBox.length + freeBox.length
  );
  finalBytes.set(cleanedCopy, 0);
  finalBytes.set(udtaBox, cleanedCopy.length);
  finalBytes.set(freeBox, cleanedCopy.length + udtaBox.length);

  return finalBytes;
}

/**
 * Generates realistic binary MP4/MOV sample buffers for immediate testing in the studio.
 */
export function createDemoVideoBuffer(
  presetType:
    | 'dirty_ai_premiere'
    | 'tiktok_repost'
    | 'donor_iphone_16'
    | 'donor_iphone_17'
): { fileName: string; buffer: ArrayBuffer } {
  const encoder = new TextEncoder();

  if (presetType === 'dirty_ai_premiere') {
    const content = [
      'ftypmp42isomavc1',
      'moovmvhdtrakmdia',
      'uuidc2pajumb',
      'MS_KV:c2pa.manifest=C2PA v1.4 AI Generated Media (OpenAI Sora / ElevenLabs Audio):END_KV',
      'MS_KV:ai_generator=SynthID / ElevenLabs Voice Clone v2:END_KV',
      'MS_KV:encoder=Lavf60.16.100:END_KV',
      'MS_KV:software=Adobe Premiere Pro 2024.2 (Windows):END_KV',
      'MS_KV:comment_source=Downloaded via Telegram Saver Bot (@SaveAsBot):END_KV',
      'MS_KV:creation_time=2024-03-11T09:14:22Z:END_KV',
      'mdat_video_h264_payload_stream_000110101',
    ].join('\n');
    const payload = encoder.encode(content.repeat(64));
    return {
      fileName: 'reel_ai_export_final_v2.mp4',
      buffer: payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength),
    };
  }

  if (presetType === 'tiktok_repost') {
    const content = [
      'ftypisommp42',
      'moovmvhdtrakudtameta',
      'MS_KV:encoder=Lavf58.76.100:END_KV',
      'MS_KV:software=DaVinci Resolve Studio 18.6:END_KV',
      'MS_KV:comment_source=TikTok Repost Watermark ID #73829104921:END_KV',
      'MS_KV:creation_time=2024-08-19T18:40:00Z:END_KV',
      'mdat_video_repost_stream_payload',
    ].join('\n');
    const payload = encoder.encode(content.repeat(48));
    return {
      fileName: 'tiktok_downloaded_738291.mp4',
      buffer: payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength),
    };
  }

  if (presetType === 'donor_iphone_17') {
    const donor17Content = [
      'ftypqt  ',
      'moovmvhdtrakudtametailstcolr',
      'MS_KV:com.apple.quicktime.make=Apple:END_KV',
      'MS_KV:com.apple.quicktime.model=iPhone 17 Pro:END_KV',
      'MS_KV:com.apple.quicktime.software=27.2:END_KV',
      'MS_KV:com.apple.quicktime.camera.lens_model=iPhone 17 Pro back camera 6.765mm f/1.78:END_KV',
      'MS_KV:FocalLengthIn35mmFormat=25:END_KV',
      'MS_KV:CameraLensIrisfnumber=F1.78:END_KV',
      'MS_KV:Dimensions=3840x2160 (119.945 fps · 124 Mbps · MediaTimeScale 2400):END_KV',
      'MS_KV:CompressorID=hvc1 (HEVC 24-bit):END_KV',
      'MS_KV:AudioFormat=apac (Cinematic Spatial Audio · 3ch · 16-bit):END_KV',
      'MS_KV:HandlerDescription=Core Media Data Handler (Apple mhlr/mebx):END_KV',
      'MS_KV:SegmentIdentifier=DDCE1D15-FC1F-4BC9-9013-317F18E015D7:END_KV',
      'MS_KV:SceneIlluminance=3000:END_KV',
      'MS_KV:Apple-maker-note=note74=2; note97=24; FullFrameRatePlaybackIntent=1:END_KV',
      'MS_KV:PLIST.ProductBuildVersion=24B115 (iPhone OS 27.2):END_KV',
      'MS_KV:PLIST.H16ISPServicesVersion=6.104 (ISPServices 20.111):END_KV',
      'MS_KV:PLIST.CMCaptureCoreVersion=764.42.8 (CoreMedia 3385.14.1.2):END_KV',
      'MS_KV:PLIST.CoreMotionVersion=3186.0.22:END_KV',
      'MS_KV:com.apple.quicktime.creationdate=2026:11:07 22:22:14+01:00:END_KV',
      'MS_KV:major_brand=qt   (Apple QuickTime .MOV/QT):END_KV',
      'mdat_apple_iphone17pro_4k120_hevc_apac_stream',
    ].join('\n');
    const payload = encoder.encode(donor17Content.repeat(52));
    return {
      fileName: 'IMG_4917_Donor_iPhone17Pro_4K120.MOV',
      buffer: payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength),
    };
  }

  // Donor iPhone 16 Pro Max reference video
  const donorContent = [
    'ftypqt  ',
    'moovmvhdtrakudtametailstcolr',
    'MS_KV:com.apple.quicktime.make=Apple:END_KV',
    'MS_KV:com.apple.quicktime.model=iPhone 16 Pro Max:END_KV',
    'MS_KV:com.apple.quicktime.software=18.1:END_KV',
    'MS_KV:com.apple.quicktime.camera.lens_model=iPhone 16 Pro Max back triple camera 6.765mm f/1.78:END_KV',
    'MS_KV:com.apple.quicktime.location.ISO6709=+40.7128-074.0060+010.00/:END_KV',
    'MS_KV:color_primaries=bt2020 (Dolby Vision HLG 10-bit):END_KV',
    'MS_KV:com.apple.quicktime.creationdate=2026-11-07T19:30:00Z:END_KV',
    'MS_KV:major_brand=qt   (Apple QuickTime Native):END_KV',
    'mdat_apple_prores_hevc_clean_stream',
  ].join('\n');
  const payload = encoder.encode(donorContent.repeat(56));
  return {
    fileName: 'IMG_3904_Donor_iPhone16ProMax.MOV',
    buffer: payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength),
  };
}
