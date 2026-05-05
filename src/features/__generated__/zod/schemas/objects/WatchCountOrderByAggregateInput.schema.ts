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
  siteChannel: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  conditionGrade: SortOrderSchema.optional(),
  movementType: SortOrderSchema.optional(),
  movementCalibre: SortOrderSchema.optional(),
  serialNumber: SortOrderSchema.optional(),
  yearText: SortOrderSchema.optional(),
  style: SortOrderSchema.optional(),
  hasBox: SortOrderSchema.optional(),
  hasPapers: SortOrderSchema.optional(),
  specStatus: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCountOrderByAggregateInput>;
export const WatchCountOrderByAggregateInputObjectZodSchema = makeSchema();
