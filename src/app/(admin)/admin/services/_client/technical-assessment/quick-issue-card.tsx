"use client";

import * as React from "react";
import { Button } from "./primitives";
import { StaticIssueSummary } from "./issue-rows";
import { formatCurrency, parseMoney } from "./utils";

export function QuickIssueCard({
    title,
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
    open: boolean;
    issueMeta?: any;
    staticView?: boolean;
    onOpen: () => void;
    onClose: () => void;
    onGoBoard: () => void;
    children: React.ReactNode;
    isLocked: boolean;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-500">
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

            {open ? (
                <div className="bg-slate-50/50 p-4">
                    {staticView ? (
                        <StaticIssueSummary
                            lineNo={1}
                            summary={issueMeta?.summary}
                            boardStatus={issueMeta?.boardStatus}
                            execution={issueMeta?.execution}
                            cost={
                                issueMeta?.estimatedCost
                                    ? formatCurrency(parseMoney(issueMeta.estimatedCost))
                                    : "0đ"
                            }
                            vendorName={issueMeta?.vendorName}
                            actionLabel={undefined}
                            onGoBoard={onGoBoard}
                            readOnly={isLocked}
                        />
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            {children}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}