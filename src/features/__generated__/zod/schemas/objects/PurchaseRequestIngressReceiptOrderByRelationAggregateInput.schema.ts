import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestIngressReceiptOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByRelationAggregateInput>;
export const PurchaseRequestIngressReceiptOrderByRelationAggregateInputObjectZodSchema = makeSchema();
