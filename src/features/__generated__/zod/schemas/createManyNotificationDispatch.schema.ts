import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchCreateManyInputObjectSchema as NotificationDispatchCreateManyInputObjectSchema } from './objects/NotificationDispatchCreateManyInput.schema';

export const NotificationDispatchCreateManySchema: z.ZodType<Prisma.NotificationDispatchCreateManyArgs> = z.object({ data: z.union([ NotificationDispatchCreateManyInputObjectSchema, z.array(NotificationDispatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchCreateManyArgs>;

export const NotificationDispatchCreateManyZodSchema = z.object({ data: z.union([ NotificationDispatchCreateManyInputObjectSchema, z.array(NotificationDispatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();