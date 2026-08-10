import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PurchaseRequestOrderByWithRelationInputObjectSchema as PurchaseRequestOrderByWithRelationInputObjectSchema } from './PurchaseRequestOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  titleSnapshot: SortOrderSchema.optional(),
  listPriceSnapshot: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  decision: SortOrderSchema.optional(),
  agreedPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  decisionReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemOrderByWithRelationInput>;
export const PurchaseRequestItemOrderByWithRelationInputObjectZodSchema = makeSchema();
