import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentCreateInputObjectSchema as MarketSegmentCreateInputObjectSchema } from './objects/MarketSegmentCreateInput.schema';
import { MarketSegmentUncheckedCreateInputObjectSchema as MarketSegmentUncheckedCreateInputObjectSchema } from './objects/MarketSegmentUncheckedCreateInput.schema';

export const MarketSegmentCreateOneSchema: z.ZodType<Prisma.MarketSegmentCreateArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), data: z.union([MarketSegmentCreateInputObjectSchema, MarketSegmentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MarketSegmentCreateArgs>;

export const MarketSegmentCreateOneZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), data: z.union([MarketSegmentCreateInputObjectSchema, MarketSegmentUncheckedCreateInputObjectSchema]) }).strict();