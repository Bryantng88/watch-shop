"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "./primitives";
import { StaticIssueSummary } from "./issue-rows";
import { formatCurrency, parseMoney, cx } from "./utils";

const AREA_TONE: Record<string, { ring: string; soft: string; text: string }> = {
    CASE: {
        ring: "border-amber-200",
        soft: "bg-amber-50/70",
        text: "text-amber-800",
    },
    CRYSTAL: {
        ring: "border-violet-200",
        soft: "bg-violet-50/70",
        text: "text-violet-800",
    },
    DIAL: {
        ring: "border-emerald-200",
        soft: "bg-emerald-50/70",
        text: "text-emerald-800",
    },
    CROWN: {
        ring: "border-rose-200",
        soft: "bg-rose-50/70",
        text: "text-rose-800",
    },
};

export function QuickIssueCard({
    title,
    area,
    open,
    issueMeta,
    staticView,
    onOpen,
    onClose,
    onGoBoard,
    children,
    isLocked,
}: {
    title: string;
    area: "CASE" | "CRYSTAL" | "DIAL" | "CROWN";
    open: boolean;
    issueMeta?: any;
    staticView?: boolean;
    onOpen: () => void;
    onClose: () => void;
    onGoBoard: () => void;
    children: React.ReactNode;
    isLocked: boolean;
}) {
    const tone = AREA_TONE[area];

    return (
        <div className={cx("overflow-hidden rounded-2xl border bg-white shadow-sm", tone.ring)}>
            <div className={cx("border-b px-4 py-4", tone.ring, tone.soft)}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className={cx("flex h-8 w-8 items-center justify-center rounded-xl border bg-white", tone.ring, tone.text)}>
                                <LayoutGrid className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-semibold text-slate-900">{title}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-500">
                            {open
                                ? issueMeta?.summary || "Đang chuẩn bị ghi nhận issue."
                                : "Không phát sinh issue ở hạng mục này."}
                        </div>
                    </div>

                    {!isLocked ? (
                        !open ? (
                            <Button type="button" variant="outline" onClick={onOpen}>
                                Mở issue
                            </Button>
                        ) : staticView ? (
                            <Button type="button" variant="outline" onClick={onGoBoard}>
                                Đi Issue Board
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" onClick={onClose}>
                                Bỏ issue
                            </Button>
                        )
                    ) : null}
                </div>
            </div>

            {open ? (
                <div className="p-4">
                    {staticView ? (
                        <StaticIssueSummary
                            lineNo={1}
                            summary={issueMeta?.summary}
                            boardStatus={issueMeta?.boardStatus}
                            execution={issueMeta?.execution}
                            cost={
                                issueMeta?.estimatedCost
                                    ? formatCurrency(parseMoney(issueMeta.estimatedCost))
                                    : issueMeta?.cost
                                        ? formatCurrency(parseMoney(issueMeta.cost))
                                        : "0đ"
                            }
                            vendorName={issueMeta?.vendorName}
                            actionLabel={undefined}
                            onGoBoard={onGoBoard}
                            readOnly={isLocked}
                        />
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                            {children}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
