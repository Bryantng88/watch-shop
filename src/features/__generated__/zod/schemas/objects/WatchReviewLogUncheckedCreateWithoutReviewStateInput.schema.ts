import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: WatchReviewActionSchema,
  fromStatus: WatchReviewStatusSchema.optional().nullable(),
  toStatus: WatchReviewStatusSchema,
  actorId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUncheckedCreateWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUncheckedCreateWithoutReviewStateInput>;
export const WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectZodSchema = makeSchema();
