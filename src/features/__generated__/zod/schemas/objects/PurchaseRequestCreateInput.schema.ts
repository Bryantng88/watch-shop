import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { PurchaseRequestItemCreateNestedManyWithoutPurchaseRequestInputObjectSchema as PurchaseRequestItemCreateNestedManyWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestItemCreateNestedManyWithoutPurchaseRequestInput.schema';
import { OrderCreateNestedOneWithoutPurchaseRequestInputObjectSchema as OrderCreateNestedOneWithoutPurchaseRequestInputObjectSchema } from './OrderCreateNestedOneWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  reference: z.string(),
  status: PurchaseRequestStatusSchema.optional(),
  outcome: PurchaseRequestOutcomeSchema.optional().nullable(),
  channel: z.string(),
  externalRequestId: z.string().optional().nullable(),
  requestKey: z.string(),
  requestHash: z.string(),
  fingerprintHash: z.string(),
  customerName: z.string(),
  phone: z.string(),
  contactPreference: PurchaseRequestContactPreferenceSchema.optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  customerNote: z.string().optional().nullable(),
  processingNote: z.string().optional().nullable(),
  completionReason: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  processingStartedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  items: z.lazy(() => PurchaseRequestItemCreateNestedManyWithoutPurchaseRequestInputObjectSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutPurchaseRequestInputObjectSchema).optional()
}).strict();
export const PurchaseRequestCreateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateInput>;
export const PurchaseRequestCreateInputObjectZodSchema = makeSchema();
