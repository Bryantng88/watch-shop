import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductPostTargetOrderByRelationAggregateInputObjectSchema as ProductPostTargetOrderByRelationAggregateInputObjectSchema } from './ProductPostTargetOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  platform: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  products: z.lazy(() => ProductPostTargetOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const PostTargetOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PostTargetOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetOrderByWithRelationInput>;
export const PostTargetOrderByWithRelationInputObjectZodSchema = makeSchema();
