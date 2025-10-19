import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  defaultPrice: SortOrderSchema.optional(),
  durationMin: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  maintenanceRecordId: SortOrderSchema.optional()
}).strict();
export const ServiceCatalogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogMinOrderByAggregateInput>;
export const ServiceCatalogMinOrderByAggregateInputObjectZodSchema = makeSchema();
