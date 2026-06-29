import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRecipientGroupOrderByWithRelationInputObjectSchema as NotificationRecipientGroupOrderByWithRelationInputObjectSchema } from './objects/NotificationRecipientGroupOrderByWithRelationInput.schema';
import { NotificationRecipientGroupWhereInputObjectSchema as NotificationRecipientGroupWhereInputObjectSchema } from './objects/NotificationRecipientGroupWhereInput.schema';
import { NotificationRecipientGroupWhereUniqueInputObjectSchema as NotificationRecipientGroupWhereUniqueInputObjectSchema } from './objects/NotificationRecipientGroupWhereUniqueInput.schema';
import { NotificationRecipientGroupScalarFieldEnumSchema } from './enums/NotificationRecipientGroupScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const NotificationRecipientGroupFindFirstSelectSchema: z.ZodType<Prisma.NotificationRecipientGroupSelect> = z.object({
    id: z.boolean().optional(),
    key: z.boolean().optional(),
    name: z.boolean().optional(),
    enabled: z.boolean().optional(),
    roleNames: z.boolean().optional(),
    userIds: z.boolean().optional(),
    zaloGroupId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupSelect>;

export const NotificationRecipientGroupFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    key: z.boolean().optional(),
    name: z.boolean().optional(),
    enabled: z.boolean().optional(),
    roleNames: z.boolean().optional(),
    userIds: z.boolean().optional(),
    zaloGroupId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const NotificationRecipientGroupFindFirstSchema: z.ZodType<Prisma.NotificationRecipientGroupFindFirstArgs> = z.object({ select: NotificationRecipientGroupFindFirstSelectSchema.optional(),  orderBy: z.union([NotificationRecipientGroupOrderByWithRelationInputObjectSchema, NotificationRecipientGroupOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRecipientGroupWhereInputObjectSchema.optional(), cursor: NotificationRecipientGroupWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRecipientGroupScalarFieldEnumSchema, NotificationRecipientGroupScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRecipientGroupFindFirstArgs>;

export const NotificationRecipientGroupFindFirstZodSchema = z.object({ select: NotificationRecipientGroupFindFirstSelectSchema.optional(),  orderBy: z.union([NotificationRecipientGroupOrderByWithRelationInputObjectSchema, NotificationRecipientGroupOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationRecipientGroupWhereInputObjectSchema.optional(), cursor: NotificationRecipientGroupWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationRecipientGroupScalarFieldEnumSchema, NotificationRecipientGroupScalarFieldEnumSchema.array()]).optional() }).strict();