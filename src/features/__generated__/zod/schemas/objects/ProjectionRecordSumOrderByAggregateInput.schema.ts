import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  projectionVersion: SortOrderSchema.optional()
}).strict();
export const ProjectionRecordSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordSumOrderByAggregateInput>;
export const ProjectionRecordSumOrderByAggregateInputObjectZodSchema = makeSchema();
