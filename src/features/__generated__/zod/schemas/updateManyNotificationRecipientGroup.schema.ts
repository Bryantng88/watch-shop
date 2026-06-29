import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupUpdateManyMutationInputObjectSchema as NotificationRecipientGroupUpdateManyMutationInputObjectSchema } from './objects/NotificationRecipientGroupUpdateManyMutationInput.schema';
import { NotificationRecipientGroupWhereInputObjectSchema as NotificationRecipientGroupWhereInputObjectSchema } from './objects/NotificationRecipientGroupWhereInput.schema';

export const NotificationRecipientGroupUpdateManySchema: z.ZodType<Prisma.NotificationRecipientGroupUpdateManyArgs> = z.object({ data: NotificationRecipientGroupUpdateManyMutationInputObjectSchema, where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupUpdateManyArgs>;

export const NotificationRecipientGroupUpdateManyZodSchema = z.object({ data: NotificationRecipientGroupUpdateManyMutationInputObjectSchema, where: NotificationRecipientGroupWhereInputObjectSchema.optional() }).strict();