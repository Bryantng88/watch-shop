import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  isAuthorized: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const VendorMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.VendorMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorMaxOrderByAggregateInput>;
export const VendorMaxOrderByAggregateInputObjectZodSchema = makeSchema();
