import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemFindManySchema as PurchaseRequestItemFindManySchema } from '../findManyPurchaseRequestItem.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { PurchaseRequestCountOutputTypeArgsObjectSchema as PurchaseRequestCountOutputTypeArgsObjectSchema } from './PurchaseRequestCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  reference: z.boolean().optional(),
  status: z.boolean().optional(),
  outcome: z.boolean().optional(),
  channel: z.boolean().optional(),
  externalRequestId: z.boolean().optional(),
  requestKey: z.boolean().optional(),
  requestHash: z.boolean().optional(),
  fingerprintHash: z.boolean().optional(),
  customerName: z.boolean().optional(),
  phone: z.boolean().optional(),
  contactPreference: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  district: z.boolean().optional(),
  ward: z.boolean().optional(),
  customerNote: z.boolean().optional(),
  processingNote: z.boolean().optional(),
  completionReason: z.boolean().optional(),
  assignedUserId: z.boolean().optional(),
  followUpAt: z.boolean().optional(),
  processingStartedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  orderId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  items: z.union([z.boolean(), z.lazy(() => PurchaseRequestItemFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PurchaseRequestCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestSelectObjectSchema: z.ZodType<Prisma.PurchaseRequestSelect> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestSelect>;
export const PurchaseRequestSelectObjectZodSchema = makeSchema();
