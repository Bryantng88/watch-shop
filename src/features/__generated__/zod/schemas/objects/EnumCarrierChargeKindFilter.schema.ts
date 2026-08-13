import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { NestedEnumCarrierChargeKindFilterObjectSchema as NestedEnumCarrierChargeKindFilterObjectSchema } from './NestedEnumCarrierChargeKindFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierChargeKindSchema.optional(),
  in: CarrierChargeKindSchema.array().optional(),
  notIn: CarrierChargeKindSchema.array().optional(),
  not: z.union([CarrierChargeKindSchema, z.lazy(() => NestedEnumCarrierChargeKindFilterObjectSchema)]).optional()
}).strict();
export const EnumCarrierChargeKindFilterObjectSchema: z.ZodType<Prisma.EnumCarrierChargeKindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierChargeKindFilter>;
export const EnumCarrierChargeKindFilterObjectZodSchema = makeSchema();
