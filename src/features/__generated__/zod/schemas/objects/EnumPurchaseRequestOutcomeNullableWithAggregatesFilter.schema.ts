import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema as NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema } from './NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema as NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema } from './NestedEnumPurchaseRequestOutcomeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestOutcomeSchema.optional().nullable(),
  in: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  notIn: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  not: z.union([PurchaseRequestOutcomeSchema, z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema).optional()
}).strict();
export const EnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestOutcomeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestOutcomeNullableWithAggregatesFilter>;
export const EnumPurchaseRequestOutcomeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
