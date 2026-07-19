"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Settings2, X } from "lucide-react";

import { DashboardWidgetGrid } from "@/domains/shared/ui/dashboard";
import type {
    BusinessListDashboardData,
    BusinessListDashboardView,
    BusinessListDashboardWidgetKey,
} from "./business-list.types";
import { BUSINESS_LIST_DASHBOARD_WIDGET_REGISTRY } from "./widgets/BusinessListDashboardWidgets";

const defaultWidgets: BusinessListDashboardWidgetKey[] = [
    "overview",
    "value-trend",
    "status-breakdown",
    "recent-activity",
];
const registryWidgets = Object.keys(
    BUSINESS_LIST_DASHBOARD_WIDGET_REGISTRY,
) as BusinessListDashboardWidgetKey[];

function normalizeWidgets(
    value: unknown,
    availableWidgets: BusinessListDashboardWidgetKey[],
    limit = 4,
) {
    if (!Array.isArray(value)) return null;
    const available = new Set(availableWidgets);
    const normalized = Array.from(
        new Set(
            value.filter(
                (item): item is BusinessListDashboardWidgetKey =>
                    typeof item === "string" && available.has(item as BusinessListDashboardWidgetKey),
            ),
        ),
    ).slice(0, limit);
    return normalized.length ? normalized : null;
}

export function BusinessListDashboardSkeleton({ count = 4 }: { count?: number }) {
    const skeletonCount = Math.min(Math.max(count, 1), 4);

    return (
        <DashboardWidgetGrid
            columns="xl:grid-cols-[1.65fr_1fr_1fr_1.12fr]"
            className="animate-pulse"
        >
            {Array.from({ length: skeletonCount }, (_, item) => (
                <div key={item} className="h-[190px] rounded-xl border border-slate-200 bg-white p-5">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="mt-6 h-8 w-32 rounded bg-slate-100" />
                    <div className="mt-5 h-12 rounded bg-slate-50" />
                </div>
            ))}
        </DashboardWidgetGrid>
    );
}

