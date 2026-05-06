import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateCreateManyInputObjectSchema as WatchReviewStateCreateManyInputObjectSchema } from './objects/WatchReviewStateCreateManyInput.schema';

export const WatchReviewStateCreateManyAndReturnSchema: z.ZodType<Prisma.WatchReviewStateCreateManyAndReturnArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), data: z.union([ WatchReviewStateCreateManyInputObjectSchema, z.array(WatchReviewStateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateCreateManyAndReturnArgs>;

export const WatchReviewStateCreateManyAndReturnZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), data: z.union([ WatchReviewStateCreateManyInputObjectSchema, z.array(WatchReviewStateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();