import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema as NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema } from './NestedEnumPurchaseRequestContactPreferenceFilter.schema'

const nestedenumpurchaserequestcontactpreferencewithaggregatesfilterSchema = z.object({
  equals: PurchaseRequestContactPreferenceSchema.optional(),
  in: PurchaseRequestContactPreferenceSchema.array().optional(),
  notIn: PurchaseRequestContactPreferenceSchema.array().optional(),
  not: z.union([PurchaseRequestContactPreferenceSchema, z.lazy(() => NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema).optional()
}).strict();
export const NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilter> = nestedenumpurchaserequestcontactpreferencewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilter>;
export const NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectZodSchema = nestedenumpurchaserequestcontactpreferencewithaggregatesfilterSchema;
