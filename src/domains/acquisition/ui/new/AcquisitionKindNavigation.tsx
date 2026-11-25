"use client";
import { useRouter } from "next/navigation";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";

export function AcquisitionKindNavigation({ current, canSwitch, dirty = false }: {current:"watches"|"accessories";canSwitch:boolean;dirty?:boolean}) {
  const router=useRouter(), dialog=useAppDialog();
  if(!canSwitch)return null;
  return <nav aria-label="Loại sản phẩm nhập" className="flex flex-wrap items-center gap-1">
    {([{key:"watches",label:"Đồng hồ"},{key:"accessories",label:"Phụ kiện"}] as const).map(item=>
      <AdminLinkAction key={item.key} variant="quiet" density="compact" href={`/admin/acquisitions/${item.key}/new`} aria-current={current===item.key?"page":undefined}
        onClick={async event=>{if(current===item.key){event.preventDefault();return;}if(dirty){event.preventDefault();const accepted=await dialog.confirm({title:"Đổi loại sản phẩm?",message:"Thông tin chưa lưu trong phiếu hiện tại sẽ không được chuyển sang form mới.",confirmText:"Đổi loại",cancelText:"Ở lại"});if(accepted)router.push(`/admin/acquisitions/${item.key}/new`);}}}>
        <span className={current===item.key?"border-b-2 border-slate-900 pb-1 font-semibold text-slate-950":"pb-1 text-slate-500"}>{item.label}</span>
      </AdminLinkAction>)}
  </nav>;
}
