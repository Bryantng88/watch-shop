import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { NestedEnumPurchaseRequestActivityTypeFilterObjectSchema as NestedEnumPurchaseRequestActivityTypeFilterObjectSchema } from './NestedEnumPurchaseRequestActivityTypeFilter.schema'

const makeSchema = () => z.object({
  equals: PurchaseRequestActivityTypeSchema.optional(),
  in: PurchaseRequestActivityTypeSchema.array().optional(),
  notIn: PurchaseRequestActivityTypeSchema.array().optional(),
  not: z.union([PurchaseRequestActivityTypeSchema, z.lazy(() => NestedEnumPurchaseRequestActivityTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumPurchaseRequestActivityTypeFilterObjectSchema: z.ZodType<Prisma.EnumPurchaseRequestActivityTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPurchaseRequestActivityTypeFilter>;
export const EnumPurchaseRequestActivityTypeFilterObjectZodSchema = makeSchema();
