import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const NotificationCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationCountOrderByAggregateInput>;
export const NotificationCountOrderByAggregateInputObjectZodSchema = makeSchema();
