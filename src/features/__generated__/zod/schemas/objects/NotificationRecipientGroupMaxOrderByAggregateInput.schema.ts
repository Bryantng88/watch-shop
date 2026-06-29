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
export const NotificationRecipientGroupMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupMaxOrderByAggregateInput>;
export const NotificationRecipientGroupMaxOrderByAggregateInputObjectZodSchema = makeSchema();
