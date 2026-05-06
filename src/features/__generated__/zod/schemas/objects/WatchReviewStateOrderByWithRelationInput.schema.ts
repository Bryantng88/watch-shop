import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './WatchOrderByWithRelationInput.schema';
import { WatchReviewLogOrderByRelationAggregateInputObjectSchema as WatchReviewLogOrderByRelationAggregateInputObjectSchema } from './WatchReviewLogOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  submittedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  submittedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  watch: z.lazy(() => WatchOrderByWithRelationInputObjectSchema).optional(),
  WatchReviewLog: z.lazy(() => WatchReviewLogOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WatchReviewStateOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchReviewStateOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateOrderByWithRelationInput>;
export const WatchReviewStateOrderByWithRelationInputObjectZodSchema = makeSchema();
