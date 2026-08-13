import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  operation: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  requestJson: SortOrderSchema.optional(),
  responseJson: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  httpStatus: SortOrderSchema.optional(),
  externalOrderCode: SortOrderSchema.optional(),
  errorCode: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional(),
  attemptCount: SortOrderSchema.optional(),
  requestedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional()
}).strict();
export const CarrierRequestCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestCountOrderByAggregateInput>;
export const CarrierRequestCountOrderByAggregateInputObjectZodSchema = makeSchema();
