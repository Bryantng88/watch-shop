import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionOrderByWithRelationInputObjectSchema as WorkflowConditionOrderByWithRelationInputObjectSchema } from './objects/WorkflowConditionOrderByWithRelationInput.schema';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './objects/WorkflowConditionWhereInput.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionScalarFieldEnumSchema } from './enums/WorkflowConditionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowConditionFindFirstSelectSchema: z.ZodType<Prisma.WorkflowConditionSelect> = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionSelect>;

export const WorkflowConditionFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict();

export const WorkflowConditionFindFirstSchema: z.ZodType<Prisma.WorkflowConditionFindFirstArgs> = z.object({ select: WorkflowConditionFindFirstSelectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowConditionOrderByWithRelationInputObjectSchema, WorkflowConditionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowConditionWhereInputObjectSchema.optional(), cursor: WorkflowConditionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowConditionScalarFieldEnumSchema, WorkflowConditionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionFindFirstArgs>;

export const WorkflowConditionFindFirstZodSchema = z.object({ select: WorkflowConditionFindFirstSelectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowConditionOrderByWithRelationInputObjectSchema, WorkflowConditionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowConditionWhereInputObjectSchema.optional(), cursor: WorkflowConditionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowConditionScalarFieldEnumSchema, WorkflowConditionScalarFieldEnumSchema.array()]).optional() }).strict();