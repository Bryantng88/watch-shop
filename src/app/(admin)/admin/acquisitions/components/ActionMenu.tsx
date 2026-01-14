"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ==============================
   TYPES
============================== */

type Rect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type EntityType =
    | "order"
    | "orders"
    | "acquisition"
    | "acquisitions"
    | "invoice"
    | "invoices"
    | "shipment"
    | "shipments";

type ActionConfig = {
    postUrl?: string;
    editUrl?: string;
    viewUrl?: string;
    cancelUrl?: string;

    canPost: boolean;
    canEdit: boolean;
    canCancel: boolean;
};

type Props = {
    entityId: string;
    entityType: EntityType;
    status: string; // DRAFT | POSTED | RESERVED | CANCELLED | READY | SHIPPED | DELIVERED | ...
    mode?: "view" | "edit";
    className?: string;
    size?: "sm" | "md";

    /** optional: gọi khi action xong (ngoài router.refresh) */
    onDone?: () => void;
};

const DEFAULT_ACTIONS: ActionConfig = {
    canEdit: false,
    canPost: false,
    canCancel: false,
};

/* ==============================
   HELPERS
============================== */

// normalize số nhiều → số ít
function normalizeEntityType(
    t: EntityType
): "order" | "acquisition" | "invoice" | "shipment" {
    if (t === "orders") return "order";
    if (t === "acquisitions") return "acquisition";
    if (t === "invoices") return "invoice";
    if (t === "shipments") return "shipment";
    return t;
}

function getAdminDetailUrl(entityTypeRaw: EntityType, entityId: string) {
    const t = normalizeEntityType(entityTypeRaw);
    return `/admin/${t}s/${entityId}`;
}

function getActions(entityTypeRaw: EntityType, entityId: string, status: string): ActionConfig {
    const entityType = normalizeEntityType(entityTypeRaw);

    switch (entityType) {
        case "acquisition":
            return {
                postUrl: `/api/admin/acquisitions/${entityId}/post`,
                editUrl: `/admin/acquisitions/${entityId}/edit`,
                cancelUrl: `/api/admin/acquisitions/${entityId}/cancel`,
                viewUrl: getAdminDetailUrl(entityTypeRaw, entityId),

                canPost: status !== "POSTED" && status !== "CANCELLED",
                canEdit: status !== "POSTED" && status !== "CANCELLED",
                canCancel: status !== "CANCELLED",
            };

        case "order":
            return {
                postUrl: `/api/admin/orders/${entityId}/post`,
                cancelUrl: `/api/admin/orders/${entityId}/cancel`,
                viewUrl: getAdminDetailUrl(entityTypeRaw, entityId),

                // rule của bạn
                canPost: status === "DRAFT" || status === "RESERVED",
                canEdit: false,
                canCancel: status === "DRAFT" || status === "RESERVED",
            };

        case "invoice":
            return {
                postUrl: `/api/admin/invoices/${entityId}/post`,
                editUrl: `/admin/invoices/${entityId}/edit`,
                cancelUrl: `/api/admin/invoices/${entityId}/cancel`,
                viewUrl: getAdminDetailUrl(entityTypeRaw, entityId),

                canPost: status === "DRAFT",
                canEdit: status === "DRAFT",
                canCancel: status === "DRAFT",
            };

        case "shipment":
            return {
                // Single-ready (nếu bạn chưa có, tạo tương tự bulk-ready)
                postUrl: `/api/admin/shipments/${entityId}/ready`,
                viewUrl: getAdminDetailUrl(entityTypeRaw, entityId),

                // Shipment không có editUrl/cancelUrl trong flow bạn mô tả (tuỳ bạn bật)
                canPost: status === "DRAFT",
                canEdit: false,
                canCancel: false,
            };

        default:
            return DEFAULT_ACTIONS;
    }
}

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

