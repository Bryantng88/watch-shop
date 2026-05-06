import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';

export const WatchReviewLogFindUniqueSchema: z.ZodType<Prisma.WatchReviewLogFindUniqueArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogFindUniqueArgs>;

export const WatchReviewLogFindUniqueZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict();