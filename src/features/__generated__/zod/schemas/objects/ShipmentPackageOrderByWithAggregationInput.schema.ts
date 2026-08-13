import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ShipmentPackageCountOrderByAggregateInputObjectSchema as ShipmentPackageCountOrderByAggregateInputObjectSchema } from './ShipmentPackageCountOrderByAggregateInput.schema';
import { ShipmentPackageAvgOrderByAggregateInputObjectSchema as ShipmentPackageAvgOrderByAggregateInputObjectSchema } from './ShipmentPackageAvgOrderByAggregateInput.schema';
import { ShipmentPackageMaxOrderByAggregateInputObjectSchema as ShipmentPackageMaxOrderByAggregateInputObjectSchema } from './ShipmentPackageMaxOrderByAggregateInput.schema';
import { ShipmentPackageMinOrderByAggregateInputObjectSchema as ShipmentPackageMinOrderByAggregateInputObjectSchema } from './ShipmentPackageMinOrderByAggregateInput.schema';
import { ShipmentPackageSumOrderByAggregateInputObjectSchema as ShipmentPackageSumOrderByAggregateInputObjectSchema } from './ShipmentPackageSumOrderByAggregateInput.schema'

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
  _count: z.lazy(() => ShipmentPackageCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ShipmentPackageAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ShipmentPackageMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ShipmentPackageMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ShipmentPackageSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ShipmentPackageOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ShipmentPackageOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageOrderByWithAggregationInput>;
export const ShipmentPackageOrderByWithAggregationInputObjectZodSchema = makeSchema();
