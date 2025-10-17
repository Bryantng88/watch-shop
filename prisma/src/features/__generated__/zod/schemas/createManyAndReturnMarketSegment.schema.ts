import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './objects/MarketSegmentSelect.schema';
import { MarketSegmentCreateManyInputObjectSchema as MarketSegmentCreateManyInputObjectSchema } from './objects/MarketSegmentCreateManyInput.schema';

export const MarketSegmentCreateManyAndReturnSchema: z.ZodType<Prisma.MarketSegmentCreateManyAndReturnArgs> = z.object({ select: MarketSegmentSelectObjectSchema.optional(), data: z.union([ MarketSegmentCreateManyInputObjectSchema, z.array(MarketSegmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentCreateManyAndReturnArgs>;

export const MarketSegmentCreateManyAndReturnZodSchema = z.object({ select: MarketSegmentSelectObjectSchema.optional(), data: z.union([ MarketSegmentCreateManyInputObjectSchema, z.array(MarketSegmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();