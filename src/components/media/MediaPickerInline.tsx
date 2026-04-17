"use client";

import * as React from "react";
import MediaBrowserDialog from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type Props = {
    value: string | null;
    onChange: (key: string) => void;
    profile?: any;
};

export default function MediaPickerInline({
    value,
    onChange,
    profile = "inline",
}: Props) {
    const [open, setOpen] = React.useState(false);

    const src = resolveMediaPreviewSrc(value);

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer"
            >
                {src ? (
                    <img src={src} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        Chọn ảnh
                    </div>
                )}
            </div>

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                multiple={false}
                selectedKeys={value ? [value] : []}
                onSubmit={(keys) => {
                    if (keys[0]) onChange(keys[0]);
                }}
            />
        </>
    );
}