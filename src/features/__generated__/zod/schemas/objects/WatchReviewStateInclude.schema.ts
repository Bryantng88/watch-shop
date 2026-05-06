import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { WatchReviewLogFindManySchema as WatchReviewLogFindManySchema } from '../findManyWatchReviewLog.schema';
import { WatchReviewStateCountOutputTypeArgsObjectSchema as WatchReviewStateCountOutputTypeArgsObjectSchema } from './WatchReviewStateCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  WatchReviewLog: z.union([z.boolean(), z.lazy(() => WatchReviewLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchReviewStateCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchReviewStateIncludeObjectSchema: z.ZodType<Prisma.WatchReviewStateInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateInclude>;
export const WatchReviewStateIncludeObjectZodSchema = makeSchema();
