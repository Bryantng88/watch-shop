import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchCreateInputObjectSchema as NotificationDispatchCreateInputObjectSchema } from './objects/NotificationDispatchCreateInput.schema';
import { NotificationDispatchUncheckedCreateInputObjectSchema as NotificationDispatchUncheckedCreateInputObjectSchema } from './objects/NotificationDispatchUncheckedCreateInput.schema';

export const NotificationDispatchCreateOneSchema: z.ZodType<Prisma.NotificationDispatchCreateArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  data: z.union([NotificationDispatchCreateInputObjectSchema, NotificationDispatchUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchCreateArgs>;

export const NotificationDispatchCreateOneZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  data: z.union([NotificationDispatchCreateInputObjectSchema, NotificationDispatchUncheckedCreateInputObjectSchema]) }).strict();