"use client";
import { useState } from "react";
import styles from "./PromoBanner2.module.css";

export default function PromoBanner2() {
    const [hidden, setHidden] = useState(false);
    if (hidden) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div>
                    <span className={styles.badge}>Special Offer</span>
                    <h2 className={styles.title}>
                        Autumn Collection — <span>Up to 25% Off</span>
                    </h2>
                    <p className={styles.desc}>
                        Explore our carefully curated vintage watches. Limited time only!
                    </p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cta}>Shop Now</button>
                </div>
            </div>
        </div>
    );
};


