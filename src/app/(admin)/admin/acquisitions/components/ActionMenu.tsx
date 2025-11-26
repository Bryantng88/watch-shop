"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function ActionMenu({
    open,
    onClose,
    children,
    acqId,
    status,
    vendor,
}: {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    acqId: string;
    status: string;
    vendor: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    // Click outside → close
    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
        >
            <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                    if (status !== "POSTED") {
                        fetch(`/api/admin/acquisitions/${acqId}/post`, {
                            method: "POST",
                        }).then(() => location.reload());
                    }
                }}
            >
                Duyệt phiếu
            </button>

            <Link
                href={`/admin/acquisitions/${acqId}/edit`}
                className="block px-3 py-2 hover:bg-gray-50 text-sm"
            >
                Sửa phiếu
            </Link>
        </div>
    );
}
