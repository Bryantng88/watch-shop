import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { WatchReviewLogCreateNestedManyWithoutReviewStateInputObjectSchema as WatchReviewLogCreateNestedManyWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateNestedManyWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  targetType: WatchReviewTargetTypeSchema,
  status: WatchReviewStatusSchema.optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  submittedById: z.string().optional().nullable(),
  reviewedAt: z.coerce.date().optional().nullable(),
  reviewedById: z.string().optional().nullable(),
  reviewNote: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  WatchReviewLog: z.lazy(() => WatchReviewLogCreateNestedManyWithoutReviewStateInputObjectSchema).optional()
}).strict();
export const WatchReviewStateCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateWithoutWatchInput>;
export const WatchReviewStateCreateWithoutWatchInputObjectZodSchema = makeSchema();
