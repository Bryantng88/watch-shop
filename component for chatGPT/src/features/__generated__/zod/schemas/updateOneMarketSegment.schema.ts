import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentUpdateInputObjectSchema as MarketSegmentUpdateInputObjectSchema } from './objects/MarketSegmentUpdateInput.schema';
import { MarketSegmentUncheckedUpdateInputObjectSchema as MarketSegmentUncheckedUpdateInputObjectSchema } from './objects/MarketSegmentUncheckedUpdateInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';

export const MarketSegmentUpdateOneSchema: z.ZodType<Prisma.MarketSegmentUpdateArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), data: z.union([MarketSegmentUpdateInputObjectSchema, MarketSegmentUncheckedUpdateInputObjectSchema]), where: MarketSegmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MarketSegmentUpdateArgs>;

export const MarketSegmentUpdateOneZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), data: z.union([MarketSegmentUpdateInputObjectSchema, MarketSegmentUncheckedUpdateInputObjectSchema]), where: MarketSegmentWhereUniqueInputObjectSchema }).strict();