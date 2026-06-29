import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleWhereInputObjectSchema as NotificationRuleWhereInputObjectSchema } from './objects/NotificationRuleWhereInput.schema';

export const NotificationRuleDeleteManySchema: z.ZodType<Prisma.NotificationRuleDeleteManyArgs> = z.object({ where: NotificationRuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleDeleteManyArgs>;

export const NotificationRuleDeleteManyZodSchema = z.object({ where: NotificationRuleWhereInputObjectSchema.optional() }).strict();