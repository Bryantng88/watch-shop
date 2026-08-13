import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  weightGram: z.literal(true).optional(),
  lengthCm: z.literal(true).optional(),
  widthCm: z.literal(true).optional(),
  heightCm: z.literal(true).optional(),
  itemCount: z.literal(true).optional(),
  declaredValue: z.literal(true).optional(),
  contentDescription: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ShipmentPackageMinAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageMinAggregateInputType>;
export const ShipmentPackageMinAggregateInputObjectZodSchema = makeSchema();
