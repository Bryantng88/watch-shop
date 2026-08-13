import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema'

const nestedenumcarriersettlementstatusfilterSchema = z.object({
  equals: CarrierSettlementStatusSchema.optional(),
  in: CarrierSettlementStatusSchema.array().optional(),
  notIn: CarrierSettlementStatusSchema.array().optional(),
  not: z.union([CarrierSettlementStatusSchema, z.lazy(() => NestedEnumCarrierSettlementStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCarrierSettlementStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumCarrierSettlementStatusFilter> = nestedenumcarriersettlementstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCarrierSettlementStatusFilter>;
export const NestedEnumCarrierSettlementStatusFilterObjectZodSchema = nestedenumcarriersettlementstatusfilterSchema;
