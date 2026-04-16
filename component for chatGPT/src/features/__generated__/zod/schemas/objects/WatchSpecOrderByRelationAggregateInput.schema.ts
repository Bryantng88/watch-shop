import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WatchSpecOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecOrderByRelationAggregateInput>;
export const WatchSpecOrderByRelationAggregateInputObjectZodSchema = makeSchema();
