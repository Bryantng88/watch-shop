import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema'

const nestedenumpurchaserequestoutcomenullablefilterSchema = z.object({
  equals: PurchaseRequestOutcomeSchema.optional().nullable(),
  in: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  notIn: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  not: z.union([PurchaseRequestOutcomeSchema, z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestOutcomeNullableFilter> = nestedenumpurchaserequestoutcomenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestOutcomeNullableFilter>;
export const NestedEnumPurchaseRequestOutcomeNullableFilterObjectZodSchema = nestedenumpurchaserequestoutcomenullablefilterSchema;
