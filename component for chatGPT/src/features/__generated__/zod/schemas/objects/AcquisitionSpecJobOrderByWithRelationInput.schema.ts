import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionItemOrderByWithRelationInputObjectSchema as AcquisitionItemOrderByWithRelationInputObjectSchema } from './AcquisitionItemOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finishedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  runAfter: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  priority: SortOrderSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemOrderByWithRelationInputObjectSchema).optional(),
  Product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobOrderByWithRelationInput>;
export const AcquisitionSpecJobOrderByWithRelationInputObjectZodSchema = makeSchema();
