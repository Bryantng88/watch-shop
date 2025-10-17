import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentUpdateManyMutationInputObjectSchema as MarketSegmentUpdateManyMutationInputObjectSchema } from './objects/MarketSegmentUpdateManyMutationInput.schema';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './objects/MarketSegmentWhereInput.schema';

export const MarketSegmentUpdateManyAndReturnSchema: z.ZodType<Prisma.MarketSegmentUpdateManyAndReturnArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), data: MarketSegmentUpdateManyMutationInputObjectSchema, where: MarketSegmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyAndReturnArgs>;

export const MarketSegmentUpdateManyAndReturnZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), data: MarketSegmentUpdateManyMutationInputObjectSchema, where: MarketSegmentWhereInputObjectSchema.optional() }).strict();