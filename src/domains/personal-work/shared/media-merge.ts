import { z } from "zod";
export class MediaMergeError extends Error {}
export const mediaMergeSelection = z.object({ ids:z.array(z.string().min(1).max(160)).min(2).max(30) }).strict()
  .refine(input=>new Set(input.ids).size===input.ids.length,"Không chọn trùng công việc.");
export const mediaMergeCommand = z.object({ids:z.array(z.string().min(1).max(160)).min(2).max(30),title:z.string().trim().min(1).max(300),revision:z.string().regex(/^[a-f0-9]{64}$/),requestKey:z.string().uuid()}).strict();
export type MediaMergePreview = {revision:string; suggestedTitle:string; sources:{id:string;title:string;total:number;done:number}[];total:number;done:number;warnings:string[]};
export type MediaMergeCandidate = {id:string;title:string;ownerId:string|null;assigneeId?:string|null;status:string;locked:boolean;categoryId:string|null;workType:string|null;shares:string[];entries:{id:string;isDone:boolean;media:boolean}[];calendar:boolean;running:boolean;merged:boolean};
export function validateMediaMerge(rows:MediaMergeCandidate[],ownerId:string) {
  if(rows.length<2||rows.length>30)throw new MediaMergeError("Chọn từ 2 đến 30 công việc media.");
  for(const row of rows){
    if(row.ownerId!==ownerId)throw new MediaMergeError("Chỉ gộp các việc do bạn sở hữu; không gộp việc được chia sẻ hoặc khác người phụ trách.");
    if(row.assigneeId&&row.assigneeId!==ownerId)throw new MediaMergeError("Người thực hiện khác chủ sở hữu. Hãy thống nhất người phụ trách trước khi gộp.");
    if(row.merged||!["TODO","IN_PROGRESS"].includes(row.status)||row.locked)throw new MediaMergeError("Chỉ gộp công việc chưa hoàn tất, chưa hủy và chưa bị gộp.");
    if(!row.entries.length||row.entries.some(e=>!e.media))throw new MediaMergeError(`“${row.title}” không thuần media Watch. Cùng nhóm WatchShop chưa đủ để gộp; mọi đầu việc phải có ngữ cảnh media.`);
    if(row.workType==="CONTINUOUS")throw new MediaMergeError("Việc duy trì không gộp như công việc có điểm kết thúc.");
    if(row.workType==="EVENT")throw new MediaMergeError("Không gộp sự kiện.");
    if(row.calendar)throw new MediaMergeError("Có việc đã liên kết Google Calendar. Hãy bỏ liên kết lịch trước khi gộp để tránh lịch cũ bị trùng.");
    if(row.running)throw new MediaMergeError("Có việc đang chờ hoặc đang chạy Codex. Hãy xử lý tác vụ nền trước khi gộp.");
    if(row.categoryId!==rows[0].categoryId||row.workType!==rows[0].workType)throw new MediaMergeError("Các công việc khác nhóm hoặc khác loại xử lý; không thể gộp.");
    if([...row.shares].sort().join("|")!==[...rows[0].shares].sort().join("|"))throw new MediaMergeError("Quyền chia sẻ toàn việc khác nhau. Hãy thống nhất người xem/quyền trước khi gộp; hệ thống không tự cấp thêm quyền.");
  }
  const entries=rows.flatMap(r=>r.entries);
  if(entries.length>500)throw new MediaMergeError("Tối đa 500 đầu việc trong một lần gộp.");
  if(entries.every(e=>e.isDone))throw new MediaMergeError("Không có đầu việc media đang mở để gộp.");
}
