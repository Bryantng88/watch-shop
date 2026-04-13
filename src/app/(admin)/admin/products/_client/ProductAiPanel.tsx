'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    FileText,
    Image as ImageIcon,
    Loader2,
    Save,
    Sparkles,
    Wand2,
} from 'lucide-react';

import type { GeneratedPayload } from '@/app/(admin)/admin/products/_server/product-ai.type';

type PickedImage = {
    key: string;
    url: string;
};

type Brand = { id: string; name: string };
type CategoryOption = { id: string; name: string; scope?: string };

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
    images?: PickedImage[];
    brands?: Brand[];
    categories?: CategoryOption[];
    title: string;
    brandId?: string | null;
    categoryId?: string | null;
    watchSpec: Record<string, any>;
    initialContent: GeneratedPayload;
    onContentChange?: (next: GeneratedPayload) => void;
    onSaveContent?: (
        nextContent: GeneratedPayload,
        promptMeta: ProductContentPromptMeta
    ) => Promise<void>;
};

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

const narrativeOptions = [
    { label: 'Vintage feel', value: 'vintage' },
    { label: 'Dress elegance', value: 'dress' },
    { label: 'Daily wearable', value: 'daily' },
    { label: 'Collector piece', value: 'collector' },
];

const audienceOptions = [
    { label: 'Người mới chơi', value: 'beginner' },
    { label: 'Người chơi lâu năm', value: 'collector' },
    { label: 'Khách mua đeo hằng ngày', value: 'daily' },
];

const structureOptions = [
    { label: 'Short listing', value: 'short' },
    { label: 'Storytelling', value: 'story' },
    { label: 'Hybrid', value: 'hybrid' },
];

const toneOptions = [
    { label: 'Cân bằng', value: 'balanced' },
    { label: 'Tinh tế', value: 'refined' },
    { label: 'Người chơi', value: 'collector' },
    { label: 'Bán hàng', value: 'sales' },
    { label: 'Minimal Japan', value: 'minimal_japan' },
    { label: 'Quiet luxury', value: 'quiet_luxury' },
];

