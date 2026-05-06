import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './WatchReviewStateWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional()
}).strict();
export const WatchReviewStateScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchReviewStateScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateScalarRelationFilter>;
export const WatchReviewStateScalarRelationFilterObjectZodSchema = makeSchema();
