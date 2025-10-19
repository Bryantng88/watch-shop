import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';

export const MarketSegmentDeleteOneSchema: z.ZodType<Prisma.MarketSegmentDeleteArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MarketSegmentDeleteArgs>;

export const MarketSegmentDeleteOneZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema }).strict();