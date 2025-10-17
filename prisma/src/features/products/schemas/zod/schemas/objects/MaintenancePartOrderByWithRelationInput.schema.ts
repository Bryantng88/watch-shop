import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordOrderByWithRelationInputObjectSchema as MaintenanceRecordOrderByWithRelationInputObjectSchema } from './MaintenanceRecordOrderByWithRelationInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  recordId: SortOrderSchema.optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  unitCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  record: z.lazy(() => MaintenanceRecordOrderByWithRelationInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const MaintenancePartOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MaintenancePartOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartOrderByWithRelationInput>;
export const MaintenancePartOrderByWithRelationInputObjectZodSchema = makeSchema();
