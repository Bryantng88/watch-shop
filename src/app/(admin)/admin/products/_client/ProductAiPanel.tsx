'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';

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

type Props = {
    productId: string;
    images: { url: string }[];
    watchSpec: any;
    initialContent: GeneratedPayload;
    onContentChange: (c: GeneratedPayload) => void;
    onApplyExtractedSpecs: (patch: any) => void;
};

export default function ProductAiPanel({
    productId,
    images,
    watchSpec,
    initialContent,
    onContentChange,
    onApplyExtractedSpecs,
}: Props) {
    const [loadingExtract, setLoadingExtract] = useState(false);
    const [loadingGenerate, setLoadingGenerate] = useState(false);

    const [promptHint, setPromptHint] = useState('');
    const [toneSample, setToneSample] = useState('');

    const extractSpec = async () => {
        setLoadingExtract(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/spec-extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            onApplyExtractedSpecs(data.spec);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingExtract(false);
        }
    };

    const generateContent = async () => {
        setLoadingGenerate(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/content/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watchSpec,
                    promptHint,
                    toneSample,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            onContentChange(data.generated);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingGenerate(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">AI Assistant</div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={extractSpec}
                    className="w-full rounded-xl bg-slate-900 text-white py-2 flex items-center justify-center gap-2"
                >
                    <ImageIcon className="w-4 h-4" />
                    {loadingExtract ? 'Đang phân tích...' : 'Nhận diện từ ảnh'}
                </button>

                <textarea
                    placeholder="Gợi ý cho AI..."
                    value={promptHint}
                    onChange={(e) => setPromptHint(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm"
                />

                <textarea
                    placeholder="Mẫu văn phong..."
                    value={toneSample}
                    onChange={(e) => setToneSample(e.target.value)}
                    className="w-full border rounded-xl p-3 text-sm"
                />

                <button
                    onClick={generateContent}
                    className="w-full rounded-xl bg-indigo-600 text-white py-2 flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    {loadingGenerate ? 'Đang generate...' : 'Generate content'}
                </button>
            </div>
        </div>
    );
}