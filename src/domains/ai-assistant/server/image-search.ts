import sharp from 'sharp';
import { AssistantError } from './access';
import { MAX_BEN_IMAGE_BYTES, MAX_BEN_IMAGE_BASE64, MAX_BEN_NORMALIZED_IMAGE_BYTES } from '../image-search';

export async function normalizeBenImage(base64: string): Promise<string> {
  try {
    if (base64.length > MAX_BEN_IMAGE_BASE64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw Error('encoding');
    const input = Buffer.from(base64, 'base64');
    if (input.length > MAX_BEN_IMAGE_BYTES || input.toString('base64') !== base64)
      throw Error('size or encoding');
    const image = sharp(input, { limitInputPixels: 25_000_000, failOn: 'error' });
    const info = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(info.format || '') || (info.pages ?? 1) > 1)
      throw Error('format');
    const jpeg = await image.rotate().resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 78 }).toBuffer();
    if (jpeg.length > MAX_BEN_NORMALIZED_IMAGE_BYTES) throw Error('output size');
    return jpeg.toString('base64');
  } catch {
    throw new AssistantError('Ảnh chưa hợp lệ. Hãy chọn ảnh JPG, PNG hoặc WebP tĩnh, tối đa 4 MB.');
  }
}
