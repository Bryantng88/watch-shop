import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackOrderByWithRelationInputObjectSchema as BusinessFeedbackOrderByWithRelationInputObjectSchema } from './objects/BusinessFeedbackOrderByWithRelationInput.schema';
import { BusinessFeedbackWhereInputObjectSchema as BusinessFeedbackWhereInputObjectSchema } from './objects/BusinessFeedbackWhereInput.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';
import { BusinessFeedbackScalarFieldEnumSchema } from './enums/BusinessFeedbackScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BusinessFeedbackFindFirstOrThrowSelectSchema: z.ZodType<Prisma.BusinessFeedbackSelect> = z.object({
    id: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    message: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackSelect>;

export const BusinessFeedbackFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    message: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const BusinessFeedbackFindFirstOrThrowSchema: z.ZodType<Prisma.BusinessFeedbackFindFirstOrThrowArgs> = z.object({ select: BusinessFeedbackFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([BusinessFeedbackOrderByWithRelationInputObjectSchema, BusinessFeedbackOrderByWithRelationInputObjectSchema.array()]).optional(), where: BusinessFeedbackWhereInputObjectSchema.optional(), cursor: BusinessFeedbackWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BusinessFeedbackScalarFieldEnumSchema, BusinessFeedbackScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackFindFirstOrThrowArgs>;

export const BusinessFeedbackFindFirstOrThrowZodSchema = z.object({ select: BusinessFeedbackFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([BusinessFeedbackOrderByWithRelationInputObjectSchema, BusinessFeedbackOrderByWithRelationInputObjectSchema.array()]).optional(), where: BusinessFeedbackWhereInputObjectSchema.optional(), cursor: BusinessFeedbackWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BusinessFeedbackScalarFieldEnumSchema, BusinessFeedbackScalarFieldEnumSchema.array()]).optional() }).strict();