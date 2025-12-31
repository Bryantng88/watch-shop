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
<<<<<<< HEAD
  address: SortOrderSchema.optional()
=======
  address: SortOrderSchema.optional(),
  district: SortOrderSchema.optional()
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
}).strict();
export const CustomerMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CustomerMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerMaxOrderByAggregateInput>;
export const CustomerMaxOrderByAggregateInputObjectZodSchema = makeSchema();
