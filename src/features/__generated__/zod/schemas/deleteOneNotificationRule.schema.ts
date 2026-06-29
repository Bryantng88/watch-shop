import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';

export const NotificationRuleDeleteOneSchema: z.ZodType<Prisma.NotificationRuleDeleteArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRuleDeleteArgs>;

export const NotificationRuleDeleteOneZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict();