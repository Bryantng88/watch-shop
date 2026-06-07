import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  message: z.boolean().optional(),
  priority: z.boolean().optional(),
  isRead: z.boolean().optional(),
  userId: z.boolean().optional(),
  taskId: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional()
}).strict();
export const NotificationSelectObjectSchema: z.ZodType<Prisma.NotificationSelect> = makeSchema() as unknown as z.ZodType<Prisma.NotificationSelect>;
export const NotificationSelectObjectZodSchema = makeSchema();
