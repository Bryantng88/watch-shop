import {
  OrderFlowType,
  OrderSource,
  OrderStatus,
  OrderVerificationStatus,
  PaymentMethod,
  ReserveType,
  TaskDomain,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import { prisma, type DB } from "@/server/db/client";
import { createTaskExecutionRepo } from "@/domains/task/server/task-execution.repo";
import { authCanViewAllTasks, getAuthUserId } from "@/domains/task/server/task.service";
import { createOrderWithItems } from "../write";

export type CreateOrderFromTaskInput = {
  taskId: string;
  customerName: string;
  shipPhone?: string | null;
  unitPriceAgreed?: number | string | null;
  note?: string | null;
};

function assertUser(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("Không xác định được user hiện tại");
}

function money(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

async function getExecutableTask(db: DB, taskId: string, auth: any) {
  const userId = getAuthUserId(auth);
  assertUser(userId);

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: {
      watch: {
        select: {
          id: true,
          productId: true,
          product: {
            select: {
              id: true,
              title: true,
              primaryImageUrl: true,
              watch: {
                select: {
                  watchPrice: {
                    select: {
                      salePrice: true,
                      listPrice: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      workCase: {
        select: {
          id: true,
          refNo: true,
          title: true,
          watch: {
            select: {
              id: true,
              productId: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  primaryImageUrl: true,
                  watch: {
                    select: {
                      watchPrice: {
                        select: {
                          salePrice: true,
                          listPrice: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!task) throw new Error("Không tìm thấy task");
  if (!authCanViewAllTasks(auth) && task.createdByUserId !== userId && task.assignedToUserId !== userId) {
    throw new Error("Bạn không có quyền thực thi task này");
  }
  if (task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED) {
    throw new Error("Task đã đóng, không thể tạo Order");
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
      0,
  );
}

export async function createOrderFromTask(db: DB, input: CreateOrderFromTaskInput, auth: any) {
  const { task, userId } = await getExecutableTask(db, input.taskId, auth);
  const watch = resolveWatch(task);
  if (!watch?.productId) throw new Error("Task chưa gắn watch nên không thể tạo Order");

  const customerName = String(input.customerName ?? "").trim();
  if (!customerName) throw new Error("Vui lòng nhập tên khách hàng");

  const listPrice = resolveListPrice(watch);
  const agreedPrice = money(input.unitPriceAgreed || listPrice);
  if (agreedPrice <= 0) throw new Error("Giá chốt phải lớn hơn 0 để tạo Order");

  const noteLines = [
    input.note?.trim() || null,
    `Tạo từ task: ${task.title}`,
    task.workCase?.refNo ? `Work Case: ${task.workCase.refNo}` : null,
  ].filter(Boolean);

  const order = await createOrderWithItems({
    customerId: null,
    customerName,
    shipPhone: input.shipPhone ?? "",
    hasShipment: false,
    shipAddress: "",
    shipCity: "",
    shipDistrict: null,
    shipWard: null,
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
        kind: "PRODUCT",
        productId: watch.productId,
        quantity: 1,
        title: watch.product?.title ?? task.title,
        listPrice: listPrice > 0 ? listPrice : agreedPrice,
        unitPriceAgreed: agreedPrice,
        img: watch.product?.primaryImageUrl ?? null,
        createdFromFlow: OrderFlowType.QUICK_ORDER,
      },
    ],
  });

  const orderId = order?.id;
  if (!orderId) throw new Error("Không tạo được Order");

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        domain: task.domain === TaskDomain.GENERAL || task.domain === TaskDomain.WORK_CASE ? TaskDomain.ORDER : task.domain,
        orderId,
        status: task.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS : task.status,
        startedAt: task.startedAt ?? new Date(),
      } as any,
    });

    await createTaskExecutionRepo(tx, {
      taskId: task.id,
      targetType: TaskExecutionTargetType.ORDER,
      targetId: orderId,
      actionType: "CREATED",
      note: input.note?.trim() || "Tạo Order từ task",
      createdByUserId: userId,
      syncTaskRelation: false,
    });
  });

  return { order };
}
