import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { NestedEnumWatchReviewActionFilterObjectSchema as NestedEnumWatchReviewActionFilterObjectSchema } from './NestedEnumWatchReviewActionFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewActionSchema.optional(),
  in: WatchReviewActionSchema.array().optional(),
  notIn: WatchReviewActionSchema.array().optional(),
  not: z.union([WatchReviewActionSchema, z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchReviewActionFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewActionFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewActionFilter>;
export const EnumWatchReviewActionFilterObjectZodSchema = makeSchema();
