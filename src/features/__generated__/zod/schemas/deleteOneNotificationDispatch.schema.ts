import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';

export const NotificationDispatchDeleteOneSchema: z.ZodType<Prisma.NotificationDispatchDeleteArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchDeleteArgs>;

export const NotificationDispatchDeleteOneZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict();