import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { reservetypeSchema } from '../enums/reservetype.schema';
import { NestedEnumreservetypeNullableFilterObjectSchema as NestedEnumreservetypeNullableFilterObjectSchema } from './NestedEnumreservetypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: reservetypeSchema.optional().nullable(),
  in: reservetypeSchema.array().optional().nullable(),
  notIn: reservetypeSchema.array().optional().nullable(),
  not: z.union([reservetypeSchema, z.lazy(() => NestedEnumreservetypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumreservetypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumreservetypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumreservetypeNullableFilter>;
export const EnumreservetypeNullableFilterObjectZodSchema = makeSchema();
