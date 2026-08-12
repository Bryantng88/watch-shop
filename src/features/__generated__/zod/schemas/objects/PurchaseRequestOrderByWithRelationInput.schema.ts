import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PurchaseRequestItemOrderByRelationAggregateInputObjectSchema as PurchaseRequestItemOrderByRelationAggregateInputObjectSchema } from './PurchaseRequestItemOrderByRelationAggregateInput.schema';
import { PurchaseRequestActivityOrderByRelationAggregateInputObjectSchema as PurchaseRequestActivityOrderByRelationAggregateInputObjectSchema } from './PurchaseRequestActivityOrderByRelationAggregateInput.schema';
import { PurchaseRequestIngressReceiptOrderByRelationAggregateInputObjectSchema as PurchaseRequestIngressReceiptOrderByRelationAggregateInputObjectSchema } from './PurchaseRequestIngressReceiptOrderByRelationAggregateInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  reference: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  outcome: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  channel: SortOrderSchema.optional(),
  externalRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  requestKey: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  fingerprintHash: SortOrderSchema.optional(),
  customerName: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  normalizedPhone: SortOrderSchema.optional(),
  contactPreference: SortOrderSchema.optional(),
  contactHandle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  city: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  district: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ward: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customerNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  processingNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completionReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  followUpAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  processingStartedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  items: z.lazy(() => PurchaseRequestItemOrderByRelationAggregateInputObjectSchema).optional(),
  activities: z.lazy(() => PurchaseRequestActivityOrderByRelationAggregateInputObjectSchema).optional(),
  ingressReceipts: z.lazy(() => PurchaseRequestIngressReceiptOrderByRelationAggregateInputObjectSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  assignedUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PurchaseRequestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestOrderByWithRelationInput>;
export const PurchaseRequestOrderByWithRelationInputObjectZodSchema = makeSchema();
