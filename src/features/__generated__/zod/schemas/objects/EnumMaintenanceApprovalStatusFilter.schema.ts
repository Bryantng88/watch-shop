import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceApprovalStatusSchema } from '../enums/MaintenanceApprovalStatus.schema';
import { NestedEnumMaintenanceApprovalStatusFilterObjectSchema as NestedEnumMaintenanceApprovalStatusFilterObjectSchema } from './NestedEnumMaintenanceApprovalStatusFilter.schema'

const makeSchema = () => z.object({
  equals: MaintenanceApprovalStatusSchema.optional(),
  in: MaintenanceApprovalStatusSchema.array().optional(),
  notIn: MaintenanceApprovalStatusSchema.array().optional(),
  not: z.union([MaintenanceApprovalStatusSchema, z.lazy(() => NestedEnumMaintenanceApprovalStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumMaintenanceApprovalStatusFilterObjectSchema: z.ZodType<Prisma.EnumMaintenanceApprovalStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMaintenanceApprovalStatusFilter>;
export const EnumMaintenanceApprovalStatusFilterObjectZodSchema = makeSchema();
