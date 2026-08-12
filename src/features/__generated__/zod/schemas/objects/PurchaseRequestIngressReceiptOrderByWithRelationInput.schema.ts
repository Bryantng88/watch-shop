import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { PurchaseRequestOrderByWithRelationInputObjectSchema as PurchaseRequestOrderByWithRelationInputObjectSchema } from './PurchaseRequestOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  requestKey: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  disposition: SortOrderSchema.optional(),
  addedItemCount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PurchaseRequestIngressReceiptOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptOrderByWithRelationInput>;
export const PurchaseRequestIngressReceiptOrderByWithRelationInputObjectZodSchema = makeSchema();
