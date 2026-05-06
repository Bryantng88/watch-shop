import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './objects/WatchReviewStateWhereUniqueInput.schema';

export const WatchReviewStateFindUniqueSchema: z.ZodType<Prisma.WatchReviewStateFindUniqueArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateFindUniqueArgs>;

export const WatchReviewStateFindUniqueZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict();