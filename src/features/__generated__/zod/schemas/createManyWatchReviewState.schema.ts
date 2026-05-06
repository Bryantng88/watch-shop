import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateCreateManyInputObjectSchema as WatchReviewStateCreateManyInputObjectSchema } from './objects/WatchReviewStateCreateManyInput.schema';

export const WatchReviewStateCreateManySchema: z.ZodType<Prisma.WatchReviewStateCreateManyArgs> = z.object({ data: z.union([ WatchReviewStateCreateManyInputObjectSchema, z.array(WatchReviewStateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateCreateManyArgs>;

export const WatchReviewStateCreateManyZodSchema = z.object({ data: z.union([ WatchReviewStateCreateManyInputObjectSchema, z.array(WatchReviewStateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();