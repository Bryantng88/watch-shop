import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { reservetypeSchema } from '../enums/reservetype.schema'

const nestedenumreservetypenullablefilterSchema = z.object({
  equals: reservetypeSchema.optional().nullable(),
  in: reservetypeSchema.array().optional().nullable(),
  notIn: reservetypeSchema.array().optional().nullable(),
  not: z.union([reservetypeSchema, z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumreservetypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumreservetypeNullableFilter> = nestedenumreservetypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumreservetypeNullableFilter>;
export const NestedEnumreservetypeNullableFilterObjectZodSchema = nestedenumreservetypenullablefilterSchema;
