"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

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
    | "invoices";

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
    status: string; // DRAFT | POSTED | RESERVED | CANCELLED | ...
    mode?: "view" | "edit";
    className?: string;
    size?: "sm" | "md";
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
function normalizeEntityType(t: EntityType): "order" | "acquisition" | "invoice" {
    if (t === "orders") return "order";
    if (t === "acquisitions") return "acquisition";
    if (t === "invoices") return "invoice";
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

                // bạn chỉnh rule ở đây tuỳ nghiệp vụ
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

        default:
            return DEFAULT_ACTIONS;
    }
}

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
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
}: Props) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    const actions = useMemo(() => getActions(entityType, entityId, status) ?? DEFAULT_ACTIONS, [
        entityType,
        entityId,
        status,
    ]);

    const canPost = mode === "edit" && actions.canPost;
    const canEdit = mode === "edit" && actions.canEdit;
    const canCancel = mode === "edit" && actions.canCancel;

    const viewUrl = actions.viewUrl ?? getAdminDetailUrl(entityType, entityId);

    /* ==========================
       POSITIONING
    ========================== */

    const measure = () => {
        const el = btnRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const menuW = 180;
        const margin = 8;

        // default: canh phải theo button
        let left = r.right - menuW;
        left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin));

        // default: xổ xuống
        let top = r.bottom + 6;

        // nếu gần đáy thì xổ lên
        const estimatedH = 44 * 4; // rough height
        if (top + estimatedH > window.innerHeight - margin) {
            top = Math.max(margin, r.top - estimatedH - 6);
        }

        setRect({
            top,
            left,
            width: r.width,
            height: r.height,
        });
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

    const doPost = async () => {
        if (!actions.postUrl) return;
        await fetch(actions.postUrl, { method: "POST" });
        setOpen(false);
        location.reload();
    };

    const doCancel = async () => {
        if (!actions.cancelUrl) return;
        const ok = confirm("Bạn có chắc muốn hủy?");
        if (!ok) return;

        await fetch(actions.cancelUrl, { method: "POST" });
        setOpen(false);
        location.reload();
    };

    /* ==========================
       UI
    ========================== */

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

            {open &&
                rect &&
                createPortal(
                    <div
                        ref={popRef}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            width: 180,
                            zIndex: 10000,
                        }}
                        className="rounded-lg border bg-white shadow-xl overflow-hidden"
                    >
                        <div className="py-1 text-sm">
                            {/* POST */}
                            {canPost && actions.postUrl && (
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                    onClick={doPost}
                                    type="button"
                                >
                                    Duyệt
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
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                                    onClick={doCancel}
                                    type="button"
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
