import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInput.schema'

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
  WatchReviewLog: z.lazy(() => WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema).optional()
}).strict();
export const WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUncheckedCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUncheckedCreateWithoutWatchInput>;
export const WatchReviewStateUncheckedCreateWithoutWatchInputObjectZodSchema = makeSchema();
