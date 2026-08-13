import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  weightGram: z.literal(true).optional(),
  lengthCm: z.literal(true).optional(),
  widthCm: z.literal(true).optional(),
  heightCm: z.literal(true).optional(),
  itemCount: z.literal(true).optional(),
  declaredValue: z.literal(true).optional()
}).strict();
export const ShipmentPackageSumAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageSumAggregateInputType>;
export const ShipmentPackageSumAggregateInputObjectZodSchema = makeSchema();
