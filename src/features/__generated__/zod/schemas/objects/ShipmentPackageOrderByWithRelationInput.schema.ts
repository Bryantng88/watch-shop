import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './ShipmentOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  weightGram: SortOrderSchema.optional(),
  lengthCm: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  widthCm: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  heightCm: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  itemCount: SortOrderSchema.optional(),
  declaredValue: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  contentDescription: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  shipment: z.lazy(() => ShipmentOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ShipmentPackageOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ShipmentPackageOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageOrderByWithRelationInput>;
export const ShipmentPackageOrderByWithRelationInputObjectZodSchema = makeSchema();
