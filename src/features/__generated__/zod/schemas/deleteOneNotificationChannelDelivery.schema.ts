import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryWhereUniqueInputObjectSchema as NotificationChannelDeliveryWhereUniqueInputObjectSchema } from './objects/NotificationChannelDeliveryWhereUniqueInput.schema';

export const NotificationChannelDeliveryDeleteOneSchema: z.ZodType<Prisma.NotificationChannelDeliveryDeleteArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryDeleteArgs>;

export const NotificationChannelDeliveryDeleteOneZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict();