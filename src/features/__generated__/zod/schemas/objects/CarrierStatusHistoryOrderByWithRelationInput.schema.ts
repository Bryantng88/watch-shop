import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  externalStatus: SortOrderSchema.optional(),
  normalizedStatus: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  occurredAt: SortOrderSchema.optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CarrierStatusHistoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryOrderByWithRelationInput>;
export const CarrierStatusHistoryOrderByWithRelationInputObjectZodSchema = makeSchema();
