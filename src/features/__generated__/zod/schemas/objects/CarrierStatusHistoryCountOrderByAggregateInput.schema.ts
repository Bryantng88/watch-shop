import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  externalStatus: SortOrderSchema.optional(),
  normalizedStatus: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  occurredAt: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const CarrierStatusHistoryCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCountOrderByAggregateInput>;
export const CarrierStatusHistoryCountOrderByAggregateInputObjectZodSchema = makeSchema();
