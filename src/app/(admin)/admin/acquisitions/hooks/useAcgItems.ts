// useAcqItems.ts
"use client";
import { useEffect, useState } from "react";
import { getAcqItems, isAcqItemsCached } from "../_server/acqItems.cache";

export function useAcqItems(acqId: string, enabled: boolean) {
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [cached, setCached] = useState(false);

    useEffect(() => {
        setCached(isAcqItemsCached(acqId)); // check cache state trước khi load
    }, [acqId]);

    useEffect(() => {
        if (!enabled) return;
        let active = true;

        setLoading(true);
        setError(null);

        getAcqItems(acqId)
            .then(d => {
                if (!active) return;
                setData(d);
                // cập nhật cờ cached sau khi đã ghi cache
                setCached(isAcqItemsCached(acqId));
            })
            .catch(e => active && setError(e))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [acqId, enabled]);

    return { data, loading, cached, error };
}