import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentCreateManyInputObjectSchema as MarketSegmentCreateManyInputObjectSchema } from './objects/MarketSegmentCreateManyInput.schema';

export const MarketSegmentCreateManySchema: z.ZodType<Prisma.MarketSegmentCreateManyArgs> = z.object({ data: z.union([ MarketSegmentCreateManyInputObjectSchema, z.array(MarketSegmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentCreateManyArgs>;

export const MarketSegmentCreateManyZodSchema = z.object({ data: z.union([ MarketSegmentCreateManyInputObjectSchema, z.array(MarketSegmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();