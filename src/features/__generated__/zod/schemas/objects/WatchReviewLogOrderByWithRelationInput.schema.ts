import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchReviewStateOrderByWithRelationInputObjectSchema as WatchReviewStateOrderByWithRelationInputObjectSchema } from './WatchReviewStateOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  reviewStateId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  fromStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  toStatus: SortOrderSchema.optional(),
  actorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  reviewState: z.lazy(() => WatchReviewStateOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WatchReviewLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchReviewLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogOrderByWithRelationInput>;
export const WatchReviewLogOrderByWithRelationInputObjectZodSchema = makeSchema();
