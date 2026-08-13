import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateNestedOneWithoutPackagesInputObjectSchema as ShipmentCreateNestedOneWithoutPackagesInputObjectSchema } from './ShipmentCreateNestedOneWithoutPackagesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  weightGram: z.number().int(),
  lengthCm: z.number().int().optional().nullable(),
  widthCm: z.number().int().optional().nullable(),
  heightCm: z.number().int().optional().nullable(),
  itemCount: z.number().int().optional(),
  declaredValue: z.number().optional().nullable(),
  contentDescription: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shipment: z.lazy(() => ShipmentCreateNestedOneWithoutPackagesInputObjectSchema)
}).strict();
export const ShipmentPackageCreateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageCreateInput>;
export const ShipmentPackageCreateInputObjectZodSchema = makeSchema();
