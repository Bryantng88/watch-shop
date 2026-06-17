import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceApprovalStatusSchema } from '../enums/MaintenanceApprovalStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMaintenanceApprovalStatusFilterObjectSchema as NestedEnumMaintenanceApprovalStatusFilterObjectSchema } from './NestedEnumMaintenanceApprovalStatusFilter.schema'

const nestedenummaintenanceapprovalstatuswithaggregatesfilterSchema = z.object({
  equals: MaintenanceApprovalStatusSchema.optional(),
  in: MaintenanceApprovalStatusSchema.array().optional(),
  notIn: MaintenanceApprovalStatusSchema.array().optional(),
  not: z.union([MaintenanceApprovalStatusSchema, z.lazy(() => NestedEnumMaintenanceApprovalStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMaintenanceApprovalStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMaintenanceApprovalStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumMaintenanceApprovalStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMaintenanceApprovalStatusWithAggregatesFilter> = nestedenummaintenanceapprovalstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMaintenanceApprovalStatusWithAggregatesFilter>;
export const NestedEnumMaintenanceApprovalStatusWithAggregatesFilterObjectZodSchema = nestedenummaintenanceapprovalstatuswithaggregatesfilterSchema;
