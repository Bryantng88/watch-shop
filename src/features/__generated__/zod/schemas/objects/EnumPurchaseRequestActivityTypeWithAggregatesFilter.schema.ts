import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { NestedEnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema as NestedEnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema } from './NestedEnumPurchaseRequestActivityTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPurchaseRequestActivityTypeFilterObjectSchema as NestedEnumPurchaseRequestActivityTypeFilterObjectSchema } from './NestedEnumPurchaseRequestActivityTypeFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestActivityTypeSchema.optional(),
  in: PurchaseRequestActivityTypeSchema.array().optional(),
  notIn: PurchaseRequestActivityTypeSchema.array().optional(),
  not: z.union([PurchaseRequestActivityTypeSchema, z.lazy(() => NestedEnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestActivityTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestActivityTypeFilterObjectSchema).optional()
}).strict();
export const EnumPurchaseRequestActivityTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestActivityTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestActivityTypeWithAggregatesFilter>;
export const EnumPurchaseRequestActivityTypeWithAggregatesFilterObjectZodSchema = makeSchema();
