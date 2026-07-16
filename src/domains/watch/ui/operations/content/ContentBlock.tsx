"use client";

import { FileText, Sparkles } from "lucide-react";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell, Pill, textareaClass } from "../shared/OperationShell";

export default function ContentBlock({
    values,
    onChange,
    onSave,
}: {
    values: WatchWorkbenchValues;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
}) {
    const setContent = (patch: Partial<WatchWorkbenchValues["content"]>) =>
        onChange(updateValues(values, { content: patch }));

    return (
        <OperationShell
            id="content"
            number="3"
            title="Nội dung"
            icon={<FileText className="h-4 w-4" />}
            description="Mô tả, story và nội dung xoay quanh giúp tăng giá trị bán."
            actions={
                <>
                    <Pill>Draft</Pill>
                    <button type="button" className="h-9 rounded-md border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700">
                        <span className="inline-flex items-center gap-1"><Sparkles className="h-4 w-4" />Sinh content từ AI</span>
                    </button>
                    <button type="button" onClick={onSave} className="h-9 rounded-md bg-slate-950 px-3 text-xs font-bold text-white">
                        Làm gọn
                    </button>
                </>
            }
        >
            <div className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="grid gap-3">
                    <Field label="Title override">
                        <input className={inputClass} value={values.content.titleOverride} onChange={(event) => setContent({ titleOverride: event.target.value })} />
                    </Field>
                    <Field label="Mô tả (VI)">
                        <textarea className={textareaClass} value={values.content.hookText} onChange={(event) => setContent({ hookText: event.target.value })} />
                    </Field>
                    <Field label="Domain context">
                        <input className={inputClass} value={values.content.hashTags} onChange={(event) => setContent({ hashTags: event.target.value })} placeholder="retro, LED, dress, diver..." />
                    </Field>
                </div>

                <div className="grid gap-3">
                    <Field label="Summary">
                        <textarea className={textareaClass} value={values.content.body} onChange={(event) => setContent({ body: event.target.value })} />
                    </Field>
                    <Field label="Bullet points">
                        <textarea
                            className={textareaClass}
                            value={(values.content.bulletSpecs ?? []).join("\n")}
                            onChange={(event) => setContent({ bulletSpecs: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })}
                        />
                    </Field>
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 md:flex-row md:items-center md:justify-between">
                <span>Workbench chỉ lưu content draft và emit <b>watch.content.modified</b>. Gửi duyệt / duyệt nội dung chỉ nằm trong Workspace.</span>
                <button type="button" className="h-8 rounded-md border border-emerald-200 bg-white px-3 font-bold text-emerald-700">Mở Media WP</button>
            </div>
        </OperationShell>
    );
}
