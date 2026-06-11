"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { createOrderFromTask } from "../server/task-execution/order-from-task.service";

function serialize<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "object" && value?._isDecimal) return Number(value);
      return value;
    }),
  );
}

export type CreateOrderFromTaskActionInput = {
  taskId: string;
  customerName: string;
  shipPhone?: string | null;
  unitPriceAgreed?: number | string | null;
  note?: string | null;

  hasShipment?: boolean;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
};

export async function createOrderFromTaskAction(input: CreateOrderFromTaskActionInput) {
  const auth = await requirePermission("ORDER_CREATE");

  const result = await createOrderFromTask(prisma, input, auth);

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${input.taskId}`);
  revalidatePath("/admin/orders");

  if (result?.order?.id) {
    revalidatePath(`/admin/orders/${result.order.id}`);
  }

  return serialize({ ok: true, ...result });
}