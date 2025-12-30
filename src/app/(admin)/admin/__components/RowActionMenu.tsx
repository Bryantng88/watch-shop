"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

type Props = {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function RowActionsMenu({
    onView,
    onEdit,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // ==========================
    // CLICK OUTSIDE TO CLOSE
    // ==========================
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block text-left">
            {/* TRIGGER */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="p-1 rounded hover:bg-gray-100"
            >
                <MoreVertical size={16} />
            </button>

            {/* MENU */}
            {open && (
                <div className="absolute right-0 z-50 mt-1 w-36 rounded-md border bg-white shadow-lg">
                    <ul className="py-1 text-sm">
                        {onView && (
                            <li>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onView();
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                >
                                    Xem
                                </button>
                            </li>
                        )}

                        {onEdit && (
                            <li>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onEdit();
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                >
                                    Chỉnh sửa
                                </button>
                            </li>
                        )}

                        {onDelete && (
                            <li>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        onDelete();
                                    }}
                                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                                >
                                    Xóa
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
