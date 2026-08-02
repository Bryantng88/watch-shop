import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema'

const nestedenumstraplengthclassnullablefilterSchema = z.object({
  equals: StrapLengthClassSchema.optional().nullable(),
  in: StrapLengthClassSchema.array().optional().nullable(),
  notIn: StrapLengthClassSchema.array().optional().nullable(),
  not: z.union([StrapLengthClassSchema, z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumStrapLengthClassNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapLengthClassNullableFilter> = nestedenumstraplengthclassnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapLengthClassNullableFilter>;
export const NestedEnumStrapLengthClassNullableFilterObjectZodSchema = nestedenumstraplengthclassnullablefilterSchema;
