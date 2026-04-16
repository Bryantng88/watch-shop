import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WatchMediaOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WatchMediaOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaOrderByRelationAggregateInput>;
export const WatchMediaOrderByRelationAggregateInputObjectZodSchema = makeSchema();
