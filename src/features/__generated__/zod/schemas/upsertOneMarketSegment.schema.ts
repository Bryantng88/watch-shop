import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentCreateInputObjectSchema as MarketSegmentCreateInputObjectSchema } from './objects/MarketSegmentCreateInput.schema';
import { MarketSegmentUncheckedCreateInputObjectSchema as MarketSegmentUncheckedCreateInputObjectSchema } from './objects/MarketSegmentUncheckedCreateInput.schema';
import { MarketSegmentUpdateInputObjectSchema as MarketSegmentUpdateInputObjectSchema } from './objects/MarketSegmentUpdateInput.schema';
import { MarketSegmentUncheckedUpdateInputObjectSchema as MarketSegmentUncheckedUpdateInputObjectSchema } from './objects/MarketSegmentUncheckedUpdateInput.schema';

export const MarketSegmentUpsertOneSchema: z.ZodType<Prisma.MarketSegmentUpsertArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema, create: z.union([ MarketSegmentCreateInputObjectSchema, MarketSegmentUncheckedCreateInputObjectSchema ]), update: z.union([ MarketSegmentUpdateInputObjectSchema, MarketSegmentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MarketSegmentUpsertArgs>;

export const MarketSegmentUpsertOneZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), where: MarketSegmentWhereUniqueInputObjectSchema, create: z.union([ MarketSegmentCreateInputObjectSchema, MarketSegmentUncheckedCreateInputObjectSchema ]), update: z.union([ MarketSegmentUpdateInputObjectSchema, MarketSegmentUncheckedUpdateInputObjectSchema ]) }).strict();