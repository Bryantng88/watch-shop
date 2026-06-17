import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceApprovalStatusSchema } from '../enums/MaintenanceApprovalStatus.schema'

const nestedenummaintenanceapprovalstatusfilterSchema = z.object({
  equals: MaintenanceApprovalStatusSchema.optional(),
  in: MaintenanceApprovalStatusSchema.array().optional(),
  notIn: MaintenanceApprovalStatusSchema.array().optional(),
  not: z.union([MaintenanceApprovalStatusSchema, z.lazy(() => NestedEnumMaintenanceApprovalStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMaintenanceApprovalStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumMaintenanceApprovalStatusFilter> = nestedenummaintenanceapprovalstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMaintenanceApprovalStatusFilter>;
export const NestedEnumMaintenanceApprovalStatusFilterObjectZodSchema = nestedenummaintenanceapprovalstatusfilterSchema;
