import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  depositAmt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expiresAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ReservationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ReservationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationOrderByWithRelationInput>;
export const ReservationOrderByWithRelationInputObjectZodSchema = makeSchema();
