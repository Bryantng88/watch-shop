import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MediaOperationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationOrderByRelationAggregateInput>;
export const MediaOperationOrderByRelationAggregateInputObjectZodSchema = makeSchema();
