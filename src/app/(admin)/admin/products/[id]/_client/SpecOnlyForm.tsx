"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/feedback/AppToastProvider";

export default function ProductSpecOnlyForm({
    product,
    movementOptions,
    caseMaterialOptions,
    glassOptions,
}: {
    product: any;
    movementOptions: Array<{ value: string; label: string }>;
    caseMaterialOptions: Array<{ value: string; label: string }>;
    glassOptions: Array<{ value: string; label: string }>;
}) {
    const router = useRouter();
    const notify = useNotify();
    const [saving, setSaving] = React.useState(false);

    const [form, setForm] = React.useState({
        movement: product?.watchSpec?.movement || "AUTOMATIC",
        caliber: product?.watchSpec?.caliber || "",
        model: product?.watchSpec?.model || "",
        ref: product?.watchSpec?.ref || "",
        caseMaterial: product?.watchSpec?.caseMaterial || "STAINLESS_STEEL",
        glass: product?.watchSpec?.glass || "MINERAL",
        caseSize: product?.watchSpec?.caseSize || "",
        dialColor: product?.watchSpec?.dialColor || "",
    });

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();

        try {
            setSaving(true);

            const res = await fetch(`/api/admin/products/${product.id}/spec`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Không thể lưu watch spec");

            notify.success({
                title: "Đã lưu watch spec",
                message: "Thông số kỹ thuật của sản phẩm đã được cập nhật.",
            });

            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Lưu watch spec thất bại",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Movement</div>
                    <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.movement}
                        onChange={(e) => setForm((prev) => ({ ...prev, movement: e.target.value }))}
                    >
                        {movementOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Movement calibre</div>
                    <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.caliber}
                        onChange={(e) => setForm((prev) => ({ ...prev, caliber: e.target.value }))}
                    />
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Model</div>
                    <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.model}
                        onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
                    />
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Ref</div>
                    <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.ref}
                        onChange={(e) => setForm((prev) => ({ ...prev, ref: e.target.value }))}
                    />
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Case material</div>
                    <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.caseMaterial}
                        onChange={(e) => setForm((prev) => ({ ...prev, caseMaterial: e.target.value }))}
                    >
                        {caseMaterialOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Glass</div>
                    <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.glass}
                        onChange={(e) => setForm((prev) => ({ ...prev, glass: e.target.value }))}
                    >
                        {glassOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Case size</div>
                    <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.caseSize}
                        onChange={(e) => setForm((prev) => ({ ...prev, caseSize: e.target.value }))}
                    />
                </label>

                <label className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Dial color</div>
                    <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={form.dialColor}
                        onChange={(e) => setForm((prev) => ({ ...prev, dialColor: e.target.value }))}
                    />
                </label>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
                    onClick={() => router.back()}
                >
                    Quay lại
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                    {saving ? "Đang lưu..." : "Lưu watch spec"}
                </button>
            </div>
        </form>
    );
}