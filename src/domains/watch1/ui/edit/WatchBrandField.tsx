"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createQuickBrand } from "../../client/form/watch-brand.actions";
import { Button, FieldLabel, Input, Select } from "./shared";

type BrandOption = {
    id: string;
    name: string;
    slug?: string | null;
};

type Props = {
    value: string;
    brands: BrandOption[];
    onBrandsChange: (brands: BrandOption[]) => void;
    onChange: (brandId: string) => void;
};

export default function WatchBrandField({
    value,
    brands,
    onBrandsChange,
    onChange,
}: Props) {
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState("");
    const [pending, startTransition] = useTransition();

    const options = brands.map((x) => ({
        value: x.id,
        label: x.name,
    }));

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel>Brand</FieldLabel>

                {!creating ? (
                    <button
                        type="button"
                        onClick={() => setCreating(true)}
                        className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Brand mới
                    </button>
                ) : null}
            </div>

            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                options={options}
                placeholder="Chọn brand"
            />

            {creating ? (
                <div className="mt-3 rounded-2xl bg-indigo-50/60 p-3 ring-1 ring-inset ring-indigo-100">
                    <div className="flex items-end gap-2">
                        <div className="min-w-0 flex-1">
                            <FieldLabel>Tên brand mới</FieldLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ví dụ: Universal Genève"
                            />
                        </div>

                        <Button
                            type="button"
                            disabled={pending || !name.trim()}
                            onClick={() => {
                                startTransition(async () => {
                                    try {
                                        const brand = await createQuickBrand(name);

                                        onBrandsChange(
                                            [...brands, brand].sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                            )
                                        );

                                        onChange(brand.id);
                                        setName("");
                                        setCreating(false);
                                    } catch (error: any) {
                                        alert(error?.message || "Không thể tạo brand.");
                                    }
                                });
                            }}
                        >
                            Thêm
                        </Button>

                        <button
                            type="button"
                            onClick={() => {
                                setName("");
                                setCreating(false);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}