import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { NestedEnumMaintenanceEventTypeWithAggregatesFilterObjectSchema as NestedEnumMaintenanceEventTypeWithAggregatesFilterObjectSchema } from './NestedEnumMaintenanceEventTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMaintenanceEventTypeFilterObjectSchema as NestedEnumMaintenanceEventTypeFilterObjectSchema } from './NestedEnumMaintenanceEventTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MaintenanceEventTypeSchema.optional(),
  in: MaintenanceEventTypeSchema.array().optional(),
  notIn: MaintenanceEventTypeSchema.array().optional(),
  not: z.union([MaintenanceEventTypeSchema, z.lazy(() => NestedEnumMaintenanceEventTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMaintenanceEventTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMaintenanceEventTypeFilterObjectSchema).optional()
}).strict();
export const EnumMaintenanceEventTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMaintenanceEventTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMaintenanceEventTypeWithAggregatesFilter>;
export const EnumMaintenanceEventTypeWithAggregatesFilterObjectZodSchema = makeSchema();
