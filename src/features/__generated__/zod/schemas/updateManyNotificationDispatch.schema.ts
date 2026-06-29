import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchUpdateManyMutationInputObjectSchema as NotificationDispatchUpdateManyMutationInputObjectSchema } from './objects/NotificationDispatchUpdateManyMutationInput.schema';
import { NotificationDispatchWhereInputObjectSchema as NotificationDispatchWhereInputObjectSchema } from './objects/NotificationDispatchWhereInput.schema';

export const NotificationDispatchUpdateManySchema: z.ZodType<Prisma.NotificationDispatchUpdateManyArgs> = z.object({ data: NotificationDispatchUpdateManyMutationInputObjectSchema, where: NotificationDispatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchUpdateManyArgs>;

export const NotificationDispatchUpdateManyZodSchema = z.object({ data: NotificationDispatchUpdateManyMutationInputObjectSchema, where: NotificationDispatchWhereInputObjectSchema.optional() }).strict();