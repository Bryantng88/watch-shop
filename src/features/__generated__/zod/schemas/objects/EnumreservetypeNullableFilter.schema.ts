import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReserveTypeSchema } from '../enums/ReserveType.schema';
import { NestedEnumReserveTypeNullableFilterObjectSchema as NestedEnumReserveTypeNullableFilterObjectSchema } from './NestedEnumReserveTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ReserveTypeSchema.optional().nullable(),
  in: ReserveTypeSchema.array().optional().nullable(),
  notIn: ReserveTypeSchema.array().optional().nullable(),
  not: z.union([ReserveTypeSchema, z.lazy(() => NestedEnumReserveTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumReserveTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumReserveTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumReserveTypeNullableFilter>;
export const EnumReserveTypeNullableFilterObjectZodSchema = makeSchema();
