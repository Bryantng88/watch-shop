import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const acquisitionitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceOrderItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AcquisitionItemScalarWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionItemScalarWhereInput> = acquisitionitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionItemScalarWhereInput>;
export const AcquisitionItemScalarWhereInputObjectZodSchema = acquisitionitemscalarwhereinputSchema;
