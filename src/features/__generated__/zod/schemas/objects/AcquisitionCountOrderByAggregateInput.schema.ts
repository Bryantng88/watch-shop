import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  acquiredAt: SortOrderSchema.optional(),
  cost: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  payoutStatus: SortOrderSchema.optional(),
  accquisitionStt: SortOrderSchema.optional(),
  refNo: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  condition: SortOrderSchema.optional(),
  warrantyUntil: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const AcquisitionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCountOrderByAggregateInput>;
export const AcquisitionCountOrderByAggregateInputObjectZodSchema = makeSchema();
