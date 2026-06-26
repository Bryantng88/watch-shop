import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema'

const nestedenumapptagownertypenullablefilterSchema = z.object({
  equals: AppTagOwnerTypeSchema.optional().nullable(),
  in: AppTagOwnerTypeSchema.array().optional().nullable(),
  notIn: AppTagOwnerTypeSchema.array().optional().nullable(),
  not: z.union([AppTagOwnerTypeSchema, z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumAppTagOwnerTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagOwnerTypeNullableFilter> = nestedenumapptagownertypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagOwnerTypeNullableFilter>;
export const NestedEnumAppTagOwnerTypeNullableFilterObjectZodSchema = nestedenumapptagownertypenullablefilterSchema;
