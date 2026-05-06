import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './objects/WatchReviewStateWhereUniqueInput.schema';

export const WatchReviewStateFindUniqueOrThrowSchema: z.ZodType<Prisma.WatchReviewStateFindUniqueOrThrowArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateFindUniqueOrThrowArgs>;

export const WatchReviewStateFindUniqueOrThrowZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict();