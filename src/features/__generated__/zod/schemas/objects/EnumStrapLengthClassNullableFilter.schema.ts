import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema';
import { NestedEnumStrapLengthClassNullableFilterObjectSchema as NestedEnumStrapLengthClassNullableFilterObjectSchema } from './NestedEnumStrapLengthClassNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapLengthClassSchema.optional().nullable(),
  in: StrapLengthClassSchema.array().optional().nullable(),
  notIn: StrapLengthClassSchema.array().optional().nullable(),
  not: z.union([StrapLengthClassSchema, z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumStrapLengthClassNullableFilterObjectSchema: z.ZodType<Prisma.EnumStrapLengthClassNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapLengthClassNullableFilter>;
export const EnumStrapLengthClassNullableFilterObjectZodSchema = makeSchema();
