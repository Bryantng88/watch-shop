import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  country: SortOrderSchema.optional(),
  foundedYear: SortOrderSchema.optional(),
  website: SortOrderSchema.optional(),
  logoUrl: SortOrderSchema.optional(),
  isAuthorized: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const BrandMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BrandMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandMaxOrderByAggregateInput>;
export const BrandMaxOrderByAggregateInputObjectZodSchema = makeSchema();
