import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './NotificationChannelDeliverySelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => NotificationChannelDeliverySelectObjectSchema).optional()
}).strict();
export const NotificationChannelDeliveryArgsObjectSchema = makeSchema();
export const NotificationChannelDeliveryArgsObjectZodSchema = makeSchema();
