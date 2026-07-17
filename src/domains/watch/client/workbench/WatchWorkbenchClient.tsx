"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { submitWatchForm } from "../form/watch-form.actions";
import { mapWatchDetailToFormValues } from "../form/watch-form.mapper";
import { markWatchMediaAssetAttachedFromWatchAction } from "../media-work/watch-media-work.actions";
import { saveWatchWorkbenchPricingAction } from "./watch-workbench.actions";
import PriceBlock from "../../ui/operations/price/PriceBlock";
import SpecBlock from "../../ui/operations/spec/SpecBlock";
import ContentBlock from "../../ui/operations/content/ContentBlock";
import ImageBlock from "../../ui/operations/images/ImageBlock";
import TradeHistoryCard from "../../ui/operations/side/TradeHistoryCard";
import ServiceCard from "../../ui/operations/side/ServiceCard";
import ProjectionFeedCard from "../../ui/operations/side/ProjectionFeedCard";
import MediaWorkspaceModalDemo from "../../ui/operations/side/MediaWorkspaceModalDemo";
import WatchWorkbenchDirtyBar from "./WatchWorkbenchDirtyBar";
import WatchWorkbenchHeader from "./WatchWorkbenchHeader";
import WatchWorkbenchNav from "./WatchWorkbenchNav";
import type { WatchWorkbenchProps, WatchWorkbenchSection, WatchWorkbenchValues } from "./types";
import { titleForWatch } from "./workbench-utils";

const TRACKED_SECTIONS: WatchWorkbenchSection[] = [
    "pricing",
    "spec",
    "content",
    "images",
    "trade",
    "timeline",
    "projection",
    "media-modal",
];

function stableStringify(value: unknown) {
    return JSON.stringify(value, (_key, item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
            return Object.keys(item as Record<string, unknown>)
                .sort()
                .reduce((acc: Record<string, unknown>, key) => {
                    acc[key] = (item as Record<string, unknown>)[key];
                    return acc;
                }, {});
        }
        return item ?? null;
    });
}

function firstImageUrl(values: WatchWorkbenchValues, detail: Record<string, unknown>) {
    const record = detail as {
        primaryImageUrl?: string | null;
        images?: Array<{ url?: string | null }> | null;
    };

    return (
        values.media.inlineImage?.url ||
        values.media.galleryImages?.[0]?.url ||
        record.primaryImageUrl ||
        record.images?.[0]?.url ||
        null
    );
}

