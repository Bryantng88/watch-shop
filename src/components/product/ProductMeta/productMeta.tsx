// src/components/common/ProductMeta.tsx
import React from "react";
import styles from "./productMeta.module.css";

type ProductMetaProps = {
    categories?: string[];
    tags?: string[];
};

export default function ProductMeta({ categories = [], tags = [] }: ProductMetaProps) {
    return (
        <div className={styles.meta}>
            {categories.length > 0 && (
                <p className={styles.categories}>
                    <span className={styles.label}>Categories:</span>{" "}
                    {categories.map((c, i) => (
                        <a key={i} href={`/categories/${c.toLowerCase()}`}>
                            {c}
                            {i < categories.length - 1 && ", "}
                        </a>
                    ))}
                </p>
            )}

            {tags.length > 0 && (
                <p className={styles.tags}>
                    <span className={styles.label}>Tags:</span>{" "}
                    {tags.map((t, i) => (
                        <a key={i} href={`/tags/${t.toLowerCase()}`}>
                            #{t}
                            {i < tags.length - 1 && ", "}
                        </a>
                    ))}
                </p>
            )}

            <div className={styles.share}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-facebook" />
                </a>
                <a href="mailto:someone@example.com">
                    <i className="bi bi-envelope" />
                </a>
            </div>
        </div>
    );
}
