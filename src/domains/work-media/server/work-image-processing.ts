import sharp from "sharp";
import { WORK_IMAGE_MAX_BYTES } from "../shared/work-media";
import { WorkMediaError } from "../shared/work-media-error";
export async function prepareWorkImage(bytes: Uint8Array, mimeType: string) {
  if (!bytes.length || bytes.length > WORK_IMAGE_MAX_BYTES || !["image/jpeg","image/png","image/webp"].includes(mimeType)) throw new WorkMediaError("Chọn ảnh JPEG, PNG hoặc WebP tối đa 10 MB.");
  const input = sharp(bytes,{limitInputPixels:50_000_000,failOn:"error"});
  const meta = await input.metadata();
  if (!meta.format || !["jpeg","png","webp"].includes(meta.format) || (meta.pages ?? 1)>1) throw new WorkMediaError("Chỉ nhận ảnh tĩnh JPEG, PNG hoặc WebP.");
  // Rotation applies EXIF orientation; WebP output deliberately excludes EXIF/GPS.
  const output = await input.rotate().resize({width:2048,height:2048,fit:"inside",withoutEnlargement:true}).webp({quality:85,effort:3}).toBuffer();
  if (output.length > 5*1024*1024) throw new WorkMediaError("Ảnh sau xử lý quá lớn.");
  return output;
}
