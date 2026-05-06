import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateArgsObjectSchema as WatchReviewStateArgsObjectSchema } from './WatchReviewStateArgs.schema'

const makeSchema = () => z.object({
  reviewState: z.union([z.boolean(), z.lazy(() => WatchReviewStateArgsObjectSchema)]).optional()
}).strict();
export const WatchReviewLogIncludeObjectSchema: z.ZodType<Prisma.WatchReviewLogInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogInclude>;
export const WatchReviewLogIncludeObjectZodSchema = makeSchema();
