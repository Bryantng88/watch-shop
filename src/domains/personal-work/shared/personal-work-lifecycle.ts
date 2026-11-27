import { isContinuousWork } from "./continuous-work";

export function personalWorkTransition(current:{status:string;workTypeId:string|null}, input:{status?:string;updateBody?:string|null;[key:string]:unknown},owner:boolean){
  if(input.restoreCancelled&&current.status!=="CANCELLED"){if(current.status==="DONE")throw Error("Không khôi phục việc hoàn thành qua thao tác này.");if(!owner)throw Error("Chỉ chủ sở hữu được mở lại công việc.");return {cancelling:false,restoring:false,duplicate:true};}
  const cancelling=input.status==="CANCELLED",restoring=current.status==="CANCELLED"&&!cancelling;
  if(!cancelling&&!restoring)return {cancelling:false,restoring:false,duplicate:false};
  if(!owner)throw Error("Chỉ chủ sở hữu được hủy hoặc mở lại công việc.");
  const restoreStatuses=isContinuousWork(current.workTypeId)?["IN_PROGRESS"]:current.workTypeId==="EVENT"?["TODO"]:["TODO","IN_PROGRESS"];
  if(restoring&&(!input.status||!restoreStatuses.includes(input.status)))throw Error("Công việc đã hủy chỉ được xem hoặc mở lại.");
  const allowed=new Set(cancelling?["id","status","updateBody","confirmRunning"]:["id","status","dueAt","scheduledEndAt","estimatedDays","updateBody","restoreCancelled"]);
  if(Object.entries(input).some(([key,value])=>value!==undefined&&!allowed.has(key)))throw Error("Không chỉnh nội dung trong thao tác hủy hoặc mở lại.");
  if(cancelling&&current.status==="DONE")throw Error("Không hủy việc đã hoàn thành.");
  if(cancelling&&!input.updateBody?.trim())throw Error("Vui lòng nhập lý do hủy công việc.");
  if((input.updateBody?.length??0)>2000)throw Error("Lý do tối đa 2000 ký tự.");
  return {cancelling,restoring,duplicate:cancelling&&current.status==="CANCELLED"};
}
