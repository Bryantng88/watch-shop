import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';
import { NotificationDispatchCreateInputObjectSchema as NotificationDispatchCreateInputObjectSchema } from './objects/NotificationDispatchCreateInput.schema';
import { NotificationDispatchUncheckedCreateInputObjectSchema as NotificationDispatchUncheckedCreateInputObjectSchema } from './objects/NotificationDispatchUncheckedCreateInput.schema';
import { NotificationDispatchUpdateInputObjectSchema as NotificationDispatchUpdateInputObjectSchema } from './objects/NotificationDispatchUpdateInput.schema';
import { NotificationDispatchUncheckedUpdateInputObjectSchema as NotificationDispatchUncheckedUpdateInputObjectSchema } from './objects/NotificationDispatchUncheckedUpdateInput.schema';

export const NotificationDispatchUpsertOneSchema: z.ZodType<Prisma.NotificationDispatchUpsertArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema, create: z.union([ NotificationDispatchCreateInputObjectSchema, NotificationDispatchUncheckedCreateInputObjectSchema ]), update: z.union([ NotificationDispatchUpdateInputObjectSchema, NotificationDispatchUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchUpsertArgs>;

export const NotificationDispatchUpsertOneZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(),  where: NotificationDispatchWhereUniqueInputObjectSchema, create: z.union([ NotificationDispatchCreateInputObjectSchema, NotificationDispatchUncheckedCreateInputObjectSchema ]), update: z.union([ NotificationDispatchUpdateInputObjectSchema, NotificationDispatchUncheckedUpdateInputObjectSchema ]) }).strict();