"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import {
  createWorkCase,
  createWorkCaseCategory,
  updateWorkCase,
  updateWorkCaseCategory,
} from "../server/work-case.service";
import type {
  CreateWorkCaseCategoryInput,
  CreateWorkCaseInput,
  UpdateWorkCaseCategoryInput,
  UpdateWorkCaseInput,
} from "../server/work-case.types";
import { TaskPriority, WorkCaseScope } from "@prisma/client";
async function getWorkCaseAuth() {
  return requirePermission("TASK_VIEW");
}

export async function createWorkCaseAction(input: CreateWorkCaseInput) {
  const auth = await getWorkCaseAuth();
  const item = await createWorkCase(prisma, input, auth);
  revalidatePath("/admin/work-cases");
  revalidatePath("/admin/watches");
  return { ok: true, item };
}

export async function updateWorkCaseAction(id: string, input: UpdateWorkCaseInput) {
  const auth = await getWorkCaseAuth();
  const item = await updateWorkCase(prisma, id, input, auth);
  revalidatePath("/admin/work-cases");
  return { ok: true, item };
}

export async function createWorkCaseCategoryAction(input: CreateWorkCaseCategoryInput) {
  await requirePermission("TASK_VIEW");
  const item = await createWorkCaseCategory(prisma, input);
  revalidatePath("/admin/work-cases/settings");
  return { ok: true, item };
}

export async function updateWorkCaseCategoryAction(id: string, input: UpdateWorkCaseCategoryInput) {
  await requirePermission("TASK_VIEW");
  const item = await updateWorkCaseCategory(prisma, id, input);
  revalidatePath("/admin/work-cases/settings");
  return { ok: true, item };
}
export async function createWorkCaseFromOrderAction(input: {
  orderId: string;
  title: string;
  description?: string | null;
  scope: WorkCaseScope;
  priority?: TaskPriority;
  categoryId?: string | null;
}) {
  const auth = await getWorkCaseAuth();

  const item = await createWorkCase(
    prisma,
    {
      title: input.title,
      description: input.description,
      scope: input.scope,
      priority: input.priority ?? TaskPriority.MEDIUM,
      categoryId: input.categoryId ?? null,
      orderId: input.orderId,
    },
    auth,
  );

  revalidatePath("/admin/work-cases");
  revalidatePath("/admin/orders");

  return { ok: true, item };
}

export async function searchWorkCaseLinkTargetsAction(input: {
  type: "WATCH" | "ORDER" | "SHIPMENT" | "SERVICE";
  q: string;
}) {
  const q = input.q.trim();
  if (!q) return [];

  if (input.type === "WATCH") {
    const rows = await prisma.watch.findMany({
      where: {
        OR: [
          { id: { contains: q, mode: "insensitive" } },
          { productId: { contains: q, mode: "insensitive" } },
          { product: { title: { contains: q, mode: "insensitive" } } },
          { product: { sku: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 10,
      select: {
        id: true,
        productId: true,
        product: {
          select: {
            title: true,
            sku: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      label: row.product?.title || row.product?.sku || row.id,
      sublabel: `SKU: ${row.product?.sku || "-"} · Watch ID: ${row.id}`,
    }));
  }

  if (input.type === "ORDER") {
    const rows = await prisma.order.findMany({
      where: {
        OR: [
          { id: { contains: q, mode: "insensitive" } },
          { refNo: { contains: q, mode: "insensitive" } },
          { customerName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        refNo: true,
        customerName: true,
      },
    });

    return rows.map((row) => ({
      id: row.id,
      label: row.refNo || row.id,
      sublabel: row.customerName
        ? `Khách: ${row.customerName}`
        : `Order ID: ${row.id}`,
    }));
  }

  if (input.type === "SHIPMENT") {
    const rows = await prisma.shipment.findMany({
      where: {
        OR: [
          { id: q },
          { trackingCode: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        trackingCode: true,
        status: true,
      },
    });

    return rows.map((row) => ({
      id: row.id,
      label: row.trackingCode || row.id,
      sublabel: `Trạng thái: ${row.status}`,
    }));
  }

  const rows = await prisma.serviceRequest.findMany({
    where: {
      OR: [
        { id: { contains: q, mode: "insensitive" } },
        { refNo: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    select: {
      id: true,
      refNo: true,
      status: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    label: row.refNo || row.id,
    sublabel: `Trạng thái: ${row.status}`,
  }));
}