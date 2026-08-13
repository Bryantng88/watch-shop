import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { WorkCaseFindManySchema as WorkCaseFindManySchema } from '../findManyWorkCase.schema';
import { ShipmentPackageFindManySchema as ShipmentPackageFindManySchema } from '../findManyShipmentPackage.schema';
import { CarrierRequestFindManySchema as CarrierRequestFindManySchema } from '../findManyCarrierRequest.schema';
import { CarrierStatusHistoryFindManySchema as CarrierStatusHistoryFindManySchema } from '../findManyCarrierStatusHistory.schema';
import { CarrierChargeFindManySchema as CarrierChargeFindManySchema } from '../findManyCarrierCharge.schema';
import { ShipmentCountOutputTypeArgsObjectSchema as ShipmentCountOutputTypeArgsObjectSchema } from './ShipmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  orderId: z.boolean().optional(),
  shipPhone: z.boolean().optional(),
  shipAddress: z.boolean().optional(),
  shipCity: z.boolean().optional(),
  shipDistrict: z.boolean().optional(),
  shipWard: z.boolean().optional(),
  carrier: z.boolean().optional(),
  trackingCode: z.boolean().optional(),
  shippingAmount: z.boolean().optional(),
  currency: z.boolean().optional(),
  shippedAt: z.boolean().optional(),
  deliveredAt: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  status: z.boolean().optional(),
  shippingFeePayer: z.boolean().optional(),
  carrierCode: z.boolean().optional(),
  carrierEnvironment: z.boolean().optional(),
  externalOrderCode: z.boolean().optional(),
  carrierStatus: z.boolean().optional(),
  carrierStatusText: z.boolean().optional(),
  carrierSyncedAt: z.boolean().optional(),
  carrierCreatedAt: z.boolean().optional(),
  estimatedDeliveryAt: z.boolean().optional(),
  refNo: z.boolean().optional(),
  orderRefNo: z.boolean().optional(),
  customerName: z.boolean().optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  packages: z.union([z.boolean(), z.lazy(() => ShipmentPackageFindManySchema)]).optional(),
  carrierRequests: z.union([z.boolean(), z.lazy(() => CarrierRequestFindManySchema)]).optional(),
  carrierStatusHistory: z.union([z.boolean(), z.lazy(() => CarrierStatusHistoryFindManySchema)]).optional(),
  carrierCharges: z.union([z.boolean(), z.lazy(() => CarrierChargeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ShipmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ShipmentSelectObjectSchema: z.ZodType<Prisma.ShipmentSelect> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentSelect>;
export const ShipmentSelectObjectZodSchema = makeSchema();
