import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';

export const WatchReviewLogFindUniqueOrThrowSchema: z.ZodType<Prisma.WatchReviewLogFindUniqueOrThrowArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogFindUniqueOrThrowArgs>;

export const WatchReviewLogFindUniqueOrThrowZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict();