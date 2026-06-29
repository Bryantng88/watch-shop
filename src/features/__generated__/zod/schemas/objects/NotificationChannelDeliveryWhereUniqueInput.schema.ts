import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const NotificationChannelDeliveryWhereUniqueInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryWhereUniqueInput>;
export const NotificationChannelDeliveryWhereUniqueInputObjectZodSchema = makeSchema();
