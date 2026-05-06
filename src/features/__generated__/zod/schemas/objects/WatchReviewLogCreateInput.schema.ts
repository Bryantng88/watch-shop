import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { WatchReviewStateCreateNestedOneWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateNestedOneWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateNestedOneWithoutWatchReviewLogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: WatchReviewActionSchema,
  fromStatus: WatchReviewStatusSchema.optional().nullable(),
  toStatus: WatchReviewStatusSchema,
  actorId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  reviewState: z.lazy(() => WatchReviewStateCreateNestedOneWithoutWatchReviewLogInputObjectSchema)
}).strict();
export const WatchReviewLogCreateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogCreateInput>;
export const WatchReviewLogCreateInputObjectZodSchema = makeSchema();
