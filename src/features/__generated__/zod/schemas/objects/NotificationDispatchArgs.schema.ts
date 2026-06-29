import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './NotificationDispatchSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => NotificationDispatchSelectObjectSchema).optional()
}).strict();
export const NotificationDispatchArgsObjectSchema = makeSchema();
export const NotificationDispatchArgsObjectZodSchema = makeSchema();
