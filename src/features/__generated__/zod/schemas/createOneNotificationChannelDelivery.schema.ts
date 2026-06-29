import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryCreateInputObjectSchema as NotificationChannelDeliveryCreateInputObjectSchema } from './objects/NotificationChannelDeliveryCreateInput.schema';
import { NotificationChannelDeliveryUncheckedCreateInputObjectSchema as NotificationChannelDeliveryUncheckedCreateInputObjectSchema } from './objects/NotificationChannelDeliveryUncheckedCreateInput.schema';

export const NotificationChannelDeliveryCreateOneSchema: z.ZodType<Prisma.NotificationChannelDeliveryCreateArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  data: z.union([NotificationChannelDeliveryCreateInputObjectSchema, NotificationChannelDeliveryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCreateArgs>;

export const NotificationChannelDeliveryCreateOneZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(),  data: z.union([NotificationChannelDeliveryCreateInputObjectSchema, NotificationChannelDeliveryUncheckedCreateInputObjectSchema]) }).strict();