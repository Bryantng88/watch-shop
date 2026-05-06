import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './WatchReviewStateWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional(),
  some: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional(),
  none: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional()
}).strict();
export const WatchReviewStateListRelationFilterObjectSchema: z.ZodType<Prisma.WatchReviewStateListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateListRelationFilter>;
export const WatchReviewStateListRelationFilterObjectZodSchema = makeSchema();
