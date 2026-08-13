import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  weightGram: SortOrderSchema.optional(),
  lengthCm: SortOrderSchema.optional(),
  widthCm: SortOrderSchema.optional(),
  heightCm: SortOrderSchema.optional(),
  itemCount: SortOrderSchema.optional(),
  declaredValue: SortOrderSchema.optional(),
  contentDescription: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ShipmentPackageMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageMinOrderByAggregateInput>;
export const ShipmentPackageMinOrderByAggregateInputObjectZodSchema = makeSchema();
