// src/components/common/PromoBanner.tsx
"use client";
import { useState } from "react";
import styles from "./PromoBanner.module.css";

export default function PromoBanner() {
    const [hidden, setHidden] = useState(false);
    if (hidden) return null;

    return (
        <div className={styles.promo} role="region" aria-label="Promotion">
            <div className="container">
                <div className={styles.promoInner}>
                    <div className={styles.promoText}>
                        <span className={styles.badge}>Limited</span>
                        <h3 className={styles.title}>
                            Mid-Season Sale — <strong>Up to 30% off</strong> selected vintage!
                        </h3>
                        <p className={styles.desc}>
                            Free domestic shipping for orders over 2.000.000 VND. Offer ends this Sunday.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <a className={styles.cta} href="/collections/sale">Shop Sale</a>
                        <button
                            className={styles.ghost}
                            type="button"
                            onClick={() => setHidden(true)}
                            aria-label="Dismiss promotion"
                            title="Dismiss"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
