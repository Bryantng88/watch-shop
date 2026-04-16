import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './objects/WatchPriceWhereInput.schema';

export const WatchPriceDeleteManySchema: z.ZodType<Prisma.WatchPriceDeleteManyArgs> = z.object({ where: WatchPriceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceDeleteManyArgs>;

export const WatchPriceDeleteManyZodSchema = z.object({ where: WatchPriceWhereInputObjectSchema.optional() }).strict();