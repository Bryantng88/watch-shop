import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './objects/WatchReviewLogWhereInput.schema';

export const WatchReviewLogDeleteManySchema: z.ZodType<Prisma.WatchReviewLogDeleteManyArgs> = z.object({ where: WatchReviewLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogDeleteManyArgs>;

export const WatchReviewLogDeleteManyZodSchema = z.object({ where: WatchReviewLogWhereInputObjectSchema.optional() }).strict();