function withTimeout<T>(work: Promise<T>, timeoutMs: number, message: string) {
    return Promise.race([
        work,
        new Promise<T>((_, reject) => {
            window.setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]);
}

export default function WatchWorkbenchClient({
    detail,
    serviceHistory = [],
    tradeHistory,
    permissions,
}: WatchWorkbenchProps) {
    const router = useRouter();
    const dialog = useAppDialog();
    const progress = useAppProgress();
    const notify = useNotify();
    const initialValues = useMemo(() => mapWatchDetailToFormValues(detail), [detail]);
    const [values, setValues] = useState(initialValues);
    const [savedValues, setSavedValues] = useState(initialValues);
    const [activeSection, setActiveSection] = useState<WatchWorkbenchSection>("pricing");
    const [mediaWorkspaceOpening, setMediaWorkspaceOpening] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValues(initialValues);
        setSavedValues(initialValues);
    }, [initialValues]);

    useEffect(() => {
        const onScroll = () => {
            let next: WatchWorkbenchSection = "pricing";
            for (const id of TRACKED_SECTIONS) {
                const element = document.getElementById(id);
                if (!element) continue;
                if (element.getBoundingClientRect().top <= 120) next = id;
            }
            setActiveSection(next);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const dirty = stableStringify(values) !== stableStringify(savedValues);

    const save = async () => {
        if (saving) return;

        setSaving(true);
        progress.show({
            title: "Dang luu Watch Workbench",
            message: "He thong dang luu domain data va phat event cho consumer xu ly.",
        });

            try {
                await submitWatchForm({
                    ...values,
                    saveIntent: "NORMAL",
                });
                notify.success({
                    title: "Đã lưu Watch Workbench",
                    message: "Domain data đã được lưu và event sẽ được consumer xử lý.",
                });
                setSavedValues(values);
                router.refresh();
            } catch (error) {
                notify.error({
                    title: "Không lưu được watch",
                    message: error instanceof Error ? error.message : "Có lỗi khi lưu Watch Workbench.",
                });
            } finally {
                progress.hide();
                setSaving(false);
            }
    };

    const savePricing = async () => {
        if (saving) return;

        setSaving(true);
        progress.show({
            title: "Dang luu gia ban",
            message: "He thong chi cap nhat pricing va emit event gia, khong reload toan bo watch.",
        });

        try {
            const result = await withTimeout(
                saveWatchWorkbenchPricingAction({
                    productId: values.productId,
                    pricing: values.pricing,
                    title,
                    sku: values.header.sku,
                }),
                10000,
                "Luu gia ban qua lau. He thong da huy trang thai loading, vui long thu lai.",
            );

            setSavedValues((current) => ({
                ...current,
                pricing: {
                    ...current.pricing,
                    ...values.pricing,
                },
            }));

            notify.success({
                title: result.changedFields.length ? "Da luu gia ban" : "Gia ban khong doi",
                message: result.changedFields.length
                    ? "Pricing da duoc cap nhat rieng, khong refresh watch detail."
                    : "Khong co thay doi pricing moi can ghi nhan.",
            });
        } catch (error) {
            notify.error({
                title: "Khong luu duoc gia ban",
                message: error instanceof Error ? error.message : "Co loi khi luu pricing.",
            });
        } finally {
            progress.hide();
            setSaving(false);
        }
    };

    const title = titleForWatch(detail, values);
    const imageUrl = firstImageUrl(values, detail);
    const mediaWorkspaceHref = `/admin/watches/${values.productId}/edit?embedded=1&mode=media`;
    const hasActiveMediaWorkspaceItem = Boolean(
        detail?.mediaWorkspace?.hasActiveItem,
    );

    const openMediaWorkspace = async () => {
        if (mediaWorkspaceOpening) return;

        if (!hasActiveMediaWorkspaceItem) {
            const accepted = await dialog.confirm({
                title: "Đưa watch vào WP Media?",
                message:
                    "Watch này chưa có item Media Processing đang mở. Bạn có muốn đưa watch vào WP Media rồi mở workspace xử lý ảnh không?",
                confirmText: "Đưa vào WP Media",
                cancelText: "Hủy",
                tone: "warning",
            });

            if (!accepted) return;

            setMediaWorkspaceOpening(true);
            progress.show({
                title: "Dang dua vao WP Media",
                message: "He thong dang tao hoac cap nhat item Media Processing cho watch nay.",
            });
            try {
                const result = await markWatchMediaAssetAttachedFromWatchAction({
                    productId: values.productId,
                    note: "Requested Media Workspace from Watch detail.",
                });

                if (result?.skipped) {
                    notify.warning({
                        title: "Chưa thể đưa vào WP Media",
                        message:
                            result.reason ?? "Không thể tạo hoặc cập nhật item Media Processing cho watch này.",
                    });
                    progress.hide();
                    setMediaWorkspaceOpening(false);
                    return;
                }

                notify.success({
                    title: "Đã đưa vào WP Media",
                    message: "Watch đã được đưa vào luồng Media Processing.",
                });
            } catch (error) {
                notify.error({
                    title: "Không mở được WP Media",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Có lỗi khi đưa watch vào WP Media.",
                });
                progress.hide();
                setMediaWorkspaceOpening(false);
                return;
            }
        }

        setMediaWorkspaceOpening(true);
        progress.show({
            title: "Dang mo Media Workspace",
            message: "He thong dang chuyen sang man hinh xu ly anh.",
        });
        router.push(mediaWorkspaceHref);
        window.setTimeout(() => {
            progress.hide();
            setMediaWorkspaceOpening(false);
        }, 1200);
    };

    return (
        <main className="mx-auto w-full max-w-[1600px] space-y-4 px-4 py-5 pb-28 text-slate-900 lg:px-6 xl:px-8">
            <WatchWorkbenchHeader
                detail={detail}
                values={values}
                permissions={permissions}
                onOpenMediaWorkspace={openMediaWorkspace}
                openingMediaWorkspace={mediaWorkspaceOpening}
            />

            <WatchWorkbenchNav
                activeSection={activeSection}
                saving={saving}
                dirty={dirty}
                onSave={save}
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
                <div className="space-y-4">
                    <PriceBlock
                        values={values}
                        permissions={permissions}
                        tradeHistory={tradeHistory}
                        onChange={setValues}
                        onSave={savePricing}
                        saving={saving}
                    />
                    <SpecBlock values={values} onChange={setValues} onSave={save} saving={saving} />
                    <ContentBlock
                        values={values}
                        detail={detail}
                        onChange={setValues}
                        onSave={save}
                        saving={saving}
                        onOpenMediaWorkspace={openMediaWorkspace}
                        openingMediaWorkspace={mediaWorkspaceOpening}
                    />
                    <ImageBlock
                        values={values}
                        detail={detail}
                        onSave={save}
                        saving={saving}
                        onOpenMediaWorkspace={openMediaWorkspace}
                        openingMediaWorkspace={mediaWorkspaceOpening}
                    />
                    <MediaWorkspaceModalDemo
                        title={title}
                        imageUrl={imageUrl}
                        onOpenMediaWorkspace={openMediaWorkspace}
                        openingMediaWorkspace={mediaWorkspaceOpening}
                    />
                </div>

                <div className="space-y-4 xl:sticky xl:top-[76px] xl:self-start">
                    <TradeHistoryCard
                        tradeHistory={tradeHistory}
                        canViewSensitivePrice={permissions.canViewSensitivePrice}
                    />
                    <ServiceCard
                        serviceHistory={serviceHistory}
                        productId={values.productId}
                        title={title}
                        sku={values.header.sku}
                    />
                    <ProjectionFeedCard />
                </div>
            </div>

            <WatchWorkbenchDirtyBar
                dirty={dirty}
                saving={saving}
                onSave={save}
                onReset={() => setValues(savedValues)}
            />
        </main>
    );
}
