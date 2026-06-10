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
