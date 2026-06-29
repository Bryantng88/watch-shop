import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  roleNames: SortOrderSchema.optional(),
  userIds: SortOrderSchema.optional(),
  zaloGroupId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationRecipientGroupCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCountOrderByAggregateInput>;
export const NotificationRecipientGroupCountOrderByAggregateInputObjectZodSchema = makeSchema();
