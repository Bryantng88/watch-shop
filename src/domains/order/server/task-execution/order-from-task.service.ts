import {
  OrderFlowType,
  OrderSource,
  OrderStatus,
  OrderVerificationStatus,
  PaymentMethod,
  ReserveType,
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { createOrderWithItems } from "../write";

export type CreateOrderFromTaskInput = {
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

function getAuthUserId(auth: any) {
  return (
    auth?.user?.id ??
    auth?.id ??
    auth?.userId ??
    null
  );
}

function money(value: unknown) {
  if (value instanceof Prisma.Decimal) return value;
  if (value === null || value === undefined || value === "") {
    return new Prisma.Decimal(0);
  }
  return new Prisma.Decimal(String(value));
}

async function getExecutableTask(db: DB, taskId: string, auth: any) {
  const userId = getAuthUserId(auth);
  if (!userId) throw new Error("Không xác định được user hiện tại");

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      taskType: true,
      workCase: {
        include: {
          watch: {
            include: {
              product: {
                include: {
                  watch: {
                    include: {
                      watchPrice: true,
                    },
                  },
                },
              },
              watchPrice: true,
            },
          },
        },
      },
      watch: {
        include: {
          product: {
            include: {
              watch: {
                include: {
                  watchPrice: true,
                },
              },
            },
          },
          watchPrice: true,
        },
      },
    },
  });

  if (!task) throw new Error("Không tìm thấy task");

  const permissions =
    auth?.permissions ??
    auth?.user?.permissions ??
    [];

  const role = String(auth?.user?.role ?? auth?.role ?? "").toUpperCase();

  const canManage =
    role === "ADMIN" ||
    permissions.includes("TASK_MANAGE");

  const related =
    task.createdByUserId === userId ||
    task.assignedToUserId === userId ||
    task.workCase?.raisedByUserId === userId ||
    task.workCase?.assignedToUserId === userId;

  if (!canManage && !related) {
    throw new Error("Bạn không có quyền thực thi task này");
  }

  return { task, userId };
}

function resolveWatch(task: Awaited<ReturnType<typeof getExecutableTask>>["task"]) {
  return task.watch ?? task.workCase?.watch ?? null;
}

function resolveListPrice(watch: NonNullable<ReturnType<typeof resolveWatch>>) {
  return money(
    watch.product?.watch?.watchPrice?.salePrice ??
    watch.product?.watch?.watchPrice?.listPrice ??
    watch.watchPrice?.salePrice ??
    watch.watchPrice?.listPrice ??
    0,
  );
}

export async function createOrderFromTask(
  db: DB,
  input: CreateOrderFromTaskInput,
  auth: any,
) {
  const { task, userId } = await getExecutableTask(db, input.taskId, auth);

  const watch = resolveWatch(task);
  if (!watch?.productId) {
    throw new Error("Task chưa gắn watch nên không thể tạo Order");
  }

  const customerName = String(input.customerName ?? "").trim();
  if (!customerName) throw new Error("Vui lòng nhập tên khách hàng");

  const hasShipment = Boolean(input.hasShipment);
  const shipPhone = String(input.shipPhone ?? "").trim();
  const shipAddress = String(input.shipAddress ?? "").trim();
  const shipCity = String(input.shipCity ?? "").trim();
  const shipDistrict = input.shipDistrict ? String(input.shipDistrict).trim() : null;
  const shipWard = input.shipWard ? String(input.shipWard).trim() : null;

  if (hasShipment && !shipAddress) {
    throw new Error("Vui lòng nhập địa chỉ giao hàng");
  }

  const listPrice = resolveListPrice(watch);
  const agreedPrice = money(input.unitPriceAgreed || listPrice);

  if (agreedPrice.lte(0)) {
    throw new Error("Giá chốt phải lớn hơn 0 để tạo Order");
  }

  const noteLines = [
    input.note?.trim() || null,
    `Tạo từ task: ${task.title}`,
    task.workCase?.refNo ? `Work Case: ${task.workCase.refNo}` : null,
  ].filter(Boolean);

  const duplicated = await db.taskExecution.findFirst({
    where: {
      taskId: task.id,
      targetType: TaskExecutionTargetType.ORDER,
      actionType: TaskExecutionActionType.CREATED,
    },
  });

  if (duplicated) {
    throw new Error("Task này đã tạo Order rồi");
  }

  const order = await createOrderWithItems({
    customerId: null,
    customerName,
    shipPhone,
    hasShipment,
    shipAddress: hasShipment ? shipAddress : "",
    shipCity: hasShipment ? shipCity : "",
    shipDistrict: hasShipment ? shipDistrict : null,
    shipWard: hasShipment ? shipWard : null,

    paymentMethod: PaymentMethod.BANK_TRANSFER,
    notes: noteLines.join("\n"),
    status: OrderStatus.DRAFT,
    source: OrderSource.ADMIN,
    verificationStatus: OrderVerificationStatus.VERIFIED,
    quickFromProductId: watch.productId,
    quickFlowType: OrderFlowType.QUICK_ORDER,

    reserve: {
      type: ReserveType.NONE,
      amount: 0,
      expiresAt: null,
    },

    items: [
      {
        productId: watch.productId,
        quantity: 1,
        unitPrice: agreedPrice,
      },
    ],
  } as any);

  const execution = await db.taskExecution.create({
    data: {
      taskId: task.id,
      targetType: TaskExecutionTargetType.ORDER,
      targetId: order.id,
      actionType: TaskExecutionActionType.CREATED,
      note: hasShipment
        ? "Tạo order từ task, có yêu cầu tạo shipment"
        : "Tạo order từ task",
      createdByUserId: userId,
    },
  });

  if (task.status === TaskStatus.TODO) {
    await db.task.update({
      where: { id: task.id },
      data: {
        status: TaskStatus.IN_PROGRESS,
      },
    });
  }

  return {
    order,
    execution,
  };
}