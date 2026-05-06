import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './objects/WatchReviewStateWhereInput.schema';

export const WatchReviewStateDeleteManySchema: z.ZodType<Prisma.WatchReviewStateDeleteManyArgs> = z.object({ where: WatchReviewStateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateDeleteManyArgs>;

export const WatchReviewStateDeleteManyZodSchema = z.object({ where: WatchReviewStateWhereInputObjectSchema.optional() }).strict();