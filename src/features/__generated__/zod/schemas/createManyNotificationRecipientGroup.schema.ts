import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupCreateManyInputObjectSchema as NotificationRecipientGroupCreateManyInputObjectSchema } from './objects/NotificationRecipientGroupCreateManyInput.schema';

export const NotificationRecipientGroupCreateManySchema: z.ZodType<Prisma.NotificationRecipientGroupCreateManyArgs> = z.object({ data: z.union([ NotificationRecipientGroupCreateManyInputObjectSchema, z.array(NotificationRecipientGroupCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCreateManyArgs>;

export const NotificationRecipientGroupCreateManyZodSchema = z.object({ data: z.union([ NotificationRecipientGroupCreateManyInputObjectSchema, z.array(NotificationRecipientGroupCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();