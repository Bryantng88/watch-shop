"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu";
import { useNotify } from "@/components/feedback/AppToastProvider";
import { useAppDialog } from "@/components/feedback/AppDialogProvider";
import { useAppProgress } from "@/components/feedback/AppProgressProvider";
import { postAcquisitions } from "@/domains/acquisition/client/list/post-acquisition.action";
import AcquisitionItemsPreview from "./AcquisitionItemsPreview";
import type { AcquisitionListItem } from "./types";
import { cx, fmtDate, fmtMoney, statusTone } from "./helpers";

export default function AcquisitionListRow({
    item,
}: {
    item: AcquisitionListItem;
}) {
    const router = useRouter();
    const notify = useNotify();
    const dialog = useAppDialog();
    const progress = useAppProgress();

    async function handleApprove() {
        const accepted = await dialog.confirm({
            title: "Duyệt phiếu nhập",
            message:
                "Phiếu sau khi duyệt sẽ cập nhật tồn kho và chạy các xử lý liên quan. Bạn có chắc chắn muốn tiếp tục?",
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
                message:
                    error instanceof Error ? error.message : "Có lỗi không xác định",
            });
        } finally {
            progress.hide();
        }
    }

    return (
        <tr className="border-t border-slate-100 align-top">
            <td className="px-5 py-4">
                <div className="font-medium text-slate-950">{item.refNo}</div>
                <div className="mt-1 text-xs text-slate-500">{item.notes || "-"}</div>
            </td>

            <td className="px-5 py-4">
                <span
                    className={cx(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        statusTone(item.status)
                    )}
                >
                    {item.statusLabel}
                </span>
            </td>

            <td className="px-5 py-4">{item.vendorName}</td>

            <td className="px-5 py-4">
                <AcquisitionItemsPreview row={item} />
            </td>

            <td className="px-5 py-4">{fmtMoney(item.totalAmount)}</td>

            <td className="px-5 py-4">{fmtDate(item.updatedAt)}</td>

            <td className="px-5 py-4">
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
                            label: "Chỉnh sửa",
                            href: `/admin/acquisitions/${item.id}/edit`,
                            icon: "edit",
                        },
                        {
                            key: "approve",
                            label: "Duyệt phiếu",
                            onClick: handleApprove,
                            icon: <BadgeCheck className="h-4 w-4" />,
                            hidden: item.status === "POSTED",
                        },
                    ]}
                />
            </td>
        </tr>
    );
}