import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { NestedEnumCarrierSettlementStatusFilterObjectSchema as NestedEnumCarrierSettlementStatusFilterObjectSchema } from './NestedEnumCarrierSettlementStatusFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierSettlementStatusSchema.optional(),
  in: CarrierSettlementStatusSchema.array().optional(),
  notIn: CarrierSettlementStatusSchema.array().optional(),
  not: z.union([CarrierSettlementStatusSchema, z.lazy(() => NestedEnumCarrierSettlementStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumCarrierSettlementStatusFilterObjectSchema: z.ZodType<Prisma.EnumCarrierSettlementStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierSettlementStatusFilter>;
export const EnumCarrierSettlementStatusFilterObjectZodSchema = makeSchema();
