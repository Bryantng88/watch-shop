"use client";

import type { ReactNode } from "react";
import { ImageIcon, Pencil, X } from "lucide-react";
import { AdminButton, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminDetailPage, AdminDetailSection, AdminDetailNavigation, ADMIN_DETAIL as ui } from "@/domains/shared/ui/admin-design-contract/AdminDetail";

export type AcquisitionDetailItem = {
    id: string; productId?: string | null; linkedWatchSku?: string | null; linkedWatchTitle?: string | null;
    title: string; quantity: number; productType: "WATCH" | "WATCH_STRAP" | "WATCH_CLASP";
    sourceOrderItemId?: string | null; unitCost: number | "" | null;
    imageKey: string | null; imageUrl: string | null; aiHint: string;
};
export type AcquisitionDetail = {
    id: string; refNo?: string | null; status: string; audienceSegment: "MEN" | "WOMEN";
    vendorName?: string | null; currency: string; notes: string;
    totalAmount: number | null; paidAmount: number | null; unpaidAmount: number | null;
    items: AcquisitionDetailItem[];
};
const statusLabels: Record<string, string> = { DRAFT: "Bản nháp", POSTED: "Đã nhập kho", CANCELLED: "Đã hủy", CANCELED: "Đã hủy" };
const productLabels = { WATCH: "Đồng hồ", WATCH_STRAP: "Dây đồng hồ", WATCH_CLASP: "Khóa dây" };
function money(value: number | null | "" | undefined, currency: string) {
    return value == null || value === "" ? "—" : `${new Intl.NumberFormat("vi-VN").format(value)} ${currency}`;
}
export default function AcquisitionDetailClient({ detail, canManage, canViewFinancials, onEdit, onClose, editing = false, pending = false, actions, children }: {
    detail: AcquisitionDetail; canManage: boolean; canViewFinancials: boolean; onEdit: () => void; onClose: () => void;
    editing?: boolean; pending?: boolean; actions?: ReactNode; children?: ReactNode;
}) {
    const editable = canManage && canViewFinancials && ["DRAFT", "POSTED"].includes(detail.status);
    return <AdminDetailPage>
        <div className={ui.breadcrumb}>Mua bán <span aria-hidden="true">/</span> Phiếu nhập</div>
        <header className={ui.recordHeader}>
            <div className={ui.identityText}>
                <div className={ui.tags}><span>{statusLabels[detail.status] ?? detail.status}</span></div>
                <h1 id="acquisition-detail-title" className={ui.recordTitle}>{detail.refNo || "Phiếu nhập"}</h1>
                <p className={ui.metadata}>{detail.vendorName || "Chưa có nhà cung cấp"} · {detail.items.length} dòng sản phẩm</p>
                <details className={ui.metadata}><AdminDisclosureSummary>Mã hệ thống</AdminDisclosureSummary><span className="break-all">{detail.id}</span></details>
            </div>
            <div className={ui.actions}>
                {editing ? actions : editable && <AdminButton variant="secondary" onClick={onEdit}><Pencil size={14}/>Chỉnh thông tin</AdminButton>}
                <AdminButton variant="secondary" iconOnly aria-label="Đóng phiếu nhập" disabled={pending} onClick={onClose}><X size={16}/></AdminButton>
            </div>
        </header>
        <AdminDetailNavigation entries={[{href:"#acquisition-items",label:"Sản phẩm"},{href:"#acquisition-notes",label:"Ghi chú"},...(canViewFinancials?[{href:"#acquisition-payment",label:"Thanh toán"}]:[])]}/>
        <div className={ui.layout}>
            <div className={ui.column}>
                {editing ? children : <>
                    <AdminDetailSection id="acquisition-items" title="Sản phẩm" description={`${detail.items.length} dòng trong phiếu nhập`}>
                        <div className={ui.itemHead}><span>Sản phẩm</span><span className="text-right">Số lượng</span><span className="text-right">{canViewFinancials ? "Thành tiền" : ""}</span></div>
                        {detail.items.map(item => <div key={item.id} className={ui.itemRow}>
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50 text-slate-400">
                                    {item.imageUrl || item.imageKey ? <img src={item.imageUrl || `/api/media/sign?key=${encodeURIComponent(item.imageKey!)}`} alt={item.title} className="h-full w-full object-cover"/> : <ImageIcon size={18}/>}
                                </div>
                                <div className="min-w-0"><p className={ui.itemName}>{item.title}</p><p className={ui.metadata}>{productLabels[item.productType]}{item.linkedWatchSku ? ` · ${item.linkedWatchSku}` : ""}</p></div>
                            </div>
                            <div className="text-right tabular-nums">{item.quantity}</div>
                            <div className="text-right tabular-nums">{canViewFinancials && <><span>{money(item.unitCost == null || item.unitCost === "" ? null : item.unitCost * item.quantity, detail.currency)}</span><p className={ui.metadata}>{money(item.unitCost, detail.currency)} / sản phẩm</p></>}</div>
                        </div>)}
                    </AdminDetailSection>
                    <AdminDetailSection id="acquisition-notes" title="Ghi chú"><p className={ui.note}>{detail.notes || "Chưa có ghi chú."}</p></AdminDetailSection>
                </>}
            </div>
            <aside className={ui.sidebar}>
                {canViewFinancials && <AdminDetailSection id="acquisition-payment" title="Thanh toán" description="Số tiền đã ghi nhận trên phiếu">
                    <dl className={ui.moneyRows}><div className={ui.moneyRow}><dt>Tổng phiếu</dt><dd>{money(detail.totalAmount, detail.currency)}</dd></div><div className={ui.moneyRow}><dt>Đã thanh toán</dt><dd>{money(detail.paidAmount, detail.currency)}</dd></div></dl>
                    <div className={`${ui.focus} mt-4`}><p className={ui.focusLabel}>Còn phải trả</p><div className={ui.focusValue}>{money(detail.unpaidAmount, detail.currency)}</div></div>
                </AdminDetailSection>}
                <AdminDetailSection title="Thông tin phiếu"><dl className={ui.moneyRows}><div><dt className={ui.metadata}>Nhà cung cấp</dt><dd>{detail.vendorName || "—"}</dd></div><div><dt className={ui.metadata}>Trạng thái</dt><dd>{statusLabels[detail.status] ?? detail.status}</dd></div></dl></AdminDetailSection>
            </aside>
        </div>
    </AdminDetailPage>;
}
