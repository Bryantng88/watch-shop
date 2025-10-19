import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const InvoiceOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceOrderByRelationAggregateInput>;
export const InvoiceOrderByRelationAggregateInputObjectZodSchema = makeSchema();
