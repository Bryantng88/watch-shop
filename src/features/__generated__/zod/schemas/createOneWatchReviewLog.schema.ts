import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogCreateInputObjectSchema as WatchReviewLogCreateInputObjectSchema } from './objects/WatchReviewLogCreateInput.schema';
import { WatchReviewLogUncheckedCreateInputObjectSchema as WatchReviewLogUncheckedCreateInputObjectSchema } from './objects/WatchReviewLogUncheckedCreateInput.schema';

export const WatchReviewLogCreateOneSchema: z.ZodType<Prisma.WatchReviewLogCreateArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), data: z.union([WatchReviewLogCreateInputObjectSchema, WatchReviewLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogCreateArgs>;

export const WatchReviewLogCreateOneZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), data: z.union([WatchReviewLogCreateInputObjectSchema, WatchReviewLogUncheckedCreateInputObjectSchema]) }).strict();