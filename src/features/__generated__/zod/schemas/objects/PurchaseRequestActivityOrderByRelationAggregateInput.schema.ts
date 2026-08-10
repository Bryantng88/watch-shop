import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestActivityOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityOrderByRelationAggregateInput>;
export const PurchaseRequestActivityOrderByRelationAggregateInputObjectZodSchema = makeSchema();
