import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './objects/WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateCreateInputObjectSchema as WatchReviewStateCreateInputObjectSchema } from './objects/WatchReviewStateCreateInput.schema';
import { WatchReviewStateUncheckedCreateInputObjectSchema as WatchReviewStateUncheckedCreateInputObjectSchema } from './objects/WatchReviewStateUncheckedCreateInput.schema';
import { WatchReviewStateUpdateInputObjectSchema as WatchReviewStateUpdateInputObjectSchema } from './objects/WatchReviewStateUpdateInput.schema';
import { WatchReviewStateUncheckedUpdateInputObjectSchema as WatchReviewStateUncheckedUpdateInputObjectSchema } from './objects/WatchReviewStateUncheckedUpdateInput.schema';

export const WatchReviewStateUpsertOneSchema: z.ZodType<Prisma.WatchReviewStateUpsertArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema, create: z.union([ WatchReviewStateCreateInputObjectSchema, WatchReviewStateUncheckedCreateInputObjectSchema ]), update: z.union([ WatchReviewStateUpdateInputObjectSchema, WatchReviewStateUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateUpsertArgs>;

export const WatchReviewStateUpsertOneZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), where: WatchReviewStateWhereUniqueInputObjectSchema, create: z.union([ WatchReviewStateCreateInputObjectSchema, WatchReviewStateUncheckedCreateInputObjectSchema ]), update: z.union([ WatchReviewStateUpdateInputObjectSchema, WatchReviewStateUncheckedUpdateInputObjectSchema ]) }).strict();