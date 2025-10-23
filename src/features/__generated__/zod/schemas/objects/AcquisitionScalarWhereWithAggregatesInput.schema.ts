import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumAcquisitionTypeWithAggregatesFilterObjectSchema as EnumAcquisitionTypeWithAggregatesFilterObjectSchema } from './EnumAcquisitionTypeWithAggregatesFilter.schema';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumAcquisitionStatusWithAggregatesFilterObjectSchema as EnumAcquisitionStatusWithAggregatesFilterObjectSchema } from './EnumAcquisitionStatusWithAggregatesFilter.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

const acquisitionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumAcquisitionTypeWithAggregatesFilterObjectSchema), AcquisitionTypeSchema]).optional(),
  acquiredAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  cost: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  payoutStatus: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  accquisitionStt: z.union([z.lazy(() => EnumAcquisitionStatusWithAggregatesFilterObjectSchema), AcquisitionStatusSchema]).optional(),
  refNo: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  condition: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AcquisitionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AcquisitionScalarWhereWithAggregatesInput> = acquisitionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AcquisitionScalarWhereWithAggregatesInput>;
export const AcquisitionScalarWhereWithAggregatesInputObjectZodSchema = acquisitionscalarwherewithaggregatesinputSchema;
