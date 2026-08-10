import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema'

const nestedenumpurchaserequestactivitytypefilterSchema = z.object({
  equals: PurchaseRequestActivityTypeSchema.optional(),
  in: PurchaseRequestActivityTypeSchema.array().optional(),
  notIn: PurchaseRequestActivityTypeSchema.array().optional(),
  not: z.union([PurchaseRequestActivityTypeSchema, z.lazy(() => NestedEnumPurchaseRequestActivityTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPurchaseRequestActivityTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestActivityTypeFilter> = nestedenumpurchaserequestactivitytypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestActivityTypeFilter>;
export const NestedEnumPurchaseRequestActivityTypeFilterObjectZodSchema = nestedenumpurchaserequestactivitytypefilterSchema;
