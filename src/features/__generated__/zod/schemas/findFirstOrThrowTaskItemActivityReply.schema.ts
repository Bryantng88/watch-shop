import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './objects/TaskItemActivityReplyInclude.schema';
import { TaskItemActivityReplyOrderByWithRelationInputObjectSchema as TaskItemActivityReplyOrderByWithRelationInputObjectSchema } from './objects/TaskItemActivityReplyOrderByWithRelationInput.schema';
import { TaskItemActivityReplyWhereInputObjectSchema as TaskItemActivityReplyWhereInputObjectSchema } from './objects/TaskItemActivityReplyWhereInput.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './objects/TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyScalarFieldEnumSchema } from './enums/TaskItemActivityReplyScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskItemActivityReplyFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TaskItemActivityReplySelect> = z.object({
    id: z.boolean().optional(),
    activityId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    body: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    activity: z.boolean().optional(),
    actorUser: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplySelect>;

export const TaskItemActivityReplyFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    activityId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    body: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    activity: z.boolean().optional(),
    actorUser: z.boolean().optional()
  }).strict();

export const TaskItemActivityReplyFindFirstOrThrowSchema: z.ZodType<Prisma.TaskItemActivityReplyFindFirstOrThrowArgs> = z.object({ select: TaskItemActivityReplyFindFirstOrThrowSelectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), orderBy: z.union([TaskItemActivityReplyOrderByWithRelationInputObjectSchema, TaskItemActivityReplyOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemActivityReplyWhereInputObjectSchema.optional(), cursor: TaskItemActivityReplyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemActivityReplyScalarFieldEnumSchema, TaskItemActivityReplyScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyFindFirstOrThrowArgs>;

export const TaskItemActivityReplyFindFirstOrThrowZodSchema = z.object({ select: TaskItemActivityReplyFindFirstOrThrowSelectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), orderBy: z.union([TaskItemActivityReplyOrderByWithRelationInputObjectSchema, TaskItemActivityReplyOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskItemActivityReplyWhereInputObjectSchema.optional(), cursor: TaskItemActivityReplyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskItemActivityReplyScalarFieldEnumSchema, TaskItemActivityReplyScalarFieldEnumSchema.array()]).optional() }).strict();