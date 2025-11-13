import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const VendorOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.VendorOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorOrderByRelationAggregateInput>;
export const VendorOrderByRelationAggregateInputObjectZodSchema = makeSchema();
