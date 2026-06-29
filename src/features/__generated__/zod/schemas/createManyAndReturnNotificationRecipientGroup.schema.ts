import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupSelectObjectSchema as NotificationRecipientGroupSelectObjectSchema } from './objects/NotificationRecipientGroupSelect.schema';
import { NotificationRecipientGroupCreateManyInputObjectSchema as NotificationRecipientGroupCreateManyInputObjectSchema } from './objects/NotificationRecipientGroupCreateManyInput.schema';

export const NotificationRecipientGroupCreateManyAndReturnSchema: z.ZodType<Prisma.NotificationRecipientGroupCreateManyAndReturnArgs> = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(), data: z.union([ NotificationRecipientGroupCreateManyInputObjectSchema, z.array(NotificationRecipientGroupCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCreateManyAndReturnArgs>;

export const NotificationRecipientGroupCreateManyAndReturnZodSchema = z.object({ select: NotificationRecipientGroupSelectObjectSchema.optional(), data: z.union([ NotificationRecipientGroupCreateManyInputObjectSchema, z.array(NotificationRecipientGroupCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();