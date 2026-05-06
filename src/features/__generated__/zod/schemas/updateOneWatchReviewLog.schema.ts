import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogUpdateInputObjectSchema as WatchReviewLogUpdateInputObjectSchema } from './objects/WatchReviewLogUpdateInput.schema';
import { WatchReviewLogUncheckedUpdateInputObjectSchema as WatchReviewLogUncheckedUpdateInputObjectSchema } from './objects/WatchReviewLogUncheckedUpdateInput.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';

export const WatchReviewLogUpdateOneSchema: z.ZodType<Prisma.WatchReviewLogUpdateArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), data: z.union([WatchReviewLogUpdateInputObjectSchema, WatchReviewLogUncheckedUpdateInputObjectSchema]), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateArgs>;

export const WatchReviewLogUpdateOneZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), data: z.union([WatchReviewLogUpdateInputObjectSchema, WatchReviewLogUncheckedUpdateInputObjectSchema]), where: WatchReviewLogWhereUniqueInputObjectSchema }).strict();