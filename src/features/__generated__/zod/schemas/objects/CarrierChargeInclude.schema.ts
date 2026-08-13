import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema'

const makeSchema = () => z.object({
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional()
}).strict();
export const CarrierChargeIncludeObjectSchema: z.ZodType<Prisma.CarrierChargeInclude> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeInclude>;
export const CarrierChargeIncludeObjectZodSchema = makeSchema();
