"use client";

import { ReactNode, RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type HoverPreviewPortalProps = {
    anchorRef: RefObject<HTMLElement | null>;
    open: boolean;
    width?: number;
    height?: number;
    gap?: number;
    children: ReactNode;
};

type PreviewPosition = {
    top: number;
    left: number;
};

export default function HoverPreviewPortal({
    anchorRef,
    open,
    width = 224,
    height = 224,
    gap = 10,
    children,
}: HoverPreviewPortalProps) {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<PreviewPosition>({ top: 0, left: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        function updatePosition() {
            const el = anchorRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();

            let left = rect.right + gap;
            let top = rect.top;

            // Nếu tràn bên phải thì lật sang trái
            if (left + width > window.innerWidth - 12) {
                left = rect.left - width - gap;
            }

            // Nếu vẫn tràn trái thì ép vào trong viewport
            if (left < 12) {
                left = 12;
            }

            // Nếu tràn dưới thì kéo lên
            if (top + height > window.innerHeight - 12) {
                top = window.innerHeight - height - 12;
            }

            // Nếu tràn trên thì ép xuống
            if (top < 12) {
                top = 12;
            }

            setPosition({ top, left });
        }

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [anchorRef, open, width, height, gap]);

    if (!mounted || !open || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="pointer-events-none fixed z-[9999]"
            style={{
                top: position.top,
                left: position.left,
                width,
            }}
        >
            {children}
        </div>,
        document.body
    );
}