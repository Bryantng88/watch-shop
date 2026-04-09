'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Loader2, Save, Sparkles } from 'lucide-react';

import type { GeneratedPayload } from '@/app/(admin)/admin/products/_server/product-ai.type';

type PickedImage = { key: string; url: string };
type Brand = { id: string; name: string };
type Category = { id: string; name: string; scope?: string };

type WatchSpecInput = {
    ref?: string | null;
    model?: string | null;
    year?: string | null;
    caseType?: string | null;
    gender?: string | null;
    movement?: string | null;
    caliber?: string | null;
    caseMaterial?: string | null;
    goldKarat?: number | string | null;
    goldColor?: string | null;
    width?: number | string | null;
    length?: number | string | null;
    thickness?: number | string | null;
    strap?: string | null;
    glass?: string | null;
    dialColor?: string | null;
    dialCondition?: string | null;
    boxIncluded?: boolean | null;
    bookletIncluded?: boolean | null;
    cardIncluded?: boolean | null;
};

export type ProductContentPromptMeta = {
    narrative: string;
    audience: string;
    structure: string;
    tonePreset: string;
    focusPoints: string[];
    customBrief: string;
    bannedPhrases: string;
    referenceSample: string;
    forceSections: string[];
};

type Props = {
    productId: string;
    previewImageUrl?: string | null;
    images: PickedImage[];
    brands: Brand[];
    categories: Category[];
    title: string;
    brandId: string;
    categoryId: string;
    watchSpec: WatchSpecInput;
    initialContent: GeneratedPayload;
    onContentChange: (payload: GeneratedPayload) => void;
    onSaveContent: (payload: GeneratedPayload, promptMeta: ProductContentPromptMeta) => Promise<void>;
};

const TONE_PRESETS = [
    { label: 'Cân bằng', value: 'balanced' },
    { label: 'Tinh tế', value: 'refined' },
    { label: 'Người chơi', value: 'collector' },
    { label: 'Bán hàng', value: 'sales' },
    { label: 'Minimal Japan', value: 'minimal_japan' },
    { label: 'Quiet luxury', value: 'quiet_luxury' },
];

const NARRATIVE_OPTIONS = [
    { label: 'Vintage feel', value: 'vintage' },
    { label: 'Dress elegance', value: 'dress' },
    { label: 'Daily wearable', value: 'daily' },
    { label: 'Collector piece', value: 'collector' },
    { label: 'Quiet luxury', value: 'quiet_luxury' },
    { label: 'Design-first', value: 'design_first' },
];

const AUDIENCE_OPTIONS = [
    { label: 'Người mới chơi', value: 'beginner' },
    { label: 'Người chơi lâu năm', value: 'collector' },
    { label: 'Khách mua đeo hằng ngày', value: 'daily_buyer' },
    { label: 'Người thích dress watch', value: 'dress_buyer' },
    { label: 'Khách cần quà tặng', value: 'gift_buyer' },
];

