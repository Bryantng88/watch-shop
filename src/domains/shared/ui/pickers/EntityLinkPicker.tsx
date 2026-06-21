"use client";

import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

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
    onChange: (id: string | null) => void;
    search: (input: {
        type: EntityLinkType;
        q: string;
    }) => Promise<EntityLinkOption[]>;
};

export default function EntityLinkPicker({
    type,
    label,
    value,
    onChange,
    search,
}: Props) {
    const [q, setQ] = useState("");
    const [items, setItems] = useState<EntityLinkOption[]>([]);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

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
            {value ? (
                <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-3 py-2 text-sm text-white">
                    <span className="truncate font-semibold">Đã chọn: {value}</span>

                    <button
                        type="button"
                        onClick={() => {
                            onChange(null);
                            setQ("");
                            setItems([]);
                        }}
                        className="ml-3 rounded-full p-1 hover:bg-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
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
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(item.id);
                                        setQ("");
                                        setItems([]);
                                    }}
                                    className="block w-full border-b border-slate-100 px-3 py-2 text-left last:border-b-0 hover:bg-slate-50"
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
                            ))}
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}