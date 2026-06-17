import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceApprovalStatusSchema } from '../enums/MaintenanceApprovalStatus.schema'

const makeSchema = () => z.object({
  set: MaintenanceApprovalStatusSchema.optional()
}).strict();
export const EnumMaintenanceApprovalStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMaintenanceApprovalStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMaintenanceApprovalStatusFieldUpdateOperationsInput>;
export const EnumMaintenanceApprovalStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
