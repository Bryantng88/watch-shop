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
  metadataJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const BusinessFeedbackCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackCountOrderByAggregateInput>;
export const BusinessFeedbackCountOrderByAggregateInputObjectZodSchema = makeSchema();
