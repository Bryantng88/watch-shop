import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestItemDecisionFilterObjectSchema as NestedEnumPurchaseRequestItemDecisionFilterObjectSchema } from './NestedEnumPurchaseRequestItemDecisionFilter.schema'

const nestedenumpurchaserequestitemdecisionwithaggregatesfilterSchema = z.object({
  equals: PurchaseRequestItemDecisionSchema.optional(),
  in: PurchaseRequestItemDecisionSchema.array().optional(),
  notIn: PurchaseRequestItemDecisionSchema.array().optional(),
  not: z.union([PurchaseRequestItemDecisionSchema, z.lazy(() => NestedEnumPurchaseRequestItemDecisionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestItemDecisionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestItemDecisionFilterObjectSchema).optional()
}).strict();
export const NestedEnumPurchaseRequestItemDecisionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestItemDecisionWithAggregatesFilter> = nestedenumpurchaserequestitemdecisionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestItemDecisionWithAggregatesFilter>;
export const NestedEnumPurchaseRequestItemDecisionWithAggregatesFilterObjectZodSchema = nestedenumpurchaserequestitemdecisionwithaggregatesfilterSchema;
