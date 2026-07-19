import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  projectionVersion: SortOrderSchema.optional()
}).strict();
export const ProjectionRecordAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionRecordAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordAvgOrderByAggregateInput>;
export const ProjectionRecordAvgOrderByAggregateInputObjectZodSchema = makeSchema();
