import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  legacyVariantId: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  stockState: SortOrderSchema.optional(),
  saleState: SortOrderSchema.optional(),
  serviceState: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  siteChannel: SortOrderSchema.optional(),
  conditionGrade: SortOrderSchema.optional(),
  movementType: SortOrderSchema.optional(),
  movementCalibre: SortOrderSchema.optional(),
  serialNumber: SortOrderSchema.optional(),
  yearText: SortOrderSchema.optional(),
  hasBox: SortOrderSchema.optional(),
  hasPapers: SortOrderSchema.optional(),
  attachedStrapId: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMaxOrderByAggregateInput>;
export const WatchMaxOrderByAggregateInputObjectZodSchema = makeSchema();
