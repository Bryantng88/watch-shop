"use client";

import * as React from "react";
import MediaBrowserDialog from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type Props = {
    value: string[];
    onChange: (keys: string[]) => void;
    profile?: any;
};

export default function MediaPickerMulti({
    value,
    onChange,
    profile = "inline",
}: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <div className="flex gap-2 flex-wrap">
                {value.map((key) => {
                    const src = resolveMediaPreviewSrc(key);

                    return (
                        <div
                            key={key}
                            className="w-16 h-16 border rounded overflow-hidden relative"
                        >
                            <img src={src || ""} className="w-full h-full object-cover" />

                            <button
                                onClick={() =>
                                    onChange(value.filter((k) => k !== key))
                                }
                                className="absolute top-0 right-0 bg-black text-white text-xs px-1"
                            >
                                x
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={() => setOpen(true)}
                    className="w-16 h-16 border rounded flex items-center justify-center text-sm"
                >
                    +
                </button>
            </div>

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                multiple
                selectedKeys={value}
                onSubmit={(keys) => onChange(keys)}
            />
        </>
    );
}