import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId: z.string(),
  productId: z.string(),
  targetType: WatchReviewTargetTypeSchema,
  status: WatchReviewStatusSchema.optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  submittedById: z.string().optional().nullable(),
  reviewedAt: z.coerce.date().optional().nullable(),
  reviewedById: z.string().optional().nullable(),
  reviewNote: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  WatchReviewLog: z.lazy(() => WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema)
}).strict();
export const WatchReviewStateUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUncheckedCreateInput>;
export const WatchReviewStateUncheckedCreateInputObjectZodSchema = makeSchema();
