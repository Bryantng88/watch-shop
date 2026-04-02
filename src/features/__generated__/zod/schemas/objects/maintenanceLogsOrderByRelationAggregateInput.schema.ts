import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const maintenanceLogsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.maintenanceLogsOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsOrderByRelationAggregateInput>;
export const maintenanceLogsOrderByRelationAggregateInputObjectZodSchema = makeSchema();
