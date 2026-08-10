import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { NestedEnumPurchaseRequestItemDecisionFilterObjectSchema as NestedEnumPurchaseRequestItemDecisionFilterObjectSchema } from './NestedEnumPurchaseRequestItemDecisionFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestItemDecisionSchema.optional(),
  in: PurchaseRequestItemDecisionSchema.array().optional(),
  notIn: PurchaseRequestItemDecisionSchema.array().optional(),
  not: z.union([PurchaseRequestItemDecisionSchema, z.lazy(() => NestedEnumPurchaseRequestItemDecisionFilterObjectSchema)]).optional()
}).strict();
export const EnumPurchaseRequestItemDecisionFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestItemDecisionFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestItemDecisionFilter>;
export const EnumPurchaseRequestItemDecisionFilterObjectZodSchema = makeSchema();
