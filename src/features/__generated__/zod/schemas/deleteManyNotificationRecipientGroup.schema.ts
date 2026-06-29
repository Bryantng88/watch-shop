import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupWhereInputObjectSchema as NotificationRecipientGroupWhereInputObjectSchema } from './objects/NotificationRecipientGroupWhereInput.schema';

export const NotificationRecipientGroupDeleteManySchema: z.ZodType<Prisma.NotificationRecipientGroupDeleteManyArgs> = z.object({ where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupDeleteManyArgs>;

export const NotificationRecipientGroupDeleteManyZodSchema = z.object({ where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict();