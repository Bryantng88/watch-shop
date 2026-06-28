import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionIncludeObjectSchema as WorkflowExecutionIncludeObjectSchema } from './objects/WorkflowExecutionInclude.schema';
import { WorkflowExecutionOrderByWithRelationInputObjectSchema as WorkflowExecutionOrderByWithRelationInputObjectSchema } from './objects/WorkflowExecutionOrderByWithRelationInput.schema';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './objects/WorkflowExecutionWhereInput.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionScalarFieldEnumSchema } from './enums/WorkflowExecutionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowExecutionFindManySelectSchema: z.ZodType<Prisma.WorkflowExecutionSelect> = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    actionTargetType: z.boolean().optional(),
    actionTargetId: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    failedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional(),
    events: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionSelect>;

export const WorkflowExecutionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    actionTargetType: z.boolean().optional(),
    actionTargetId: z.boolean().optional(),
    status: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    failedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional(),
    events: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WorkflowExecutionFindManySchema: z.ZodType<Prisma.WorkflowExecutionFindManyArgs> = z.object({ select: WorkflowExecutionFindManySelectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowExecutionOrderByWithRelationInputObjectSchema, WorkflowExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowExecutionWhereInputObjectSchema.optional(), cursor: WorkflowExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowExecutionScalarFieldEnumSchema, WorkflowExecutionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionFindManyArgs>;

export const WorkflowExecutionFindManyZodSchema = z.object({ select: WorkflowExecutionFindManySelectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowExecutionOrderByWithRelationInputObjectSchema, WorkflowExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowExecutionWhereInputObjectSchema.optional(), cursor: WorkflowExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowExecutionScalarFieldEnumSchema, WorkflowExecutionScalarFieldEnumSchema.array()]).optional() }).strict();