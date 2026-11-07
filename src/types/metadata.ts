export type MetadataCategory =
  | 'hash'
  | 'ai_marker'
  | 'software'
  | 'timestamp'
  | 'device'
  | 'gps'
  | 'seo'
  | 'color_space'
  | 'container'
  | 'custom';

export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface MetadataTag {
  id: string;
  key: string;
  value: string;
  category: MetadataCategory;
  riskLevel: RiskLevel;
  riskReason?: string;
  sourceAtom?: string;
}

export interface VideoFileAnalysis {
  fileName: string;
  fileSize: number;
  mimeType: string;
  durationSec: number;
  resolution: string;
  fps: number;
  videoCodec: string;
  audioCodec: string;
  bitrateMbps: number;
  md5Hash: string;
  sha256Hash: string;
  detectedAtoms: string[];
  tags: MetadataTag[];
  rawBuffer: ArrayBuffer;
  isDemo?: boolean;
  demoId?: string;
}

export interface SpoofPreset {
  id: string;
  name: string;
  subtitle: string;
  recommendedExt: 'MOV' | 'MP4';
  tags: Array<{
    key: string;
    value: string;
    category: MetadataCategory;
    sourceAtom: string;
  }>;
}

export interface GeoPreset {
  id: string;
  country: string;
  city: string;
  regionCode: string;
  lat: number;
  lon: number;
  alt: number;
  defaultTz: string;
  iso6709: string;
  description: string;
}

export interface SeoMetadataConfig {
  title: string;
  comment: string;
  description: string;
  keywords: string;
}

export interface UniqualizationConfig {
  modifyMd5: boolean;
  microCropZoom: boolean;
  horizontalFlip: boolean;
  colorShift: boolean;
  audioProtect: boolean;
  tiktokStandardize: boolean;
}

export interface TrustScoreItem {
  reason: string;
  points: number;
  type: 'penalty' | 'bonus';
}

export interface TrustScoreBreakdown {
  score: number;
  statusLabel: string;
  items: TrustScoreItem[];
}

export interface ProcessedVideoResult {
  fileName: string;
  fileSize: number;
  md5Hash: string;
  sha256Hash: string;
  blobUrl: string;
  engineUsed: 'ffmpeg-wasm' | 'binary-surgical';
  processedAt: string;
  detectedAtoms: string[];
}
