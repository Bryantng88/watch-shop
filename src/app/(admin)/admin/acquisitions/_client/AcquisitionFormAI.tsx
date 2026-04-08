"use client";

import { useMemo, useState } from "react";
import { Sparkles, Save, Image as ImageIcon } from "lucide-react";

import ImagePicker from "@/app/(admin)/admin/products/_components/ImagePicker";

type Picked = { key: string; url: string };
type Vendor = { id: string; name: string };

type Props = {
    vendors: Vendor[];
};

export default function AcquisitionFormAI({ vendors }: Props) {
    const [images, setImages] = useState<Picked[]>([]);
    const [vendorId, setVendorId] = useState("");
    const [cost, setCost] = useState("");
    const [hintText, setHintText] = useState("");
    const [drafting, setDrafting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [aiDraft, setAiDraft] = useState<any>(null);

    const imageUrls = useMemo(
        () => images.map((i) => i.url).filter(Boolean),
        [images]
    );

    const vendorName = useMemo(
        () => vendors.find((v) => v.id === vendorId)?.name || null,
        [vendorId, vendors]
    );

    // ===== AI DRAFT =====
    const runDraft = async () => {
        setDrafting(true);

        try {
            const res = await fetch("/api/admin/acquisitions/ai-draft", {
                method: "POST",
                body: JSON.stringify({
                    imageUrls,
                    vendorName,
                    cost: cost ? Number(cost) : null,
                    hintText,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            setAiDraft(data);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDrafting(false);
        }
    };

    // ===== CREATE =====
    const create = async () => {
        setSaving(true);

        try {
            const res = await fetch("/api/admin/acquisitions/create-with-ai", {
                method: "POST",
                body: JSON.stringify({
                    imageUrls,
                    vendorId,
                    vendorName,
                    cost: Number(cost),
                    hintText,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            alert("Tạo phiếu nhập + product draft thành công");
            console.log(data);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="col-span-12 xl:col-span-8 space-y-6">
                {/* IMAGE */}
                <div className="rounded-2xl border p-5 space-y-3">
                    <div className="text-sm font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Hình sản phẩm
                    </div>

                    <ImagePicker value={images} onChange={setImages as any} />
                </div>

                {/* BASIC */}
                <div className="rounded-2xl border p-5 space-y-4">
                    <div className="text-sm font-semibold">Thông tin nhập</div>

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={vendorId}
                            onChange={(e) => setVendorId(e.target.value)}
                            className="h-[42px] rounded-xl border px-3"
                        >
                            <option value="">Chọn vendor</option>
                            {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Giá nhập"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="h-[42px] rounded-xl border px-3"
                        />
                    </div>

                    <input
                        placeholder="Gợi ý thêm (vd: niềng 18K gold, máy pin...)"
                        value={hintText}
                        onChange={(e) => setHintText(e.target.value)}
                        className="h-[42px] rounded-xl border px-3 w-full"
                    />
                </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
                {/* ACTION */}
                <div className="rounded-2xl border p-4 space-y-3">
                    <button
                        onClick={runDraft}
                        disabled={!imageUrls.length}
                        className="w-full h-[42px] rounded-xl bg-black text-white flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {drafting ? "Đang phân tích..." : "AI Generate Draft"}
                    </button>

                    <button
                        onClick={create}
                        disabled={!vendorId || !cost}
                        className="w-full h-[42px] rounded-xl border flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Đang tạo..." : "Post phiếu nhập"}
                    </button>
                </div>

                {/* AI RESULT */}
                {aiDraft && (
                    <>
                        {/* TITLE */}
                        <div className="rounded-2xl border p-4 space-y-2">
                            <div className="text-xs text-gray-500">Title</div>
                            <div className="font-semibold">
                                {aiDraft.generatedDraft.generatedTitle}
                            </div>
                        </div>

                        {/* SPEC */}
                        <div className="rounded-2xl border p-4 space-y-2 text-sm">
                            <div>Brand: {aiDraft.extractedSpec.brandName || "—"}</div>
                            <div>Model: {aiDraft.extractedSpec.modelFamily || "—"}</div>
                            <div>Movement: {aiDraft.extractedSpec.movement || "—"}</div>
                            <div>Material: {aiDraft.extractedSpec.caseMaterial || "—"}</div>
                            <div>Dial: {aiDraft.extractedSpec.dialColor || "—"}</div>
                        </div>

                        {/* REF */}
                        <div className="rounded-2xl border p-4 space-y-2 text-sm">
                            <div className="font-semibold">Ref candidates</div>
                            {aiDraft.extractedSpec.refCandidates?.map((r: any) => (
                                <div key={r.value}>
                                    {r.value} ({r.confidence})
                                </div>
                            ))}
                        </div>

                        {/* NEED MORE */}
                        <div className="rounded-2xl border p-4 text-sm">
                            {aiDraft.extractedSpec.needsMoreImages?.map((i: string) => (
                                <div key={i}>• {i}</div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}