import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptOrderByWithRelationInputObjectSchema as IntegrationIngressReceiptOrderByWithRelationInputObjectSchema } from './objects/IntegrationIngressReceiptOrderByWithRelationInput.schema';
import { IntegrationIngressReceiptWhereInputObjectSchema as IntegrationIngressReceiptWhereInputObjectSchema } from './objects/IntegrationIngressReceiptWhereInput.schema';
import { IntegrationIngressReceiptWhereUniqueInputObjectSchema as IntegrationIngressReceiptWhereUniqueInputObjectSchema } from './objects/IntegrationIngressReceiptWhereUniqueInput.schema';
import { IntegrationIngressReceiptScalarFieldEnumSchema } from './enums/IntegrationIngressReceiptScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const IntegrationIngressReceiptFindFirstOrThrowSelectSchema: z.ZodType<Prisma.IntegrationIngressReceiptSelect> = z.object({
    id: z.boolean().optional(),
    channel: z.boolean().optional(),
    keyId: z.boolean().optional(),
    nonce: z.boolean().optional(),
    eventId: z.boolean().optional(),
    eventType: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    status: z.boolean().optional(),
    responseJson: z.boolean().optional(),
    lastError: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    expiresAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptSelect>;

export const IntegrationIngressReceiptFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    channel: z.boolean().optional(),
    keyId: z.boolean().optional(),
    nonce: z.boolean().optional(),
    eventId: z.boolean().optional(),
    eventType: z.boolean().optional(),
    requestHash: z.boolean().optional(),
    status: z.boolean().optional(),
    responseJson: z.boolean().optional(),
    lastError: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    expiresAt: z.boolean().optional()
  }).strict();

export const IntegrationIngressReceiptFindFirstOrThrowSchema: z.ZodType<Prisma.IntegrationIngressReceiptFindFirstOrThrowArgs> = z.object({ select: IntegrationIngressReceiptFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([IntegrationIngressReceiptOrderByWithRelationInputObjectSchema, IntegrationIngressReceiptOrderByWithRelationInputObjectSchema.array()]).optional(), where: IntegrationIngressReceiptWhereInputObjectSchema.optional(), cursor: IntegrationIngressReceiptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([IntegrationIngressReceiptScalarFieldEnumSchema, IntegrationIngressReceiptScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptFindFirstOrThrowArgs>;

export const IntegrationIngressReceiptFindFirstOrThrowZodSchema = z.object({ select: IntegrationIngressReceiptFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([IntegrationIngressReceiptOrderByWithRelationInputObjectSchema, IntegrationIngressReceiptOrderByWithRelationInputObjectSchema.array()]).optional(), where: IntegrationIngressReceiptWhereInputObjectSchema.optional(), cursor: IntegrationIngressReceiptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([IntegrationIngressReceiptScalarFieldEnumSchema, IntegrationIngressReceiptScalarFieldEnumSchema.array()]).optional() }).strict();