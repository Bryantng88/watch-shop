import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const MediaOperationSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationSumOrderByAggregateInput>;
export const MediaOperationSumOrderByAggregateInputObjectZodSchema = makeSchema();
