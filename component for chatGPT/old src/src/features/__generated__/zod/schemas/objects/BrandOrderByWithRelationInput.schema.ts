import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  country: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  foundedYear: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  website: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  logoUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isAuthorized: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BrandOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BrandOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandOrderByWithRelationInput>;
export const BrandOrderByWithRelationInputObjectZodSchema = makeSchema();
