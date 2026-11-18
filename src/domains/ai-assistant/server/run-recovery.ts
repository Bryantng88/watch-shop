import { randomUUID } from "node:crypto";
import type { CustomerAssistantConversation, Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { assistantRunTimeout } from "../run-timeout";

/** The caller supplies an already owned/authorized row. Fence every update against a newer turn/heartbeat. */
export async function recoverStaleAssistantRun(db: DB, row: CustomerAssistantConversation, now = Date.now()) {
  const code = assistantRunTimeout(row, now);
  if (!code) return row;
  const client = dbOrTx(db);
  const state = row.state as Prisma.JsonObject;
  const text = code === "QUEUE_TIMEOUT"
    ? "Ben chưa nhận được lượt xử lý từ worker. Bạn có thể thử lại yêu cầu."
    : "Lượt xử lý đã quá thời gian và được dừng. Bạn có thể thử lại yêu cầu.";
  const { pendingImage: _image, ...rest } = state;
  void _image;
  await client.customerAssistantConversation.updateMany({
    where: { id: row.id, ownerId: row.ownerId, revision: row.revision, status: row.status, leaseToken: row.leaseToken, updatedAt: row.updatedAt },
    data: {
      status: row.approvedAt ? "APPLIED" : "FAILED",
      errorCode: code, leaseToken: null, leaseExpiresAt: null,
      state: {
        ...rest,
        messages: [...(Array.isArray(state.messages) ? state.messages : []), {
          id: randomUUID(), role: "assistant", requiredPermissions: [],
          text: text + (row.approvedAt ? " Các yêu cầu đã duyệt vẫn được giữ nguyên; kiểm tra kết quả trước khi gửi lại." : ""),
        }],
      } as Prisma.InputJsonValue,
    },
  });
  // A completed result/new turn wins if it changed while this read was in flight.
  return await client.customerAssistantConversation.findFirst({ where: { id: row.id, ownerId: row.ownerId } }) ?? row;
}
