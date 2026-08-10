import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumPurchaseRequestStatusFilterObjectSchema as EnumPurchaseRequestStatusFilterObjectSchema } from './EnumPurchaseRequestStatusFilter.schema';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema';
import { EnumPurchaseRequestOutcomeNullableFilterObjectSchema as EnumPurchaseRequestOutcomeNullableFilterObjectSchema } from './EnumPurchaseRequestOutcomeNullableFilter.schema';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumPurchaseRequestContactPreferenceFilterObjectSchema as EnumPurchaseRequestContactPreferenceFilterObjectSchema } from './EnumPurchaseRequestContactPreferenceFilter.schema';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const purchaserequestscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reference: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumPurchaseRequestStatusFilterObjectSchema), PurchaseRequestStatusSchema]).optional(),
  outcome: z.union([z.lazy(() => EnumPurchaseRequestOutcomeNullableFilterObjectSchema), PurchaseRequestOutcomeSchema]).optional().nullable(),
  channel: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  externalRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  requestKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  fingerprintHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  customerName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  contactPreference: z.union([z.lazy(() => EnumPurchaseRequestContactPreferenceFilterObjectSchema), PurchaseRequestContactPreferenceSchema]).optional(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  city: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  district: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  ward: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  processingNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  completionReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignedUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  followUpAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  processingStartedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestScalarWhereInputObjectSchema: z.ZodType<Prisma.PurchaseRequestScalarWhereInput> = purchaserequestscalarwhereinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestScalarWhereInput>;
export const PurchaseRequestScalarWhereInputObjectZodSchema = purchaserequestscalarwhereinputSchema;
