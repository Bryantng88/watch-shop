import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './WatchReviewStateInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchReviewStateSelectObjectSchema).optional(),
  include: z.lazy(() => WatchReviewStateIncludeObjectSchema).optional()
}).strict();
export const WatchReviewStateArgsObjectSchema = makeSchema();
export const WatchReviewStateArgsObjectZodSchema = makeSchema();
