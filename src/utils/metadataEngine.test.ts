import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPOOF_PRESETS,
  GEO_PRESETS,
  computeMd5Hex,
  computeSha256Hex,
  parseBinaryMp4Atoms,
  sanitizeMetadataTags,
  applySpoofPresetToTags,
  applyGeoTag,
  applyFreshTimestampTag,
  applySeoMetadataTags,
  cloneDonorMetadataTags,
  calculateTrustScore,
  buildFfmpegCommand,
  generateNativeAppleFilename,
  buildModifiedMp4Binary,
  createDemoVideoBuffer,
} from './metadataEngine';
import { UniqualizationConfig } from '../types/metadata';

const defaultUniq: UniqualizationConfig = {
  modifyMd5: false,
  microCropZoom: false,
  horizontalFlip: false,
  colorShift: false,
  audioProtect: false,
  tiktokStandardize: false,
};

test('MD5 and SHA-256 hashes compute deterministically and change when binary changes', async () => {
  const sampleA = createDemoVideoBuffer('dirty_ai_premiere');
  const sampleB = createDemoVideoBuffer('donor_iphone_16');

  const md5A1 = computeMd5Hex(sampleA.buffer);
  const md5A2 = computeMd5Hex(sampleA.buffer);
  const md5B = computeMd5Hex(sampleB.buffer);

  assert.equal(md5A1.length, 32);
  assert.equal(md5A1, md5A2);
  assert.notEqual(md5A1, md5B);

  const shaA = await computeSha256Hex(sampleA.buffer);
  assert.equal(shaA.length, 64);
});

test('parseBinaryMp4Atoms detects toxic AI, Lavf, Premiere, and stale creation_time tags', () => {
  const { fileName, buffer } = createDemoVideoBuffer('dirty_ai_premiere');
  const parsed = parseBinaryMp4Atoms(buffer, fileName);

  assert.ok(parsed.detectedAtoms.includes('ftyp'));
  assert.ok(parsed.detectedAtoms.includes('moov'));
  assert.ok(parsed.detectedAtoms.includes('c2pa'));

  const dangerTags = parsed.tags.filter((t) => t.riskLevel === 'danger');
  assert.ok(dangerTags.length >= 4, 'Expected at least 4 toxic metadata tags');
  assert.ok(dangerTags.some((t) => t.category === 'ai_marker'));
  assert.ok(dangerTags.some((t) => t.key === 'encoder' && t.value.includes('Lavf')));
});

test('Sanitizer removes all bad tags and Spoofer injects iPhone 16 Pro Max + GPS + Timestamp + SEO', () => {
  const { fileName, buffer } = createDemoVideoBuffer('dirty_ai_premiere');
  const parsed = parseBinaryMp4Atoms(buffer, fileName);

  const initialScore = calculateTrustScore(parsed.tags, false, defaultUniq);
  assert.ok(initialScore.score < 30, `Expected low initial trust score, got ${initialScore.score}`);

  // Step 1: Sanitize
  let cleanTags = sanitizeMetadataTags(parsed.tags);
  assert.equal(cleanTags.filter((t) => t.riskLevel === 'danger').length, 0);

  // Step 2: Spoof iPhone 16 Pro Max
  const iphone16Preset = SPOOF_PRESETS.find((p) => p.id === 'iphone_16_pro_max')!;
  cleanTags = applySpoofPresetToTags(cleanTags, iphone16Preset);
  assert.ok(
    cleanTags.some(
      (t) => t.key === 'com.apple.quicktime.model' && t.value === 'iPhone 16 Pro Max'
    )
  );

  // Step 3: Geo-spoofing NYC
  const nyc = GEO_PRESETS.find((g) => g.id === 'us_nyc')!;
  cleanTags = applyGeoTag(cleanTags, nyc.iso6709, `${nyc.country} - ${nyc.city}`);
  assert.ok(
    cleanTags.some(
      (t) =>
        t.key === 'com.apple.quicktime.location.ISO6709' &&
        t.value === '+40.7128-074.0060+010.00/'
    )
  );

  // Step 4: Fresh timestamp & SEO
  cleanTags = applyFreshTimestampTag(cleanTags, 5);
  cleanTags = applySeoMetadataTags(cleanTags, {
    title: 'How to edit viral videos',
    comment: 'Shot on iPhone 16 Pro Max',
    description: 'Tutorial for creators',
    keywords: 'tiktok,editing,iphone16promax',
  });

  // Step 5: Enable Anti-pHash & MD5 uniqueness
  const fullUniq: UniqualizationConfig = {
    modifyMd5: true,
    microCropZoom: true,
    horizontalFlip: false,
    colorShift: true,
    audioProtect: true,
    tiktokStandardize: true,
  };

  const finalScore = calculateTrustScore(cleanTags, true, fullUniq);
  assert.equal(finalScore.score, 100);
});