async function postJson(url: string, body?: any) {
    const res = await fetch(url, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed: ${res.status}`);
    }
    return res;
}

/* ==============================
   COMPONENT
============================== */

export default function ActionMenuPopover({
    entityId,
    entityType,
    status,
    mode = "edit",
    className,
    size = "md",
    onDone,
}: Props) {
    const router = useRouter();

    const btnRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    // ===== Shipment modals
    const [shipModalOpen, setShipModalOpen] = useState(false);
    const [deliverModalOpen, setDeliverModalOpen] = useState(false);
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const actions = useMemo(
        () => getActions(entityType, entityId, status) ?? DEFAULT_ACTIONS,
        [entityType, entityId, status]
    );

    const t = normalizeEntityType(entityType);
    const viewUrl = actions.viewUrl ?? getAdminDetailUrl(entityType, entityId);

    const canPost = mode === "edit" && actions.canPost;
    const canEdit = mode === "edit" && actions.canEdit;
    const canCancel = mode === "edit" && actions.canCancel;

    // ===== Shipment status helpers
    const isShipment = t === "shipment";
    const canMarkShipped = mode === "edit" && isShipment && status === "READY";
    const canMarkDelivered = mode === "edit" && isShipment && status === "SHIPPED";

    /* ==========================
       POSITIONING
    ========================== */

    const measure = () => {
        const el = btnRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const menuW = 220; // nhỉnh hơn chút vì thêm actions shipment
        const margin = 8;

        let left = r.right - menuW;
        left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin));

        let top = r.bottom + 6;

        const estimatedH = 44 * 5; // rough height (tối đa ~5 dòng)
        if (top + estimatedH > window.innerHeight - margin) {
            top = Math.max(margin, r.top - estimatedH - 6);
        }

        setRect({ top, left, width: r.width, height: r.height });
    };

    useLayoutEffect(() => {
        if (open) measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (popRef.current?.contains(target) || btnRef.current?.contains(target)) return;
            setOpen(false);
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        const onResize = () => measure();
        const onScroll = () => measure();

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);

        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    /* ==========================
       ACTION HELPERS
    ========================== */

    const done = () => {
        setOpen(false);
        onDone?.();
        router.refresh();
    };

    const doPost = async () => {
        if (!actions.postUrl) return;
        setErr(null);
        setSaving(true);
        try {
            await postJson(actions.postUrl);
            done();
        } catch (e: any) {
            setErr(e?.message || "Duyệt thất bại");
        } finally {
            setSaving(false);
        }
    };

    const doCancel = async () => {
        if (!actions.cancelUrl) return;
        const ok = confirm("Bạn có chắc muốn hủy?");
        if (!ok) return;

        setErr(null);
        setSaving(true);
        try {
            await postJson(actions.cancelUrl);
            done();
        } catch (e: any) {
            setErr(e?.message || "Huỷ thất bại");
        } finally {
            setSaving(false);
        }
    };

    // Shipment: READY -> SHIPPED (nhập phí ship)
    const openShipModal = () => {
        setErr(null);
        setOpen(false);
        setShippingFee(0);
        setShipModalOpen(true);
    };

    const submitShip = async () => {
        setErr(null);
        const fee = Number(shippingFee);
        if (Number.isNaN(fee) || fee < 0) {
            setErr("Phí ship không hợp lệ");
            return;
        }

        setSaving(true);
        try {
            await postJson(`/api/admin/shipments/${entityId}/ship`, { shippingFee: fee });
            setShipModalOpen(false);
            done();
        } catch (e: any) {
            setErr(e?.message || "Chuyển SHIPPED thất bại");
        } finally {
            setSaving(false);
        }
    };

    // Shipment: SHIPPED -> DELIVERED (tạo payment + đổi order + product ở backend)
    const openDeliverModal = () => {
        setErr(null);
        setOpen(false);
        setDeliverModalOpen(true);
    };

    const submitDeliver = async () => {
        setErr(null);
        setSaving(true);
        try {
            await postJson(`/api/admin/shipments/${entityId}/deliver`, {});
            setDeliverModalOpen(false);
            done();
        } catch (e: any) {
            setErr(e?.message || "Chuyển DELIVERED thất bại");
        } finally {
            setSaving(false);
        }
    };

    /* ==========================
       UI
    ========================== */

    const menu = (
        <div
            ref={popRef}
            style={{
                position: "fixed",
                top: rect?.top ?? 0,
                left: rect?.left ?? 0,
                width: 220,
                zIndex: 10000,
            }}
            className="rounded-lg border bg-white shadow-xl overflow-hidden"
        >
            <div className="py-1 text-sm">
                {/* POST */}
                {canPost && actions.postUrl && (
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
                        onClick={doPost}
                        type="button"
                        disabled={saving}
                    >
                        Duyệt
                    </button>
                )}

                {/* Shipment: READY -> SHIPPED */}
                {canMarkShipped && (
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
                        onClick={openShipModal}
                        type="button"
                        disabled={saving}
                    >
                        Chuyển sang SHIPPED…
                    </button>
                )}

                {/* Shipment: SHIPPED -> DELIVERED */}
                {canMarkDelivered && (
                    <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
                        onClick={openDeliverModal}
                        type="button"
                        disabled={saving}
                    >
                        Xác nhận DELIVERED
                    </button>
                )}

                {/* EDIT */}
                {canEdit && actions.editUrl && (
                    <Link className="block px-3 py-2 hover:bg-gray-50" href={actions.editUrl}>
                        Sửa
                    </Link>
                )}

                {/* VIEW */}
                <Link className="block px-3 py-2 hover:bg-gray-50" href={viewUrl}>
                    Xem chi tiết
                </Link>

                {/* CANCEL */}
                {canCancel && actions.cancelUrl && (
                    <button
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                        onClick={doCancel}
                        type="button"
                        disabled={saving}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className={cls(
                    size === "sm" ? "px-2 py-1" : "px-2",
                    "text-lg rounded hover:bg-gray-100",
                    className
                )}
                title="Hành động"
                type="button"
            >
                ⋮
            </button>

            {open && rect && createPortal(menu, document.body)}

            {/* ===== Modal READY -> SHIPPED */}
            {shipModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[10001] bg-black/30 flex items-center justify-center">
                        <div className="bg-white rounded-lg w-[420px] p-5 space-y-4">
                            <h3 className="font-semibold text-lg">Chuyển shipment sang SHIPPED</h3>

                            <div className="text-sm text-gray-600">
                                Nhập <b>phí giao hàng</b> để cập nhật vào shipment.
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-gray-600">Phí ship (VND)</label>
                                <input
                                    className="h-9 w-full rounded border px-2"
                                    type="number"
                                    min={0}
                                    value={shippingFee}
                                    onChange={(e) => setShippingFee(Number(e.target.value))}
                                />
                            </div>

                            {err ? <div className="text-sm text-red-600">{err}</div> : null}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    className="px-3 py-1 border rounded"
                                    onClick={() => setShipModalOpen(false)}
                                    type="button"
                                    disabled={saving}
                                >
                                    Huỷ
                                </button>

                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                                    onClick={submitShip}
                                    type="button"
                                    disabled={saving}
                                >
                                    {saving ? "Đang lưu..." : "Xác nhận"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            {/* ===== Modal SHIPPED -> DELIVERED */}
            {deliverModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[10001] bg-black/30 flex items-center justify-center">
                        <div className="bg-white rounded-lg w-[440px] p-5 space-y-4">
                            <h3 className="font-semibold text-lg">Xác nhận DELIVERED</h3>

                            <div className="text-sm text-gray-600">
                                Hệ thống sẽ:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Chuyển shipment sang <b>DELIVERED</b></li>
                                    <li>Tạo payment cho <b>phí ship</b></li>
                                    <li>Chuyển trạng thái <b>order</b> và <b>sản phẩm</b></li>
                                </ul>
                            </div>

                            {err ? <div className="text-sm text-red-600">{err}</div> : null}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    className="px-3 py-1 border rounded"
                                    onClick={() => setDeliverModalOpen(false)}
                                    type="button"
                                    disabled={saving}
                                >
                                    Huỷ
                                </button>

                                <button
                                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-60"
                                    onClick={submitDeliver}
                                    type="button"
                                    disabled={saving}
                                >
                                    {saving ? "Đang xử lý..." : "Xác nhận giao thành công"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
