"use client";

import * as React from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import MediaBrowserDialog, { SharedMediaProfile } from "./MediaBrowserDialog";

type Props = {
    value: string | null;
    onChange: (fileKey: string) => void;
    pending?: boolean;
    disabled?: boolean;
    profile?: SharedMediaProfile;
    compact?: boolean;
    className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isRenderableUrl(value: string) {
    return /^(https?:)?\/\//i.test(value) || value.startsWith("/") || value.startsWith("data:") || value.startsWith("blob:");
}

function resolvePreviewSrc(value: string | null | undefined) {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (isRenderableUrl(trimmed)) return trimmed;
    return `/api/media/sign?key=${encodeURIComponent(trimmed)}`;
}

export default function MediaPickerInline({
    value,
    onChange,
    pending = false,
    disabled = false,
    profile = "inline",
    compact = false,
    className,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const previewSrc = React.useMemo(() => resolvePreviewSrc(value), [value]);

    const triggerClass = compact ? "h-14 w-14 rounded-xl" : "h-20 w-20 rounded-2xl";

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    if (disabled) return;
                    setOpen(true);
                }}
                disabled={disabled || pending}
                className={cx(
                    "group relative shrink-0 overflow-hidden border border-slate-200 bg-slate-50 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50",
                    triggerClass,
                    className
                )}
                title="Chọn ảnh"
            >
                {previewSrc ? (
                    <img src={previewSrc} alt="selected" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className={compact ? "h-4 w-4" : "h-5 w-5"} />}
                    </div>
                )}

                {pending ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                    {previewSrc ? "Đổi ảnh" : "Chọn ảnh"}
                </div>
            </button>

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                onSelect={onChange}
                profile={profile}
                selectedKey={value}
            />
        </>
    );
}
