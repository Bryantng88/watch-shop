"use client";

import { BookOpen } from "lucide-react";
import { FieldLabel, SectionCard, Textarea } from "./shared";
import type { WatchFormValues } from "../../client/form/watch-form.types";

type Props = {
    values: WatchFormValues["content"];
    onChange: (patch: Partial<WatchFormValues["content"]>) => void;
};

function BulletSpecsEditor({
    items,
    onChange,
}: {
    items: string[];
    onChange: (next: string[]) => void;
}) {
    const updateItem = (index: number, value: string) => {
        const next = [...items];
        next[index] = value;
        onChange(next);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...(items || []), ""]);
    };

    return (
        <div className="space-y-3">
            {(items || []).length ? (
                items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <Textarea
                            rows={2}
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            placeholder="Nhập bullet spec..."
                            className="min-h-[72px]"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="h-[44px] shrink-0 rounded-2xl border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Xóa
                        </button>
                    </div>
                ))
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Chưa có bullet specs.
                </div>
            )}

            <button
                type="button"
                onClick={addItem}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
                + Thêm bullet
            </button>
        </div>
    );
}

export default function WatchContentSection({ values, onChange }: Props) {
    return (
        <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Content"
            subtitle="Chỉ giữ những gì thực sự dùng trong thao tác content."
        >
            <div className="space-y-4">
                <div>
                    <FieldLabel>Hook</FieldLabel>
                    <Textarea
                        rows={3}
                        value={values.hookText}
                        onChange={(e) => onChange({ hookText: e.target.value })}
                        placeholder="Hook"
                        className="min-h-[88px]"
                    />
                </div>

                <div>
                    <FieldLabel>Body</FieldLabel>
                    <Textarea
                        rows={8}
                        value={values.body}
                        onChange={(e) => onChange({ body: e.target.value })}
                        placeholder="Body"
                        className="min-h-[220px]"
                    />
                </div>

                <div>
                    <FieldLabel>Bullet specs</FieldLabel>
                    <BulletSpecsEditor
                        items={values.bulletSpecs}
                        onChange={(next) => onChange({ bulletSpecs: next })}
                    />
                </div>
            </div>
        </SectionCard>
    );
}