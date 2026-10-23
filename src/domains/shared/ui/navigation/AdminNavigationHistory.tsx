"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "watch-shop:admin-navigation-history:v1";
const MAX_HISTORY_ITEMS = 40;

type AdminNavigationContextValue = {
    canGoBack: boolean;
    previousHref: string | null;
    goBack: () => void;
};

const AdminNavigationContext = createContext<AdminNavigationContextValue | null>(null);

function isSafeAdminHref(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("/admin") && !value.startsWith("//");
}

function readHistory(): string[] {
    try {
        const parsed: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter(isSafeAdminHref).slice(-MAX_HISTORY_ITEMS) : [];
    } catch {
        return [];
    }
}

function writeHistory(history: string[]) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY_ITEMS)));
}

export function AdminNavigationHistoryProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [history, setHistory] = useState<string[]>([]);
    const query = searchParams.toString();
    const currentHref = query ? `${pathname}?${query}` : pathname;

    useEffect(() => {
        if (!isSafeAdminHref(currentHref)) return;

        const stored = readHistory();
        const currentIndex = stored.lastIndexOf(currentHref);
        let next: string[];

        if (currentIndex === stored.length - 2) {
            // Native browser Back: remove the page that was just left.
            next = stored.slice(0, -1);
        } else if (currentIndex === stored.length - 1) {
            next = stored;
        } else {
            next = [...stored, currentHref].slice(-MAX_HISTORY_ITEMS);
        }

        writeHistory(next);
        setHistory(next);
    }, [currentHref]);

    const previousHref = history.length > 1 ? history[history.length - 2] : null;

    const goBack = useCallback(() => {
        const stored = readHistory();
        const target = stored.length > 1 ? stored[stored.length - 2] : null;

        if (!target) {
            router.push("/admin/dashboard");
            return;
        }

        const next = stored.slice(0, -1);
        writeHistory(next);
        setHistory(next);
        router.push(target);
    }, [router]);

    const value = useMemo<AdminNavigationContextValue>(() => ({
        canGoBack: Boolean(previousHref),
        previousHref,
        goBack,
    }), [goBack, previousHref]);

    return (
        <AdminNavigationContext.Provider value={value}>
            {children}
        </AdminNavigationContext.Provider>
    );
}

export function useAdminNavigationHistory() {
    const context = useContext(AdminNavigationContext);
    if (!context) {
        throw new Error("useAdminNavigationHistory must be used within AdminNavigationHistoryProvider");
    }
    return context;
}
