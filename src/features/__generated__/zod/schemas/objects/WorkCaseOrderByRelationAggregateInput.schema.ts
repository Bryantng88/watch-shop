import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WorkCaseOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseOrderByRelationAggregateInput>;
export const WorkCaseOrderByRelationAggregateInputObjectZodSchema = makeSchema();
