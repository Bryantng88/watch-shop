import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MaintenanceRecordOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordOrderByRelationAggregateInput>;
export const MaintenanceRecordOrderByRelationAggregateInputObjectZodSchema = makeSchema();
