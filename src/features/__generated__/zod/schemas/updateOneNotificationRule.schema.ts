import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleUpdateInputObjectSchema as NotificationRuleUpdateInputObjectSchema } from './objects/NotificationRuleUpdateInput.schema';
import { NotificationRuleUncheckedUpdateInputObjectSchema as NotificationRuleUncheckedUpdateInputObjectSchema } from './objects/NotificationRuleUncheckedUpdateInput.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';

export const NotificationRuleUpdateOneSchema: z.ZodType<Prisma.NotificationRuleUpdateArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  data: z.union([NotificationRuleUpdateInputObjectSchema, NotificationRuleUncheckedUpdateInputObjectSchema]), where: NotificationRuleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NotificationRuleUpdateArgs>;

export const NotificationRuleUpdateOneZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  data: z.union([NotificationRuleUpdateInputObjectSchema, NotificationRuleUncheckedUpdateInputObjectSchema]), where: NotificationRuleWhereUniqueInputObjectSchema }).strict();