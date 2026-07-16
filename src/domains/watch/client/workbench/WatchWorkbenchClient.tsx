"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { submitWatchForm } from "../form/watch-form.actions";
import { mapWatchDetailToFormValues } from "../form/watch-form.mapper";
import { markWatchMediaAssetAttachedFromWatchAction } from "../media-work/watch-media-work.actions";
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

export default function WatchWorkbenchClient({
    detail,
    serviceHistory = [],
    tradeHistory,
    permissions,
}: WatchWorkbenchProps) {
    const router = useRouter();
    const dialog = useAppDialog();
    const notify = useNotify();
    const initialValues = useMemo(() => mapWatchDetailToFormValues(detail), [detail]);
    const [values, setValues] = useState(initialValues);
    const [activeSection, setActiveSection] = useState<WatchWorkbenchSection>("pricing");
    const [mediaWorkspaceOpening, setMediaWorkspaceOpening] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setValues(initialValues);
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

    const dirty = stableStringify(values) !== stableStringify(initialValues);

    const save = () => {
        startTransition(async () => {
            try {
                await submitWatchForm({
                    ...values,
                    saveIntent: "NORMAL",
                });
                notify.success({
                    title: "Đã lưu Watch Workbench",
                    message: "Domain data đã được lưu và event sẽ được consumer xử lý.",
                });
                router.refresh();
            } catch (error) {
                notify.error({
                    title: "Không lưu được watch",
                    message: error instanceof Error ? error.message : "Có lỗi khi lưu Watch Workbench.",
                });
            }
        });
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
                setMediaWorkspaceOpening(false);
                return;
            }
        }

        router.push(mediaWorkspaceHref);
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
                saving={isPending}
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
                        onSave={save}
                    />
                    <SpecBlock values={values} onChange={setValues} onSave={save} />
                    <ContentBlock
                        values={values}
                        detail={detail}
                        onChange={setValues}
                        onSave={save}
                        onOpenMediaWorkspace={openMediaWorkspace}
                        openingMediaWorkspace={mediaWorkspaceOpening}
                    />
                    <ImageBlock
                        values={values}
                        detail={detail}
                        onSave={save}
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
                    <ServiceCard serviceHistory={serviceHistory} />
                    <ProjectionFeedCard />
                </div>
            </div>

            <WatchWorkbenchDirtyBar
                dirty={dirty}
                saving={isPending}
                onSave={save}
                onReset={() => setValues(initialValues)}
            />
        </main>
    );
}
