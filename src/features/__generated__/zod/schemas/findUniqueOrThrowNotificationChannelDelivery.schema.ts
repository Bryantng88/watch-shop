import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryWhereUniqueInputObjectSchema as NotificationChannelDeliveryWhereUniqueInputObjectSchema } from './objects/NotificationChannelDeliveryWhereUniqueInput.schema';

export const NotificationChannelDeliveryFindUniqueOrThrowSchema: z.ZodType<Prisma.NotificationChannelDeliveryFindUniqueOrThrowArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryFindUniqueOrThrowArgs>;

export const NotificationChannelDeliveryFindUniqueOrThrowZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict();