import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema';
import { NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema as NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema } from './NestedEnumPurchaseRequestContactPreferenceFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestContactPreferenceSchema.optional(),
  in: PurchaseRequestContactPreferenceSchema.array().optional(),
  notIn: PurchaseRequestContactPreferenceSchema.array().optional(),
  not: z.union([PurchaseRequestContactPreferenceSchema, z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema)]).optional()
}).strict();
export const EnumPurchaseRequestContactPreferenceFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestContactPreferenceFilter>;
export const EnumPurchaseRequestContactPreferenceFilterObjectZodSchema = makeSchema();
