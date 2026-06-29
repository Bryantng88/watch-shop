import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';

export const NotificationRuleFindUniqueSchema: z.ZodType<Prisma.NotificationRuleFindUniqueArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRuleFindUniqueArgs>;

export const NotificationRuleFindUniqueZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict();