import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';

export const NotificationDispatchFindUniqueSchema: z.ZodType<Prisma.NotificationDispatchFindUniqueArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchFindUniqueArgs>;

export const NotificationDispatchFindUniqueZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict();