// src/components/product/ProductGallery.tsx
"use client";

import React, { useState } from "react";

type Props = {
    images: string[];                 // danh sách ảnh
    title: string;                    // alt ảnh
    status?: "sold" | "on hold";      // hiện banner
    classes?: {
        gallery?: string;
        media?: string;
        heroImg?: string;
        thumbs?: string;
        thumbBtn?: string;
        active?: string;
        banner?: string;
        sold?: string;
        hold?: string;
    };
};

export default function ProductGallery({
    images,
    title,
    status,
    classes = {},
}: Props) {
    const [activeIdx, setActiveIdx] = useState(0);

    const isSold = status === "sold";
    const isHold = status === "on hold";

    return (
        <div className={classes.gallery}>
            {/* Ảnh lớn */}
            <div className={classes.media}>
                <img
                    src={images[activeIdx]}
                    alt={title}
                    className={classes.heroImg}
                />
                {isSold && (
                    <div className={`${classes.banner} ${classes.sold}`}>OUT OF STOCK</div>
                )}
                {isHold && (
                    <div className={`${classes.banner} ${classes.hold}`}>ON HOLD</div>
                )}
            </div>

            {/* Thumbnail */}
            <div className={classes.thumbs}>
                {images.map((src, i) => (
                    <button
                        key={src + i}
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        className={`${classes.thumbBtn} ${i === activeIdx ? classes.active : ""}`}
                        aria-label={`View image ${i + 1}`}
                    >
                        <img src={src} alt={`thumb-${i + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}
