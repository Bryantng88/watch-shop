import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateCreateInputObjectSchema as WatchReviewStateCreateInputObjectSchema } from './objects/WatchReviewStateCreateInput.schema';
import { WatchReviewStateUncheckedCreateInputObjectSchema as WatchReviewStateUncheckedCreateInputObjectSchema } from './objects/WatchReviewStateUncheckedCreateInput.schema';

export const WatchReviewStateCreateOneSchema: z.ZodType<Prisma.WatchReviewStateCreateArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), data: z.union([WatchReviewStateCreateInputObjectSchema, WatchReviewStateUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateCreateArgs>;

export const WatchReviewStateCreateOneZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), data: z.union([WatchReviewStateCreateInputObjectSchema, WatchReviewStateUncheckedCreateInputObjectSchema]) }).strict();