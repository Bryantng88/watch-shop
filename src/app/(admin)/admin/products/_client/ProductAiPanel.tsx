'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    FileText,
    Image as ImageIcon,
    Loader2,
    Sparkles,
    Wand2,
} from 'lucide-react';

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
    knowledgeHints: string;
};

export type GeneratedLongformPayload = {
    promoteLong: string;
    missingData: string[];
    safetyNotes: string[];
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
    initialContent: GeneratedLongformPayload;
    onContentChange?: (next: GeneratedLongformPayload) => void;
    onSaveContent?: (
        nextContent: GeneratedLongformPayload,
        promptMeta: ProductContentPromptMeta
    ) => Promise<void>;
};

const defaultPayload: GeneratedLongformPayload = {
    promoteLong: '',
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
    { label: 'Editorial bullets', value: 'editorial_bullets' },
    { label: 'Storytelling', value: 'story' },
    { label: 'Hybrid', value: 'hybrid' },
];

const toneOptions = [
    { label: 'Cân bằng', value: 'balanced' },
    { label: 'Tinh tế', value: 'refined' },
    { label: 'Người chơi', value: 'collector' },
    { label: 'Quiet luxury', value: 'quiet_luxury' },
];

const focusPointOptions = [
    'Dial',
    'Case',
    'Layout',
    'Wearability',
    'Vintage feel',
    'Contrast',
    'Texture',
    'Dress character',
    'Mid-size feel',
    'Daily flexibility',
];

const forceSectionOptions = [
    'Opening hook',
    'Design insight',
    'Wearability note',
    'Closing insight',
    'Missing data note',
];

const DEFAULT_REFERENCE_SAMPLE = `▪️Có những chiếc dress giữ sự tĩnh tuyệt đối, nhưng cũng có những chiếc thêm vào một chút chuyển động để tạo cảm xúc – open heart luôn là kiểu như vậy

▪️Phần lộ cơ ở góc dial không quá lớn, vừa đủ để nhìn thấy nhịp chuyển động của bộ máy mà không làm mất đi sự gọn gàng tổng thể

▪️Dial đen kết hợp cọc số La Mã tạo nên độ tương phản tốt, vừa cổ điển vừa có chiều sâu thị giác

▪️Khi đeo thực tế, điểm open heart sẽ là thứ thu hút ánh nhìn đầu tiên – không phô trương nhưng rất “có chuyện để nhìn”

▪️Dây thép giúp chiếc đồng hồ trở nên linh hoạt hơn, không quá formal như dây da nhưng vẫn giữ được chất dress. Điểm đặc biệt ở chiếc Open heart mid-size này là bộ dây thép được làm mềm đi hẳn, mang đậm tinh thần dress watch hơn là sport. Size 35mm cho bản này thực sự đã mang open heart đến gần hơn cho người đeo để có thể đeo được hàng ngày.`;

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

function inputClassName() {
    return 'block h-[42px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm leading-tight text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
}

function textareaClassName() {
    return 'block min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100';
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

function buildPromptSummary(meta: ProductContentPromptMeta) {
    const parts = [
        meta.narrative ? narrativeOptions.find((x) => x.value === meta.narrative)?.label : null,
        meta.audience ? audienceOptions.find((x) => x.value === meta.audience)?.label : null,
        meta.structure ? structureOptions.find((x) => x.value === meta.structure)?.label : null,
        meta.tonePreset ? toneOptions.find((x) => x.value === meta.tonePreset)?.label : null,
    ].filter(Boolean);

    const focus = meta.focusPoints.length ? `Focus: ${meta.focusPoints.join(', ')}` : null;
    return [parts.join(' · '), focus].filter(Boolean).join(' · ');
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
    const [structure, setStructure] = useState('editorial_bullets');
    const [tonePreset, setTonePreset] = useState('refined');
    const [focusPoints, setFocusPoints] = useState<string[]>(['Dial', 'Wearability', 'Dress character']);
    const [forceSections, setForceSections] = useState<string[]>([
        'Opening hook',
        'Design insight',
        'Wearability note',
        'Closing insight',
    ]);
    const [customBrief, setCustomBrief] = useState(
        'Viết theo style editorial bullet như mẫu. Mỗi bullet một ý rõ, mềm, có nhịp. Không brochure, không quá đời, không generic.'
    );
    const [bannedPhrases, setBannedPhrases] = useState(
        'lựa chọn đáng cân nhắc, phù hợp với nhiều đối tượng, hoàn hảo cho, bán hàng lộ'
    );
    const [referenceSample, setReferenceSample] = useState(DEFAULT_REFERENCE_SAMPLE);
    const [content, setContent] = useState<GeneratedLongformPayload>(initialContent ?? defaultPayload);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [knowledgeHints, setKnowledgeHints] = useState(
        'Ví dụ: Ultra-Chron line, cushion case, chronometer wording, technical identity'
    );
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
            knowledgeHints,
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
            knowledgeHints,
        ]
    );

    const safeImages = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) return images;
        if (previewImageUrl) return [{ key: 'primary', url: previewImageUrl }];
        return [];
    }, [images, previewImageUrl]);

    function setAndBubble(next: GeneratedLongformPayload) {
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

            const next: GeneratedLongformPayload = {
                promoteLong: generated.promoteLong ?? '',
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
                            Tập trung duy nhất vào promote long theo style editorial bullet có gu.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 px-5 py-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Nguồn dữ liệu hiện tại
                    </div>
                    <div className="space-y-1 text-sm text-slate-700">
                        <div className="font-medium text-slate-900">{title || '—'}</div>
                        <div>Brand: {brandName || '—'}</div>
                        <div>Category: {categoryName || '—'}</div>
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
                            <FieldLabel label="Section gợi ý" />
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
                            <FieldLabel label="Knowledge hints" />
                            <textarea
                                value={knowledgeHints}
                                onChange={(e) => setKnowledgeHints(e.target.value)}
                                className={textareaClassName()}
                                placeholder="Ví dụ: Ultra-Chron line, cushion case, technical identity..."
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
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ImageIcon className="h-4 w-4" />
                        Bước 2 · Generate promote long
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Prompt hiện tại: {buildPromptSummary(promptMeta) || '—'}
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
                            {isGenerating ? 'Đang generate...' : 'Generate promote long'}
                        </button>
                        {onSaveContent ? (
                            <button
                                type="button"
                                onClick={async () => {
                                    setError(null);
                                    try {
                                        await onSaveContent(content, promptMeta);
                                    } catch (e: any) {
                                        setError(e?.message || 'Lưu ProductContent thất bại.');
                                    }
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Lưu ProductContent
                            </button>
                        ) : null}
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

                    <PreviewBlock title="Promote long">
                        {content.promoteLong ? (
                            <div className="whitespace-pre-line">{content.promoteLong}</div>
                        ) : (
                            <span className="text-slate-400">Chưa có nội dung</span>
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