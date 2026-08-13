import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  estimatedAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  chargedAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  settlementStatus: SortOrderSchema.optional(),
  settlementRef: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  settledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CarrierChargeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CarrierChargeOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeOrderByWithRelationInput>;
export const CarrierChargeOrderByWithRelationInputObjectZodSchema = makeSchema();
