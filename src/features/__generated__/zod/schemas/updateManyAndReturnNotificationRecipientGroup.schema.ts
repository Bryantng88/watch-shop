import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupUpdateManyMutationInputObjectSchema as NotificationRecipientGroupUpdateManyMutationInputObjectSchema } from './objects/NotificationRecipientGroupUpdateManyMutationInput.schema';
import { NotificationRecipientGroupWhereInputObjectSchema as NotificationRecipientGroupWhereInputObjectSchema } from './objects/NotificationRecipientGroupWhereInput.schema';

export const NotificationRecipientGroupUpdateManyAndReturnSchema: z.ZodType<Prisma.NotificationRecipientGroupUpdateManyAndReturnArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(), data: NotificationRecipientGroupUpdateManyMutationInputObjectSchema, where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupUpdateManyAndReturnArgs>;

export const NotificationRecipientGroupUpdateManyAndReturnZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(), data: NotificationRecipientGroupUpdateManyMutationInputObjectSchema, where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict();