import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapSurfaceNullableFilterObjectSchema as NestedEnumStrapSurfaceNullableFilterObjectSchema } from './NestedEnumStrapSurfaceNullableFilter.schema'

const nestedenumstrapsurfacenullablewithaggregatesfilterSchema = z.object({
  equals: StrapSurfaceSchema.optional().nullable(),
  in: StrapSurfaceSchema.array().optional().nullable(),
  notIn: StrapSurfaceSchema.array().optional().nullable(),
  not: z.union([StrapSurfaceSchema, z.lazy(() => NestedEnumStrapSurfaceNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapSurfaceNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapSurfaceNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapSurfaceNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapSurfaceNullableWithAggregatesFilter> = nestedenumstrapsurfacenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapSurfaceNullableWithAggregatesFilter>;
export const NestedEnumStrapSurfaceNullableWithAggregatesFilterObjectZodSchema = nestedenumstrapsurfacenullablewithaggregatesfilterSchema;
