import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { NestedEnumAcquisitionItemKindNullableFilterObjectSchema as NestedEnumAcquisitionItemKindNullableFilterObjectSchema } from './NestedEnumAcquisitionItemKindNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionItemKindSchema.optional().nullable(),
  in: AcquisitionItemKindSchema.array().optional().nullable(),
  notIn: AcquisitionItemKindSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemKindSchema, z.lazy(() => NestedEnumAcquisitionItemKindNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumAcquisitionItemKindNullableFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionItemKindNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionItemKindNullableFilter>;
export const EnumAcquisitionItemKindNullableFilterObjectZodSchema = makeSchema();
