import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionOrderByWithRelationInputObjectSchema as TaskExecutionOrderByWithRelationInputObjectSchema } from './objects/TaskExecutionOrderByWithRelationInput.schema';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionScalarFieldEnumSchema } from './enums/TaskExecutionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskExecutionFindManySelectSchema: z.ZodType<Prisma.TaskExecutionSelect> = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    note: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    checklistItemId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    task: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskExecutionSelect>;

export const TaskExecutionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    note: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    checklistItemId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    task: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional()
  }).strict();

export const TaskExecutionFindManySchema: z.ZodType<Prisma.TaskExecutionFindManyArgs> = z.object({ select: TaskExecutionFindManySelectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskExecutionScalarFieldEnumSchema, TaskExecutionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionFindManyArgs>;

export const TaskExecutionFindManyZodSchema = z.object({ select: TaskExecutionFindManySelectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskExecutionScalarFieldEnumSchema, TaskExecutionScalarFieldEnumSchema.array()]).optional() }).strict();