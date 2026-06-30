import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleOrderByWithRelationInputObjectSchema as NotificationRuleOrderByWithRelationInputObjectSchema } from './objects/NotificationRuleOrderByWithRelationInput.schema';
import { NotificationRuleWhereInputObjectSchema as NotificationRuleWhereInputObjectSchema } from './objects/NotificationRuleWhereInput.schema';
import { NotificationRuleWhereUniqueInputObjectSchema as NotificationRuleWhereUniqueInputObjectSchema } from './objects/NotificationRuleWhereUniqueInput.schema';
import { NotificationRuleScalarFieldEnumSchema } from './enums/NotificationRuleScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const NotificationRuleFindManySelectSchema: z.ZodType<Prisma.NotificationRuleSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    enabled: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    conditionJson: z.boolean().optional(),
    titleTemplate: z.boolean().optional(),
    messageTemplate: z.boolean().optional(),
    priority: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.NotificationRuleSelect>;

export const NotificationRuleFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    enabled: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    conditionJson: z.boolean().optional(),
    titleTemplate: z.boolean().optional(),
    messageTemplate: z.boolean().optional(),
    priority: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const NotificationRuleFindManySchema: z.ZodType<Prisma.NotificationRuleFindManyArgs> = z.object({ select: NotificationRuleFindManySelectSchema.optional(),  orderBy: z.union([NotificationRuleOrderByWithRelationInputObjectSchema, NotificationRuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRuleWhereInputObjectSchema.optional(), cursor: NotificationRuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRuleScalarFieldEnumSchema, NotificationRuleScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleFindManyArgs>;

export const NotificationRuleFindManyZodSchema = z.object({ select: NotificationRuleFindManySelectSchema.optional(),  orderBy: z.union([NotificationRuleOrderByWithRelationInputObjectSchema, NotificationRuleOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRuleWhereInputObjectSchema.optional(), cursor: NotificationRuleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRuleScalarFieldEnumSchema, NotificationRuleScalarFieldEnumSchema.array()]).optional() }).strict();