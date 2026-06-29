import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupWhereUniqueInputObjectSchema as NotificationRecipientGroupWhereUniqueInputObjectSchema } from './objects/NotificationRecipientGroupWhereUniqueInput.schema';

export const NotificationRecipientGroupFindUniqueOrThrowSchema: z.ZodType<Prisma.NotificationRecipientGroupFindUniqueOrThrowArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupFindUniqueOrThrowArgs>;

export const NotificationRecipientGroupFindUniqueOrThrowZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict();