import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  estimatedAmount: SortOrderSchema.optional(),
  chargedAmount: SortOrderSchema.optional(),
  settlementStatus: SortOrderSchema.optional(),
  settlementRef: SortOrderSchema.optional(),
  settledAt: SortOrderSchema.optional(),
  metadataJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const CarrierChargeCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeCountOrderByAggregateInput>;
export const CarrierChargeCountOrderByAggregateInputObjectZodSchema = makeSchema();
