import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';

export const NotificationDispatchFindUniqueOrThrowSchema: z.ZodType<Prisma.NotificationDispatchFindUniqueOrThrowArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchFindUniqueOrThrowArgs>;

export const NotificationDispatchFindUniqueOrThrowZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema }).strict();