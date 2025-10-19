import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { NestedEnumLengthLabelNullableFilterObjectSchema as NestedEnumLengthLabelNullableFilterObjectSchema } from './NestedEnumLengthLabelNullableFilter.schema'

const makeSchema = () => z.object({
  equals: LengthLabelSchema.optional().nullable(),
  in: LengthLabelSchema.array().optional().nullable(),
  notIn: LengthLabelSchema.array().optional().nullable(),
  not: z.union([LengthLabelSchema, z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumLengthLabelNullableFilterObjectSchema: z.ZodType<Prisma.EnumLengthLabelNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumLengthLabelNullableFilter>;
export const EnumLengthLabelNullableFilterObjectZodSchema = makeSchema();
