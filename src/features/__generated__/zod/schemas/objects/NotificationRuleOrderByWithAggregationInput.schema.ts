import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NotificationRuleCountOrderByAggregateInputObjectSchema as NotificationRuleCountOrderByAggregateInputObjectSchema } from './NotificationRuleCountOrderByAggregateInput.schema';
import { NotificationRuleMaxOrderByAggregateInputObjectSchema as NotificationRuleMaxOrderByAggregateInputObjectSchema } from './NotificationRuleMaxOrderByAggregateInput.schema';
import { NotificationRuleMinOrderByAggregateInputObjectSchema as NotificationRuleMinOrderByAggregateInputObjectSchema } from './NotificationRuleMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  conditionJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  titleTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  messageTemplate: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => NotificationRuleCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NotificationRuleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NotificationRuleMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NotificationRuleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NotificationRuleOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleOrderByWithAggregationInput>;
export const NotificationRuleOrderByWithAggregationInputObjectZodSchema = makeSchema();
