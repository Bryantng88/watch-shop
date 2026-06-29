import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchSelectObjectSchema as NotificationDispatchSelectObjectSchema } from './objects/NotificationDispatchSelect.schema';
import { NotificationDispatchCreateManyInputObjectSchema as NotificationDispatchCreateManyInputObjectSchema } from './objects/NotificationDispatchCreateManyInput.schema';

export const NotificationDispatchCreateManyAndReturnSchema: z.ZodType<Prisma.NotificationDispatchCreateManyAndReturnArgs> = z.object({ select: NotificationDispatchSelectObjectSchema.optional(), data: z.union([ NotificationDispatchCreateManyInputObjectSchema, z.array(NotificationDispatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchCreateManyAndReturnArgs>;

export const NotificationDispatchCreateManyAndReturnZodSchema = z.object({ select: NotificationDispatchSelectObjectSchema.optional(), data: z.union([ NotificationDispatchCreateManyInputObjectSchema, z.array(NotificationDispatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();