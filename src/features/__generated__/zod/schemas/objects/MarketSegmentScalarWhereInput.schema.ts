import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema'

const marketsegmentscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MarketSegmentScalarWhereInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MarketSegmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MarketSegmentScalarWhereInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const MarketSegmentScalarWhereInputObjectSchema: z.ZodType<Prisma.MarketSegmentScalarWhereInput> = marketsegmentscalarwhereinputSchema as unknown as z.ZodType<Prisma.MarketSegmentScalarWhereInput>;
export const MarketSegmentScalarWhereInputObjectZodSchema = marketsegmentscalarwhereinputSchema;
