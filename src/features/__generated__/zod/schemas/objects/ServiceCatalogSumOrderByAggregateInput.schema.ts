import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  defaultPrice: SortOrderSchema.optional(),
  durationMin: SortOrderSchema.optional(),
  vendorPrice: SortOrderSchema.optional(),
  customerPrice: SortOrderSchema.optional(),
  internalCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const ServiceCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogSumOrderByAggregateInput>;
export const ServiceCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
