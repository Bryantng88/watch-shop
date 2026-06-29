import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';
import { NotificationRuleCreateInputObjectSchema as NotificationRuleCreateInputObjectSchema } from './objects/NotificationRuleCreateInput.schema';
import { NotificationRuleUncheckedCreateInputObjectSchema as NotificationRuleUncheckedCreateInputObjectSchema } from './objects/NotificationRuleUncheckedCreateInput.schema';
import { NotificationRuleUpdateInputObjectSchema as NotificationRuleUpdateInputObjectSchema } from './objects/NotificationRuleUpdateInput.schema';
import { NotificationRuleUncheckedUpdateInputObjectSchema as NotificationRuleUncheckedUpdateInputObjectSchema } from './objects/NotificationRuleUncheckedUpdateInput.schema';

export const NotificationRuleUpsertOneSchema: z.ZodType<Prisma.NotificationRuleUpsertArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema, create: z.union([ NotificationRuleCreateInputObjectSchema, NotificationRuleUncheckedCreateInputObjectSchema ]), update: z.union([ NotificationRuleUpdateInputObjectSchema, NotificationRuleUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.NotificationRuleUpsertArgs>;

export const NotificationRuleUpsertOneZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(),  where: NotificationRuleWhereUniqueInputObjectSchema, create: z.union([ NotificationRuleCreateInputObjectSchema, NotificationRuleUncheckedCreateInputObjectSchema ]), update: z.union([ NotificationRuleUpdateInputObjectSchema, NotificationRuleUncheckedUpdateInputObjectSchema ]) }).strict();