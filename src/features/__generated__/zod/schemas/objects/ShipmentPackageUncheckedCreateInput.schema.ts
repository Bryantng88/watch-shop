import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  shipmentId: z.string(),
  weightGram: z.number().int(),
  lengthCm: z.number().int().optional().nullable(),
  widthCm: z.number().int().optional().nullable(),
  heightCm: z.number().int().optional().nullable(),
  itemCount: z.number().int().optional(),
  declaredValue: z.number().optional().nullable(),
  contentDescription: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ShipmentPackageUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageUncheckedCreateInput>;
export const ShipmentPackageUncheckedCreateInputObjectZodSchema = makeSchema();
