import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema as NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema } from './NestedEnumPurchaseRequestIngressDispositionFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestIngressDispositionSchema.optional(),
  in: PurchaseRequestIngressDispositionSchema.array().optional(),
  notIn: PurchaseRequestIngressDispositionSchema.array().optional(),
  not: z.union([PurchaseRequestIngressDispositionSchema, z.lazy(() => NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema)]).optional()
}).strict();
export const EnumPurchaseRequestIngressDispositionFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionFilter>;
export const EnumPurchaseRequestIngressDispositionFilterObjectZodSchema = makeSchema();
