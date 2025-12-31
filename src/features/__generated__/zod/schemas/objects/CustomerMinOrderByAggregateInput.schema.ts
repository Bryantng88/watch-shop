import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  ward: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  address: SortOrderSchema.optional()
}).strict();
export const CustomerMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CustomerMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerMinOrderByAggregateInput>;
export const CustomerMinOrderByAggregateInputObjectZodSchema = makeSchema();
