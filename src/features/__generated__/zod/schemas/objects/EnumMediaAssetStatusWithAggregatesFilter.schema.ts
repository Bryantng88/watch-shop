import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema';
import { NestedEnumMediaAssetStatusWithAggregatesFilterObjectSchema as NestedEnumMediaAssetStatusWithAggregatesFilterObjectSchema } from './NestedEnumMediaAssetStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaAssetStatusFilterObjectSchema as NestedEnumMediaAssetStatusFilterObjectSchema } from './NestedEnumMediaAssetStatusFilter.schema'

const makeSchema = () => z.object({
  equals: MediaAssetStatusSchema.optional(),
  in: MediaAssetStatusSchema.array().optional(),
  notIn: MediaAssetStatusSchema.array().optional(),
  not: z.union([MediaAssetStatusSchema, z.lazy(() => NestedEnumMediaAssetStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema).optional()
}).strict();
export const EnumMediaAssetStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaAssetStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaAssetStatusWithAggregatesFilter>;
export const EnumMediaAssetStatusWithAggregatesFilterObjectZodSchema = makeSchema();
