"use client";

import * as React from "react";
import type { MediaProfile } from "@/lib/media-profile";

type Item = {
    key: string;
    signedUrl?: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    profile?: MediaProfile;
    multiple?: boolean;
    selectedKeys?: string[];
    onSubmit: (keys: string[]) => void;
};

export default function MediaBrowserDialog({
    open,
    onClose,
    profile = "inline",
    multiple = false,
    selectedKeys = [],
    onSubmit,
}: Props) {
    const [items, setItems] = React.useState<Item[]>([]);
    const [selected, setSelected] = React.useState<string[]>(selectedKeys);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!open) return;

        setLoading(true);
        fetch(`/api/media/browse?profile=${profile}`)
            .then((res) => res.json())
            .then((data) => setItems(data.items || []))
            .finally(() => setLoading(false));
    }, [open, profile]);

    function toggle(key: string) {
        if (!multiple) {
            setSelected([key]);
            return;
        }

        setSelected((prev) =>
            prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
        );
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[800px] max-h-[80vh] rounded-xl p-4 overflow-hidden flex flex-col">
                <div className="flex justify-between mb-3">
                    <div className="font-semibold">Chọn ảnh</div>
                    <button onClick={onClose}>Đóng</button>
                </div>

                <div className="flex-1 overflow-auto grid grid-cols-4 gap-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        items.map((item) => {
                            const isSelected = selected.includes(item.key);

                            return (
                                <div
                                    key={item.key}
                                    onClick={() => toggle(item.key)}
                                    className={`cursor-pointer border rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-blue-500" : ""
                                        }`}
                                >
                                    <img
                                        src={item.signedUrl || ""}
                                        className="w-full h-32 object-cover"
                                    />
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onClose}>Hủy</button>
                    <button
                        className="bg-black text-white px-4 py-2 rounded"
                        onClick={() => {
                            onSubmit(selected);
                            onClose();
                        }}
                    >
                        Chọn ({selected.length})
                    </button>
                </div>
            </div>
        </div>
    );
}