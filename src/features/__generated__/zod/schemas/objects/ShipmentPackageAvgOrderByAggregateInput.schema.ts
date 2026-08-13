import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  weightGram: SortOrderSchema.optional(),
  lengthCm: SortOrderSchema.optional(),
  widthCm: SortOrderSchema.optional(),
  heightCm: SortOrderSchema.optional(),
  itemCount: SortOrderSchema.optional(),
  declaredValue: SortOrderSchema.optional()
}).strict();
export const ShipmentPackageAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageAvgOrderByAggregateInput>;
export const ShipmentPackageAvgOrderByAggregateInputObjectZodSchema = makeSchema();
