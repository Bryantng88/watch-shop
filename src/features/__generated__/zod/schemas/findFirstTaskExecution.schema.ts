import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionOrderByWithRelationInputObjectSchema as TaskExecutionOrderByWithRelationInputObjectSchema } from './objects/TaskExecutionOrderByWithRelationInput.schema';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionScalarFieldEnumSchema } from './enums/TaskExecutionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskExecutionFindFirstSelectSchema: z.ZodType<Prisma.TaskExecutionSelect> = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    note: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    task: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskExecutionSelect>;

export const TaskExecutionFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    note: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    task: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional()
  }).strict();

export const TaskExecutionFindFirstSchema: z.ZodType<Prisma.TaskExecutionFindFirstArgs> = z.object({ select: TaskExecutionFindFirstSelectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskExecutionScalarFieldEnumSchema, TaskExecutionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionFindFirstArgs>;

export const TaskExecutionFindFirstZodSchema = z.object({ select: TaskExecutionFindFirstSelectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), orderBy: z.union([TaskExecutionOrderByWithRelationInputObjectSchema, TaskExecutionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskExecutionWhereInputObjectSchema.optional(), cursor: TaskExecutionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskExecutionScalarFieldEnumSchema, TaskExecutionScalarFieldEnumSchema.array()]).optional() }).strict();