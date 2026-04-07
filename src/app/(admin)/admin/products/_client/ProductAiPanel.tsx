'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, FileImage, Save, Wand2 } from 'lucide-react';

export type GeneratedPayload = {
    specBullets: string[];
    promoteShort: string;
    promoteLong: string;
    facebookCaption: string;
    instagramCaption: string;
    titleOptions: string[];
    hashtags: string[];
    missingData: string[];
    safetyNotes: string[];
};

type TonePreset = 'balanced' | 'refined' | 'collector' | 'sales' | 'listing';

type Props = {
    productId: string;
    previewImageUrl?: string;
    images: { key?: string; url: string }[];
    brands?: Array<{ id: string; name: string }>;
    categories?: Array<{ id: string; name: string }>;
    title?: string;
    brandId?: string;
    categoryId?: string;
    watchSpec: any;
    initialContent: GeneratedPayload;
    onContentChange: (payload: GeneratedPayload) => void;
    onSaveContent: (
        payload: GeneratedPayload,
        meta: { hint: string; sample: string; tonePreset: string; focusPoints: string[] }
    ) => Promise<void>;
    onApplyExtractedSpecs: (patch: any) => void;
};

const FOCUS_OPTIONS = [
    { value: 'dial', label: 'Dial' },
    { value: 'case', label: 'Case' },
    { value: 'condition', label: 'Condition' },
    { value: 'movement', label: 'Movement' },
    { value: 'wearability', label: 'Độ đeo' },
    { value: 'rarity', label: 'Tính sưu tầm' },
    { value: 'accessories', label: 'Phụ kiện' },
];

const TONE_PRESETS: Array<{ value: TonePreset; label: string }> = [
    { value: 'balanced', label: 'Cân bằng' },
    { value: 'refined', label: 'Tinh tế' },
    { value: 'collector', label: 'Người chơi' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'listing', label: 'Listing' },
];

const emptyGenerated: GeneratedPayload = {
    specBullets: [],
    promoteShort: '',
    promoteLong: '',
    facebookCaption: '',
    instagramCaption: '',
    titleOptions: [],
    hashtags: [],
    missingData: [],
    safetyNotes: [],
};

