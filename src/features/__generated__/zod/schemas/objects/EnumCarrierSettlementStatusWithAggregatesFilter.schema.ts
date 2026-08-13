import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { NestedEnumCarrierSettlementStatusWithAggregatesFilterObjectSchema as NestedEnumCarrierSettlementStatusWithAggregatesFilterObjectSchema } from './NestedEnumCarrierSettlementStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCarrierSettlementStatusFilterObjectSchema as NestedEnumCarrierSettlementStatusFilterObjectSchema } from './NestedEnumCarrierSettlementStatusFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierSettlementStatusSchema.optional(),
  in: CarrierSettlementStatusSchema.array().optional(),
  notIn: CarrierSettlementStatusSchema.array().optional(),
  not: z.union([CarrierSettlementStatusSchema, z.lazy(() => NestedEnumCarrierSettlementStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCarrierSettlementStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCarrierSettlementStatusFilterObjectSchema).optional()
}).strict();
export const EnumCarrierSettlementStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCarrierSettlementStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierSettlementStatusWithAggregatesFilter>;
export const EnumCarrierSettlementStatusWithAggregatesFilterObjectZodSchema = makeSchema();
