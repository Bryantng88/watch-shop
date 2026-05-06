import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema'

const nestedenumwatchreviewactionfilterSchema = z.object({
  equals: WatchReviewActionSchema.optional(),
  in: WatchReviewActionSchema.array().optional(),
  notIn: WatchReviewActionSchema.array().optional(),
  not: z.union([WatchReviewActionSchema, z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchReviewActionFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewActionFilter> = nestedenumwatchreviewactionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewActionFilter>;
export const NestedEnumWatchReviewActionFilterObjectZodSchema = nestedenumwatchreviewactionfilterSchema;
