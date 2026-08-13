import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { OrderCreateNestedOneWithoutShipmentsInputObjectSchema as OrderCreateNestedOneWithoutShipmentsInputObjectSchema } from './OrderCreateNestedOneWithoutShipmentsInput.schema';
import { TaskCreateNestedManyWithoutShipmentInputObjectSchema as TaskCreateNestedManyWithoutShipmentInputObjectSchema } from './TaskCreateNestedManyWithoutShipmentInput.schema';
import { WorkCaseCreateNestedManyWithoutShipmentInputObjectSchema as WorkCaseCreateNestedManyWithoutShipmentInputObjectSchema } from './WorkCaseCreateNestedManyWithoutShipmentInput.schema';
import { ShipmentPackageCreateNestedManyWithoutShipmentInputObjectSchema as ShipmentPackageCreateNestedManyWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateNestedManyWithoutShipmentInput.schema';
import { CarrierRequestCreateNestedManyWithoutShipmentInputObjectSchema as CarrierRequestCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierRequestCreateNestedManyWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateNestedManyWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateNestedManyWithoutShipmentInput.schema';
import { CarrierChargeCreateNestedManyWithoutShipmentInputObjectSchema as CarrierChargeCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierChargeCreateNestedManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipPhone: z.string().optional().nullable(),
  shipAddress: z.string().optional().nullable(),
  shipCity: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  shipWard: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  shippingAmount: z.number().optional(),
  currency: z.string().max(10).optional(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: ShipmentStatusSchema.optional(),
  shippingFeePayer: ShippingFeePayerSchema.optional().nullable(),
  carrierCode: z.string().optional().nullable(),
  carrierEnvironment: z.string().optional().nullable(),
  externalOrderCode: z.string().optional().nullable(),
  carrierStatus: z.string().optional().nullable(),
  carrierStatusText: z.string().optional().nullable(),
  carrierSyncedAt: z.coerce.date().optional().nullable(),
  carrierCreatedAt: z.coerce.date().optional().nullable(),
  estimatedDeliveryAt: z.coerce.date().optional().nullable(),
  refNo: z.string().optional().nullable(),
  orderRefNo: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  order: z.lazy(() => OrderCreateNestedOneWithoutShipmentsInputObjectSchema),
  task: z.lazy(() => TaskCreateNestedManyWithoutShipmentInputObjectSchema),
  workCase: z.lazy(() => WorkCaseCreateNestedManyWithoutShipmentInputObjectSchema),
  packages: z.lazy(() => ShipmentPackageCreateNestedManyWithoutShipmentInputObjectSchema),
  carrierRequests: z.lazy(() => CarrierRequestCreateNestedManyWithoutShipmentInputObjectSchema),
  carrierStatusHistory: z.lazy(() => CarrierStatusHistoryCreateNestedManyWithoutShipmentInputObjectSchema),
  carrierCharges: z.lazy(() => CarrierChargeCreateNestedManyWithoutShipmentInputObjectSchema)
}).strict();
export const ShipmentCreateInputObjectSchema: z.ZodType<Prisma.ShipmentCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateInput>;
export const ShipmentCreateInputObjectZodSchema = makeSchema();
