import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './objects/MarketSegmentWhereInput.schema';

export const MarketSegmentDeleteManySchema: z.ZodType<Prisma.MarketSegmentDeleteManyArgs> = z.object({ where: MarketSegmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentDeleteManyArgs>;

export const MarketSegmentDeleteManyZodSchema = z.object({ where: MarketSegmentWhereInputObjectSchema.optional() }).strict();