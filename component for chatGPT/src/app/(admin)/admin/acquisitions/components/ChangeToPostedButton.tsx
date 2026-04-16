"use client";

import { useTransition } from "react";

export default function ActionButton({ id, status, vendor }: { id: string, status: string, vendor: string }) {
    const [pending, startTransition] = useTransition();

    const handleClick = async () => {
        await fetch(`/api/admin/acquisitions/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "POSTED", vendor }),
        });
        // reload trang (hoặc dùng router.refresh() nếu xài next/navigation)
        window.location.reload();
    };

    return (
        <button
            onClick={() => startTransition(handleClick)}
            className={`
                px-2 py-1 
                rounded 
                bg-blue-600 
                text-xs 
                text-white 
                font-semibold
                hover:bg-blue-700 
                transition 
                shadow-sm 
                disabled:bg-blue-300 
                disabled:cursor-not-allowed
              `}
            style={{
                minWidth: 64,
                fontSize: 12,
                padding: "2px 10px"
            }} disabled={status === "POSTED" || pending}
        >
            {status === "POSTED" ? "Đã Duyệt" : "Duyệt Phiếu"}
        </button>
    );
}
