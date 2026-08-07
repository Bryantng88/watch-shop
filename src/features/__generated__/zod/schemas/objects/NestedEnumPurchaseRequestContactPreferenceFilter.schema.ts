import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestContactPreferenceSchema } from '../enums/PurchaseRequestContactPreference.schema'

const nestedenumpurchaserequestcontactpreferencefilterSchema = z.object({
  equals: PurchaseRequestContactPreferenceSchema.optional(),
  in: PurchaseRequestContactPreferenceSchema.array().optional(),
  notIn: PurchaseRequestContactPreferenceSchema.array().optional(),
  not: z.union([PurchaseRequestContactPreferenceSchema, z.lazy(() => NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPurchaseRequestContactPreferenceFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestContactPreferenceFilter> = nestedenumpurchaserequestcontactpreferencefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestContactPreferenceFilter>;
export const NestedEnumPurchaseRequestContactPreferenceFilterObjectZodSchema = nestedenumpurchaserequestcontactpreferencefilterSchema;
