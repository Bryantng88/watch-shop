"use client";

import { Copy, ExternalLink, FileText, ListChecks, Wrench } from "lucide-react";

import RowActions, { type RowAction } from "@/domains/shared/ui/list/RowActions";
import InlineImage from "@/domains/shared/ui/image/InlineImage";
import { Badge } from "@/domains/shared/ui/badge/Badge";
import {
    formatServiceDateTime,
    formatServiceScope,
    isServiceRequestClosable,
    serviceImageItem,
    serviceScopeTone,
    serviceStatusTone,
} from "./helpers";
import type { ServiceReqItem } from "./types";

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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <div className="text-base font-semibold text-slate-950">Danh sách service</div>
                <div className="mt-1 text-xs text-slate-500">Theo dõi xử lý kỹ thuật, vendor, thợ và nhật ký maintenance.</div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <tr>
                            <th className="px-4 py-4">Phiếu</th>
                            <th className="px-4 py-4">Ảnh</th>
                            <th className="px-4 py-4">Service / Watch</th>
                            <th className="px-4 py-4">Nguồn / xử lý</th>
                            <th className="px-4 py-4">Trạng thái</th>
                            <th className="px-4 py-4">Thời gian</th>
                            <th className="px-4 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-14 text-center text-sm text-slate-500">
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
    const actions: RowAction<ServiceReqItem>[] = [
        {
            key: "detail",
            label: "Mở chi tiết",
            icon: <ExternalLink className="h-4 w-4" />,
            onClick: onOpenDetail,
        },
        {
            key: "issue-board",
            label: "Đi tới Issue Board",
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
            key: "complete",
            label: "Kết thúc / DONE",
            icon: <Wrench className="h-4 w-4" />,
            hidden: !isServiceRequestClosable(row.status),
            separatorBefore: true,
            onClick: onComplete,
        },
        {
            key: "technical",
            label: row.status === "IN_PROGRESS" ? "Mở phiếu kỹ thuật" : "Đánh giá kỹ thuật",
            icon: <Wrench className="h-4 w-4" />,
            onClick: onOpenTechnicalAssessment,
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
        <tr className="align-top transition hover:bg-slate-50/70">
            <td className="px-4 py-4">
                <button
                    type="button"
                    className="text-left font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                    onClick={() => onOpenDetail(row)}
                >
                    {row.refNo || "-"}
                </button>
                <div className="mt-1 max-w-[170px] truncate font-mono text-[11px] text-slate-400">ID: {row.id}</div>
            </td>

            <td className="px-4 py-4">
                <InlineImage image={image} title={row.productTitle || row.serviceName || row.refNo} size="sm" />
            </td>

            <td className="px-4 py-4">
                <div className="font-semibold text-slate-950">{row.serviceName || "-"}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">product · {row.productTitle || row.product?.title || "-"}</div>
                <div className="mt-1 text-xs text-slate-500">SKU: {row.skuSnapshot || "-"}</div>
                {row.orderRefNo ? <div className="mt-1 text-xs text-slate-500">Order: {row.orderRefNo}</div> : null}
                <div className="mt-1 max-w-[320px] truncate text-xs text-slate-500">Note: {row.customerItemNote || "-"}</div>
            </td>

            <td className="px-4 py-4">
                <Badge tone={serviceScopeTone(row.scope)}>{formatServiceScope(row.scope)}</Badge>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div>
                        Thợ: <span className="font-semibold text-slate-900">{row.technicianName || "-"}</span>
                    </div>
                    <div>
                        Vendor: <span className="font-semibold text-slate-900">{row.vendorName || "-"}</span>
                    </div>
                    <div className="text-slate-400">Maintenance: {row.maintenanceCount ?? 0}</div>
                </div>
            </td>

            <td className="px-4 py-4 align-middle">
                <Badge tone={serviceStatusTone(row.status)}>{row.status || "-"}</Badge>
            </td>

            <td className="px-4 py-4">
                <div className="text-sm font-medium text-slate-800">{formatServiceDateTime(row.createdAt)}</div>
                <div className="mt-1 text-xs text-slate-400">Updated: {formatServiceDateTime(row.updatedAt)}</div>
            </td>

            <td className="px-4 py-4 text-right align-middle">
                <RowActions row={row} actions={actions} />
            </td>
        </tr>
    );
}
