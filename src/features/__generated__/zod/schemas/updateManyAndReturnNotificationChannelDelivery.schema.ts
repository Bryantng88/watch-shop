import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryUpdateManyMutationInputObjectSchema as NotificationChannelDeliveryUpdateManyMutationInputObjectSchema } from './objects/NotificationChannelDeliveryUpdateManyMutationInput.schema';
import { NotificationChannelDeliveryWhereInputObjectSchema as NotificationChannelDeliveryWhereInputObjectSchema } from './objects/NotificationChannelDeliveryWhereInput.schema';

export const NotificationChannelDeliveryUpdateManyAndReturnSchema: z.ZodType<Prisma.NotificationChannelDeliveryUpdateManyAndReturnArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(), data: NotificationChannelDeliveryUpdateManyMutationInputObjectSchema, where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryUpdateManyAndReturnArgs>;

export const NotificationChannelDeliveryUpdateManyAndReturnZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(), data: NotificationChannelDeliveryUpdateManyMutationInputObjectSchema, where: NotificationChannelDeliveryWhereInputObjectSchema.optional() }).strict();