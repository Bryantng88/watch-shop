import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleCreateInputObjectSchema as NotificationRuleCreateInputObjectSchema } from './objects/NotificationRuleCreateInput.schema';
import { NotificationRuleUncheckedCreateInputObjectSchema as NotificationRuleUncheckedCreateInputObjectSchema } from './objects/NotificationRuleUncheckedCreateInput.schema';

export const NotificationRuleCreateOneSchema: z.ZodType<Prisma.NotificationRuleCreateArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  data: z.union([NotificationRuleCreateInputObjectSchema, NotificationRuleUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.NotificationRuleCreateArgs>;

export const NotificationRuleCreateOneZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  data: z.union([NotificationRuleCreateInputObjectSchema, NotificationRuleUncheckedCreateInputObjectSchema]) }).strict();