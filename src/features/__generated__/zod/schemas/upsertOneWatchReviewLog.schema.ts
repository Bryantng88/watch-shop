import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogCreateInputObjectSchema as WatchReviewLogCreateInputObjectSchema } from './objects/WatchReviewLogCreateInput.schema';
import { WatchReviewLogUncheckedCreateInputObjectSchema as WatchReviewLogUncheckedCreateInputObjectSchema } from './objects/WatchReviewLogUncheckedCreateInput.schema';
import { WatchReviewLogUpdateInputObjectSchema as WatchReviewLogUpdateInputObjectSchema } from './objects/WatchReviewLogUpdateInput.schema';
import { WatchReviewLogUncheckedUpdateInputObjectSchema as WatchReviewLogUncheckedUpdateInputObjectSchema } from './objects/WatchReviewLogUncheckedUpdateInput.schema';

export const WatchReviewLogUpsertOneSchema: z.ZodType<Prisma.WatchReviewLogUpsertArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema, create: z.union([ WatchReviewLogCreateInputObjectSchema, WatchReviewLogUncheckedCreateInputObjectSchema ]), update: z.union([ WatchReviewLogUpdateInputObjectSchema, WatchReviewLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogUpsertArgs>;

export const WatchReviewLogUpsertOneZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), where: WatchReviewLogWhereUniqueInputObjectSchema, create: z.union([ WatchReviewLogCreateInputObjectSchema, WatchReviewLogUncheckedCreateInputObjectSchema ]), update: z.union([ WatchReviewLogUpdateInputObjectSchema, WatchReviewLogUncheckedUpdateInputObjectSchema ]) }).strict();