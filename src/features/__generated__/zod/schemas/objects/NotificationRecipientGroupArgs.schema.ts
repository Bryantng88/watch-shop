import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './NotificationRecipientGroupSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => NotificationRecipientGroupSelectObjectSchema).optional()
}).strict();
export const NotificationRecipientGroupArgsObjectSchema = makeSchema();
export const NotificationRecipientGroupArgsObjectZodSchema = makeSchema();