export default function ProductAiPanel({
    productId,
    previewImageUrl,
    images,
    brands = [],
    categories = [],
    title,
    brandId,
    categoryId,
    watchSpec,
    initialContent,
    onContentChange,
    onSaveContent,
    onApplyExtractedSpecs,
}: Props) {
    const [extracting, setExtracting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [extractPreview, setExtractPreview] = useState<any | null>(null);
    const [hint, setHint] = useState('');
    const [sample, setSample] = useState('');
    const [tonePreset, setTonePreset] = useState<TonePreset>('balanced');
    const [focusPoints, setFocusPoints] = useState<string[]>(['dial', 'wearability']);
    const [localContent, setLocalContent] = useState<GeneratedPayload>(initialContent || emptyGenerated);
    const [statusMessage, setStatusMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'spec' | 'promote' | 'social'>('spec');

    const brandName = useMemo(
        () => brands.find((b) => String(b.id) === String(brandId))?.name || '—',
        [brands, brandId]
    );

    const categoryName = useMemo(
        () => categories.find((c) => String(c.id) === String(categoryId))?.name || '—',
        [categories, categoryId]
    );

    const imageForDisplay = previewImageUrl || images?.[0]?.url || '';

    const toggleFocusPoint = (value: string) => {
        setFocusPoints((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const extractSpec = async () => {
        setStatusMessage('');
        setExtracting(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/spec-extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || 'Nhận diện spec thất bại.');
            setExtractPreview(data?.spec ?? null);
            setStatusMessage('Đã nhận diện spec từ ảnh. Xem lại trước khi áp vào form.');
        } catch (e: any) {
            alert(e?.message || 'Nhận diện spec thất bại.');
        } finally {
            setExtracting(false);
        }
    };

    const applyExtractedSpec = () => {
        if (!extractPreview) return;
        onApplyExtractedSpecs(extractPreview);
        setStatusMessage('Đã áp spec AI vào form. Bạn có thể chỉnh tay trước khi generate content.');
    };

    const generateContent = async () => {
        setStatusMessage('');
        setGenerating(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/content/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watchSpec,
                    promptHint: hint,
                    toneSample: sample,
                    tonePreset,
                    focusPoints,
                }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || 'Generate content thất bại.');
            const generated = { ...emptyGenerated, ...(data?.generated ?? {}) };
            setLocalContent(generated);
            onContentChange(generated);
            setStatusMessage(
                data?.meta?.mode === 'openai'
                    ? `Đã generate bằng OpenAI${data?.meta?.model ? ` · ${data.meta.model}` : ''}.`
                    : data?.meta?.message || 'Đã generate bằng fallback rule-based.'
            );
        } catch (e: any) {
            alert(e?.message || 'Generate content thất bại.');
        } finally {
            setGenerating(false);
        }
    };

    const saveContent = async () => {
        setSaving(true);
        try {
            await onSaveContent(localContent, {
                hint,
                sample,
                tonePreset,
                focusPoints,
            });
            setStatusMessage('Đã lưu ProductContent.');
        } catch (e: any) {
            alert(e?.message || 'Lưu ProductContent thất bại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">AI workflow</h2>
                    <p className="text-sm leading-7 text-slate-500">
                        Bước 1 nhận diện spec từ ảnh, bước 2 áp spec vào form, bước 3 generate nội dung theo tone bạn muốn.
                    </p>
                </div>
            </div>

            <div className="space-y-5 px-5 pb-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Bước 1 · Ảnh hiện tại
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {imageForDisplay ? (
                                <img src={imageForDisplay} alt={title || 'product'} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 space-y-1 text-sm">
                            <div className="line-clamp-2 font-semibold text-slate-900">
                                {title || 'Chưa có tên sản phẩm'}
                            </div>
                            <div className="text-slate-500">Brand: {brandName}</div>
                            <div className="text-slate-500">Category: {categoryName}</div>
                            <div className="text-slate-500">
                                Ảnh dùng cho AI: {images?.length || (imageForDisplay ? 1 : 0)}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={extractSpec}
                        disabled={extracting || (!imageForDisplay && images.length === 0)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FileImage className="h-4 w-4" />
                        {extracting ? 'Đang phân tích...' : 'Nhận diện spec từ ảnh'}
                    </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Bước 2 · Preview spec AI nhận diện
                    </div>

                    {extractPreview ? (
                        <>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {Object.entries(extractPreview).map(([key, value]) => (
                                    <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                            {key}
                                        </div>
                                        <div className="mt-1 text-slate-900">
                                            {Array.isArray(value) ? value.join(', ') : String(value ?? '—')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={applyExtractedSpec}
                                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Áp spec vào form
                            </button>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                            Chưa có preview spec. Hãy bấm “Nhận diện spec từ ảnh” ở bước 1.
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Bước 3 · Generate nội dung từ spec
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Gợi ý cho AI
                            </label>
                            <textarea
                                value={hint}
                                onChange={(e) => setHint(e.target.value)}
                                rows={4}
                                placeholder="Ví dụ: nhấn mạnh dial đẹp, form cổ điển, giọng văn tinh tế, không phô trương..."
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Mẫu văn phong tham chiếu
                            </label>
                            <textarea
                                value={sample}
                                onChange={(e) => setSample(e.target.value)}
                                rows={4}
                                placeholder="Dán một đoạn caption mẫu bạn thích để AI học đúng tone viết của shop..."
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Tone preset
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TONE_PRESETS.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setTonePreset(item.value)}
                                        className={[
                                            'rounded-full px-3 py-2 text-sm transition',
                                            tonePreset === item.value
                                                ? 'bg-slate-950 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Điểm cần nhấn
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {FOCUS_OPTIONS.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => toggleFocusPoint(item.value)}
                                        className={[
                                            'rounded-full px-3 py-2 text-sm transition',
                                            focusPoints.includes(item.value)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={generateContent}
                                disabled={generating}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Wand2 className="h-4 w-4" />
                                {generating ? 'Đang generate...' : 'Generate nội dung từ spec'}
                            </button>

                            <button
                                type="button"
                                onClick={saveContent}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'Đang lưu...' : 'Lưu ProductContent'}
                            </button>
                        </div>
                    </div>
                </div>

                {statusMessage ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {statusMessage}
                    </div>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-900">Thiếu dữ liệu</div>
                        <div className="text-sm text-slate-600">
                            {localContent.missingData?.length
                                ? localContent.missingData.join(', ')
                                : 'Hiện đủ dữ liệu nền tảng để generate khá ổn.'}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-amber-900">Safety notes</div>
                        <div className="text-sm text-amber-800">
                            {localContent.safetyNotes?.length
                                ? localContent.safetyNotes.join(' ')
                                : 'Không có cảnh báo thêm.'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                    {[
                        ['spec', 'Spec'],
                        ['promote', 'Promote'],
                        ['social', 'Social'],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key as any)}
                            className={[
                                'rounded-full px-4 py-2 text-sm transition',
                                activeTab === key
                                    ? 'bg-slate-950 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                            ].join(' ')}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {activeTab === 'spec' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Spec bullets
                            </label>
                            <textarea
                                value={(localContent.specBullets ?? []).join('\n')}
                                onChange={(e) => {
                                    const next = {
                                        ...localContent,
                                        specBullets: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean),
                                    };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={8}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Tiêu đề gợi ý
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {(localContent.titleOptions ?? []).length ? (
                                    localContent.titleOptions.map((item, idx) => (
                                        <div
                                            key={`${item}-${idx}`}
                                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                                        >
                                            {item}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400">Chưa có tiêu đề gợi ý.</span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                {activeTab === 'promote' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Promote short
                            </label>
                            <textarea
                                value={localContent.promoteShort ?? ''}
                                onChange={(e) => {
                                    const next = { ...localContent, promoteShort: e.target.value };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={5}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Promote long
                            </label>
                            <textarea
                                value={localContent.promoteLong ?? ''}
                                onChange={(e) => {
                                    const next = { ...localContent, promoteLong: e.target.value };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={10}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>
                ) : null}

                {activeTab === 'social' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Facebook caption
                            </label>
                            <textarea
                                value={localContent.facebookCaption ?? ''}
                                onChange={(e) => {
                                    const next = { ...localContent, facebookCaption: e.target.value };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={7}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Instagram caption
                            </label>
                            <textarea
                                value={localContent.instagramCaption ?? ''}
                                onChange={(e) => {
                                    const next = { ...localContent, instagramCaption: e.target.value };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={7}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                Hashtags
                            </label>
                            <textarea
                                value={(localContent.hashtags ?? []).join(' ')}
                                onChange={(e) => {
                                    const next = {
                                        ...localContent,
                                        hashtags: e.target.value.split(/\s+/).map((x) => x.trim()).filter(Boolean),
                                    };
                                    setLocalContent(next);
                                    onContentChange(next);
                                }}
                                rows={3}
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}