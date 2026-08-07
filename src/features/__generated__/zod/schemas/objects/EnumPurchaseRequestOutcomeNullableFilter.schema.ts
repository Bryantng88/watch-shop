import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestOutcomeSchema } from '../enums/PurchaseRequestOutcome.schema';
import { NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema as NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema } from './NestedEnumPurchaseRequestOutcomeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestOutcomeSchema.optional().nullable(),
  in: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  notIn: PurchaseRequestOutcomeSchema.array().optional().nullable(),
  not: z.union([PurchaseRequestOutcomeSchema, z.lazy(() => NestedEnumPurchaseRequestOutcomeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumPurchaseRequestOutcomeNullableFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestOutcomeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestOutcomeNullableFilter>;
export const EnumPurchaseRequestOutcomeNullableFilterObjectZodSchema = makeSchema();
