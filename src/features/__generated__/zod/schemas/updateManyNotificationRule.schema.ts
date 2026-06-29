import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleUpdateManyMutationInputObjectSchema as NotificationRuleUpdateManyMutationInputObjectSchema } from './objects/NotificationRuleUpdateManyMutationInput.schema';
import { NotificationRuleWhereInputObjectSchema as NotificationRuleWhereInputObjectSchema } from './objects/NotificationRuleWhereInput.schema';

export const NotificationRuleUpdateManySchema: z.ZodType<Prisma.NotificationRuleUpdateManyArgs> = z.object({ data: NotificationRuleUpdateManyMutationInputObjectSchema, where: NotificationRuleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleUpdateManyArgs>;

export const NotificationRuleUpdateManyZodSchema = z.object({ data: NotificationRuleUpdateManyMutationInputObjectSchema, where: NotificationRuleWhereInputObjectSchema.optional() }).strict();