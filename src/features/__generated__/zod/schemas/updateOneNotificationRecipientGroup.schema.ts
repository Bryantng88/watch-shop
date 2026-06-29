import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupUpdateInputObjectSchema as NotificationRecipientGroupUpdateInputObjectSchema } from './objects/NotificationRecipientGroupUpdateInput.schema';
import { NotificationRecipientGroupUncheckedUpdateInputObjectSchema as NotificationRecipientGroupUncheckedUpdateInputObjectSchema } from './objects/NotificationRecipientGroupUncheckedUpdateInput.schema';
import { NotificationRecipientGroupWhereUniqueInputObjectSchema as NotificationRecipientGroupWhereUniqueInputObjectSchema } from './objects/NotificationRecipientGroupWhereUniqueInput.schema';

export const NotificationRecipientGroupUpdateOneSchema: z.ZodType<Prisma.NotificationRecipientGroupUpdateArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  data: z.union([NotificationRecipientGroupUpdateInputObjectSchema, NotificationRecipientGroupUncheckedUpdateInputObjectSchema]), where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupUpdateArgs>;

export const NotificationRecipientGroupUpdateOneZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  data: z.union([NotificationRecipientGroupUpdateInputObjectSchema, NotificationRecipientGroupUncheckedUpdateInputObjectSchema]), where: NotificationRecipientGroupWhereUniqueInputObjectSchema }).strict();