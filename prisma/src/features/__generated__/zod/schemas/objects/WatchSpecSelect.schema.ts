import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ComplicationFindManySchema as ComplicationFindManySchema } from '../findManyComplication.schema';
import { MarketSegmentFindManySchema as MarketSegmentFindManySchema } from '../findManyMarketSegment.schema';
import { WatchSpecCountOutputTypeArgsObjectSchema as WatchSpecCountOutputTypeArgsObjectSchema } from './WatchSpecCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  productId: z.boolean().optional(),
  model: z.boolean().optional(),
  year: z.boolean().optional(),
  caseType: z.boolean().optional(),
  category: z.boolean().optional(),
  gender: z.boolean().optional(),
  length: z.boolean().optional(),
  sizeCategory: z.boolean().optional(),
  width: z.boolean().optional(),
  thickness: z.boolean().optional(),
  movement: z.boolean().optional(),
  caliber: z.boolean().optional(),
  caseMaterial: z.boolean().optional(),
  goldKarat: z.boolean().optional(),
  goldColor: z.boolean().optional(),
  caseSize: z.boolean().optional(),
  dialColor: z.boolean().optional(),
  marketSegmentId: z.boolean().optional(),
  strap: z.boolean().optional(),
  glass: z.boolean().optional(),
  boxIncluded: z.boolean().optional(),
  bookletIncluded: z.boolean().optional(),
  cardIncluded: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  complication: z.union([z.boolean(), z.lazy(() => ComplicationFindManySchema)]).optional(),
  marketSegment: z.union([z.boolean(), z.lazy(() => MarketSegmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchSpecCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchSpecSelectObjectSchema: z.ZodType<Prisma.WatchSpecSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecSelect>;
export const WatchSpecSelectObjectZodSchema = makeSchema();
