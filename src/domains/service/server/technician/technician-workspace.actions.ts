"use server";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import {
  confirmTechnicalIssue,
  startTechnicalIssue,
  completeTechnicalIssue,
  updateTechnicalIssue,
} from "../issue-board";
import {
  technicianCommand,
  type TechnicianCommand,
} from "../../shared/technician-workspace";
export async function updateTechnicianIssue(
  raw: TechnicianCommand,
): Promise<{ ok: boolean; error?: string }> {
  const actor = await requirePermission("SERVICE_UPDATE");
  const parsed = technicianCommand.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false,
      error: "Thông tin xử lý chưa hợp lệ. Kiểm tra các trường rồi thử lại.",
    };
  const input = parsed.data;
  try {
    await prisma.$transaction(async (tx) => {
      // Serialize changes so a stale/double completion cannot create a second payment.
      await tx.$queryRaw`SELECT "id" FROM "TechnicalIssue" WHERE "id" = ${input.id} FOR UPDATE`;
      const issue = await tx.technicalIssue.findUnique({
        where: { id: input.id },
        select: {
          updatedAt: true,
          executionStatus: true,
          isConfirmed: true,
          area: true,
        },
      });
      if (
        !issue ||
        issue.updatedAt.getTime() !== new Date(input.version).getTime()
      )
        throw new Error(
          "Phiếu đã thay đổi. Đóng và mở lại phiếu để xem dữ liệu mới nhất.",
        );
      if (
        issue.executionStatus === "DONE" ||
        issue.executionStatus === "CANCELED"
      )
        throw new Error(
          "Phiếu đã kết thúc, không thể cập nhật ở màn hình này.",
        );
      const common = {
        id: input.id,
        actorId: actor.id,
        actorName: actor.name,
        deferConsumers: (work: () => Promise<void>) => after(work),
      };
      if (input.action === "confirm") {
        if (issue.executionStatus !== "OPEN" || issue.isConfirmed)
          throw new Error("Phiếu không còn ở trạng thái chờ xác nhận.");
        await confirmTechnicalIssue(common, tx);
      } else if (input.action === "start") {
        if (!issue.isConfirmed && issue.executionStatus !== "CONFIRMED")
          throw new Error("Cần xác nhận phiếu trước khi bắt đầu.");
        if (issue.executionStatus === "IN_PROGRESS")
          throw new Error("Phiếu đã được bắt đầu.");
        const detail = await tx.technicalDetailCatalog.findFirst({
          where: { id: input.technicalDetailCatalogId, isActive: true },
          select: { area: true },
        });
        if (!detail) throw new Error("Chi tiết kỹ thuật không còn khả dụng.");
        await startTechnicalIssue(
          { ...common, ...input, technicalArea: detail.area ?? issue.area },
          tx,
        );
      } else if (input.action === "complete") {
        if (issue.executionStatus !== "IN_PROGRESS")
          throw new Error("Chỉ hoàn tất phiếu đang xử lý.");
        await completeTechnicalIssue({ ...common, ...input }, tx);
      } else await updateTechnicalIssue({ ...common, note: input.note }, tx);
    });
    revalidatePath("/admin/services/technician");
    revalidatePath("/admin/services");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Chưa cập nhật được phiếu. Thử lại sau.",
    };
  }
}
