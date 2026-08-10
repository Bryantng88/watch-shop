import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema'

const nestedenumpurchaserequestitemdecisionfilterSchema = z.object({
  equals: PurchaseRequestItemDecisionSchema.optional(),
  in: PurchaseRequestItemDecisionSchema.array().optional(),
  notIn: PurchaseRequestItemDecisionSchema.array().optional(),
  not: z.union([PurchaseRequestItemDecisionSchema, z.lazy(() => NestedEnumPurchaseRequestItemDecisionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPurchaseRequestItemDecisionFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestItemDecisionFilter> = nestedenumpurchaserequestitemdecisionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestItemDecisionFilter>;
export const NestedEnumPurchaseRequestItemDecisionFilterObjectZodSchema = nestedenumpurchaserequestitemdecisionfilterSchema;
