import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './objects/TaskItemChecklistInclude.schema';
import { TaskItemChecklistOrderByWithRelationInputObjectSchema as TaskItemChecklistOrderByWithRelationInputObjectSchema } from './objects/TaskItemChecklistOrderByWithRelationInput.schema';
import { TaskItemChecklistWhereInputObjectSchema as TaskItemChecklistWhereInputObjectSchema } from './objects/TaskItemChecklistWhereInput.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './objects/TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistScalarFieldEnumSchema } from './enums/TaskItemChecklistScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskItemChecklistFindManySelectSchema: z.ZodType<Prisma.TaskItemChecklistSelect> = z.object({
    id: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    doneAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    Task: z.boolean().optional(),
    taskId: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistSelect>;

export const TaskItemChecklistFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    doneAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    Task: z.boolean().optional(),
    taskId: z.boolean().optional()
  }).strict();

export const TaskItemChecklistFindManySchema: z.ZodType<Prisma.TaskItemChecklistFindManyArgs> = z.object({ select: TaskItemChecklistFindManySelectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), orderBy: z.union([TaskItemChecklistOrderByWithRelationInputObjectSchema, TaskItemChecklistOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemChecklistWhereInputObjectSchema.optional(), cursor: TaskItemChecklistWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemChecklistScalarFieldEnumSchema, TaskItemChecklistScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistFindManyArgs>;

export const TaskItemChecklistFindManyZodSchema = z.object({ select: TaskItemChecklistFindManySelectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), orderBy: z.union([TaskItemChecklistOrderByWithRelationInputObjectSchema, TaskItemChecklistOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemChecklistWhereInputObjectSchema.optional(), cursor: TaskItemChecklistWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemChecklistScalarFieldEnumSchema, TaskItemChecklistScalarFieldEnumSchema.array()]).optional() }).strict();