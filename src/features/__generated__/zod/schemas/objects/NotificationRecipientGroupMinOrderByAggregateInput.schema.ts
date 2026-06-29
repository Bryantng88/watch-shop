import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  zaloGroupId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationRecipientGroupMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupMinOrderByAggregateInput>;
export const NotificationRecipientGroupMinOrderByAggregateInputObjectZodSchema = makeSchema();
