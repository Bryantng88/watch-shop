import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressDispositionSchema } from '../enums/PurchaseRequestIngressDisposition.schema';
import { NestedEnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema as NestedEnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema } from './NestedEnumPurchaseRequestIngressDispositionWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema as NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema } from './NestedEnumPurchaseRequestIngressDispositionFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestIngressDispositionSchema.optional(),
  in: PurchaseRequestIngressDispositionSchema.array().optional(),
  notIn: PurchaseRequestIngressDispositionSchema.array().optional(),
  not: z.union([PurchaseRequestIngressDispositionSchema, z.lazy(() => NestedEnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestIngressDispositionFilterObjectSchema).optional()
}).strict();
export const EnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestIngressDispositionWithAggregatesFilter>;
export const EnumPurchaseRequestIngressDispositionWithAggregatesFilterObjectZodSchema = makeSchema();
