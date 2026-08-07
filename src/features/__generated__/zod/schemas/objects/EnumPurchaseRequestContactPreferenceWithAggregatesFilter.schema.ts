import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema as NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema } from './NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema as NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema } from './NestedEnumPurchaseRequestContactPreferenceFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestContactPreferenceSchema.optional(),
  in: PurchaseRequestContactPreferenceSchema.array().optional(),
  notIn: PurchaseRequestContactPreferenceSchema.array().optional(),
  not: z.union([PurchaseRequestContactPreferenceSchema, z.lazy(() => NestedEnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema).optional()
}).strict();
export const EnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceWithAggregatesFilter>;
export const EnumPurchaseRequestContactPreferenceWithAggregatesFilterObjectZodSchema = makeSchema();
