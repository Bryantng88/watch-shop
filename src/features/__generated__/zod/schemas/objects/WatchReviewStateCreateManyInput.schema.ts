import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

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
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchReviewStateCreateManyInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateManyInput>;
export const WatchReviewStateCreateManyInputObjectZodSchema = makeSchema();
