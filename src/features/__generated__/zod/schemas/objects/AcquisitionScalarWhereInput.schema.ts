import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumAcquisitionTypeFilterObjectSchema as EnumAcquisitionTypeFilterObjectSchema } from './EnumAcquisitionTypeFilter.schema';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumAcquisitionStatusFilterObjectSchema as EnumAcquisitionStatusFilterObjectSchema } from './EnumAcquisitionStatusFilter.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const acquisitionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionScalarWhereInputObjectSchema), z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionScalarWhereInputObjectSchema), z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  vendorId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumAcquisitionTypeFilterObjectSchema), AcquisitionTypeSchema]).optional(),
  acquiredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  cost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payoutStatus: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  accquisitionStt: z.union([z.lazy(() => EnumAcquisitionStatusFilterObjectSchema), AcquisitionStatusSchema]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  condition: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  sentAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  returnedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const AcquisitionScalarWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionScalarWhereInput> = acquisitionscalarwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionScalarWhereInput>;
export const AcquisitionScalarWhereInputObjectZodSchema = acquisitionscalarwhereinputSchema;
