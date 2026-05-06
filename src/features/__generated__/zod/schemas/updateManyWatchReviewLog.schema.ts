import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogUpdateManyMutationInputObjectSchema as WatchReviewLogUpdateManyMutationInputObjectSchema } from './objects/WatchReviewLogUpdateManyMutationInput.schema';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './objects/WatchReviewLogWhereInput.schema';

export const WatchReviewLogUpdateManySchema: z.ZodType<Prisma.WatchReviewLogUpdateManyArgs> = z.object({ data: WatchReviewLogUpdateManyMutationInputObjectSchema, where: WatchReviewLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateManyArgs>;

export const WatchReviewLogUpdateManyZodSchema = z.object({ data: WatchReviewLogUpdateManyMutationInputObjectSchema, where: WatchReviewLogWhereInputObjectSchema.optional() }).strict();