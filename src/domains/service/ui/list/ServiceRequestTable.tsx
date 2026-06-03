"use client";

import { ClipboardList, Copy, ExternalLink, FileText, ListChecks, PackageCheck, ShoppingBag, Wrench } from "lucide-react";

import RowActions, { type RowAction } from "@/domains/shared/ui/list/RowActions";
import { DomainSignalIcon } from "@/domains/shared/ui/icons";
import InlineImage from "@/domains/shared/ui/image/InlineImage";
import {
    compactDateTime,
    formatServiceDateTime,
    isServiceRequestClosable,
    serviceImageItem,
} from "./helpers";
import type { ServiceReqItem } from "./types";


function ServiceStatusSignalIcon({ status }: { status?: string | null }) {
    const value = String(status || "").toUpperCase();

    if (value === "DONE" || value === "COMPLETED" || value === "DELIVERED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Hoàn tất"
                icon={<ClipboardList />}
                className="bg-emerald-50 text-emerald-700 ring-emerald-200"
            />
        );
    }

    if (value === "IN_PROGRESS" || value === "DIAGNOSING" || value === "WAIT_APPROVAL") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đang xử lý"
                icon={<Wrench />}
                className="bg-blue-50 text-blue-700 ring-blue-200"
            />
        );
    }

    if (value === "CANCELED" || value === "CANCELLED") {
        return (
            <DomainSignalIcon
                size="md"
                title="Đã hủy"
                icon={<FileText />}
                className="bg-slate-100 text-slate-500 ring-slate-200"
            />
        );
    }

    return (
        <DomainSignalIcon
            size="md"
            title="Draft"
            icon={<FileText />}
            className="bg-amber-50 text-amber-700 ring-amber-200"
        />
    );
}

function ServiceSourceSignalIcon({ row }: { row: ServiceReqItem }) {
    const source = String(row.source || row.sourceType || "").toUpperCase();

    if (source.includes("ORDER") || row.orderId || row.orderRefNo) {
        return (
            <DomainSignalIcon
                size="sm"
                title="Service từ order"
                icon={<ShoppingBag />}
                className="bg-indigo-50 text-indigo-700 ring-indigo-200"
            />
        );
    }

    if (source.includes("ACQUISITION") || source.includes("IMPORT")) {
        return (
            <DomainSignalIcon
                size="sm"
                title="Service từ phiếu nhập"
                icon={<PackageCheck />}
                className="bg-sky-50 text-sky-700 ring-sky-200"
            />
        );
    }

    return (
        <DomainSignalIcon
            size="sm"
            title="Quick service từ watch"
            icon={<Wrench />}
            className="bg-violet-50 text-violet-700 ring-violet-200"
        />
    );
}

type Props = {
    items: ServiceReqItem[];
    onOpenDetail: (row: ServiceReqItem) => void;
    onOpenIssueBoard: (row: ServiceReqItem) => void;
    onOpenLogs: (row: ServiceReqItem) => void;
    onComplete: (row: ServiceReqItem) => void;
    onCopyId: (row: ServiceReqItem) => void;
    onOpenTechnicalAssessment: (row: ServiceReqItem) => void;
};

