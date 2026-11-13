import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { Prisma } from "@prisma/client";
import { prisma, type DB, type Tx } from "@/server/db/client";
import { assistantActor, AssistantError } from "@/domains/ai-assistant/server/access";
import { hasAssistantPermission } from "@/domains/ai-assistant/capabilities";
import { mediaStorage } from "@/domains/media/storage";
import { quickNameRequestSchema, quickNameResultSchema, quickNameTitle, isQuickNameImageKey, type QuickNameLine, type QuickNameResult } from "../shared/quick-name";

const purpose = "ACQUISITION_QUICK_NAME";
type PreviewState = { purpose: typeof purpose; signature: string; line: QuickNameLine; imageBase64?: string; imageVersion?: string; result?: QuickNameResult };
const json = (value: unknown) => JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const previewState = (value: Prisma.JsonValue) => value as unknown as PreviewState;
async function actor(db: DB, userId: string) {
  const user = await assistantActor(db, userId);
  if (!hasAssistantPermission(user, "WATCH_ACQUISITION_CREATE")) throw new AssistantError("Không còn quyền tạo phiếu nhập đồng hồ.", 403);
  return user;
}
async function transaction<T>(work: (tx: Tx) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(work, { isolationLevel: "Serializable", timeout: 15000 }); }
    catch (error) {
      if (attempt < 3 && error instanceof Prisma.PrismaClientKnownRequestError && ["P2034", "P2002"].includes(error.code)) continue;
      throw error;
    }
  }
}
async function expireQuickNames(db: DB, ownerId?: string) {
  const expired=await db.customerAssistantConversation.findMany({where:{...(ownerId?{ownerId}:{}),state:{path:["purpose"],equals:purpose},OR:[{status:{in:["QUEUED","RUNNING"]},createdAt:{lt:new Date(Date.now()-15*60000)}},{status:"RUNNING",leaseExpiresAt:{lt:new Date()}}]},take:24});
  for(const old of expired)await db.customerAssistantConversation.updateMany({where:{id:old.id,status:old.status,leaseToken:old.leaseToken,updatedAt:old.updatedAt},data:{status:"FAILED",state:json({...previewState(old.state),imageBase64:undefined}),leaseToken:null,leaseExpiresAt:null,errorCode:"PREVIEW_TIMEOUT"}});
}
async function imageForPreview(line: QuickNameLine) {
  if (!isQuickNameImageKey(line.imageKey, line.audienceSegment)) throw new AssistantError("Chỉ nhận ảnh trong thư mục NAS inline đúng nhóm đồng hồ.");
  const info = await mediaStorage.stat(line.imageKey);
  if (!info || !info.sizeBytes || info.sizeBytes > 20 * 1024 * 1024) throw new AssistantError("Ảnh NAS không tồn tại hoặc vượt 20 MB.");
  const source = await mediaStorage.read(line.imageKey);
  if (source.bytes.length > 20 * 1024 * 1024) throw new AssistantError("Ảnh NAS vượt 20 MB.");
  const image = sharp(Buffer.from(source.bytes), { limitInputPixels: 25_000_000, failOn: "error" });
  const metadata = await image.metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format || "") || (metadata.pages ?? 1) > 1) throw new AssistantError("Chỉ nhận ảnh JPG, PNG, WebP tĩnh.");
  const bytes = await image.rotate().resize(1280, 1280, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#fff" }).jpeg({ quality: 78 }).toBuffer();
  if (bytes.length > 512 * 1024) throw new AssistantError("Ảnh sau xử lý vẫn quá lớn.");
  return {base64:bytes.toString("base64"), version:JSON.stringify([source.etag,source.sizeBytes])};
}
export async function requestQuickNames(userId: string, raw: unknown) {
  await actor(prisma, userId);
  const input = quickNameRequestSchema.parse(raw);
  await expireQuickNames(prisma,userId);
  const prefix = `acquisition-quick:${input.requestKey}:`;
  const signature = createHash("sha256").update(JSON.stringify(input.lines)).digest("hex");
  // Retry before reading media: a lost HTTP response never enqueues another batch.
  const prior = await prisma.customerAssistantConversation.findMany({where: {ownerId:userId, firstRequestKey:{startsWith:prefix}}, select:{id:true,state:true}});
  if (prior.length) {
    if (prior.length !== input.lines.length || prior.some(row => previewState(row.state).signature !== signature)) throw new AssistantError("Mã yêu cầu đã được dùng cho dữ liệu khác.",409);
    return {ids:prior.map(row=>row.id)};
  }
  if (await prisma.customerAssistantConversation.count({where:{ownerId:userId,status:{in:["QUEUED","RUNNING"]}}}) + input.lines.length > 12) throw new AssistantError("Tối đa 12 ảnh đang chờ. Hãy chờ kết quả trước khi gửi thêm.",429);
  if (await prisma.customerAssistantConversation.count({where:{ownerId:userId,createdAt:{gte:new Date(Date.now()-3600000)},state:{path:["purpose"],equals:purpose}}}) + input.lines.length > 60) throw new AssistantError("Đã đạt giới hạn yêu cầu Codex. Hãy thử lại sau.",429);
  const images: {base64:string;version:string}[] = [];
  for (const line of input.lines) images.push(await imageForPreview(line));
  return transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`acquisition-quick-name:${userId}`}, 0))`;
    await actor(tx, userId);
    const existing = await tx.customerAssistantConversation.findMany({where:{firstRequestKey:{startsWith:prefix}}, select:{id:true,ownerId:true,state:true}});
    if (existing.length) {
      if (existing.length !== input.lines.length || existing.some(row=>row.ownerId!==userId || previewState(row.state).signature!==signature)) throw new AssistantError("Mã yêu cầu không hợp lệ.",409);
      return {ids:existing.map(row=>row.id)};
    }
    const active = await tx.customerAssistantConversation.count({where:{ownerId:userId,status:{in:["QUEUED","RUNNING"]}}});
    const recent = await tx.customerAssistantConversation.count({where:{ownerId:userId,createdAt:{gte:new Date(Date.now()-3600000)},state:{path:["purpose"],equals:purpose}}});
    if (active + input.lines.length > 12 || recent + input.lines.length > 60) throw new AssistantError("Đã đạt giới hạn yêu cầu Codex. Hãy thử lại sau.",429);
    const ids: string[] = [];
    for (const [index,line] of input.lines.entries()) {
      const row = await tx.customerAssistantConversation.create({data:{ownerId:userId,firstRequestKey:prefix+line.id,state:json({purpose,signature,line,imageBase64:images[index].base64,imageVersion:images[index].version})},select:{id:true}});
      ids.push(row.id);
    }
    return {ids};
  });
}
export async function readQuickNames(userId: string, ids: string[]) {
  await actor(prisma,userId);
  await expireQuickNames(prisma,userId);
  const rows = await prisma.$queryRaw<{id:string;status:string;createdAt:Date;state:Prisma.JsonValue}[]>`
    SELECT id, status, "createdAt", state - 'imageBase64' AS state
    FROM "CustomerAssistantConversation"
    WHERE "ownerId" = ${userId} AND id IN (${Prisma.join(ids)}) AND state->>'purpose' = ${purpose}
  `;
  if (rows.length !== ids.length) throw new AssistantError("Không có quyền xem lượt nhận diện này.",403);
  return {items:rows.map(row=>{
    const s=previewState(row.state);
    const expired=["QUEUED","RUNNING"].includes(row.status) && row.createdAt.getTime()<Date.now()-15*60000;
    return {id:row.id,line:s.line,status:expired?"FAILED":row.status,title:s.result?quickNameTitle(s.result):null,notes:s.result?.notes||[],error:expired||row.status==="FAILED"?"Chưa nhận diện được ảnh. Bạn có thể nhập tên hoặc thử lại.":null};
  })};
}
/** Uses the existing authenticated, read-only customer worker. No product/acquisition writes. */
export async function quickNameWorker(operation: string, body: Record<string, unknown>) {
  return transaction(async tx=>{
    if(operation==="claim") {
      // Do not let a batch jump ahead of older Ben conversations.
      await expireQuickNames(tx);
      const row=await tx.customerAssistantConversation.findFirst({where:{status:"QUEUED"},orderBy:{createdAt:"asc"}});
      if(!row || previewState(row.state).purpose!==purpose)return {run:null};
      const s=previewState(row.state);
      try {await actor(tx,row.ownerId);} catch {
        await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:"FAILED",state:json({...s,imageBase64:undefined}),errorCode:"REQUESTER_UNAUTHORIZED"}});return {run:null};
      }
      const leaseToken=randomUUID();
      const locked=await tx.customerAssistantConversation.updateMany({where:{id:row.id,status:"QUEUED"},data:{status:"RUNNING",leaseToken,leaseExpiresAt:new Date(Date.now()+120000)}});
      return {run:locked.count?{id:row.id,kind:"acquisition-quick-name",leaseToken,imageBase64:s.imageBase64,text:JSON.stringify({quickInput:s.line.quickInput,aiHint:s.line.aiHint})}:null};
    }
    const id=String(body.id||""),leaseToken=String(body.leaseToken||"");
    const row=await tx.customerAssistantConversation.findFirst({where:{id,leaseToken,state:{path:["purpose"],equals:purpose}}});
    if(!row)throw new AssistantError("Lượt nhận diện không hợp lệ.",409);
    await actor(tx,row.ownerId);
    if(operation==="finish" && ["APPLIED","FAILED"].includes(row.status))return {accepted:true};
    if(row.status!=="RUNNING" || !row.leaseExpiresAt || row.leaseExpiresAt.getTime()<=Date.now())throw new AssistantError("Lượt nhận diện đã hết hiệu lực.",409);
    if(operation==="heartbeat") {
      await tx.customerAssistantConversation.update({where:{id},data:{leaseExpiresAt:new Date(Date.now()+120000)}});return {active:true};
    }
    if(operation!=="finish")throw new AssistantError("Nhận diện không hỗ trợ thao tác này.");
    const s=previewState(row.state);
    let result=body.failed===true?undefined:quickNameResultSchema.parse(body.acquisitionPreview);
    if(result){const now=await mediaStorage.stat(s.line.imageKey);if(!now || JSON.stringify([now.etag,now.sizeBytes])!==s.imageVersion)result=undefined;}
    await tx.customerAssistantConversation.update({where:{id},data:{status:result?"APPLIED":"FAILED",state:json({...s,imageBase64:undefined,result}),leaseExpiresAt:null,errorCode:result?null:"PREVIEW_FAILED"}});
    return {accepted:true};
  });
}
