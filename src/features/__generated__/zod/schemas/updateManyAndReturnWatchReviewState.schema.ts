import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateSelectObjectSchema as WatchReviewStateSelectObjectSchema } from './objects/WatchReviewStateSelect.schema';
import { WatchReviewStateUpdateManyMutationInputObjectSchema as WatchReviewStateUpdateManyMutationInputObjectSchema } from './objects/WatchReviewStateUpdateManyMutationInput.schema';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './objects/WatchReviewStateWhereInput.schema';

export const WatchReviewStateUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchReviewStateUpdateManyAndReturnArgs> = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), data: WatchReviewStateUpdateManyMutationInputObjectSchema, where: WatchReviewStateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateManyAndReturnArgs>;

export const WatchReviewStateUpdateManyAndReturnZodSchema = z.object({ select: WatchReviewStateSelectObjectSchema.optional(), data: WatchReviewStateUpdateManyMutationInputObjectSchema, where: WatchReviewStateWhereInputObjectSchema.optional() }).strict();