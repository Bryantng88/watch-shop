import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema as EnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema } from './EnumAcquisitionItemKindNullableWithAggregatesFilter.schema';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { EnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema as EnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema } from './EnumAcquisitionItemStatusNullableWithAggregatesFilter.schema';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { BoolNullableWithAggregatesFilterObjectSchema as BoolNullableWithAggregatesFilterObjectSchema } from './BoolNullableWithAggregatesFilter.schema'

const acquisitionitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sourceOrderItemId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  kind: z.union([z.lazy(() => EnumAcquisitionItemKindNullableWithAggregatesFilterObjectSchema), AcquisitionItemKindSchema]).optional().nullable(),
  status: z.union([z.lazy(() => EnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema), AcquisitionItemStatusSchema]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  expectedReturnAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  returnedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  vendorRmaNo: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyMonths: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  capitalizeToProduct: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable()
}).strict();
export const AcquisitionItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AcquisitionItemScalarWhereWithAggregatesInput> = acquisitionitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AcquisitionItemScalarWhereWithAggregatesInput>;
export const AcquisitionItemScalarWhereWithAggregatesInputObjectZodSchema = acquisitionitemscalarwherewithaggregatesinputSchema;
