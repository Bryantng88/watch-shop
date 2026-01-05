"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

type EntityType =
    | "order"
    | "orders"
    | "acquisition"
    | "acquisitions"
    | "invoice"
    | "invoices";

type ActionConfig = {
    postUrl?: string;
    editUrl?: string;
    cancelUrl?: string;
    canPost: boolean;
    canEdit: boolean;
};

type Props = {
    entityId: string;
    entityType: EntityType;
    status: string; // DRAFT | POSTED | ...
    mode?: "view" | "edit"; // override nếu cần
};
const DEFAULT_ACTIONS: ActionConfig = {
    canEdit: false,
    canPost: false,
};

/* ==============================
   HELPERS
============================== */

// normalize số nhiều → số ít
function normalizeEntityType(
    t: EntityType
): "order" | "acquisition" | "invoice" {
    if (t === "orders") return "order";
    if (t === "acquisitions") return "acquisition";
    if (t === "invoices") return "invoice";
    return t;
}

function getActions(
    entityTypeRaw: EntityType,
    entityId: string,
    status: string
): ActionConfig {
    const entityType = normalizeEntityType(entityTypeRaw);

    switch (entityType) {
        case "acquisition":
            return {
                postUrl: `/api/admin/acquisitions/${entityId}/post`,
                editUrl: `/admin/acquisitions/${entityId}/edit`,
                cancelUrl: `/api/admin/acquisitions/${entityId}/cancel`,
                canPost: status !== "POSTED",
                canEdit: status !== "POSTED",
            };

        case "order":
            return {
                postUrl: `/api/admin/orders/${entityId}/post`,
                canPost: status === "DRAFT",
                canEdit: false,
            };

        case "invoice":
            return {
                postUrl: `/api/admin/invoices/${entityId}/post`,
                editUrl: `/admin/invoices/${entityId}/edit`,
                cancelUrl: `/api/admin/invoices/${entityId}/cancel`,
                canPost: status === "DRAFT",
                canEdit: status === "DRAFT",
            };

        default:
            return DEFAULT_ACTIONS; // 🔥 CỰC KỲ QUAN TRỌNG
    }
}


/* ==============================
   COMPONENT
============================== */

export default function ActionMenuPopover({
    entityId,
    entityType,
    status,
    mode = "edit",
}: Props) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);

    const actions = getActions(entityType, entityId, status) ?? DEFAULT_ACTIONS;

    // override mode=view
    const canEdit = mode === "edit" && !!actions.canEdit;
    const canPost = mode === "edit" && !!actions.canPost;

    /* ==========================
       POSITIONING
    ========================== */
    const measure = () => {
        const el = btnRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({
            top: r.bottom + 6,
            left: Math.max(8, Math.min(r.right - 160, window.innerWidth - 168)),
            width: r.width,
            height: r.height,
        });
    };

    useLayoutEffect(() => {
        if (open) measure();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onDown = (e: MouseEvent) => {
            const pop = document.getElementById(`action-pop-${entityId}`);
            if (
                pop &&
                (pop.contains(e.target as Node) ||
                    btnRef.current?.contains(e.target as Node))
            )
                return;
            setOpen(false);
        };

        const onResize = () => measure();
        const onScroll = () => measure();

        document.addEventListener("mousedown", onDown);
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);

        return () => {
            document.removeEventListener("mousedown", onDown);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
        };
    }, [open, entityId]);

    /* ==========================
       UI
    ========================== */

    return (
        <>
            <button
                ref={btnRef}
                onClick={() => setOpen((v) => !v)}
                className="px-2 text-lg hover:bg-gray-100 rounded"
                title="Hành động"
            >
                ⋮
            </button>

            {open &&
                rect &&
                createPortal(
                    <div
                        id={`action-pop-${entityId}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            width: 160,
                            zIndex: 10000,
                        }}
                        className="rounded-lg border bg-white shadow-xl"
                    >
                        <div className="py-1 text-sm">
                            {/* POST */}
                            {canPost && actions.postUrl && (
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                    onClick={async () => {
                                        await fetch(actions.postUrl!, { method: "POST" });
                                        location.reload();
                                    }}
                                >
                                    Duyệt
                                </button>
                            )}

                            {/* EDIT */}
                            {canEdit && actions.editUrl && (
                                <Link
                                    href={actions.editUrl}
                                    className="block px-3 py-2 hover:bg-gray-50"
                                >
                                    Sửa
                                </Link>
                            )}

                            {/* VIEW (luôn có) */}
                            <Link
                                href={`/admin/${normalizeEntityType(entityType)}s/${entityId}`}
                                className="block px-3 py-2 hover:bg-gray-50"
                            >
                                Xem chi tiết
                            </Link>

                            {/* CANCEL */}
                            {canEdit && actions.cancelUrl && (
                                <button
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                                    onClick={async () => {
                                        if (!confirm("Bạn có chắc muốn hủy?")) return;
                                        await fetch(actions.cancelUrl!, { method: "POST" });
                                        location.reload();
                                    }}
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
