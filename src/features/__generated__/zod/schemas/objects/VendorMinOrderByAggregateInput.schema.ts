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
  updatedAt: SortOrderSchema.optional(),
  bankName: SortOrderSchema.optional(),
  bankAcc: SortOrderSchema.optional()
}).strict();
export const VendorMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.VendorMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorMinOrderByAggregateInput>;
export const VendorMinOrderByAggregateInputObjectZodSchema = makeSchema();
