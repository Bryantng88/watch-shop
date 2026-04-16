import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { NestedEnumMaintenanceEventTypeFilterObjectSchema as NestedEnumMaintenanceEventTypeFilterObjectSchema } from './NestedEnumMaintenanceEventTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MaintenanceEventTypeSchema.optional(),
  in: MaintenanceEventTypeSchema.array().optional(),
  notIn: MaintenanceEventTypeSchema.array().optional(),
  not: z.union([MaintenanceEventTypeSchema, z.lazy(() => NestedEnumMaintenanceEventTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumMaintenanceEventTypeFilterObjectSchema: z.ZodType<Prisma.EnumMaintenanceEventTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMaintenanceEventTypeFilter>;
export const EnumMaintenanceEventTypeFilterObjectZodSchema = makeSchema();
