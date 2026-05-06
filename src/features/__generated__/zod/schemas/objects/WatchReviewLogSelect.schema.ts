import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateArgsObjectSchema as WatchReviewStateArgsObjectSchema } from './WatchReviewStateArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  reviewStateId: z.boolean().optional(),
  action: z.boolean().optional(),
  fromStatus: z.boolean().optional(),
  toStatus: z.boolean().optional(),
  actorId: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  reviewState: z.union([z.boolean(), z.lazy(() => WatchReviewStateArgsObjectSchema)]).optional()
}).strict();
export const WatchReviewLogSelectObjectSchema: z.ZodType<Prisma.WatchReviewLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogSelect>;
export const WatchReviewLogSelectObjectZodSchema = makeSchema();
