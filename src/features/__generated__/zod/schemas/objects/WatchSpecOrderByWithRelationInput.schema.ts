import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ComplicationOrderByRelationAggregateInputObjectSchema as ComplicationOrderByRelationAggregateInputObjectSchema } from './ComplicationOrderByRelationAggregateInput.schema';
import { MarketSegmentOrderByRelationAggregateInputObjectSchema as MarketSegmentOrderByRelationAggregateInputObjectSchema } from './MarketSegmentOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  model: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  year: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseType: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  length: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  thickness: SortOrderSchema.optional(),
  movement: SortOrderSchema.optional(),
  caliber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseMaterial: SortOrderSchema.optional(),
  goldKarat: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseSize: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  marketSegmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strap: SortOrderSchema.optional(),
  glass: SortOrderSchema.optional(),
  boxIncluded: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  sizeCategory: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  complication: z.lazy(() => ComplicationOrderByRelationAggregateInputObjectSchema).optional(),
  marketSegment: z.lazy(() => MarketSegmentOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WatchSpecOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchSpecOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecOrderByWithRelationInput>;
export const WatchSpecOrderByWithRelationInputObjectZodSchema = makeSchema();
