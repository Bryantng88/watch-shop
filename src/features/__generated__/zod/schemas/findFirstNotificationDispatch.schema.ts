import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationDispatchOrderByWithRelationInputObjectSchema as NotificationDispatchOrderByWithRelationInputObjectSchema } from './objects/NotificationDispatchOrderByWithRelationInput.schema';
import { NotificationDispatchWhereInputObjectSchema as NotificationDispatchWhereInputObjectSchema } from './objects/NotificationDispatchWhereInput.schema';
import { NotificationDispatchWhereUniqueInputObjectSchema as NotificationDispatchWhereUniqueInputObjectSchema } from './objects/NotificationDispatchWhereUniqueInput.schema';
import { NotificationDispatchScalarFieldEnumSchema } from './enums/NotificationDispatchScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const NotificationDispatchFindFirstSelectSchema: z.ZodType<Prisma.NotificationDispatchSelect> = z.object({
    id: z.boolean().optional(),
    businessEventLogId: z.boolean().optional(),
    ruleId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchSelect>;

export const NotificationDispatchFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    businessEventLogId: z.boolean().optional(),
    ruleId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const NotificationDispatchFindFirstSchema: z.ZodType<Prisma.NotificationDispatchFindFirstArgs> = z.object({ select: NotificationDispatchFindFirstSelectSchema.optional(),  orderBy: z.union([NotificationDispatchOrderByWithRelationInputObjectSchema, NotificationDispatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationDispatchWhereInputObjectSchema.optional(), cursor: NotificationDispatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationDispatchScalarFieldEnumSchema, NotificationDispatchScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.NotificationDispatchFindFirstArgs>;

export const NotificationDispatchFindFirstZodSchema = z.object({ select: NotificationDispatchFindFirstSelectSchema.optional(),  orderBy: z.union([NotificationDispatchOrderByWithRelationInputObjectSchema, NotificationDispatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationDispatchWhereInputObjectSchema.optional(), cursor: NotificationDispatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationDispatchScalarFieldEnumSchema, NotificationDispatchScalarFieldEnumSchema.array()]).optional() }).strict();