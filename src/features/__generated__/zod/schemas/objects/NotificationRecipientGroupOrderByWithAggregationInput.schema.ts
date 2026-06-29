import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NotificationRecipientGroupCountOrderByAggregateInputObjectSchema as NotificationRecipientGroupCountOrderByAggregateInputObjectSchema } from './NotificationRecipientGroupCountOrderByAggregateInput.schema';
import { NotificationRecipientGroupMaxOrderByAggregateInputObjectSchema as NotificationRecipientGroupMaxOrderByAggregateInputObjectSchema } from './NotificationRecipientGroupMaxOrderByAggregateInput.schema';
import { NotificationRecipientGroupMinOrderByAggregateInputObjectSchema as NotificationRecipientGroupMinOrderByAggregateInputObjectSchema } from './NotificationRecipientGroupMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  roleNames: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userIds: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  zaloGroupId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => NotificationRecipientGroupCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NotificationRecipientGroupMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NotificationRecipientGroupMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NotificationRecipientGroupOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupOrderByWithAggregationInput>;
export const NotificationRecipientGroupOrderByWithAggregationInputObjectZodSchema = makeSchema();
