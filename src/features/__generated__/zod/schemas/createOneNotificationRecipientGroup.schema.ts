import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupCreateInputObjectSchema as NotificationRecipientGroupCreateInputObjectSchema } from './objects/NotificationRecipientGroupCreateInput.schema';
import { NotificationRecipientGroupUncheckedCreateInputObjectSchema as NotificationRecipientGroupUncheckedCreateInputObjectSchema } from './objects/NotificationRecipientGroupUncheckedCreateInput.schema';

export const NotificationRecipientGroupCreateOneSchema: z.ZodType<Prisma.NotificationRecipientGroupCreateArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  data: z.union([NotificationRecipientGroupCreateInputObjectSchema, NotificationRecipientGroupUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCreateArgs>;

export const NotificationRecipientGroupCreateOneZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(),  data: z.union([NotificationRecipientGroupCreateInputObjectSchema, NotificationRecipientGroupUncheckedCreateInputObjectSchema]) }).strict();