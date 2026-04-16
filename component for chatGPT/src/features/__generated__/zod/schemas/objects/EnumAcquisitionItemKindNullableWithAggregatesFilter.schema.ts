import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { NestedEnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema as NestedEnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema } from './NestedEnumAcquisitionItemKindNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumAcquisitionItemKindNullableFilterObjectSchema as NestedEnumAcquisitionItemKindNullableFilterObjectSchema } from './NestedEnumAcquisitionItemKindNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionItemKindSchema.optional().nullable(),
  in: AcquisitionItemKindSchema.array().optional().nullable(),
  notIn: AcquisitionItemKindSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemKindSchema, z.lazy(() => NestedEnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAcquisitionItemKindNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAcquisitionItemKindNullableFilterObjectSchema).optional()
}).strict();
export const EnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionItemKindNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionItemKindNullableWithAggregatesFilter>;
export const EnumAcquisitionItemKindNullableWithAggregatesFilterObjectZodSchema = makeSchema();
