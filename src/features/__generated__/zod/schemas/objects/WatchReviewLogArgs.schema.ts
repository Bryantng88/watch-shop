import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './WatchReviewLogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchReviewLogSelectObjectSchema).optional(),
  include: z.lazy(() => WatchReviewLogIncludeObjectSchema).optional()
}).strict();
export const WatchReviewLogArgsObjectSchema = makeSchema();
export const WatchReviewLogArgsObjectZodSchema = makeSchema();
