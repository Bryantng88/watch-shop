import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationChannelDeliveryOrderByWithRelationInputObjectSchema as NotificationChannelDeliveryOrderByWithRelationInputObjectSchema } from './objects/NotificationChannelDeliveryOrderByWithRelationInput.schema';
import { NotificationChannelDeliveryWhereInputObjectSchema as NotificationChannelDeliveryWhereInputObjectSchema } from './objects/NotificationChannelDeliveryWhereInput.schema';
import { NotificationChannelDeliveryWhereUniqueInputObjectSchema as NotificationChannelDeliveryWhereUniqueInputObjectSchema } from './objects/NotificationChannelDeliveryWhereUniqueInput.schema';
import { NotificationChannelDeliveryScalarFieldEnumSchema } from './enums/NotificationChannelDeliveryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const NotificationChannelDeliveryFindFirstOrThrowSelectSchema: z.ZodType<Prisma.NotificationChannelDeliverySelect> = z.object({
    id: z.boolean().optional(),
    dispatchId: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliverySelect>;

export const NotificationChannelDeliveryFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    dispatchId: z.boolean().optional(),
    channel: z.boolean().optional(),
    recipientGroupKey: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const NotificationChannelDeliveryFindFirstOrThrowSchema: z.ZodType<Prisma.NotificationChannelDeliveryFindFirstOrThrowArgs> = z.object({ select: NotificationChannelDeliveryFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([NotificationChannelDeliveryOrderByWithRelationInputObjectSchema, NotificationChannelDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationChannelDeliveryWhereInputObjectSchema.optional(), cursor: NotificationChannelDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationChannelDeliveryScalarFieldEnumSchema, NotificationChannelDeliveryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryFindFirstOrThrowArgs>;

export const NotificationChannelDeliveryFindFirstOrThrowZodSchema = z.object({ select: NotificationChannelDeliveryFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([NotificationChannelDeliveryOrderByWithRelationInputObjectSchema, NotificationChannelDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: NotificationChannelDeliveryWhereInputObjectSchema.optional(), cursor: NotificationChannelDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([NotificationChannelDeliveryScalarFieldEnumSchema, NotificationChannelDeliveryScalarFieldEnumSchema.array()]).optional() }).strict();