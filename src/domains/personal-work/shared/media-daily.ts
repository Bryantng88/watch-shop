import { z } from "zod";
const id=z.string().min(1).max(100).regex(/^[\w-]+$/);
export const MEDIA_DAILY_PARTS={profile:"Thông tin/spec",content:"Content",image:"Hình ảnh",cover:"Cover storefront"} as const;
export const mediaDaySchema=z.string().regex(/^20\d\d-\d{2}-\d{2}$/).refine(day=>{const date=new Date(day+'T12:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===day;},"Ngày không hợp lệ.");
export const mediaDailyRequestSchema=z.object({requestKey:z.string().uuid(),productId:id,assigneeUserId:id,day:mediaDaySchema,part:z.enum(["profile","content","image","cover"]),request:z.string().trim().min(1).max(300)}).strict();
export type MediaDailyRequest=z.infer<typeof mediaDailyRequestSchema>;
export function mediaDayToday(now=new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
const mediaContextSchema=z.object({source:z.literal("WATCH_MEDIA_DAILY"),productId:id,watchTitle:z.string().max(500),sku:z.string().max(150).nullable(),part:z.enum(["profile","content","image","cover"]),request:z.string().max(300)}).strict();
export function mediaChecklistContext(note: string|null|undefined) {
  try {const parsed=mediaContextSchema.safeParse(JSON.parse(note||""));if(!parsed.success)return undefined;const value=parsed.data;return {label:value.watchTitle,secondary:value.sku,href:`/admin/watches/${encodeURIComponent(value.productId)}/edit?mode=media&focus=${value.part==='profile'?'basic':value.part}`,request:value.request};}catch{return undefined;}
}
