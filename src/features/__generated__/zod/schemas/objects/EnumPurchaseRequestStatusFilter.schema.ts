import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestStatusSchema } from '../enums/PurchaseRequestStatus.schema';
import { NestedEnumPurchaseRequestStatusFilterObjectSchema as NestedEnumPurchaseRequestStatusFilterObjectSchema } from './NestedEnumPurchaseRequestStatusFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestStatusSchema.optional(),
  in: PurchaseRequestStatusSchema.array().optional(),
  notIn: PurchaseRequestStatusSchema.array().optional(),
  not: z.union([PurchaseRequestStatusSchema, z.lazy(() => NestedEnumPurchaseRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumPurchaseRequestStatusFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestStatusFilter>;
export const EnumPurchaseRequestStatusFilterObjectZodSchema = makeSchema();
