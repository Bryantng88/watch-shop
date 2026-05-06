import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './WatchReviewLogWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WatchReviewLogWhereInputObjectSchema).optional(),
  some: z.lazy(() => WatchReviewLogWhereInputObjectSchema).optional(),
  none: z.lazy(() => WatchReviewLogWhereInputObjectSchema).optional()
}).strict();
export const WatchReviewLogListRelationFilterObjectSchema: z.ZodType<Prisma.WatchReviewLogListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogListRelationFilter>;
export const WatchReviewLogListRelationFilterObjectZodSchema = makeSchema();
