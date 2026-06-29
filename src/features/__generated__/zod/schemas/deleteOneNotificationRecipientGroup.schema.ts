import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupWhereUniqueInputObjectSchema as NotificationRecipientGroupWhereUniqueInputObjectSchema } from './objects/NotificationRecipientGroupWhereUniqueInput.schema';

export const NotificationRecipientGroupDeleteOneSchema: z.ZodType<Prisma.NotificationRecipientGroupDeleteArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupDeleteArgs>;

export const NotificationRecipientGroupDeleteOneZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict();