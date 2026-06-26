import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { NestedEnumAppTagOwnerTypeNullableFilterObjectSchema as NestedEnumAppTagOwnerTypeNullableFilterObjectSchema } from './NestedEnumAppTagOwnerTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagOwnerTypeSchema.optional().nullable(),
  in: AppTagOwnerTypeSchema.array().optional().nullable(),
  notIn: AppTagOwnerTypeSchema.array().optional().nullable(),
  not: z.union([AppTagOwnerTypeSchema, z.lazy(() => NestedEnumAppTagOwnerTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumAppTagOwnerTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumAppTagOwnerTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagOwnerTypeNullableFilter>;
export const EnumAppTagOwnerTypeNullableFilterObjectZodSchema = makeSchema();
