"use client";

import { useRouter } from "next/navigation";
import {
    PaymentStateSignalIcon,
    WatchReadinessSignalIcon
} from "@/domains/shared/ui/icons";
import {
    BadgeCheck,
    XCircle
} from "lucide-react";
import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { postAcquisitions } from "@/domains/acquisition/client/list/post-acquisition.action";

import AcquisitionItemsPreview from "./AcquisitionItemsPreview";
import type { AcquisitionListItem } from "./types";
import { fmtDateCompact, fmtMoney } from "./helpers";

type Props = {
    item: AcquisitionListItem;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    onOpenEdit?: (id: string) => void;
};

export default function AcquisitionListRow({
    item,
    checked,
    onCheckedChange,
    onOpenEdit,
}: Props) {
    const router = useRouter();
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();

    const posted = String(item.approvalStatus).toUpperCase() === "POSTED";
    const draft = String(item.approvalStatus).toUpperCase() === "DRAFT";
    const selectable = !posted;
    async function handleCancel() {
        const accepted = await dialog.confirm({
            title: "Hủy phiếu nhập",
            message:
                "Phiếu DRAFT sau khi hủy sẽ không còn được chỉnh sửa, duyệt phiếu hoặc tạo payment. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Hủy phiếu",
            cancelText: "Giữ lại",
            tone: "danger",
        });

        if (!accepted) return;

        progress.show({
            title: "Đang hủy phiếu nhập",
            message: item.refNo || "Vui lòng chờ trong giây lát",
        });

        try {
            const res = await fetch(`/api/admin/acquisitions/${item.id}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể hủy phiếu nhập");
            }

            notify.success({
                title: "Đã hủy phiếu nhập",
                message: "Phiếu nhập đã được chuyển sang trạng thái hủy.",
            });

            router.refresh();
        } catch (error) {
            notify.error({
                title: "Hủy phiếu thất bại",
                message: error instanceof Error ? error.message : "Có lỗi không xác định",
            });
        } finally {
            progress.hide();
        }
    }
    async function handleApprove() {
        const accepted = await dialog.confirm({
            title: "Duyệt phiếu nhập",
            message:
                "Phiếu sau khi duyệt sẽ cập nhật tồn kho và tạo payment đầu vào. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Duyệt phiếu",
            cancelText: "Hủy",
            tone: "warning",
        });

        if (!accepted) return;

        progress.show({
            title: "Đang duyệt phiếu",
            message: item.refNo || "Vui lòng chờ trong giây lát",
        });

        try {
            const result = await postAcquisitions([item.id]);

            if (result.kind === "success") {
                notify.success({
                    title: "Thành công",
                    message: "Duyệt phiếu thành công",
                });
                router.refresh();
                return;
            }

            if (result.kind === "partial") {
                notify.warning({
                    title: "Duyệt phiếu chưa hoàn tất",
                    message: result.message,
                });
                router.refresh();
                return;
            }

            notify.error({
                title: "Duyệt phiếu thất bại",
                message: result.message,
            });
        } catch (error) {
            notify.error({
                title: "Duyệt phiếu thất bại",
                message: error instanceof Error ? error.message : "Có lỗi không xác định",
            });
        } finally {
            progress.hide();
        }
    }

    const updated = fmtDateCompact(item.updatedAt);

    return (
        <tr className="align-middle hover:bg-slate-50/40">
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={!selectable}
                    onChange={(event) => onCheckedChange(event.target.checked)}
                />
            </td>

            <td className="px-3 py-3">
                <AcquisitionItemsPreview row={item} />
            </td>

            <td className="px-4 py-4">
                <div className="min-w-0">
                    <div className="truncate font-bold text-slate-950">{item.refNo}</div>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <WatchReadinessSignalIcon state={posted ? "APPROVED" : "DRAFT"} />
                    <span className="text-xs font-semibold text-slate-800">
                        {posted ? "Đã nhập kho" : draft ? "Bản nháp" : "Đã hủy"}
                    </span>
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <PaymentStateSignalIcon
                        status={item.paymentStatus ?? "UNPAID"}
                        totalAmount={item.totalAmount}
                        remainingAmount={item.paymentRemainingAmount ?? item.totalAmount}
                        collectedAmount={item.paymentPaidAmount ?? 0}
                    />
                    <div>
                        <div className="text-xs font-semibold text-slate-800">
                            {item.paymentIsFullyPaid ? "Đã thanh toán" : item.paymentPaidAmount > 0 ? "Một phần" : "Chưa thanh toán"}
                        </div>
                        {!item.paymentIsFullyPaid ? <div className="mt-0.5 text-[11px] text-slate-500">Còn {fmtMoney(item.paymentRemainingAmount)}</div> : null}
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <div className="truncate font-semibold text-slate-950">
                    {item.vendorName || "-"}
                </div>
                <div className="mt-1 text-xs text-slate-400">{item.acquisitionType || "-"}</div>
            </td>

            <td className="px-4 py-4 text-right whitespace-nowrap">
                <div className="font-bold text-slate-950">{fmtMoney(item.totalAmount)}</div>
            </td>

            <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-700">{updated.time}</div>
                <div className="text-xs text-slate-400">{updated.date}</div>
            </td>

            <td className="px-3 py-4 text-right">
                <RowActionMenu
                    actions={[
                        {
                            key: "view",
                            label: "Xem chi tiết",
                            href: `/admin/acquisitions/${item.id}`,
                            icon: "view",
                        },
                        {
                            key: "edit",
                            label: "Chỉnh giá nhập & item",
                            onClick: () => onOpenEdit?.(item.id),
                            icon: "edit",
                            hidden: !draft,
                        },
                        {
                            key: "approve",
                            label: "Duyệt phiếu",
                            onClick: handleApprove,
                            icon: <BadgeCheck className="h-4 w-4" />,
                            hidden: posted,
                        },
                        {
                            key: "cancel",
                            label: "Hủy phiếu",
                            onClick: handleCancel,
                            icon: <XCircle className="h-4 w-4" />,
                            hidden: !draft,
                        },
                    ]}
                />
            </td>
        </tr>
    );
}

