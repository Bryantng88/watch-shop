import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const InvoiceItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemOrderByRelationAggregateInput>;
export const InvoiceItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
