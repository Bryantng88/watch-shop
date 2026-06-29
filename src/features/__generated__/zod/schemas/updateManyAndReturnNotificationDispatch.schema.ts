import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchUpdateManyMutationInputObjectSchema as NotificationDispatchUpdateManyMutationInputObjectSchema } from './objects/NotificationDispatchUpdateManyMutationInput.schema';
import { NotificationDispatchWhereInputObjectSchema as NotificationDispatchWhereInputObjectSchema } from './objects/NotificationDispatchWhereInput.schema';

export const NotificationDispatchUpdateManyAndReturnSchema: z.ZodType<Prisma.NotificationDispatchUpdateManyAndReturnArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(), data: NotificationDispatchUpdateManyMutationInputObjectSchema, where: NotificationDispatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchUpdateManyAndReturnArgs>;

export const NotificationDispatchUpdateManyAndReturnZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(), data: NotificationDispatchUpdateManyMutationInputObjectSchema, where: NotificationDispatchWhereInputObjectSchema.optional() }).strict();