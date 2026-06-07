import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './TaskOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  taskId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updatedAt: SortOrderSchema.optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const NotificationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NotificationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationOrderByWithRelationInput>;
export const NotificationOrderByWithRelationInputObjectZodSchema = makeSchema();
