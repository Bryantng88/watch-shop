import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchSpecV2CountOrderByAggregateInputObjectSchema as WatchSpecV2CountOrderByAggregateInputObjectSchema } from './WatchSpecV2CountOrderByAggregateInput.schema';
import { WatchSpecV2AvgOrderByAggregateInputObjectSchema as WatchSpecV2AvgOrderByAggregateInputObjectSchema } from './WatchSpecV2AvgOrderByAggregateInput.schema';
import { WatchSpecV2MaxOrderByAggregateInputObjectSchema as WatchSpecV2MaxOrderByAggregateInputObjectSchema } from './WatchSpecV2MaxOrderByAggregateInput.schema';
import { WatchSpecV2MinOrderByAggregateInputObjectSchema as WatchSpecV2MinOrderByAggregateInputObjectSchema } from './WatchSpecV2MinOrderByAggregateInput.schema';
import { WatchSpecV2SumOrderByAggregateInputObjectSchema as WatchSpecV2SumOrderByAggregateInputObjectSchema } from './WatchSpecV2SumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  brand: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  model: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  referenceNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  nickname: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseShape: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseSizeMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lugToLugMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lugWidthMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  thicknessMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  materialProfile: SortOrderSchema.optional(),
  primaryCaseMaterial: SortOrderSchema.optional(),
  secondaryCaseMaterial: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldTreatment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldColors: SortOrderSchema.optional(),
  goldKarat: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  materialNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialFinish: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  crystal: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  calibre: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  powerReserve: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  waterResistance: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  braceletType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strapMaterialText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  buckleType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  boxIncluded: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  featuresJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  rawSpecJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchSpecV2CountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WatchSpecV2AvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchSpecV2MaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchSpecV2MinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WatchSpecV2SumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchSpecV2OrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchSpecV2OrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2OrderByWithAggregationInput>;
export const WatchSpecV2OrderByWithAggregationInputObjectZodSchema = makeSchema();
