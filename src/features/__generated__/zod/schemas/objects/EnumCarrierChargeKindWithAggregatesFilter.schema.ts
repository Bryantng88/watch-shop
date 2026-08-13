import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { NestedEnumCarrierChargeKindWithAggregatesFilterObjectSchema as NestedEnumCarrierChargeKindWithAggregatesFilterObjectSchema } from './NestedEnumCarrierChargeKindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCarrierChargeKindFilterObjectSchema as NestedEnumCarrierChargeKindFilterObjectSchema } from './NestedEnumCarrierChargeKindFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierChargeKindSchema.optional(),
  in: CarrierChargeKindSchema.array().optional(),
  notIn: CarrierChargeKindSchema.array().optional(),
  not: z.union([CarrierChargeKindSchema, z.lazy(() => NestedEnumCarrierChargeKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCarrierChargeKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCarrierChargeKindFilterObjectSchema).optional()
}).strict();
export const EnumCarrierChargeKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCarrierChargeKindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierChargeKindWithAggregatesFilter>;
export const EnumCarrierChargeKindWithAggregatesFilterObjectZodSchema = makeSchema();
