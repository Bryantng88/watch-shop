import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryUpdateInputObjectSchema as NotificationChannelDeliveryUpdateInputObjectSchema } from './objects/NotificationChannelDeliveryUpdateInput.schema';
import { NotificationChannelDeliveryUncheckedUpdateInputObjectSchema as NotificationChannelDeliveryUncheckedUpdateInputObjectSchema } from './objects/NotificationChannelDeliveryUncheckedUpdateInput.schema';
import { NotificationChannelDeliveryWhereUniqueInputObjectSchema as NotificationChannelDeliveryWhereUniqueInputObjectSchema } from './objects/NotificationChannelDeliveryWhereUniqueInput.schema';

export const NotificationChannelDeliveryUpdateOneSchema: z.ZodType<Prisma.NotificationChannelDeliveryUpdateArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  data: z.union([NotificationChannelDeliveryUpdateInputObjectSchema, NotificationChannelDeliveryUncheckedUpdateInputObjectSchema]), where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryUpdateArgs>;

export const NotificationChannelDeliveryUpdateOneZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  data: z.union([NotificationChannelDeliveryUpdateInputObjectSchema, NotificationChannelDeliveryUncheckedUpdateInputObjectSchema]), where: NotificationChannelDeliveryWhereUniqueInputObjectSchema }).strict();