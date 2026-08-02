import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema'

const nestedenumstrapsurfacenullablefilterSchema = z.object({
  equals: StrapSurfaceSchema.optional().nullable(),
  in: StrapSurfaceSchema.array().optional().nullable(),
  notIn: StrapSurfaceSchema.array().optional().nullable(),
  not: z.union([StrapSurfaceSchema, z.lazy(() => NestedEnumStrapSurfaceNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumStrapSurfaceNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapSurfaceNullableFilter> = nestedenumstrapsurfacenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapSurfaceNullableFilter>;
export const NestedEnumStrapSurfaceNullableFilterObjectZodSchema = nestedenumstrapsurfacenullablefilterSchema;
