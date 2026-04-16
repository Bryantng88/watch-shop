import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const marketsegmentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MarketSegmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MarketSegmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MarketSegmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const MarketSegmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MarketSegmentScalarWhereWithAggregatesInput> = marketsegmentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MarketSegmentScalarWhereWithAggregatesInput>;
export const MarketSegmentScalarWhereWithAggregatesInputObjectZodSchema = marketsegmentscalarwherewithaggregatesinputSchema;
