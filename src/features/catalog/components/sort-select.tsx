// features/catalog/components/sort-select.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Sort = "default" | "low" | "high";

export default function SortSelect({ value }: { value: Sort }) {
    const router = useRouter();
    const params = useSearchParams();

    function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const v = e.target.value as Sort;
        const next = new URLSearchParams(params.toString());

        // để 'default' thì xoá param sort cho sạch URL
        if (v === "default") next.delete("sort");
        else next.set("sort", v);

        // đổi sort nên reset trang về 1
        next.delete("page");

        router.push(`/products?${next.toString()}`);
    }

    return (
        <select
            defaultValue={value}
            onChange={onChange}
            className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm outline-0"
        >
            <option value="default">Default sorting</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
        </select>
    );
}