const focusPointOptions = [
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

const forceSectionOptions = [
    'Opening hook',
    'Design insight',
    'Wearability note',
    'Practical ownership',
    'Collector note',
    'Soft disclaimer',
];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

function inputClassName() {
    return 'block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm leading-tight text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
}

function textareaClassName() {
    return 'block min-h-[108px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
    return (
        <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-slate-500">
                {label}
            </label>
            {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
        </div>
    );
}

function EmptyBlock({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-400">
            {text}
        </div>
    );
}

function PreviewBlock({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                {title}
            </div>
            <div className="text-sm leading-7 text-slate-800">{children}</div>
        </div>
    );
}

function MultiToggle({
    options,
    values,
    max,
    onToggle,
}: {
    options: string[];
    values: string[];
    max?: number;
    onToggle: (value: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const active = values.includes(option);
                const locked = !active && typeof max === 'number' && values.length >= max;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => !locked && onToggle(option)}
                        className={cx(
                            'rounded-full border px-3 py-2 text-sm transition',
                            active
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                            locked && 'cursor-not-allowed opacity-40'
                        )}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}

function PromptSummary(meta: ProductContentPromptMeta) {
    const parts = [
        meta.narrative ? narrativeOptions.find((x) => x.value === meta.narrative)?.label : null,
        meta.audience ? audienceOptions.find((x) => x.value === meta.audience)?.label : null,
        meta.structure ? structureOptions.find((x) => x.value === meta.structure)?.label : null,
        meta.tonePreset ? toneOptions.find((x) => x.value === meta.tonePreset)?.label : null,
    ].filter(Boolean);

    const focus = meta.focusPoints.length
        ? `Focus: ${meta.focusPoints.join(', ')}`
        : null;

    const sections = meta.forceSections.length
        ? `Section: ${meta.forceSections.join(', ')}`
        : null;

    return [parts.join(' · '), focus, sections].filter(Boolean).join(' · ');
}

export default function ProductAiPanel({
    productId,
    previewImageUrl,
    images = [],
    brands = [],
    categories = [],
    title,
    brandId,
    categoryId,
    watchSpec,
    initialContent,
    onContentChange,
    onSaveContent,
}: Props) {
    const [narrative, setNarrative] = useState('dress');
    const [audience, setAudience] = useState('daily');
    const [structure, setStructure] = useState('hybrid');
    const [tonePreset, setTonePreset] = useState('balanced');
    const [focusPoints, setFocusPoints] = useState<string[]>(['Dial', 'Case']);
    const [forceSections, setForceSections] = useState<string[]>([
        'Opening hook',
        'Design insight',
        'Wearability note',
    ]);
    const [customBrief, setCustomBrief] = useState(
        'Nhấn mạnh cảm giác vintage, dễ đeo. Chia ra khoảng 3–4 đoạn, mỗi đoạn đi 1 ý rõ ràng.'
    );
    const [bannedPhrases, setBannedPhrases] = useState(
        'phù hợp nhiều đối tượng, dễ phối mọi phong cách, hoàn hảo cho mọi dịp, chiếc đồng hồ này rất đẹp'
    );
    const [referenceSample, setReferenceSample] = useState('');
    const [content, setContent] = useState<GeneratedPayload>(initialContent ?? defaultPayload);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const promptMeta: ProductContentPromptMeta = useMemo(
        () => ({
            narrative,
            audience,
            structure,
            tonePreset,
            focusPoints,
            customBrief,
            bannedPhrases,
            referenceSample,
            forceSections,
        }),
        [
            narrative,
            audience,
            structure,
            tonePreset,
            focusPoints,
            customBrief,
            bannedPhrases,
            referenceSample,
            forceSections,
        ]
    );

    const safeImages = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) return images;
        if (previewImageUrl) return [{ key: 'primary', url: previewImageUrl }];
        return [];
    }, [images, previewImageUrl]);

    function setAndBubble(next: GeneratedPayload) {
        setContent(next);
        onContentChange?.(next);
    }

    function toggleFocusPoint(value: string) {
        setFocusPoints((prev) =>
            prev.includes(value)
                ? prev.filter((x) => x !== value)
                : prev.length >= 3
                    ? prev
                    : [...prev, value]
        );
    }

    function toggleForceSection(value: string) {
        setForceSections((prev) =>
            prev.includes(value)
                ? prev.filter((x) => x !== value)
                : [...prev, value]
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
                    images: safeImages.map((img) => ({
                        key: img.key,
                        url: img.url,
                    })),
                    promptMeta,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || 'Generate nội dung thất bại.');
            }

            const generated = data?.generated ?? null;
            if (!generated) {
                throw new Error('API generate thành công nhưng không trả về generated.');
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
        if (!onSaveContent) return;
        setIsSaving(true);
        setError(null);

        try {
            await onSaveContent(content, promptMeta);
        } catch (e: any) {
            setError(e?.message || 'Lưu ProductContent thất bại.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            AI content workflow
                        </h2>
                        <p className="text-sm leading-6 text-slate-500">
                            Bỏ nhận diện ảnh ở đây. Panel này chỉ tập trung vào hướng kể chuyện và
                            generate nội dung từ spec đã chốt.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 px-5 py-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Nguồn spec hiện tại
                    </div>
                    <div className="space-y-1 text-sm text-slate-700">
                        <div className="font-medium text-slate-900">{title || '—'}</div>
                        <div>Brand: {brandName || '—'}</div>
                        <div>Movement: {watchSpec?.movement || '—'}</div>
                        <div>Dial: {watchSpec?.dialColor || '—'}</div>
                        <div>
                            Size:{' '}
                            {watchSpec?.width
                                ? `${watchSpec.width}mm`
                                : watchSpec?.length
                                    ? `${watchSpec.length}mm`
                                    : '—'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Wand2 className="h-4 w-4" />
                        Bước 1 · Điều khiển prompt
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <FieldLabel label="Góc kể chuyện" />
                            <select
                                value={narrative}
                                onChange={(e) => setNarrative(e.target.value)}
                                className={inputClassName()}
                            >
                                {narrativeOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel label="Đối tượng người đọc" />
                            <select
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                className={inputClassName()}
                            >
                                {audienceOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel label="Cấu trúc nội dung" />
                            <select
                                value={structure}
                                onChange={(e) => setStructure(e.target.value)}
                                className={inputClassName()}
                            >
                                {structureOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <FieldLabel label="Tone preset" />
                            <div className="grid grid-cols-2 gap-2">
                                {toneOptions.map((item) => {
                                    const active = tonePreset === item.value;
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setTonePreset(item.value)}
                                            className={cx(
                                                'rounded-2xl border px-3 py-2 text-sm transition',
                                                active
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <FieldLabel label="Điểm nhấn chính" hint="Tối đa 3 mục" />
                            <MultiToggle
                                options={focusPointOptions}
                                values={focusPoints}
                                max={3}
                                onToggle={toggleFocusPoint}
                            />
                        </div>

                        <div>
                            <FieldLabel label="Section bắt buộc" />
                            <MultiToggle
                                options={forceSectionOptions}
                                values={forceSections}
                                onToggle={toggleForceSection}
                            />
                        </div>

                        <div>
                            <FieldLabel label="Brief thêm cho AI" />
                            <textarea
                                value={customBrief}
                                onChange={(e) => setCustomBrief(e.target.value)}
                                className={textareaClassName()}
                            />
                        </div>

                        <div>
                            <FieldLabel label="Các phrase cần tránh" />
                            <textarea
                                value={bannedPhrases}
                                onChange={(e) => setBannedPhrases(e.target.value)}
                                className={textareaClassName()}
                            />
                        </div>

                        <div>
                            <FieldLabel label="Mẫu văn phong tham chiếu" />
                            <textarea
                                value={referenceSample}
                                onChange={(e) => setReferenceSample(e.target.value)}
                                className={textareaClassName()}
                                placeholder="Dán 1 đoạn tham chiếu để AI học nhịp viết..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ImageIcon className="h-4 w-4" />
                        Bước 2 · Generate nội dung
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Prompt hiện tại: {PromptSummary(promptMeta) || '—'}
                    </div>

                    {safeImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {safeImages.slice(0, 4).map((img) => (
                                <div
                                    key={img.key}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.key}
                                        className="h-20 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyBlock text="Chưa có ảnh để gửi kèm content generation." />
                    )}

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            {isGenerating ? 'Đang generate...' : 'Generate nội dung từ spec'}
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || !onSaveContent}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {isSaving ? 'Đang lưu...' : 'Lưu ProductContent'}
                        </button>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <FileText className="h-4 w-4" />
                        Bước 3 · Preview output
                    </div>

                    <PreviewBlock title="Promote short">
                        {content.promoteShort ? (
                            <p>{content.promoteShort}</p>
                        ) : (
                            <span className="text-slate-400">Chưa có nội dung</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Promote long">
                        {content.promoteLong ? (
                            <div className="whitespace-pre-line">{content.promoteLong}</div>
                        ) : (
                            <span className="text-slate-400">Chưa có nội dung</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Spec bullets">
                        {content.specBullets.length ? (
                            <ul className="space-y-2">
                                {content.specBullets.map((item, idx) => (
                                    <li key={`${item}-${idx}`}>• {item}</li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Facebook caption">
                        {content.facebookCaption ? (
                            <p>{content.facebookCaption}</p>
                        ) : (
                            <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Instagram caption">
                        {content.instagramCaption ? (
                            <p>{content.instagramCaption}</p>
                        ) : (
                            <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Title options">
                        {content.titleOptions.length ? (
                            <ul className="space-y-2">
                                {content.titleOptions.map((item, idx) => (
                                    <li key={`${item}-${idx}`}>• {item}</li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Hashtags">
                        {content.hashtags.length ? (
                            <div className="flex flex-wrap gap-2">
                                {content.hashtags.map((tag, idx) => (
                                    <span
                                        key={`${tag}-${idx}`}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400">Chưa có dữ liệu</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Thiếu dữ liệu">
                        {content.missingData.length ? (
                            <ul className="space-y-2">
                                {content.missingData.map((item, idx) => (
                                    <li key={`${item}-${idx}`}>• {item}</li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-slate-400">Không có</span>
                        )}
                    </PreviewBlock>

                    <PreviewBlock title="Safety notes">
                        {content.safetyNotes.length ? (
                            <ul className="space-y-2">
                                {content.safetyNotes.map((item, idx) => (
                                    <li key={`${item}-${idx}`}>• {item}</li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-slate-400">Không có</span>
                        )}
                    </PreviewBlock>
                </div>
            </div>
        </section>
    );
}