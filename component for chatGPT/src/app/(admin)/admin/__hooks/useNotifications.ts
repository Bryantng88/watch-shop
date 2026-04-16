"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type AdminNotificationItem = {
    id: string;
    type: string;
    title: string;
    message: string;
    priority: "LOW" | "NORMAL" | "HIGH";
    isRead: boolean;
    metadata: any;
    createdAt: string;
};

export function useNotifications() {
    const [items, setItems] = useState<AdminNotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/notifications?take=6", {
                cache: "no-store",
            });
            if (!res.ok) return;

            const json = await res.json();
            setItems(Array.isArray(json?.items) ? json.items : []);
            setUnreadCount(Number(json?.unreadCount ?? 0));
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        await fetch("/api/admin/notifications/read", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        setItems((prev) =>
            prev.map((x) => (x.id === id ? { ...x, isRead: true } : x))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
    }, []);

    const markAllAsRead = useCallback(async () => {
        await fetch("/api/admin/notifications/read-all", {
            method: "POST",
        });

        setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
        setUnreadCount(0);
    }, []);

    useEffect(() => {
        fetchNotifications();
        const timer = window.setInterval(fetchNotifications, 15000);
        return () => window.clearInterval(timer);
    }, [fetchNotifications]);

    return useMemo(
        () => ({
            items,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
        }),
        [items, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead]
    );
}