import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchWhereInputObjectSchema as NotificationDispatchWhereInputObjectSchema } from './objects/NotificationDispatchWhereInput.schema';

export const NotificationDispatchDeleteManySchema: z.ZodType<Prisma.NotificationDispatchDeleteManyArgs> = z.object({ where: NotificationDispatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchDeleteManyArgs>;

export const NotificationDispatchDeleteManyZodSchema = z.object({ where: NotificationDispatchWhereInputObjectSchema.optional() }).strict();