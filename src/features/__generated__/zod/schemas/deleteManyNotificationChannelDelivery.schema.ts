import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliveryWhereInputObjectSchema as NotificationChannelDeliveryWhereInputObjectSchema } from './objects/NotificationChannelDeliveryWhereInput.schema';

export const NotificationChannelDeliveryDeleteManySchema: z.ZodType<Prisma.NotificationChannelDeliveryDeleteManyArgs> = z.object({ where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryDeleteManyArgs>;

export const NotificationChannelDeliveryDeleteManyZodSchema = z.object({ where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict();