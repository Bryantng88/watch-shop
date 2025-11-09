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
  caseType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  gender: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  length: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  width: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  thickness: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movement: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caliber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseMaterial: SortOrderSchema.optional(),
  goldKarat: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseSize: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  marketSegmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  glass: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  boxIncluded: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  sizeCategory: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ref: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  complication: z.lazy(() => ComplicationOrderByRelationAggregateInputObjectSchema).optional(),
  marketSegment: z.lazy(() => MarketSegmentOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WatchSpecOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchSpecOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecOrderByWithRelationInput>;
export const WatchSpecOrderByWithRelationInputObjectZodSchema = makeSchema();
