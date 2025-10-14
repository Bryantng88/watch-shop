'use client';

import { useMemo, useState, useEffect } from 'react';

type BaseItem = { id: string; name: string } & Record<string, any>;

type Props<T extends BaseItem> = {
    items: T[];
    active: Set<string>;
    onToggle: (id: string) => void;
    /** Khóa để hiển thị số đếm, ví dụ 'count' | 'productCount' */
    countKey?: keyof T;
    /** Bật/tắt ô search */
    withSearch?: boolean;
    placeholder?: string;
    /** Số item hiển thị trước khi show-more */
    visible?: number;
};

export default function FilterList<T extends BaseItem>({
    items,
    active,
    onToggle,
    countKey,
    withSearch = true,
    placeholder = 'Search…',
    visible = 6,
}: Props<T>) {
    const [query, setQuery] = useState('');
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        // Reset "show more" khi danh sách hoặc query đổi
        setShowMore(false);
    }, [items, query]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!withSearch || !q) return items;
        return items.filter((it) => it.name.toLowerCase().includes(q));
    }, [items, query, withSearch]);

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
                {list.map((it) => {
                    const count =
                        countKey && typeof it[countKey] === 'number'
                            ? (it[countKey] as number)
                            : undefined;

                    return (
                        <li key={it.id}>
                            <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={active.has(it.id)}
                                        onChange={() => onToggle(it.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                    />
                                    <span>{it.name}</span>
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
