import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateUpdateManyMutationInputObjectSchema as WatchReviewStateUpdateManyMutationInputObjectSchema } from './objects/WatchReviewStateUpdateManyMutationInput.schema';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './objects/WatchReviewStateWhereInput.schema';

export const WatchReviewStateUpdateManySchema: z.ZodType<Prisma.WatchReviewStateUpdateManyArgs> = z.object({ data: WatchReviewStateUpdateManyMutationInputObjectSchema, where: WatchReviewStateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateManyArgs>;

export const WatchReviewStateUpdateManyZodSchema = z.object({ data: WatchReviewStateUpdateManyMutationInputObjectSchema, where: WatchReviewStateWhereInputObjectSchema.optional() }).strict();