export default function ServiceRequestTable({
    items,
    onOpenDetail,
    onOpenIssueBoard,
    onOpenLogs,
    onComplete,
    onCopyId,
    onOpenTechnicalAssessment,
}: Props) {
    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                    <div className="text-base font-semibold text-slate-950">Danh sách service</div>
                    <div className="mt-1 text-xs text-slate-500">Mỗi phiếu là một vòng xử lý kỹ thuật của watch.</div>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                    {items.length} phiếu
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] table-fixed text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <tr>
                            <th className="w-[18%] px-4 py-4">Phiếu</th>
                            <th className="w-[34%] px-4 py-4">Watch</th>
                            <th className="w-[12%] px-4 py-4 text-center">Trạng thái</th>
                            <th className="w-[13%] px-4 py-4">Issue</th>
                            <th className="w-[16%] px-4 py-4">Thời gian</th>
                            <th className="w-[7%] px-4 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-14 text-center text-sm text-slate-500">
                                    Không có dữ liệu trong tab này.
                                </td>
                            </tr>
                        ) : (
                            items.map((row) => (
                                <ServiceRequestRow
                                    key={row.id}
                                    row={row}
                                    onOpenDetail={onOpenDetail}
                                    onOpenIssueBoard={onOpenIssueBoard}
                                    onOpenLogs={onOpenLogs}
                                    onComplete={onComplete}
                                    onCopyId={onCopyId}
                                    onOpenTechnicalAssessment={onOpenTechnicalAssessment}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

type RowProps = Omit<Props, "items"> & { row: ServiceReqItem };

function ServiceRequestRow({
    row,
    onOpenDetail,
    onOpenIssueBoard,
    onOpenLogs,
    onComplete,
    onCopyId,
    onOpenTechnicalAssessment,
}: RowProps) {
    const image = serviceImageItem(row.primaryImageUrl ?? row.product?.primaryImageUrl ?? null);
    const productTitle = row.productTitle || row.product?.title || "-";
    const sku = row.skuSnapshot || row.product?.sku || "-";
    const openIssueCount = Number(row.openIssueCount ?? 0);
    const issueCount = Number(row.issueCount ?? 0);

    const actions: RowAction<ServiceReqItem>[] = [
        {
            key: "detail",
            label: "Mở chi tiết",
            icon: <ExternalLink className="h-4 w-4" />,
            onClick: onOpenDetail,
        },
        {
            key: "issue-board",
            label: "Mở issue của SR",
            icon: <ListChecks className="h-4 w-4" />,
            onClick: onOpenIssueBoard,
        },
        {
            key: "logs",
            label: "Xem nhật ký xử lý",
            icon: <FileText className="h-4 w-4" />,
            onClick: onOpenLogs,
        },
        {
            key: "technical",
            label: "Mở đánh giá kỹ thuật",
            icon: <Wrench className="h-4 w-4" />,
            onClick: onOpenTechnicalAssessment,
        },
        {
            key: "complete",
            label: "Đóng SR",
            icon: <Wrench className="h-4 w-4" />,
            hidden: !isServiceRequestClosable(row.status),
            separatorBefore: true,
            onClick: onComplete,
        },
        {
            key: "copy-id",
            label: "Copy ID",
            icon: <Copy className="h-4 w-4" />,
            separatorBefore: true,
            onClick: onCopyId,
        },
    ];

    return (
        <tr className="align-middle transition hover:bg-slate-50/70">
            <td className="px-4 py-4">
                <div className="flex items-start gap-3">
                    <ServiceSourceSignalIcon row={row} />
                    <div className="min-w-0">
                        <button
                            type="button"
                            className="max-w-[190px] truncate text-left font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                            onClick={() => onOpenDetail(row)}
                        >
                            {row.refNo || "-"}
                        </button>
                        <div className="mt-1 max-w-[190px] truncate font-mono text-[11px] text-slate-400">
                            ID: {row.id}
                        </div>
                        {row.orderRefNo ? <div className="mt-1 text-xs text-slate-500">Order: {row.orderRefNo}</div> : null}
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <InlineImage image={image} title={productTitle} size="md" />
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => onOpenDetail(row)}
                            className="line-clamp-2 text-left text-sm font-semibold text-slate-950 hover:text-blue-700"
                        >
                            {productTitle}
                        </button>
                        <div className="mt-1 text-xs text-slate-500">SKU: {sku}</div>
                        <div className="mt-1 max-w-[320px] truncate font-mono text-[11px] text-slate-400">
                            PID: {row.productId || row.product?.id || "-"}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-4 py-4 text-center">
                <ServiceStatusSignalIcon status={row.status} />
            </td>

            <td className="px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">{issueCount} issue</div>
                <div className="mt-1 text-xs text-slate-500">
                    {openIssueCount > 0 ? `${openIssueCount} đang mở` : "Không còn issue mở"}
                </div>
                {row.technicianName ? <div className="mt-1 text-xs text-slate-400">Thợ: {row.technicianName}</div> : null}
            </td>

            <td className="px-4 py-4">
                <div className="text-sm font-medium text-slate-800">{compactDateTime(row.createdAt)}</div>
                <div className="mt-1 text-xs text-slate-400">Updated: {formatServiceDateTime(row.updatedAt)}</div>
            </td>

            <td className="px-4 py-4 text-right align-middle">
                <RowActions row={row} actions={actions} />
            </td>
        </tr>
    );
}
