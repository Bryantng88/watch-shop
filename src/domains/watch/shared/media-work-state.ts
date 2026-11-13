import type { WatchFormValues } from "../client/form/watch-form.types";
export type MediaWorkPart = "profile" | "content" | "image" | "cover";
export const MEDIA_PARTS: MediaWorkPart[] = ["profile","content","image","cover"];
function sorted(value: unknown): unknown {
  if(Array.isArray(value))return value.map(sorted);
  if(value && typeof value==="object")return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,sorted(item)]));
  return value;
}
export function mediaPartSnapshot(values: WatchFormValues, part: MediaWorkPart) {
  const key=(image: WatchFormValues["media"]["coverImage"])=>image?.key || image?.url || "";
  const value=part==="profile"?{basic:values.basic,spec:values.spec,sku:values.header.sku}
    :part==="content"?values.content
    :part==="cover"?key(values.media.coverImage)
    :{gallery:values.media.galleryImages.map(key),pool:values.media.poolImages.map(key)};
  return JSON.stringify(sorted(value));
}
export function effectiveMediaParts(done:Record<MediaWorkPart,boolean>, current:WatchFormValues, saved:WatchFormValues) {
  return Object.fromEntries(MEDIA_PARTS.map(part=>[part,done[part] && mediaPartSnapshot(current,part)===mediaPartSnapshot(saved,part)])) as Record<MediaWorkPart,boolean>;
}
export function mergeWatchSaveReceipt(current:WatchFormValues,submitted:WatchFormValues,receipt:{storefrontSlug?:string;hookText?:string|null;media?:{poolImages:unknown[];galleryImages:unknown[]};contentReviewStatus?:unknown;imageReviewStatus?:unknown}) {
  const saved:WatchFormValues={...submitted,basic:{...submitted.basic,slug:receipt.storefrontSlug||submitted.basic.slug},content:{...submitted.content,hookText:receipt.hookText??submitted.content.hookText},
    contentReviewStatus:(receipt.contentReviewStatus as WatchFormValues['contentReviewStatus'])??submitted.contentReviewStatus,imageReviewStatus:(receipt.imageReviewStatus as WatchFormValues['imageReviewStatus'])??submitted.imageReviewStatus,
    media:{...submitted.media,poolImages:(receipt.media?.poolImages as WatchFormValues['media']['poolImages'])??submitted.media.poolImages,galleryImages:(receipt.media?.galleryImages as WatchFormValues['media']['galleryImages'])??submitted.media.galleryImages,imageCount:receipt.media?.galleryImages.length??submitted.media.imageCount}};
  const unchanged=(part:MediaWorkPart)=>mediaPartSnapshot(current,part)===mediaPartSnapshot(submitted,part);
  return {saved,current:{...current,basic:unchanged('profile')?saved.basic:current.basic,content:unchanged('content')?saved.content:current.content,contentReviewStatus:saved.contentReviewStatus,imageReviewStatus:saved.imageReviewStatus,
    media:{...current.media,...(unchanged('image')?{galleryImages:saved.media.galleryImages,poolImages:saved.media.poolImages,imageCount:saved.media.imageCount}:{})}}};
}
