import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliveryCreateManyInputObjectSchema as NotificationChannelDeliveryCreateManyInputObjectSchema } from './objects/NotificationChannelDeliveryCreateManyInput.schema';

export const NotificationChannelDeliveryCreateManySchema: z.ZodType<Prisma.NotificationChannelDeliveryCreateManyArgs> = z.object({ data: z.union([ NotificationChannelDeliveryCreateManyInputObjectSchema, z.array(NotificationChannelDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCreateManyArgs>;

export const NotificationChannelDeliveryCreateManyZodSchema = z.object({ data: z.union([ NotificationChannelDeliveryCreateManyInputObjectSchema, z.array(NotificationChannelDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();