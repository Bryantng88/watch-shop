'use client';

import { useMemo, useState, useEffect } from 'react';

type BaseItem = Record<string, any>;

type StringKeyOf<T> = {
    [K in keyof T]-?: T[K] extends string ? K : never
}[keyof T];

type Props<T extends BaseItem> = {
    items: T[];
    active: Set<string>;
    onToggle: (key: string) => void;
    /** Khóa để hiển thị số đếm, ví dụ 'count' | 'productCount' */
    countKey?: keyof T;
    /** Bật/tắt ô search */
    keyField?: StringKeyOf<T>;
    /** Field hiển thị label (vd 'name' | 'sizeCategory'), mặc định 'name' */
    labelField?: StringKeyOf<T>;
    /** Field dùng để search (mặc định = labelField) */
    searchField?: StringKeyOf<T>;

    withSearch?: boolean;
    placeholder?: string;
    /** Số item hiển thị trước khi show-more */
    visible?: number;
    alwaysOpen?: boolean;
}
export default function FilterList<T extends BaseItem>({
    items,
    active,
    onToggle,
    countKey,
    keyField,
    labelField,
    searchField,
    withSearch = true,
    placeholder = 'Search…',
    visible = 6,
    alwaysOpen = true,

}: Props<T>) {
    const kField = (keyField ?? ('id' as StringKeyOf<T>));
    const lField = (labelField ?? ('name' as StringKeyOf<T>));
    const sField = (searchField ?? lField);

    const [query, setQuery] = useState('');
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        // Reset "show more" khi danh sách hoặc query đổi
        setShowMore(false);
    }, [items, query]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!withSearch || !q) return items;
        return items.filter((it) => {
            const val = it[sField];
            return typeof val === 'string' && val.toLowerCase().includes(q);
        })
    }, [items, query, withSearch, sField]);

    const list = showMore ? filtered : filtered.slice(0, visible);

    return (
        <div>
            {withSearch && (
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
            )}

            <ul className="space-y-2">
                {list.map((it, idx) => {
                    const keyVal = String(it[kField]);      // khóa toggle (id hoặc name)
                    const label = String(it[lField] ?? ''); // text hiển thị
                    const count =
                        countKey && typeof it[countKey] === 'number'
                            ? (it[countKey] as number)
                            : undefined;
                    const reactKey = keyVal || `row-${idx}`;
                    return (
                        <li key={reactKey}>
                            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={active.has(keyVal)}
                                        onChange={() => onToggle(keyVal)}
                                        className="h-3 w-3 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                    />
                                    <span>{label}</span>
                                </div>
                                {typeof count === 'number' && (
                                    <span className="text-xs text-gray-400">({count})</span>
                                )}
                            </label>
                        </li>
                    );
                })}
            </ul>

            {filtered.length > visible && (
                <button
                    onClick={() => setShowMore((s) => !s)}
                    className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline underline-offset-2"
                >
                    {showMore ? 'Show less' : `Show more (${filtered.length - visible})`}
                </button>
            )}
        </div>
    );
}
