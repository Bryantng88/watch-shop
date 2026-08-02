import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSurfaceSchema } from '../enums/StrapSurface.schema';
import { NestedEnumStrapSurfaceNullableFilterObjectSchema as NestedEnumStrapSurfaceNullableFilterObjectSchema } from './NestedEnumStrapSurfaceNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapSurfaceSchema.optional().nullable(),
  in: StrapSurfaceSchema.array().optional().nullable(),
  notIn: StrapSurfaceSchema.array().optional().nullable(),
  not: z.union([StrapSurfaceSchema, z.lazy(() => NestedEnumStrapSurfaceNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumStrapSurfaceNullableFilterObjectSchema: z.ZodType<Prisma.EnumStrapSurfaceNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapSurfaceNullableFilter>;
export const EnumStrapSurfaceNullableFilterObjectZodSchema = makeSchema();
