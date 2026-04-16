import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentUpdateManyMutationInputObjectSchema as MarketSegmentUpdateManyMutationInputObjectSchema } from './objects/MarketSegmentUpdateManyMutationInput.schema';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './objects/MarketSegmentWhereInput.schema';

export const MarketSegmentUpdateManySchema: z.ZodType<Prisma.MarketSegmentUpdateManyArgs> = z.object({ data: MarketSegmentUpdateManyMutationInputObjectSchema, where: MarketSegmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyArgs>;

export const MarketSegmentUpdateManyZodSchema = z.object({ data: MarketSegmentUpdateManyMutationInputObjectSchema, where: MarketSegmentWhereInputObjectSchema.optional() }).strict();