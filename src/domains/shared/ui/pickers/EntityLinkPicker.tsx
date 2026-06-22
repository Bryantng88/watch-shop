"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type EntityLinkType = "WATCH" | "ORDER" | "SHIPMENT" | "SERVICE";

export type EntityLinkOption = {
    id: string;
    label: string;
    sublabel?: string | null;
};

type Props = {
    type: EntityLinkType;
    label: string;

    value?: string | null;
    onChange?: (id: string | null) => void;

    values?: string[];
    onValuesChange?: (ids: string[]) => void;

    search: (input: {
        type: EntityLinkType;
        q: string;
    }) => Promise<EntityLinkOption[]>;

    multiple?: boolean;
};

export default function EntityLinkPicker({
    type,
    label,
    value,
    onChange,
    values,
    onValuesChange,
    search,
    multiple = false,
}: Props) {
    const [q, setQ] = useState("");
    const [items, setItems] = useState<EntityLinkOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<EntityLinkOption[]>([]);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const selectedIds = useMemo(() => {
        return multiple ? values ?? [] : value ? [value] : [];
    }, [multiple, values, value]);

    useEffect(() => {
        setItems([]);
        setQ("");
        setError(null);
    }, [type]);

    function commitSingle(option: EntityLinkOption) {
        onChange?.(option.id);
        setSelectedOptions([option]);
        setQ("");
        setItems([]);
    }

    function commitMulti(option: EntityLinkOption) {
        const current = values ?? [];

        if (current.includes(option.id)) {
            setQ("");
            setItems([]);
            return;
        }

        onValuesChange?.([...current, option.id]);
        setSelectedOptions((prev) => {
            if (prev.some((item) => item.id === option.id)) return prev;
            return [...prev, option];
        });

        setQ("");
        setItems([]);
    }

    function removeId(id: string) {
        if (multiple) {
            onValuesChange?.((values ?? []).filter((item) => item !== id));
            setSelectedOptions((prev) => prev.filter((item) => item.id !== id));
            return;
        }

        onChange?.(null);
        setSelectedOptions([]);
        setQ("");
        setItems([]);
    }

    function runSearch() {
        const clean = q.trim();

        if (!clean) {
            setItems([]);
            setError(null);
            return;
        }

        startTransition(async () => {
            try {
                setError(null);
                const rows = await search({ type, q: clean });
                setItems(rows);
            } catch (err: any) {
                setItems([]);
                setError(err?.message || "Không thể tìm dữ liệu.");
            }
        });
    }

    return (
        <div className="mt-3 space-y-2">
            {selectedIds.length ? (
                <div className="space-y-2">
                    {selectedIds.map((id) => {
                        const option = selectedOptions.find((item) => item.id === id);

                        return (
                            <div
                                key={id}
                                className={cn(
                                    "flex items-center justify-between rounded-2xl px-3 py-2 text-sm",
                                    multiple
                                        ? "bg-white text-slate-800 ring-1 ring-slate-200"
                                        : "bg-slate-950 text-white",
                                )}
                            >
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {option?.label || id}
                                    </div>

                                    {option?.sublabel ? (
                                        <div
                                            className={cn(
                                                "mt-0.5 truncate text-xs",
                                                multiple ? "text-slate-400" : "text-white/60",
                                            )}
                                        >
                                            {option.sublabel}
                                        </div>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeId(id)}
                                    className={cn(
                                        "ml-3 rounded-full p-1",
                                        multiple ? "hover:bg-slate-100" : "hover:bg-white/10",
                                    )}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {multiple || !selectedIds.length ? (
                <>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                        <Search className="h-4 w-4 shrink-0 text-slate-400" />

                        <input
                            value={q}
                            onChange={(event) => setQ(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    runSearch();
                                }
                            }}
                            placeholder={`Tìm ${label} theo ref, SKU, tên, ID...`}
                            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />

                        <button
                            type="button"
                            onClick={runSearch}
                            disabled={pending}
                            className="shrink-0 text-xs font-semibold text-slate-700 disabled:opacity-50"
                        >
                            {pending ? "Tìm..." : "Tìm"}
                        </button>
                    </div>

                    {error ? (
                        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    {items.length ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                            {items.map((item) => {
                                const selected = selectedIds.includes(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        disabled={selected}
                                        onClick={() => {
                                            if (multiple) commitMulti(item);
                                            else commitSingle(item);
                                        }}
                                        className={cn(
                                            "block w-full border-b border-slate-100 px-3 py-2 text-left last:border-b-0",
                                            selected
                                                ? "cursor-not-allowed bg-slate-50 opacity-50"
                                                : "hover:bg-slate-50",
                                        )}
                                    >
                                        <div className="line-clamp-1 text-sm font-semibold text-slate-900">
                                            {item.label}
                                        </div>

                                        {item.sublabel ? (
                                            <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                                {item.sublabel}
                                            </div>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </>
            ) : null}
        </div>
    );
}