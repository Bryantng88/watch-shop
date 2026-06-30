import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  visibility: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const BusinessFeedbackMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackMinOrderByAggregateInput>;
export const BusinessFeedbackMinOrderByAggregateInputObjectZodSchema = makeSchema();
