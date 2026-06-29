import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleOrderByWithRelationInputObjectSchema as NotificationRuleOrderByWithRelationInputObjectSchema } from './objects/NotificationRuleOrderByWithRelationInput.schema';
import { NotificationRuleWhereInputObjectSchema as NotificationRuleWhereInputObjectSchema } from './objects/NotificationRuleWhereInput.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';
import { NotificationRuleScalarFieldEnumSchema } from './enums/NotificationRuleScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const NotificationRuleFindFirstOrThrowSelectSchema: z.ZodType<Prisma.NotificationRuleSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    enabled: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    titleTemplate: z.boolean().optional(),
    messageTemplate: z.boolean().optional(),
    priority: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.NotificationRuleSelect>;

export const NotificationRuleFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    enabled: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    titleTemplate: z.boolean().optional(),
    messageTemplate: z.boolean().optional(),
    priority: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const NotificationRuleFindFirstOrThrowSchema: z.ZodType<Prisma.NotificationRuleFindFirstOrThrowArgs> = z.object({ select: NotificationRuleFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([NotificationRuleOrderByWithRelationInputObjectSchema, NotificationRuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRuleWhereInputObjectSchema.optional(), cursor: NotificationRuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRuleScalarFieldEnumSchema, NotificationRuleScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleFindFirstOrThrowArgs>;

export const NotificationRuleFindFirstOrThrowZodSchema = z.object({ select: NotificationRuleFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([NotificationRuleOrderByWithRelationInputObjectSchema, NotificationRuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRuleWhereInputObjectSchema.optional(), cursor: NotificationRuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRuleScalarFieldEnumSchema, NotificationRuleScalarFieldEnumSchema.array()]).optional() }).strict();