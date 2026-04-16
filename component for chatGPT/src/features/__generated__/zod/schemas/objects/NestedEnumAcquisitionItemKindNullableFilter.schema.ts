import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema'

const nestedenumacquisitionitemkindnullablefilterSchema = z.object({
  equals: AcquisitionItemKindSchema.optional().nullable(),
  in: AcquisitionItemKindSchema.array().optional().nullable(),
  notIn: AcquisitionItemKindSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemKindSchema, z.lazy(() => NestedEnumAcquisitionItemKindNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumAcquisitionItemKindNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionItemKindNullableFilter> = nestedenumacquisitionitemkindnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionItemKindNullableFilter>;
export const NestedEnumAcquisitionItemKindNullableFilterObjectZodSchema = nestedenumacquisitionitemkindnullablefilterSchema;
