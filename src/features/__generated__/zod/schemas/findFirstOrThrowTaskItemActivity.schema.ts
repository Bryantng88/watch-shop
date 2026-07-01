import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './objects/TaskItemActivityInclude.schema';
import { TaskItemActivityOrderByWithRelationInputObjectSchema as TaskItemActivityOrderByWithRelationInputObjectSchema } from './objects/TaskItemActivityOrderByWithRelationInput.schema';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './objects/TaskItemActivityWhereInput.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './objects/TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityScalarFieldEnumSchema } from './enums/TaskItemActivityScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskItemActivityFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TaskItemActivitySelect> = z.object({
    id: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    title: z.boolean().optional(),
    body: z.boolean().optional(),
    status: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    actorUser: z.boolean().optional(),
    replies: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskItemActivitySelect>;

export const TaskItemActivityFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskItemId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    title: z.boolean().optional(),
    body: z.boolean().optional(),
    status: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskItem: z.boolean().optional(),
    actorUser: z.boolean().optional(),
    replies: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskItemActivityFindFirstOrThrowSchema: z.ZodType<Prisma.TaskItemActivityFindFirstOrThrowArgs> = z.object({ select: TaskItemActivityFindFirstOrThrowSelectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), orderBy: z.union([TaskItemActivityOrderByWithRelationInputObjectSchema, TaskItemActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemActivityWhereInputObjectSchema.optional(), cursor: TaskItemActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemActivityScalarFieldEnumSchema, TaskItemActivityScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityFindFirstOrThrowArgs>;

export const TaskItemActivityFindFirstOrThrowZodSchema = z.object({ select: TaskItemActivityFindFirstOrThrowSelectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), orderBy: z.union([TaskItemActivityOrderByWithRelationInputObjectSchema, TaskItemActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemActivityWhereInputObjectSchema.optional(), cursor: TaskItemActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemActivityScalarFieldEnumSchema, TaskItemActivityScalarFieldEnumSchema.array()]).optional() }).strict();