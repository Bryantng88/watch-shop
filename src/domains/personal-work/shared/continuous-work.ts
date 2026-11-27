export const CONTINUOUS_WORK_TYPE = "CONTINUOUS";
export function isContinuousWork(type: unknown) { return typeof type === "string" && type.toUpperCase().trim() === CONTINUOUS_WORK_TYPE; }
export function assertContinuousSchedule(input:{dueAt?:string|null;scheduledEndAt?:string|null;reminderMinutes?:number|null;estimatedDays?:number;tags?:string[]}){
  if(input.dueAt||input.scheduledEndAt||input.reminderMinutes!=null||input.estimatedDays!==undefined&&input.estimatedDays!==1)throw Error("Việc duy trì không có hạn chót, thời lượng hay nhắc lịch theo ngày.");
  if(input.tags?.some(tag=>tag.trim().toLowerCase()==="codex"))throw Error("Việc duy trì không tự gửi cho Codex; hãy tạo một việc cụ thể khi cần xử lý.");
}
export function assertContinuousUpdate(currentType:string|null,input:{workType?:string|null;status?:string;progressPercent?:number;progressMode?:string;dueAt?:string|null;scheduledEndAt?:string|null;reminderMinutes?:number|null;estimatedDays?:number;tags?:string[]},owner:boolean){
  const continuous=isContinuousWork(currentType);
  if(input.workType!==undefined&&isContinuousWork(input.workType)!==continuous)throw Error("Không đổi qua lại giữa việc có điểm kết thúc và việc duy trì; hãy tạo mục mới để giữ đúng lịch sử.");
  if(!continuous)return;
  assertContinuousSchedule(input);
  if(input.status&&!["IN_PROGRESS","CANCELLED"].includes(input.status)||input.progressPercent!==undefined||input.progressMode!==undefined)throw Error("Việc duy trì không có thao tác hoàn thành. Chỉ ghi nhận cập nhật hoặc dừng duy trì.");
  if(input.status&&!owner)throw Error("Chỉ chủ sở hữu được dừng hoặc tiếp tục duy trì.");
}
