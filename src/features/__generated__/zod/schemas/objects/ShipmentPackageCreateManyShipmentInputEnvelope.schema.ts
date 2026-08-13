import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageCreateManyShipmentInputObjectSchema as ShipmentPackageCreateManyShipmentInputObjectSchema } from './ShipmentPackageCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ShipmentPackageCreateManyShipmentInputObjectSchema), z.lazy(() => ShipmentPackageCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.ShipmentPackageCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageCreateManyShipmentInputEnvelope>;
export const ShipmentPackageCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
