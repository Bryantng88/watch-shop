import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumPurchaseRequestStatusWithAggregatesFilterObjectSchema as EnumPurchaseRequestStatusWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestStatusWithAggregatesFilter.schema';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema';
import { EnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema as EnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestOutcomeNullableWithAggregatesFilter.schema';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema as EnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema } from './EnumPurchaseRequestContactPreferenceWithAggregatesFilter.schema';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const purchaserequestscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PurchaseRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PurchaseRequestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PurchaseRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PurchaseRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  reference: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumPurchaseRequestStatusWithAggregatesFilterObjectSchema), PurchaseRequestStatusSchema]).optional(),
  outcome: z.union([z.lazy(() => EnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema), PurchaseRequestOutcomeSchema]).optional().nullable(),
  channel: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  externalRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  requestKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  fingerprintHash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  customerName: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  normalizedPhone: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  contactPreference: z.union([z.lazy(() => EnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema), PurchaseRequestContactPreferenceSchema]).optional(),
  contactHandle: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  address: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  city: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  district: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  ward: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  customerNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  processingNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  completionReason: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  assignedUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  followUpAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  processingStartedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PurchaseRequestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PurchaseRequestScalarWhereWithAggregatesInput> = purchaserequestscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PurchaseRequestScalarWhereWithAggregatesInput>;
export const PurchaseRequestScalarWhereWithAggregatesInputObjectZodSchema = purchaserequestscalarwherewithaggregatesinputSchema;
