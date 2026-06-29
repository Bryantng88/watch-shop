import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliverySelectObjectSchema as NotificationChannelDeliverySelectObjectSchema } from './objects/NotificationChannelDeliverySelect.schema';
import { NotificationChannelDeliveryCreateManyInputObjectSchema as NotificationChannelDeliveryCreateManyInputObjectSchema } from './objects/NotificationChannelDeliveryCreateManyInput.schema';

export const NotificationChannelDeliveryCreateManyAndReturnSchema: z.ZodType<Prisma.NotificationChannelDeliveryCreateManyAndReturnArgs> = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(), data: z.union([ NotificationChannelDeliveryCreateManyInputObjectSchema, z.array(NotificationChannelDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCreateManyAndReturnArgs>;

export const NotificationChannelDeliveryCreateManyAndReturnZodSchema = z.object({ select: NotificationChannelDeliverySelectObjectSchema.optional(), data: z.union([ NotificationChannelDeliveryCreateManyInputObjectSchema, z.array(NotificationChannelDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();