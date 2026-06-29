import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryWhereUniqueInputObjectSchema as NotificationChannelDeliveryWhereUniqueInputObjectSchema } from './objects/NotificationChannelDeliveryWhereUniqueInput.schema';

export const NotificationChannelDeliveryFindUniqueSchema: z.ZodType<Prisma.NotificationChannelDeliveryFindUniqueArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryFindUniqueArgs>;

export const NotificationChannelDeliveryFindUniqueZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict();