import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema'

const nestedenumcarrierchargekindfilterSchema = z.object({
  equals: CarrierChargeKindSchema.optional(),
  in: CarrierChargeKindSchema.array().optional(),
  notIn: CarrierChargeKindSchema.array().optional(),
  not: z.union([CarrierChargeKindSchema, z.lazy(() => NestedEnumCarrierChargeKindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCarrierChargeKindFilterObjectSchema: z.ZodType<Prisma.NestedEnumCarrierChargeKindFilter> = nestedenumcarrierchargekindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCarrierChargeKindFilter>;
export const NestedEnumCarrierChargeKindFilterObjectZodSchema = nestedenumcarrierchargekindfilterSchema;
