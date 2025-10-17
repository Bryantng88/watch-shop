import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema'

const nestedenumlengthlabelnullablefilterSchema = z.object({
  equals: LengthLabelSchema.optional().nullable(),
  in: LengthLabelSchema.array().optional().nullable(),
  notIn: LengthLabelSchema.array().optional().nullable(),
  not: z.union([LengthLabelSchema, z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumLengthLabelNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumLengthLabelNullableFilter> = nestedenumlengthlabelnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumLengthLabelNullableFilter>;
export const NestedEnumLengthLabelNullableFilterObjectZodSchema = nestedenumlengthlabelnullablefilterSchema;
