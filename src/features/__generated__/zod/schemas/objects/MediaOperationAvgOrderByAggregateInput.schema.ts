import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const MediaOperationAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationAvgOrderByAggregateInput>;
export const MediaOperationAvgOrderByAggregateInputObjectZodSchema = makeSchema();
