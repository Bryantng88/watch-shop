import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReserveTypeSchema } from '../enums/ReserveType.schema'

const nestedenumreservetypenullablefilterSchema = z.object({
  equals: ReserveTypeSchema.optional().nullable(),
  in: ReserveTypeSchema.array().optional().nullable(),
  notIn: ReserveTypeSchema.array().optional().nullable(),
  not: z.union([ReserveTypeSchema, z.lazy(() => NestedEnumReserveTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumReserveTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumReserveTypeNullableFilter> = nestedenumreservetypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumReserveTypeNullableFilter>;
export const NestedEnumReserveTypeNullableFilterObjectZodSchema = nestedenumreservetypenullablefilterSchema;
