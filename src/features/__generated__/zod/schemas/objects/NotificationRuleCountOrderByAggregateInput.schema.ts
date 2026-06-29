import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  titleTemplate: SortOrderSchema.optional(),
  messageTemplate: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationRuleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRuleCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleCountOrderByAggregateInput>;
export const NotificationRuleCountOrderByAggregateInputObjectZodSchema = makeSchema();
