import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';

export const NotificationRuleFindUniqueOrThrowSchema: z.ZodType<Prisma.NotificationRuleFindUniqueOrThrowArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRuleFindUniqueOrThrowArgs>;

export const NotificationRuleFindUniqueOrThrowZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema }).strict();