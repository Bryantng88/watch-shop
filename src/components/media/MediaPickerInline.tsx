"use client";

import * as React from "react";
import MediaBrowserDialog, { type SharedMediaProfile } from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type Props = {
    value: string | null;
    onChange: (key: string) => void;
    profile?: SharedMediaProfile;
    audienceSegment?: "MEN" | "WOMEN";
    pending?: boolean;
    disabled?: boolean;
    compact?: boolean;
    className?: string;
};

export default function MediaPickerInline({
    value,
    onChange,
    profile = "inline",
    audienceSegment = "MEN",
    pending = false,
    disabled = false,
    compact = false,
    className = "",
}: Props) {
    const [open, setOpen] = React.useState(false);

    const src = resolveMediaPreviewSrc(value);

    return (
        <>
            <div
                onClick={() => {
                    if (!disabled && !pending) setOpen(true);
                }}
                className={`${compact ? "h-[72px] w-[72px]" : "h-20 w-20"} overflow-hidden rounded-lg border ${
                    disabled || pending ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${className}`}
            >
                {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="w-full h-full object-cover" />
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
                audienceSegment={audienceSegment}
                selectedKey={value}
                selectedKeys={value ? [value] : []}
                onSelect={(key) => {
                    onChange(key);
                    setOpen(false);
                }}
                onSubmit={(keys) => {
                    if (keys[0]) {
                        onChange(keys[0]);
                        setOpen(false);
                    }
                }}
            />
        </>
    );
}
