import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleCreateManyInputObjectSchema as NotificationRuleCreateManyInputObjectSchema } from './objects/NotificationRuleCreateManyInput.schema';

export const NotificationRuleCreateManySchema: z.ZodType<Prisma.NotificationRuleCreateManyArgs> = z.object({ data: z.union([ NotificationRuleCreateManyInputObjectSchema, z.array(NotificationRuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleCreateManyArgs>;

export const NotificationRuleCreateManyZodSchema = z.object({ data: z.union([ NotificationRuleCreateManyInputObjectSchema, z.array(NotificationRuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();