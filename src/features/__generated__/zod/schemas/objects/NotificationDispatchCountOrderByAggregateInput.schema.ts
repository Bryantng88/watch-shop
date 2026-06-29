import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  businessEventLogId: SortOrderSchema.optional(),
  ruleId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationDispatchCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationDispatchCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchCountOrderByAggregateInput>;
export const NotificationDispatchCountOrderByAggregateInputObjectZodSchema = makeSchema();
