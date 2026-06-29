import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleUpdateManyMutationInputObjectSchema as NotificationRuleUpdateManyMutationInputObjectSchema } from './objects/NotificationRuleUpdateManyMutationInput.schema';
import { NotificationRuleWhereInputObjectSchema as NotificationRuleWhereInputObjectSchema } from './objects/NotificationRuleWhereInput.schema';

export const NotificationRuleUpdateManyAndReturnSchema: z.ZodType<Prisma.NotificationRuleUpdateManyAndReturnArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(), data: NotificationRuleUpdateManyMutationInputObjectSchema, where: NotificationRuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleUpdateManyAndReturnArgs>;

export const NotificationRuleUpdateManyAndReturnZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(), data: NotificationRuleUpdateManyMutationInputObjectSchema, where: NotificationRuleWhereInputObjectSchema.optional() }).strict();