export default function BusinessListDashboard({
    data,
    views = [],
    activeView,
    onViewChange,
    widgets = defaultWidgets,
    storageKey,
    customizationRequest = 0,
    showCustomizationTrigger = true,
}: {
    data: BusinessListDashboardData;
    views?: BusinessListDashboardView[];
    activeView?: string;
    onViewChange?: (view: string) => void;
    widgets?: BusinessListDashboardWidgetKey[];
    storageKey?: string;
    customizationRequest?: number;
    showCustomizationTrigger?: boolean;
}) {
    const availableWidgets = useMemo(
        () => normalizeWidgets(widgets, registryWidgets, registryWidgets.length) ?? defaultWidgets,
        [widgets],
    );
    const configuredWidgets = availableWidgets.slice(0, 4);
    const [selectedWidgets, setSelectedWidgets] = useState(configuredWidgets);
    const [draftWidgets, setDraftWidgets] = useState(configuredWidgets);
    const [customizing, setCustomizing] = useState(false);
    const selectedWidgetsRef = useRef(selectedWidgets);

    useEffect(() => {
        selectedWidgetsRef.current = selectedWidgets;
    }, [selectedWidgets]);

    useEffect(() => {
        if (!storageKey) return;
        try {
            const stored = window.localStorage.getItem(storageKey);
            const normalized = normalizeWidgets(stored ? JSON.parse(stored) : null, availableWidgets);
            if (normalized) {
                setSelectedWidgets(normalized);
                setDraftWidgets(normalized);
            }
        } catch {
            window.localStorage.removeItem(storageKey);
        }
    }, [storageKey, availableWidgets]);

    useEffect(() => {
        if (customizationRequest <= 0) return;
        setDraftWidgets(selectedWidgetsRef.current);
        setCustomizing(true);
    }, [customizationRequest]);

    function openCustomization() {
        setDraftWidgets(selectedWidgets);
        setCustomizing(true);
    }

    function toggleWidget(widgetKey: BusinessListDashboardWidgetKey) {
        setDraftWidgets((current) => {
            if (current.includes(widgetKey)) {
                return current.filter((key) => key !== widgetKey);
            }
            if (current.length >= 4) return current;
            return [...current, widgetKey];
        });
    }

    function moveWidget(widgetKey: BusinessListDashboardWidgetKey, direction: -1 | 1) {
        setDraftWidgets((current) => {
            const index = current.indexOf(widgetKey);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= current.length) return current;
            const next = [...current];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    function saveCustomization() {
        if (!draftWidgets.length) return;
        setSelectedWidgets(draftWidgets);
        if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(draftWidgets));
        setCustomizing(false);
    }

    function resetCustomization() {
        setDraftWidgets(configuredWidgets);
        setSelectedWidgets(configuredWidgets);
        if (storageKey) window.localStorage.removeItem(storageKey);
        setCustomizing(false);
    }

    return (
        <section aria-label="Tổng quan danh sách" className="space-y-3">
            {views.length > 1 || (storageKey && showCustomizationTrigger) || customizing ? (
                <div
                    className={
                        views.length > 1 || (storageKey && showCustomizationTrigger)
                            ? "relative flex justify-end gap-2"
                            : "relative h-0"
                    }
                >
                    {views.length > 1 ? (
                    <select
                        value={activeView}
                        onChange={(event) => onViewChange?.(event.target.value)}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                    >
                        {views.map((view) => (
                            <option key={view.key} value={view.key}>
                                {view.label}
                            </option>
                        ))}
                    </select>
                    ) : null}
                    {storageKey && showCustomizationTrigger ? (
                        <button
                            type="button"
                            onClick={openCustomization}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <Settings2 className="h-4 w-4" />
                            Tùy chỉnh dashboard
                        </button>
                    ) : null}

                    {customizing ? (
                        <div className={`absolute right-0 z-30 w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.18)] ${views.length > 1 || showCustomizationTrigger ? "top-11" : "top-0"}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-slate-950">Tùy chỉnh dashboard</h3>
                                    <p className="mt-1 text-xs text-slate-500">Chọn tối đa 4 widget và sắp xếp thứ tự hiển thị.</p>
                                </div>
                                <button type="button" onClick={() => setCustomizing(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {availableWidgets.map((widgetKey) => {
                                    const definition = BUSINESS_LIST_DASHBOARD_WIDGET_REGISTRY[widgetKey];
                                    const selectedIndex = draftWidgets.indexOf(widgetKey);
                                    const selected = selectedIndex >= 0;
                                    return (
                                        <div key={widgetKey} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                disabled={!selected && draftWidgets.length >= 4}
                                                onChange={() => toggleWidget(widgetKey)}
                                                aria-label={`Chọn ${definition.label}`}
                                            />
                                            <button type="button" onClick={() => toggleWidget(widgetKey)} className="min-w-0 flex-1 text-left" disabled={!selected && draftWidgets.length >= 4}>
                                                <span className="block truncate font-semibold text-slate-800">{definition.label}</span>
                                                <span className="mt-0.5 block text-[11px] text-slate-400">{definition.scope} · {definition.size}</span>
                                            </button>
                                            {selected ? (
                                                <div className="inline-flex gap-1">
                                                    <button type="button" onClick={() => moveWidget(widgetKey, -1)} disabled={selectedIndex === 0} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-30" aria-label={`Đưa ${definition.label} lên`}>
                                                        <ChevronUp className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button type="button" onClick={() => moveWidget(widgetKey, 1)} disabled={selectedIndex === draftWidgets.length - 1} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-30" aria-label={`Đưa ${definition.label} xuống`}>
                                                        <ChevronDown className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                <button type="button" onClick={resetCustomization} className="inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Mặc định
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{draftWidgets.length}/4</span>
                                    <button type="button" onClick={saveCustomization} disabled={!draftWidgets.length} className="h-9 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white disabled:bg-slate-300">
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <DashboardWidgetGrid columns="xl:grid-cols-[1.65fr_1fr_1fr_1.12fr]">
                {selectedWidgets.map((widgetKey) => {
                    const definition = BUSINESS_LIST_DASHBOARD_WIDGET_REGISTRY[widgetKey];
                    const Widget = definition.component;
                    return <Widget key={definition.key} data={data} />;
                })}
            </DashboardWidgetGrid>
        </section>
    );
}
