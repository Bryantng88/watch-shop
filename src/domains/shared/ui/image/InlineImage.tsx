"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export type InlineImageItem = {
    id?: string | null;
    fileKey?: string | null;
    role?: string | null;
    url?: string | null;
};

type Props = {
    image?: InlineImageItem | null;
    title?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
};

const sizeClass = {
    sm: "h-12 w-12 rounded-xl",
    md: "h-16 w-16 rounded-2xl",
    lg: "h-20 w-20 rounded-2xl",
    xl: "h-24 w-24 rounded-3xl",
};

const imageSizes = {
    sm: "48px",
    md: "64px",
    lg: "80px",
    xl: "96px",
};

function resolveImageUrl(image?: InlineImageItem | null) {
    if (!image) return "";
    if (image.url) return image.url;

    if (image.fileKey) {
        return `/api/media/sign?key=${encodeURIComponent(image.fileKey)}`;
    }

    return "";
}

export default function InlineImage({
    image,
    title,
    size = "lg",
    className = "",
}: Props) {
    const [open, setOpen] = useState(false);
    const imageUrl = resolveImageUrl(image);

    return (
        <>
            {/* Thumbnail */}
            <button
                type="button"
                onClick={() => imageUrl && setOpen(true)}
                className={[
                    "relative shrink-0 overflow-hidden bg-slate-100 ring-1 ring-inset ring-slate-200 transition",
                    "hover:scale-[1.02] hover:shadow-sm", // nhẹ thôi
                    sizeClass[size],
                    className,
                ].join(" ")}
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title || "Image"}
                        fill
                        sizes={imageSizes[size]}
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
                        <ImageIcon className="h-4 w-4" />
                        {(size === "lg" || size === "xl") && (
                            <span className="text-[10px]">No image</span>
                        )}
                    </div>
                )}
            </button>

            {/* Modal zoom */}
            {open && imageUrl && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    {/* backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* image */}
                    <div className="relative z-10 max-h-[90vh] max-w-[90vw]">
                        <Image
                            src={imageUrl}
                            alt={title || "Image"}
                            width={1200}
                            height={1200}
                            className="max-h-[90vh] w-auto rounded-2xl object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
}