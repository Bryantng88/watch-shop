import { z } from "zod";
import type { DB } from "@/server/db/client";

export const LONG_SUPPORT_OFFER = "Bạn hãy liên hệ Long, người tạo ra dự án, để được hỗ trợ về quyền hạn. Bạn có muốn tạo một công việc để Long xem xét vấn đề này không?";
export const SUPPORT_TITLE = "[Ben · Quyền hạn] Nhờ Long xem xét";
export const permissionSummary = z.string().trim().min(1).max(1000).refine(s => !/(?:blueprint\w*|workTypeKey|workspaceKind|sharedUserIds|operationWorkspaceRole|systemShareGroupKey)\s*:/i.test(s));

// Recipient authority is configured by the operator, never inferred from chat/name.
export async function permissionContact(db: DB) {
  const id = process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID;
  if (!id) return null;
  return db.user.findFirst({where:{id,isActive:true,roles:{some:{name:"ADMIN"}}},select:{id:true}});
}
