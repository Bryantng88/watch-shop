"use client";

import { useEffect, useState } from "react";

type Props = {
    imageUrl: string | null;              // fileKey
    onPick: (fileKey: string) => void; // trả về fileKey
};

/* ===============================
   MediaGrid – duyệt ảnh từ S3
================================ */
function MediaGrid({ onPick }: { onPick: (key: string) => void }) {
    const [files, setFiles] = useState<{ key: string; url: string }[]>([]);

    useEffect(() => {
        fetch("/api/media/browse")
            .then((r) => r.json())
            .then((j) => {
                const imgs = (j.files || [])
                    .filter((f: any) => /\.(png|jpe?g|webp)$/i.test(f.key))
                    .map((f: any) => ({ key: f.key, url: f.url }));
                setFiles(imgs);
            });
    }, []);

    return (
        <div className="grid grid-cols-6 gap-3">
            {files.map((f) => (
                <button
                    key={f.key}
                    type="button"
                    onClick={() => onPick(f.key)}
                    className="border rounded overflow-hidden hover:ring-2 hover:ring-blue-500"
                >
                    <img src={f.url} className="h-24 w-full object-cover" />
                </button>
            ))}
        </div>
    );
}

/* ===============================
   InlineImagePicker
================================ */
export default function InlineImagePicker({ imageUrl, onPick }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* THUMBNAIL */}
            <div
                onClick={() => setOpen(true)}
                className="
      w-14 aspect-square
    rounded-md 
    flex items-center justify-center
    overflow-hidden cursor-pointer
    bg-gray-100 hover:bg-gray-200
        "
            >
                {imageUrl ? (
                    <img
                        src={`/api/media/sign?key=${encodeURIComponent(imageUrl)}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs text-gray-400">+</span>
                )}
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 w-[720px] max-h-[80vh] overflow-auto">
                        <div className="flex justify-between mb-3">
                            <h3 className="font-medium">Chọn ảnh sản phẩm</h3>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <MediaGrid
                            onPick={(fileKey) => {
                                onPick(fileKey); // CHỈ fileKey
                                setOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
