import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';

export const MarketSegmentFindUniqueOrThrowSchema: z.ZodType<Prisma.MarketSegmentFindUniqueOrThrowArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MarketSegmentFindUniqueOrThrowArgs>;

export const MarketSegmentFindUniqueOrThrowZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema }).strict();