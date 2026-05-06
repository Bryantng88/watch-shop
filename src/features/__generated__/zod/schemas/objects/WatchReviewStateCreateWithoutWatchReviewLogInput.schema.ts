import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { WatchCreateNestedOneWithoutReviewStatesInputObjectSchema as WatchCreateNestedOneWithoutReviewStatesInputObjectSchema } from './WatchCreateNestedOneWithoutReviewStatesInput.schema'

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
  watch: z.lazy(() => WatchCreateNestedOneWithoutReviewStatesInputObjectSchema)
}).strict();
export const WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateWithoutWatchReviewLogInput>;
export const WatchReviewStateCreateWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
