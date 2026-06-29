import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './objects/BusinessEventLogInclude.schema';
import { BusinessEventLogOrderByWithRelationInputObjectSchema as BusinessEventLogOrderByWithRelationInputObjectSchema } from './objects/BusinessEventLogOrderByWithRelationInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './objects/BusinessEventLogWhereInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './objects/BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogScalarFieldEnumSchema } from './enums/BusinessEventLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BusinessEventLogFindManySelectSchema: z.ZodType<Prisma.BusinessEventLogSelect> = z.object({
    id: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    workflowEvents: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogSelect>;

export const BusinessEventLogFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    workflowEvents: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BusinessEventLogFindManySchema: z.ZodType<Prisma.BusinessEventLogFindManyArgs> = z.object({ select: BusinessEventLogFindManySelectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), orderBy: z.union([BusinessEventLogOrderByWithRelationInputObjectSchema, BusinessEventLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: BusinessEventLogWhereInputObjectSchema.optional(), cursor: BusinessEventLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BusinessEventLogScalarFieldEnumSchema, BusinessEventLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogFindManyArgs>;

export const BusinessEventLogFindManyZodSchema = z.object({ select: BusinessEventLogFindManySelectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), orderBy: z.union([BusinessEventLogOrderByWithRelationInputObjectSchema, BusinessEventLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: BusinessEventLogWhereInputObjectSchema.optional(), cursor: BusinessEventLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BusinessEventLogScalarFieldEnumSchema, BusinessEventLogScalarFieldEnumSchema.array()]).optional() }).strict();