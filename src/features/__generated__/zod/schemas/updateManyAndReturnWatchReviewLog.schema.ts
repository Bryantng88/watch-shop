import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogSelectObjectSchema as WatchReviewLogSelectObjectSchema } from './objects/WatchReviewLogSelect.schema';
import { WatchReviewLogUpdateManyMutationInputObjectSchema as WatchReviewLogUpdateManyMutationInputObjectSchema } from './objects/WatchReviewLogUpdateManyMutationInput.schema';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './objects/WatchReviewLogWhereInput.schema';

export const WatchReviewLogUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchReviewLogUpdateManyAndReturnArgs> = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), data: WatchReviewLogUpdateManyMutationInputObjectSchema, where: WatchReviewLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateManyAndReturnArgs>;

export const WatchReviewLogUpdateManyAndReturnZodSchema = z.object({ select: WatchReviewLogSelectObjectSchema.optional(), data: WatchReviewLogUpdateManyMutationInputObjectSchema, where: WatchReviewLogWhereInputObjectSchema.optional() }).strict();