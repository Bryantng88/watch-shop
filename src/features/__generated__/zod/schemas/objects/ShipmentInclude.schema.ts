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
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseFindManySchema)]).optional(),
  packages: z.union([z.boolean(), z.lazy(() => ShipmentPackageFindManySchema)]).optional(),
  carrierRequests: z.union([z.boolean(), z.lazy(() => CarrierRequestFindManySchema)]).optional(),
  carrierStatusHistory: z.union([z.boolean(), z.lazy(() => CarrierStatusHistoryFindManySchema)]).optional(),
  carrierCharges: z.union([z.boolean(), z.lazy(() => CarrierChargeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ShipmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ShipmentIncludeObjectSchema: z.ZodType<Prisma.ShipmentInclude> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentInclude>;
export const ShipmentIncludeObjectZodSchema = makeSchema();
