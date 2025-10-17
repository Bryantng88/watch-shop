import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './MarketSegmentWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => MarketSegmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => MarketSegmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => MarketSegmentWhereInputObjectSchema).optional()
}).strict();
export const MarketSegmentListRelationFilterObjectSchema: z.ZodType<Prisma.MarketSegmentListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentListRelationFilter>;
export const MarketSegmentListRelationFilterObjectZodSchema = makeSchema();
