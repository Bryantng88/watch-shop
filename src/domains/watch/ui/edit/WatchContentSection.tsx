"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, WandSparkles } from "lucide-react";
import GuardNotice from "@/domains/shared/feedback/GuardNotice";
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
} from "@/domains/watch/application/generate-watch-content";
import SectionReviewActions from "../review/SectionReviewActions";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type ReviewStatusChange = {
    status: ReviewStatus;
    reviewNote?: string | null;
};

type Props = {
    productId: string;
    values: WatchFormValues["content"];
    watchValues: WatchFormValues;
    contentReviewStatus?: string | null;
    contentReviewNote?: string | null;
    canReviewContent?: boolean;
    onChange: (patch: Partial<WatchFormValues["content"]>) => void;
    onOpenSpecModal: () => void;
    onReviewStatusChange?: (next: ReviewStatusChange) => void;
    onBeforeSubmitReview?: (target: "content" | "image") => Promise<boolean>;
    isFormDirty?: boolean;
    watchId?: string;
    defaultOpen?: boolean;
    hideReviewActions?: boolean;
};

function normalizeStatus(status?: string | null): ReviewStatus {
    const value = String(status ?? "DRAFT").toUpperCase();

    if (
        value === "SUBMITTED" ||
        value === "APPROVED" ||
        value === "REJECTED"
    ) {
        return value;
    }

    return "DRAFT";
}

export default function WatchContentSection({
    productId,
    values,
    watchValues,
    contentReviewStatus,
    contentReviewNote,
    canReviewContent = false,
    onChange,
    onOpenSpecModal,
    onReviewStatusChange,
    onBeforeSubmitReview,
    isFormDirty,
    watchId,
    defaultOpen = false,
    hideReviewActions = false,
}: Props) {
    const dialog = useAppDialog();
    const notify = useNotify();

    const [generation, setGeneration] =
        useState<WatchContentGenerationResult | null>(null);

    const currentReviewStatus = normalizeStatus(contentReviewStatus);
    const locked =
        currentReviewStatus === "APPROVED" ||
        (currentReviewStatus === "SUBMITTED" && !canReviewContent);

    const bulletSpecs = Array.isArray(values.bulletSpecs)
        ? values.bulletSpecs
        : [];

    const handleBeforeOpen = async () => {
        if (currentReviewStatus !== "APPROVED") return true;

        if (!canReviewContent) {
            await dialog.alert({
                title: "Nội dung đã được duyệt",
                message:
                    "Chỉ admin mới có quyền mở lại để chỉnh sửa nội dung đã duyệt.",
                tone: "warning",
            });
            return false;
        }

        const ok = await dialog.confirm({
            title: "Mở chỉnh sửa nội dung?",
            message:
                "Nội dung đã được duyệt. Nếu chỉnh sửa lại, trạng thái sẽ chuyển về Draft và cần duyệt lại.",
            confirmText: "Mở chỉnh sửa",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!ok) return false;

        const res = await fetch(`/api/admin/watches/${productId}/content-draft`, {
            method: "POST",
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            await dialog.alert({
                title: "Không thể mở chỉnh sửa",
                message: json?.error || "Không thể chuyển nội dung về Draft.",
                tone: "danger",
            });
            return false;
        }

        onReviewStatusChange?.({
            status: "DRAFT",
            reviewNote: null,
        });

        notify.success({
            title: "Đã mở chỉnh sửa",
            message: "Nội dung đã chuyển về Draft.",
        });

        return true;
    };

    const handleGenerate = () => {
        if (locked) return;

        const result = generateWatchContent(watchValues);

        onChange({
            titleOverride: result.titleOverride,
            hookText: result.hookText,
            bulletSpecs: result.bulletSpecs,
            hashTags: result.hashTags,
        });

        setGeneration(result);
    };

    const updateBullet = (index: number, next: string) => {
        if (locked) return;

        const items = [...bulletSpecs];
        items[index] = next;
        onChange({ bulletSpecs: items });
    };

    const removeBullet = (index: number) => {
        if (locked) return;

        onChange({
            bulletSpecs: bulletSpecs.filter((_, i) => i !== index),
        });
    };

    const addBullet = () => {
        if (locked) return;

        onChange({
            bulletSpecs: [...bulletSpecs, ""],
        });
    };

    return (
        <SectionCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Content"
            subtitle="Gen hook & bullet specs từ dữ liệu spec hiện có."
            onBeforeOpen={handleBeforeOpen}
            defaultOpen={defaultOpen}
            actions={
                hideReviewActions ? null :
                <SectionReviewActions
                    productId={productId}
                    target="content"
                    status={contentReviewStatus}
                    reviewNote={contentReviewNote}
                    canReviewContent={canReviewContent}
                    onBeforeSubmit={() => onBeforeSubmitReview?.("content") ?? Promise.resolve(true)} isFormDirty={isFormDirty}
                    onStatusChange={(next) => {
                        onReviewStatusChange?.(next);
                    }}
                    watchId={watchId || watchValues.watchId}
                />
            }
        >
            <div className="space-y-5">
                {locked ? (
                    <GuardNotice
                        tone="locked"
                        icon="lock"
                        title={
                            currentReviewStatus === "APPROVED"
                                ? "Nội dung đã được duyệt"
                                : "Nội dung đang chờ duyệt"
                        }
                        message={
                            currentReviewStatus === "APPROVED"
                                ? "Muốn chỉnh sửa lại cần admin mở về Draft."
                                : "Nội dung đang chờ admin duyệt nên sale tạm thời không thể chỉnh sửa."
                        }
                    />
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-50/60 p-4 ring-1 ring-inset ring-indigo-100">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">
                            Gen nhanh nội dung bán hàng
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                            Hệ thống sẽ dùng brand, movement, size, dial,
                            material và giá bán để tạo hook + bullet specs.
                        </div>
                    </div>

                    <Button
                        type="button"
                        disabled={locked}
                        onClick={handleGenerate}
                        className="shrink-0"
                    >
                        <WandSparkles className="mr-2 h-4 w-4" />
                        Gen hook & bullet specs
                    </Button>
                </div>

                <div>
                    <FieldLabel>Title</FieldLabel>
                    <input
                        value={values.titleOverride}
                        onChange={(e) =>
                            onChange({ titleOverride: e.target.value })
                        }
                        disabled={locked}
                        placeholder="Title bài đăng sau khi gen"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                                    disabled={locked}
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
                        disabled={locked}
                        onChange={(e) => onChange({ hookText: e.target.value })}
                        placeholder="Hook"
                    />
                </div>

                <div>
                    <FieldLabel>Body</FieldLabel>
                    <Textarea
                        rows={8}
                        value={values.body}
                        disabled={locked}
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
                            disabled={locked}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        disabled={locked}
                                        onChange={(e) =>
                                            updateBullet(index, e.target.value)
                                        }
                                        placeholder={`Bullet ${index + 1}`}
                                        className="border-b-0"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeBullet(index)}
                                        disabled={locked}
                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <FieldLabel>Hashtags</FieldLabel>
                    <Textarea
                        rows={2}
                        value={values.hashTags}
                        disabled={locked}
                        onChange={(e) => onChange({ hashTags: e.target.value })}
                        placeholder="#vintagewatch #dress #seiko"
                    />
                </div>
            </div>
        </SectionCard>
    );
}
