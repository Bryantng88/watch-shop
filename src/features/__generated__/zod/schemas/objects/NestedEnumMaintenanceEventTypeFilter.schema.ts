import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema'

const nestedenummaintenanceeventtypefilterSchema = z.object({
  equals: MaintenanceEventTypeSchema.optional(),
  in: MaintenanceEventTypeSchema.array().optional(),
  notIn: MaintenanceEventTypeSchema.array().optional(),
  not: z.union([MaintenanceEventTypeSchema, z.lazy(() => NestedEnumMaintenanceEventTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMaintenanceEventTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumMaintenanceEventTypeFilter> = nestedenummaintenanceeventtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMaintenanceEventTypeFilter>;
export const NestedEnumMaintenanceEventTypeFilterObjectZodSchema = nestedenummaintenanceeventtypefilterSchema;
