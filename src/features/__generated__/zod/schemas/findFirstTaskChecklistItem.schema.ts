import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './objects/TaskChecklistItemInclude.schema';
import { TaskChecklistItemOrderByWithRelationInputObjectSchema as TaskChecklistItemOrderByWithRelationInputObjectSchema } from './objects/TaskChecklistItemOrderByWithRelationInput.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './objects/TaskChecklistItemWhereInput.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './objects/TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemScalarFieldEnumSchema } from './enums/TaskChecklistItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskChecklistItemFindFirstSelectSchema: z.ZodType<Prisma.TaskChecklistItemSelect> = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    task: z.boolean().optional(),
    executions: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemSelect>;

export const TaskChecklistItemFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    title: z.boolean().optional(),
    note: z.boolean().optional(),
    isDone: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    task: z.boolean().optional(),
    executions: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskChecklistItemFindFirstSchema: z.ZodType<Prisma.TaskChecklistItemFindFirstArgs> = z.object({ select: TaskChecklistItemFindFirstSelectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), orderBy: z.union([TaskChecklistItemOrderByWithRelationInputObjectSchema, TaskChecklistItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskChecklistItemWhereInputObjectSchema.optional(), cursor: TaskChecklistItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskChecklistItemScalarFieldEnumSchema, TaskChecklistItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemFindFirstArgs>;

export const TaskChecklistItemFindFirstZodSchema = z.object({ select: TaskChecklistItemFindFirstSelectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), orderBy: z.union([TaskChecklistItemOrderByWithRelationInputObjectSchema, TaskChecklistItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskChecklistItemWhereInputObjectSchema.optional(), cursor: TaskChecklistItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskChecklistItemScalarFieldEnumSchema, TaskChecklistItemScalarFieldEnumSchema.array()]).optional() }).strict();