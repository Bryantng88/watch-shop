import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { WatchSpecListRelationFilterObjectSchema as WatchSpecListRelationFilterObjectSchema } from './WatchSpecListRelationFilter.schema'

const marketsegmentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MarketSegmentWhereInputObjectSchema), z.lazy(() => MarketSegmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MarketSegmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MarketSegmentWhereInputObjectSchema), z.lazy(() => MarketSegmentWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchSpecs: z.lazy(() => WatchSpecListRelationFilterObjectSchema).optional()
}).strict();
export const MarketSegmentWhereInputObjectSchema: z.ZodType<Prisma.MarketSegmentWhereInput> = marketsegmentwhereinputSchema as unknown as z.ZodType<Prisma.MarketSegmentWhereInput>;
export const MarketSegmentWhereInputObjectZodSchema = marketsegmentwhereinputSchema;
