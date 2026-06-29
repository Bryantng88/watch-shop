import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchUpdateInputObjectSchema as NotificationDispatchUpdateInputObjectSchema } from './objects/NotificationDispatchUpdateInput.schema';
import { NotificationDispatchUncheckedUpdateInputObjectSchema as NotificationDispatchUncheckedUpdateInputObjectSchema } from './objects/NotificationDispatchUncheckedUpdateInput.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';

export const NotificationDispatchUpdateOneSchema: z.ZodType<Prisma.NotificationDispatchUpdateArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  data: z.union([NotificationDispatchUpdateInputObjectSchema, NotificationDispatchUncheckedUpdateInputObjectSchema]), where: NotificationDispatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchUpdateArgs>;

export const NotificationDispatchUpdateOneZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  data: z.union([NotificationDispatchUpdateInputObjectSchema, NotificationDispatchUncheckedUpdateInputObjectSchema]), where: NotificationDispatchWhereUniqueInputObjectSchema }).strict();