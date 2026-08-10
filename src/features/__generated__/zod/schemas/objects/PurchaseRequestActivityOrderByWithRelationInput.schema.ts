import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PurchaseRequestOrderByWithRelationInputObjectSchema as PurchaseRequestOrderByWithRelationInputObjectSchema } from './PurchaseRequestOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  followUpAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestOrderByWithRelationInputObjectSchema).optional(),
  actor: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityOrderByWithRelationInput>;
export const PurchaseRequestActivityOrderByWithRelationInputObjectZodSchema = makeSchema();
