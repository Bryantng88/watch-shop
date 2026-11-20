import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AdminButton, AdminButtonProvider, AdminAnchorAction, AdminDisclosureSummary } from "../../src/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminLinkAction } from "../../src/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { AsyncActionButton } from "../../src/domains/shared/ui/mutation/AsyncActionButton";
import { AdminRowActionMenu } from "../../src/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
function App() {
  const [count, setCount] = useState(0), [pending, setPending] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return <><AdminButtonProvider><main style={{fontFamily:"Arial",padding:24,maxWidth:900}}>
    <h1>Nút dùng chung trong admin</h1><p>Độ nổi nhẹ, thao tác rõ ràng.</p>
    <form onSubmit={e=>{e.preventDefault();setCount(v=>v+1)}} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <AdminButton data-testid="primary" variant="primary" ref={ref}>Lưu thay đổi</AdminButton>
      <AdminButton data-testid="secondary" type="button" onClick={()=>ref.current?.focus()}>Xem trước</AdminButton>
      <AdminButton data-testid="danger" variant="danger" type="button">Xóa</AdminButton>
      <AdminButton data-testid="disabled" variant="primary" disabled type="button" onClick={()=>setCount(999)}>Đã khóa</AdminButton>
      <AsyncActionButton data-testid="pending" variant="primary" type="button" pending={pending} pendingLabel="Đang lưu…" onClick={()=>{setCount(v=>v+1);setPending(true)}}>Xuất bản</AsyncActionButton>
    </form>
    <p data-testid="count">{count}</p>
    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginTop:16}}>
      <AdminButton data-testid="compact" density="compact" type="button">Phân loại lỗi</AdminButton>
      <AdminButton data-testid="svg-icon" type="button" aria-label="Làm mới" style={{width:40,height:40}}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8a6 6 0 1 0 2-4" /></svg></AdminButton>
      <AdminButton data-testid="icon" density="compact" iconOnly type="button" aria-label="Thêm">+</AdminButton>
      <AdminRowActionMenu label="Xử lý Media" status="Chưa xử lý" actions={[{key:"start",label:"Bắt đầu xử lý",onSelect:()=>setCount(v=>v+1)},{key:"locked",label:"Bị khóa",disabled:true,onSelect:()=>setCount(999)}]} />
      <AdminAnchorAction data-testid="anchor" href="#preview">Mở website</AdminAnchorAction>
      <AdminLinkAction data-testid="next-link" href="/admin/users">Danh bạ</AdminLinkAction>
    </div>
    <AdminButton data-testid="contextual" type="button" variant="contextual" aria-pressed style={{display:"block",width:180,padding:6,background:"#eff6ff",border:0,textAlign:"left",marginTop:16}}>Kiểm tra <span>39</span></AdminButton>
    <details><AdminDisclosureSummary>Ghi chú nhỏ</AdminDisclosureSummary><p>Thông tin ảnh</p></details>
    {createPortal(<AdminButton data-testid="portal" type="button">Nút trong portal</AdminButton>,document.body)}
  </main></AdminButtonProvider><AdminButton data-testid="public" style={{background:"pink"}}>Storefront giữ UI riêng</AdminButton></>;
}
createRoot(document.getElementById("root")!).render(<App />);
