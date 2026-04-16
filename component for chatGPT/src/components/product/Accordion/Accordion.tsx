"use client";

import React, { useState } from "react";
import styles from "./accordion.module.css";

export type AccordionItem = {
    id: string;
    title: string;
    content: React.ReactNode;
};

export default function Accordion({
    items,
    defaultOpenId,
    allowMultiple = false,
}: {
    items: AccordionItem[];
    defaultOpenId?: string;
    allowMultiple?: boolean; // true = mở nhiều mục; false = chỉ 1 mục
}) {
    const [openSet, setOpenSet] = useState<Set<string>>(() => {
        const s = new Set<string>();
        if (defaultOpenId) s.add(defaultOpenId);
        return s;
    });

    const toggle = (id: string) => {
        setOpenSet(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else {
                if (!allowMultiple) next.clear();
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className={styles.wrap} role="list">
            {items.map(({ id, title, content }) => {
                const isOpen = openSet.has(id);
                return (
                    <div key={id} className={styles.item} role="listitem">
                        <div
                            className={styles.header}
                            tabIndex={0}
                            aria-expanded={isOpen}
                            aria-controls={`acc-panel-${id}`}
                            onClick={() => toggle(id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggle(id);
                                }
                            }}
                        >
                            <span className={styles.title}>{title}</span>
                            <span className={`${styles.icon} ${isOpen ? styles.open : ""}`} aria-hidden>
                                <i className={styles.h} />
                                <i className={styles.v} />
                            </span>
                        </div>

                        <div
                            id={`acc-panel-${id}`}
                            className={`${styles.panel} ${isOpen ? styles.show : ""}`}
                            role="region"
                            aria-hidden={!isOpen}
                        >
                            <div className={styles.inner}>{content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
