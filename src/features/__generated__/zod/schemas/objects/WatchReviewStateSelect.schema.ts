import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { WatchReviewLogFindManySchema as WatchReviewLogFindManySchema } from '../findManyWatchReviewLog.schema';
import { WatchReviewStateCountOutputTypeArgsObjectSchema as WatchReviewStateCountOutputTypeArgsObjectSchema } from './WatchReviewStateCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  productId: z.boolean().optional(),
  targetType: z.boolean().optional(),
  status: z.boolean().optional(),
  submittedAt: z.boolean().optional(),
  submittedById: z.boolean().optional(),
  reviewedAt: z.boolean().optional(),
  reviewedById: z.boolean().optional(),
  reviewNote: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  WatchReviewLog: z.union([z.boolean(), z.lazy(() => WatchReviewLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchReviewStateCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchReviewStateSelectObjectSchema: z.ZodType<Prisma.WatchReviewStateSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateSelect>;
export const WatchReviewStateSelectObjectZodSchema = makeSchema();
