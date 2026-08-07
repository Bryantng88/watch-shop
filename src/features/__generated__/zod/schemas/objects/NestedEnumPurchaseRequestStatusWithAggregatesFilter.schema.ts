import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestStatusFilterObjectSchema as NestedEnumPurchaseRequestStatusFilterObjectSchema } from './NestedEnumPurchaseRequestStatusFilter.schema'

const nestedenumpurchaserequeststatuswithaggregatesfilterSchema = z.object({
  equals: PurchaseRequestStatusSchema.optional(),
  in: PurchaseRequestStatusSchema.array().optional(),
  notIn: PurchaseRequestStatusSchema.array().optional(),
  not: z.union([PurchaseRequestStatusSchema, z.lazy(() => NestedEnumPurchaseRequestStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumPurchaseRequestStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestStatusWithAggregatesFilter> = nestedenumpurchaserequeststatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestStatusWithAggregatesFilter>;
export const NestedEnumPurchaseRequestStatusWithAggregatesFilterObjectZodSchema = nestedenumpurchaserequeststatuswithaggregatesfilterSchema;
