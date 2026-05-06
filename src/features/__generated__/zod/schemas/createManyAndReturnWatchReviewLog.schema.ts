import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogCreateManyInputObjectSchema as WatchReviewLogCreateManyInputObjectSchema } from './objects/WatchReviewLogCreateManyInput.schema';

export const WatchReviewLogCreateManyAndReturnSchema: z.ZodType<Prisma.WatchReviewLogCreateManyAndReturnArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), data: z.union([ WatchReviewLogCreateManyInputObjectSchema, z.array(WatchReviewLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogCreateManyAndReturnArgs>;

export const WatchReviewLogCreateManyAndReturnZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), data: z.union([ WatchReviewLogCreateManyInputObjectSchema, z.array(WatchReviewLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();