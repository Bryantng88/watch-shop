import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemOrderByWithRelationInputObjectSchema as TaskItemOrderByWithRelationInputObjectSchema } from './objects/TaskItemOrderByWithRelationInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './objects/TaskItemWhereInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';
import { TaskItemScalarFieldEnumSchema } from './enums/TaskItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskItemFindManySelectSchema: z.ZodType<Prisma.TaskItemSelect> = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    task: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    executions: z.boolean().optional(),
    checklists: z.boolean().optional(),
    userId: z.boolean().optional(),
    User: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskItemSelect>;

export const TaskItemFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    task: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    executions: z.boolean().optional(),
    checklists: z.boolean().optional(),
    userId: z.boolean().optional(),
    User: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskItemFindManySchema: z.ZodType<Prisma.TaskItemFindManyArgs> = z.object({ select: TaskItemFindManySelectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), orderBy: z.union([TaskItemOrderByWithRelationInputObjectSchema, TaskItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemWhereInputObjectSchema.optional(), cursor: TaskItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemScalarFieldEnumSchema, TaskItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemFindManyArgs>;

export const TaskItemFindManyZodSchema = z.object({ select: TaskItemFindManySelectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), orderBy: z.union([TaskItemOrderByWithRelationInputObjectSchema, TaskItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemWhereInputObjectSchema.optional(), cursor: TaskItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemScalarFieldEnumSchema, TaskItemScalarFieldEnumSchema.array()]).optional() }).strict();