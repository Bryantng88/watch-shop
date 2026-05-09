import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaAssetStatusFilterObjectSchema as NestedEnumMediaAssetStatusFilterObjectSchema } from './NestedEnumMediaAssetStatusFilter.schema'

const nestedenummediaassetstatuswithaggregatesfilterSchema = z.object({
  equals: MediaAssetStatusSchema.optional(),
  in: MediaAssetStatusSchema.array().optional(),
  notIn: MediaAssetStatusSchema.array().optional(),
  not: z.union([MediaAssetStatusSchema, z.lazy(() => NestedEnumMediaAssetStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaAssetStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaAssetStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaAssetStatusWithAggregatesFilter> = nestedenummediaassetstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaAssetStatusWithAggregatesFilter>;
export const NestedEnumMediaAssetStatusWithAggregatesFilterObjectZodSchema = nestedenummediaassetstatuswithaggregatesfilterSchema;