test('Metadata Cloner transfers selected tags from Donor video to Target video', () => {
  const donorSample = createDemoVideoBuffer('donor_iphone_16');
  const donorParsed = parseBinaryMp4Atoms(donorSample.buffer, donorSample.fileName);

  const selectedIds = donorParsed.tags.map((t) => t.id);
  const cloned = cloneDonorMetadataTags(donorParsed.tags, selectedIds);

  assert.equal(cloned.length, donorParsed.tags.length);
  assert.ok(cloned.every((t) => t.riskLevel === 'safe'));
  assert.ok(cloned.some((t) => t.value === 'iPhone 16 Pro Max'));
});

test('iPhone 17 Pro (iOS 27.2 · 4K 120fps · Build 24B115) preset injects all QuickTime, Lens, APAC Audio, and PLIST tags', () => {
  const iphone17Preset = SPOOF_PRESETS.find((p) => p.id === 'iphone_17_pro')!;
  assert.ok(iphone17Preset, 'Expected iphone_17_pro preset to exist');

  const injected = applySpoofPresetToTags([], iphone17Preset);
  assert.ok(
    injected.some((t) => t.key === 'com.apple.quicktime.model' && t.value === 'iPhone 17 Pro')
  );
  assert.ok(
    injected.some((t) => t.key === 'com.apple.quicktime.software' && t.value === '27.2')
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'com.apple.quicktime.camera.lens_model' &&
        t.value === 'iPhone 17 Pro back camera 6.765mm f/1.78'
    )
  );
  assert.ok(
    injected.some(
      (t) => t.key === 'FocalLengthIn35mmFormat' && t.value === '25'
    )
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'PLIST.ProductBuildVersion' &&
        t.value.includes('24B115')
    )
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'PLIST.CMCaptureCoreVersion' &&
        t.value.includes('3385.14.1.2')
    )
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'SegmentIdentifier' &&
        t.value === 'DDCE1D15-FC1F-4BC9-9013-317F18E015D7'
    )
  );
  assert.ok(
    injected.some(
      (t) => t.key === 'SceneIlluminance' && t.value === '3000'
    )
  );
});

test('Google Pixel 9 (4K 60fps) preset injects AndroidMake, AndroidModel, GPS, nclx BT.709, and NRT Metadata tags', () => {
  const pixel9Preset = SPOOF_PRESETS.find((p) => p.id === 'google_pixel_9')!;
  assert.ok(pixel9Preset, 'Expected google_pixel_9 preset to exist');
  assert.equal(pixel9Preset.recommendedExt, 'MP4');

  const injected = applySpoofPresetToTags([], pixel9Preset);
  assert.ok(
    injected.some((t) => t.key === 'AndroidMake' && t.value === 'Google')
  );
  assert.ok(
    injected.some((t) => t.key === 'AndroidModel' && t.value === 'Pixel 9')
  );
  assert.ok(
    injected.some((t) => t.key === 'AndroidCaptureFPS' && t.value === '60')
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'GPSCoordinates' &&
        t.value === '48 deg 23\' 2.04" N, 11 deg 25\' 36.48" E'
    )
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'ColorProfiles' &&
        t.value.includes('nclx') &&
        t.value.includes('BT.709')
    )
  );
  assert.ok(
    injected.some(
      (t) =>
        t.key === 'HandlerType' &&
        t.value.includes('NRT Metadata') &&
        t.value.includes('MetaHandle')
    )
  );
});

test('buildFfmpegCommand outputs valid FFmpeg CLI flags and buildModifiedMp4Binary changes MD5 hash', () => {
  const { fileName, buffer } = createDemoVideoBuffer('dirty_ai_premiere');
  const iphone17Preset = SPOOF_PRESETS.find((p) => p.id === 'iphone_17_pro')!;
  const tags = applySpoofPresetToTags([], iphone17Preset);
  const uniq: UniqualizationConfig = {
    modifyMd5: true,
    microCropZoom: true,
    horizontalFlip: true,
    colorShift: true,
    audioProtect: true,
    tiktokStandardize: true,
  };

  const outName = generateNativeAppleFilename('MOV', 4829);
  assert.equal(outName, 'IMG_5829.MOV');

  const { command } = buildFfmpegCommand(fileName, outName, true, tags, uniq);
  assert.ok(command.includes('-map_metadata -1 -map_chapters -1'));
  assert.ok(command.includes('crop=iw*0.985:ih*0.985'));
  assert.ok(command.includes('hflip'));
  assert.ok(command.includes('eq=brightness=0.01:contrast=1.01:saturation=1.02'));
  assert.ok(command.includes('com.apple.quicktime.model=iPhone 17 Pro'));

  const origMd5 = computeMd5Hex(buffer);
  const modifiedBytes = buildModifiedMp4Binary(buffer, true, tags, uniq, 99999);
  const newBuffer = modifiedBytes.buffer.slice(
    modifiedBytes.byteOffset,
    modifiedBytes.byteOffset + modifiedBytes.byteLength
  ) as ArrayBuffer;
  const newMd5 = computeMd5Hex(newBuffer);

  assert.notEqual(origMd5, newMd5);

  const reparsed = parseBinaryMp4Atoms(newBuffer, outName);
  assert.equal(reparsed.tags.filter((t) => t.riskLevel === 'danger').length, 0);
  assert.ok(
    reparsed.tags.some(
      (t) => t.key === 'com.apple.quicktime.model' && t.value === 'iPhone 17 Pro'
    )
  );
});

