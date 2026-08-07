import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema'

const nestedenumpurchaserequeststatusfilterSchema = z.object({
  equals: PurchaseRequestStatusSchema.optional(),
  in: PurchaseRequestStatusSchema.array().optional(),
  notIn: PurchaseRequestStatusSchema.array().optional(),
  not: z.union([PurchaseRequestStatusSchema, z.lazy(() => NestedEnumPurchaseRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPurchaseRequestStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumPurchaseRequestStatusFilter> = nestedenumpurchaserequeststatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPurchaseRequestStatusFilter>;
export const NestedEnumPurchaseRequestStatusFilterObjectZodSchema = nestedenumpurchaserequeststatusfilterSchema;
