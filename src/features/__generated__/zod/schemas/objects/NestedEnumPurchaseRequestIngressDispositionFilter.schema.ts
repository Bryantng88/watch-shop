import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema'

const nestedenumpurchaserequestingressdispositionfilterSchema = z.object({
  equals: PurchaseRequestIngressDispositionSchema.optional(),
  in: PurchaseRequestIngressDispositionSchema.array().optional(),
  notIn: PurchaseRequestIngressDispositionSchema.array().optional(),
  not: z.union([PurchaseRequestIngressDispositionSchema, z.lazy(() => NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestIngressDispositionFilter> = nestedenumpurchaserequestingressdispositionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestIngressDispositionFilter>;
export const NestedEnumPurchaseRequestIngressDispositionFilterObjectZodSchema = nestedenumpurchaserequestingressdispositionfilterSchema;
