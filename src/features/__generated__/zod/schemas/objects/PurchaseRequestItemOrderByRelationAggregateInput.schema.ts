import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemOrderByRelationAggregateInput>;
export const PurchaseRequestItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
