"use client";

import { useState } from "react";
import { BookOpen, WandSparkles, AlertTriangle } from "lucide-react";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import {
    Button,
    FieldLabel,
    Input,
    SectionCard,
    Textarea,
} from "./shared";
import {
    generateWatchContent,
    type WatchContentGenerationResult,
} from "@/domains/watch/shared/watch-content.helpers";

type Props = {
    values: WatchFormValues["content"];
    watchValues: WatchFormValues;
    onChange: (patch: Partial<WatchFormValues["content"]>) => void;
    onOpenSpecModal: () => void;
};

export default function WatchContentSection({
    values,
    watchValues,
    onChange,
    onOpenSpecModal,
}: Props) {
    const [generation, setGeneration] =
        useState<WatchContentGenerationResult | null>(null);

    const bulletSpecs = Array.isArray(values.bulletSpecs)
        ? values.bulletSpecs
        : [];

    const handleGenerate = () => {
        const result = generateWatchContent(watchValues);

        onChange({
            titleOverride: result.titleOverride,
            hookText: result.hookText,
            bulletSpecs: result.bulletSpecs,
            hashtags: result.hashtags,
        });

        setGeneration(result);
    };

    const updateBullet = (index: number, next: string) => {
        const items = [...bulletSpecs];
        items[index] = next;
        onChange({ bulletSpecs: items });
    };

    const removeBullet = (index: number) => {
        onChange({
            bulletSpecs: bulletSpecs.filter((_, i) => i !== index),
        });
    };

    const addBullet = () => {
        onChange({
            bulletSpecs: [...bulletSpecs, ""],
        });
    };

    return (
        <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Content"
            subtitle="Gen hook & bullet specs từ dữ liệu spec hiện có."
        >
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-50/60 p-4 ring-1 ring-inset ring-indigo-100">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">
                            Gen nhanh nội dung bán hàng
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                            Hệ thống sẽ dùng brand, movement, size, dial, material và giá bán để tạo hook + bullet specs.
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGenerate}
                        className="shrink-0"
                    >
                        <WandSparkles className="mr-2 h-4 w-4" />
                        Gen hook & bullet specs
                    </Button>
                </div>
                <div>
                    <FieldLabel>TITLE</FieldLabel>
                    <input
                        value={values.titleOverride}
                        onChange={(e) =>
                            onChange({
                                titleOverride: e.target.value,
                            })
                        }
                        placeholder="Title bài đăng sau khi gen"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                    />
                </div>
                {generation?.warnings?.length ? (
                    <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-amber-800">
                                    Content đã được gen, nhưng còn thiếu dữ liệu spec.
                                </div>

                                <div className="mt-2 space-y-1 text-sm text-amber-800/90">
                                    {generation.warnings.map((item) => (
                                        <div key={item.field}>
                                            • {item.message}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onOpenSpecModal}
                                    className="mt-3 border-amber-200 bg-white/80 text-amber-800 hover:bg-white"
                                >
                                    Bổ sung spec & vật liệu
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div>
                    <FieldLabel>Hook</FieldLabel>
                    <Textarea
                        rows={3}
                        value={values.hookText}
                        onChange={(e) =>
                            onChange({ hookText: e.target.value })
                        }
                        placeholder="Hook"
                    />
                </div>

                <div>
                    <FieldLabel>Body</FieldLabel>
                    <Textarea
                        rows={8}
                        value={values.body}
                        onChange={(e) => onChange({ body: e.target.value })}
                        placeholder="Body"
                    />
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <FieldLabel>Bullet specs</FieldLabel>

                        <button
                            type="button"
                            onClick={addBullet}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            + Thêm bullet
                        </button>
                    </div>

                    {bulletSpecs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                            Chưa có bullet specs.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {bulletSpecs.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200"
                                >
                                    <Input
                                        value={item}
                                        onChange={(e) =>
                                            updateBullet(index, e.target.value)
                                        }
                                        placeholder={`Bullet ${index + 1}`}
                                        className="border-b-0"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeBullet(index)}
                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SectionCard>
    );
}