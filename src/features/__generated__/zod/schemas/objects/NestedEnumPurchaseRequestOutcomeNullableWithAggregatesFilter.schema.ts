import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema as NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema } from './NestedEnumPurchaseRequestOutcomeNullableFilter.schema'

const nestedenumpurchaserequestoutcomenullablewithaggregatesfilterSchema = z.object({
  equals: PurchaseRequestOutcomeSchema.optional().nullable(),
  in: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  notIn: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  not: z.union([PurchaseRequestOutcomeSchema, z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilter> = nestedenumpurchaserequestoutcomenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilter>;
export const NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectZodSchema = nestedenumpurchaserequestoutcomenullablewithaggregatesfilterSchema;
