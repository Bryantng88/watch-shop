import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  shipmentId: z.boolean().optional(),
  weightGram: z.boolean().optional(),
  lengthCm: z.boolean().optional(),
  widthCm: z.boolean().optional(),
  heightCm: z.boolean().optional(),
  itemCount: z.boolean().optional(),
  declaredValue: z.boolean().optional(),
  contentDescription: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional()
}).strict();
export const ShipmentPackageSelectObjectSchema: z.ZodType<Prisma.ShipmentPackageSelect> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageSelect>;
export const ShipmentPackageSelectObjectZodSchema = makeSchema();
