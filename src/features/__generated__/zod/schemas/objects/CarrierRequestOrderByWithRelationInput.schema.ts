import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  operation: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  requestJson: SortOrderSchema.optional(),
  responseJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  httpStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  externalOrderCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  attemptCount: SortOrderSchema.optional(),
  requestedAt: SortOrderSchema.optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CarrierRequestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CarrierRequestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestOrderByWithRelationInput>;
export const CarrierRequestOrderByWithRelationInputObjectZodSchema = makeSchema();
