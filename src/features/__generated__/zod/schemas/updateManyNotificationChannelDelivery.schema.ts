import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliveryUpdateManyMutationInputObjectSchema as NotificationChannelDeliveryUpdateManyMutationInputObjectSchema } from './objects/NotificationChannelDeliveryUpdateManyMutationInput.schema';
import { NotificationChannelDeliveryWhereInputObjectSchema as NotificationChannelDeliveryWhereInputObjectSchema } from './objects/NotificationChannelDeliveryWhereInput.schema';

export const NotificationChannelDeliveryUpdateManySchema: z.ZodType<Prisma.NotificationChannelDeliveryUpdateManyArgs> = z.object({ data: NotificationChannelDeliveryUpdateManyMutationInputObjectSchema, where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryUpdateManyArgs>;

export const NotificationChannelDeliveryUpdateManyZodSchema = z.object({ data: NotificationChannelDeliveryUpdateManyMutationInputObjectSchema, where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict();