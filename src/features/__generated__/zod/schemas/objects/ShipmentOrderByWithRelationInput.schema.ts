import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { WorkCaseOrderByRelationAggregateInputObjectSchema as WorkCaseOrderByRelationAggregateInputObjectSchema } from './WorkCaseOrderByRelationAggregateInput.schema';
import { ShipmentPackageOrderByRelationAggregateInputObjectSchema as ShipmentPackageOrderByRelationAggregateInputObjectSchema } from './ShipmentPackageOrderByRelationAggregateInput.schema';
import { CarrierRequestOrderByRelationAggregateInputObjectSchema as CarrierRequestOrderByRelationAggregateInputObjectSchema } from './CarrierRequestOrderByRelationAggregateInput.schema';
import { CarrierStatusHistoryOrderByRelationAggregateInputObjectSchema as CarrierStatusHistoryOrderByRelationAggregateInputObjectSchema } from './CarrierStatusHistoryOrderByRelationAggregateInput.schema';
import { CarrierChargeOrderByRelationAggregateInputObjectSchema as CarrierChargeOrderByRelationAggregateInputObjectSchema } from './CarrierChargeOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  shipPhone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipAddress: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipCity: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipDistrict: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shipWard: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrier: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trackingCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shippingAmount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  shippedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deliveredAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  shippingFeePayer: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierEnvironment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  externalOrderCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierStatusText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierSyncedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  carrierCreatedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  estimatedDeliveryAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderRefNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customerName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  task: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseOrderByRelationAggregateInputObjectSchema).optional(),
  packages: z.lazy(() => ShipmentPackageOrderByRelationAggregateInputObjectSchema).optional(),
  carrierRequests: z.lazy(() => CarrierRequestOrderByRelationAggregateInputObjectSchema).optional(),
  carrierStatusHistory: z.lazy(() => CarrierStatusHistoryOrderByRelationAggregateInputObjectSchema).optional(),
  carrierCharges: z.lazy(() => CarrierChargeOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ShipmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ShipmentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentOrderByWithRelationInput>;
export const ShipmentOrderByWithRelationInputObjectZodSchema = makeSchema();