test('Munich GeoPreset, Geo-Jitter randomization, and Custom Timestamp work accurately', async () => {
  const { randomizeGeoCoords, applyCustomTimestampTag } = await import('./metadataEngine');

  const munich = GEO_PRESETS.find((g) => g.city === 'Мюнхен, Германия')!;
  assert.ok(munich, 'Expected Мюнхен, Германия preset in GEO_PRESETS');
  assert.equal(munich.lat, 48.1371);
  assert.equal(munich.lon, 11.5754);

  // Test Geo-Jitter randomization within 1-2 km radius around Munich
  const jittered = randomizeGeoCoords(munich.lat, munich.lon, munich.alt, 1.5, {
    r1: 0.5,
    r2: 0.25,
    r3: 0.8,
  });
  assert.notEqual(jittered.lat, munich.lat);
  assert.ok(jittered.distanceKm >= 1.0 && jittered.distanceKm <= 2.0);
  assert.ok(Math.abs(jittered.lat - munich.lat) < 0.03);
  assert.ok(Math.abs(jittered.lon - munich.lon) < 0.03);
  assert.ok(jittered.iso6709.startsWith('+48.'));
  assert.ok(jittered.dms.includes('48 deg'));

  const tagsWithGeo = applyGeoTag([], jittered.iso6709, 'Мюнхен Рандом');
  assert.ok(
    tagsWithGeo.some(
      (t) =>
        t.key === 'com.apple.quicktime.location.ISO6709' &&
        t.value === jittered.iso6709
    )
  );
  assert.ok(
    tagsWithGeo.some(
      (t) => t.key === 'GPSCoordinates' && t.value === jittered.dms
    )
  );

  // Test Custom Timestamp with Munich timezone (+01:00)
  const tagsWithTime = applyCustomTimestampTag(
    tagsWithGeo,
    '2026-11-07T22:22:14',
    '+01:00'
  );
  assert.ok(
    tagsWithTime.some(
      (t) =>
        t.key === 'com.apple.quicktime.creationdate' &&
        t.value === '2026:11:07 22:22:14+01:00'
    )
  );
  assert.ok(
    tagsWithTime.some(
      (t) =>
        t.key === 'creation_time' &&
        t.value === '2026-11-07T21:22:14Z'
    )
  );
});

test('Target Audience Keyword Presets and parseUploadedKeywordsPayload parse hashtags, CSV, and JSON accurately', async () => {
  const { AUDIENCE_SEO_PRESETS, parseUploadedKeywordsPayload } = await import(
    './metadataEngine'
  );

  assert.ok(AUDIENCE_SEO_PRESETS.length >= 6);
  const dachPack = AUDIENCE_SEO_PRESETS.find((p) => p.id === 'dach_germany')!;
  assert.ok(dachPack.keywords.includes('münchen'));

  // Test parsing hashtags + commas + newlines
  const parsedHashtags = parseUploadedKeywordsPayload(
    '#münchen #bayern, fypde\n#deutschland, lifestyle'
  );
  assert.equal(parsedHashtags.count, 5);
  assert.equal(
    parsedHashtags.keywords,
    'münchen, bayern, fypde, deutschland, lifestyle'
  );

  // Test parsing JSON keyword pack
  const parsedJson = parseUploadedKeywordsPayload(
    JSON.stringify({
      title: 'Munich Viral Clip',
      keywords: ['munich', 'bavaria', 'fyp'],
      description: '4K Test',
    })
  );
  assert.equal(parsedJson.count, 3);
  assert.equal(parsedJson.keywords, 'munich, bavaria, fyp');
  assert.equal(parsedJson.suggestedTitle, 'Munich Viral Clip');
});

