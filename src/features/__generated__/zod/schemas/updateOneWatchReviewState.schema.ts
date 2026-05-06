import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateUpdateInputObjectSchema as WatchReviewStateUpdateInputObjectSchema } from './objects/WatchReviewStateUpdateInput.schema';
import { WatchReviewStateUncheckedUpdateInputObjectSchema as WatchReviewStateUncheckedUpdateInputObjectSchema } from './objects/WatchReviewStateUncheckedUpdateInput.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './objects/WatchReviewStateWhereUniqueInput.schema';

export const WatchReviewStateUpdateOneSchema: z.ZodType<Prisma.WatchReviewStateUpdateArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), data: z.union([WatchReviewStateUpdateInputObjectSchema, WatchReviewStateUncheckedUpdateInputObjectSchema]), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateArgs>;

export const WatchReviewStateUpdateOneZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), data: z.union([WatchReviewStateUpdateInputObjectSchema, WatchReviewStateUncheckedUpdateInputObjectSchema]), where: WatchReviewStateWhereUniqueInputObjectSchema }).strict();