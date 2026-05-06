import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogCreateManyInputObjectSchema as WatchReviewLogCreateManyInputObjectSchema } from './objects/WatchReviewLogCreateManyInput.schema';

export const WatchReviewLogCreateManySchema: z.ZodType<Prisma.WatchReviewLogCreateManyArgs> = z.object({ data: z.union([ WatchReviewLogCreateManyInputObjectSchema, z.array(WatchReviewLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogCreateManyArgs>;

export const WatchReviewLogCreateManyZodSchema = z.object({ data: z.union([ WatchReviewLogCreateManyInputObjectSchema, z.array(WatchReviewLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();