const STRUCTURE_OPTIONS = [
    { label: 'Short listing', value: 'short_listing' },
    { label: 'Storytelling', value: 'storytelling' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Collector note', value: 'collector_note' },
];

const FOCUS_OPTIONS = [
    'Dial',
    'Case',
    'Condition',
    'Movement',
    'Độ đeo',
    'Vintage feel',
    'Collector angle',
    'Practical daily use',
    'Finishing',
    'Tỷ lệ cổ tay',
];

const FORCE_SECTION_OPTIONS = [
    'Opening hook',
    'Design insight',
    'Wearability note',
    'Practical ownership',
    'Collector note',
    'Soft disclaimer',
];

const defaultPayload: GeneratedPayload = {
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

function chipClass(active: boolean) {
    return active
        ? 'rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white'
        : 'rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200';
}

function labelOf<T extends { value: string; label: string }>(options: T[], value: string) {
    return options.find((item) => item.value === value)?.label ?? value;
}

function previewCardLine(label: string, value: string) {
    return value ? `${label}: ${value}` : null;
}

function FieldLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
    return (
        <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {children}
            </label>
            {right}
        </div>
    );
}

export default function ProductAiPanel(props: Props) {
    const {
        productId,
        previewImageUrl,
        images,
        brands,
        categories,
        title,
        brandId,
        categoryId,
        watchSpec,
        initialContent,
        onContentChange,
        onSaveContent,
    } = props;

    const [content, setContent] = useState<GeneratedPayload>(initialContent ?? defaultPayload);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [narrative, setNarrative] = useState('dress');
    const [audience, setAudience] = useState('daily_buyer');
    const [structure, setStructure] = useState('hybrid');
    const [tonePreset, setTonePreset] = useState('refined');
    const [focusPoints, setFocusPoints] = useState<string[]>(['Dial', 'Độ đeo']);
    const [forceSections, setForceSections] = useState<string[]>(['Opening hook', 'Design insight']);
    const [customBrief, setCustomBrief] = useState('');
    const [bannedPhrases, setBannedPhrases] = useState(
        'phù hợp nhiều đối tượng, dễ phối mọi phong cách, hoàn hảo cho mọi dịp, chiếc đồng hồ này rất đẹp'
    );
    const [referenceSample, setReferenceSample] = useState('');

    useEffect(() => {
        setContent(initialContent ?? defaultPayload);
    }, [initialContent]);

    const brandName = useMemo(
        () => brands.find((b) => b.id === brandId)?.name ?? '',
        [brands, brandId]
    );
    const categoryName = useMemo(
        () => categories.find((c) => c.id === categoryId)?.name ?? '',
        [categories, categoryId]
    );

    const previewFacts = useMemo(() => {
        return [
            previewCardLine('Brand', brandName),
            previewCardLine('Category', categoryName),
            previewCardLine('Ref', String(watchSpec.ref ?? '').trim()),
            previewCardLine('Model', String(watchSpec.model ?? '').trim()),
            previewCardLine('Movement', String(watchSpec.movement ?? '').trim()),
            previewCardLine('Dial', String(watchSpec.dialColor ?? '').trim()),
            previewCardLine('Size', String(watchSpec.width ?? '').trim() ? `${watchSpec.width}mm` : ''),
        ].filter(Boolean) as string[];
    }, [brandName, categoryName, watchSpec]);

    const promptPreview = useMemo(() => {
        return [
            labelOf(NARRATIVE_OPTIONS, narrative),
            labelOf(AUDIENCE_OPTIONS, audience),
            labelOf(STRUCTURE_OPTIONS, structure),
            labelOf(TONE_PRESETS, tonePreset),
            focusPoints.length ? `Focus: ${focusPoints.join(', ')}` : null,
            forceSections.length ? `Section: ${forceSections.join(', ')}` : null,
        ]
            .filter(Boolean)
            .join(' · ');
    }, [audience, forceSections, focusPoints, narrative, structure, tonePreset]);

    function setAndBubble(next: GeneratedPayload) {
        setContent(next);
        onContentChange(next);
    }

    function toggleFocus(value: string) {
        setFocusPoints((prev) => {
            if (prev.includes(value)) return prev.filter((item) => item !== value);
            if (prev.length >= 3) return prev;
            return [...prev, value];
        });
    }

    function toggleForceSection(value: string) {
        setForceSections((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    }

    async function handleGenerate() {
        setIsGenerating(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/products/${productId}/generate-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    brandName,
                    categoryName,
                    watchSpec,
                    images,
                    promptMeta: {
                        narrative,
                        audience,
                        structure,
                        tonePreset,
                        focusPoints,
                        customBrief,
                        bannedPhrases,
                        referenceSample,
                        forceSections,
                    },
                }),
            });

            const data = await res.json().catch(() => null);

            console.log('[PRODUCT_AI_PANEL][GENERATE_RESPONSE]', data);

            if (!res.ok) {
                throw new Error(data?.error || 'Generate nội dung thất bại.');
            }

            const generated = data?.generated ?? data?.payload ?? data?.data ?? null;

            if (!generated) {
                throw new Error('API generate thành công nhưng không trả về dữ liệu nội dung.');
            }

            const next: GeneratedPayload = {
                ...defaultPayload,
                specBullets: Array.isArray(generated.specBullets) ? generated.specBullets : [],
                promoteShort: generated.promoteShort ?? '',
                promoteLong: generated.promoteLong ?? '',
                facebookCaption: generated.facebookCaption ?? '',
                instagramCaption: generated.instagramCaption ?? '',
                titleOptions: Array.isArray(generated.titleOptions) ? generated.titleOptions : [],
                hashtags: Array.isArray(generated.hashtags) ? generated.hashtags : [],
                missingData: Array.isArray(generated.missingData) ? generated.missingData : [],
                safetyNotes: Array.isArray(generated.safetyNotes) ? generated.safetyNotes : [],
            };

            setAndBubble(next);
        } catch (e: any) {
            setError(e?.message || 'Generate nội dung thất bại.');
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSave() {
        setIsSaving(true);
        setError(null);
        try {
            await onSaveContent(content, {
                narrative,
                audience,
                structure,
                tonePreset,
                focusPoints,
                customBrief,
                bannedPhrases,
                referenceSample,
                forceSections,
            });
        } catch (e: any) {
            setError(e?.message || 'Lưu ProductContent thất bại.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">AI content workflow</h2>
                        <p className="text-sm leading-6 text-slate-500">
                            Bỏ nhận diện ảnh ở đây. Panel này chỉ tập trung vào hướng kể chuyện và generate nội dung từ spec đã chốt.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 px-5 py-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Nguồn spec hiện tại</div>
                    <div className="flex gap-3">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {previewImageUrl ? (
                                <img src={previewImageUrl} alt={title || 'preview'} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-900">{title || 'Untitled product'}</div>
                            <div className="mt-2 space-y-1 text-sm text-slate-500">
                                {previewFacts.map((line) => (
                                    <div key={line}>{line}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Bước 1 · Điều khiển prompt</div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <FieldLabel>Góc kể chuyện</FieldLabel>
                            <select value={narrative} onChange={(e) => setNarrative(e.target.value)} className="block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100">
                                {NARRATIVE_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel>Đối tượng người đọc</FieldLabel>
                            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100">
                                {AUDIENCE_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel>Cấu trúc nội dung</FieldLabel>
                            <select value={structure} onChange={(e) => setStructure(e.target.value)} className="block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100">
                                {STRUCTURE_OPTIONS.map((item) => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel>Tone preset</FieldLabel>
                            <div className="flex flex-wrap gap-2">
                                {TONE_PRESETS.map((item) => (
                                    <button key={item.value} type="button" className={chipClass(tonePreset === item.value)} onClick={() => setTonePreset(item.value)}>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <FieldLabel right={<span className="text-xs text-slate-400">Tối đa 3 mục</span>}>Điểm nhấn chính</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {FOCUS_OPTIONS.map((item) => (
                                <button key={item} type="button" className={chipClass(focusPoints.includes(item))} onClick={() => toggleFocus(item)}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <FieldLabel>Section bắt buộc</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {FORCE_SECTION_OPTIONS.map((item) => (
                                <button key={item} type="button" className={chipClass(forceSections.includes(item))} onClick={() => toggleForceSection(item)}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <FieldLabel>Brief thêm cho AI</FieldLabel>
                        <textarea value={customBrief} onChange={(e) => setCustomBrief(e.target.value)} rows={4} placeholder="Ví dụ: nhấn mạnh cảm giác champagne dial nhẹ, form dress nhưng vẫn đeo daily được; tránh giọng quảng cáo lộ liễu." className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                    </div>

                    <div>
                        <FieldLabel>Các phrase cần tránh</FieldLabel>
                        <textarea value={bannedPhrases} onChange={(e) => setBannedPhrases(e.target.value)} rows={3} className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                    </div>

                    <div>
                        <FieldLabel>Mẫu văn phong tham chiếu</FieldLabel>
                        <textarea value={referenceSample} onChange={(e) => setReferenceSample(e.target.value)} rows={4} placeholder="Dán 1 đoạn caption hoặc đoạn mô tả bạn từng viết đúng tone shop để AI bám theo." className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Bước 2 · Generate nội dung</div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleGenerate} disabled={isGenerating} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            {isGenerating ? 'Đang generate...' : 'Generate nội dung từ spec'}
                        </button>
                        <button type="button" onClick={handleSave} disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Lưu ProductContent
                        </button>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Prompt hiện tại: <span className="font-medium text-slate-800">{promptPreview}</span>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        <FileText className="h-4 w-4" />
                        Bước 3 · Preview output
                    </div>

                    <PreviewBlock label="Promote short" value={content.promoteShort} />
                    <PreviewBlock label="Promote long" value={content.promoteLong} multiline />
                    <PreviewList label="Spec bullets" items={content.specBullets} />
                    <PreviewBlock label="Facebook caption" value={content.facebookCaption} multiline />
                    <PreviewBlock label="Instagram caption" value={content.instagramCaption} multiline />
                    <PreviewList label="Title options" items={content.titleOptions} />
                    <PreviewList label="Hashtags" items={content.hashtags} inline />
                    <div className="grid gap-4 md:grid-cols-2">
                        <PreviewList label="Thiếu dữ liệu" items={content.missingData} tone="muted" />
                        <PreviewList label="Safety notes" items={content.safetyNotes} tone="warning" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function PreviewBlock({ label, value, multiline = false }: { label: string; value?: string; multiline?: boolean }) {
    return (
        <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
            <div className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 ${multiline ? 'min-h-[110px]' : ''}`}>
                {value?.trim() || 'Chưa có nội dung.'}
            </div>
        </div>
    );
}

function PreviewList({ label, items, inline = false, tone = 'default' }: { label: string; items?: string[]; inline?: boolean; tone?: 'default' | 'muted' | 'warning' }) {
    const toneClass = tone === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : tone === 'muted'
            ? 'border-slate-200 bg-slate-50 text-slate-700'
            : 'border-slate-200 bg-white text-slate-700';

    return (
        <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
            <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClass}`}>
                {Array.isArray(items) && items.length > 0 ? (
                    inline ? (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <span key={item} className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium">{item}</span>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-1.5">
                            {items.map((item) => (
                                <li key={item}>• {item}</li>
                            ))}
                        </ul>
                    )
                ) : (
                    <span>Chưa có dữ liệu.</span>
                )}
            </div>
        </div>
    );
}
