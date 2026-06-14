import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeOrderByWithRelationInputObjectSchema as TaskTypeOrderByWithRelationInputObjectSchema } from './objects/TaskTypeOrderByWithRelationInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './objects/TaskTypeWhereInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';
import { TaskTypeScalarFieldEnumSchema } from './enums/TaskTypeScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskTypeFindManySelectSchema: z.ZodType<Prisma.TaskTypeSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    domain: z.boolean().optional(),
    defaultPriority: z.boolean().optional(),
    completionMode: z.boolean().optional(),
    completionRuleKey: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tasks: z.boolean().optional(),
    taskAction: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskTypeSelect>;

export const TaskTypeFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    domain: z.boolean().optional(),
    defaultPriority: z.boolean().optional(),
    completionMode: z.boolean().optional(),
    completionRuleKey: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tasks: z.boolean().optional(),
    taskAction: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskTypeFindManySchema: z.ZodType<Prisma.TaskTypeFindManyArgs> = z.object({ select: TaskTypeFindManySelectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), orderBy: z.union([TaskTypeOrderByWithRelationInputObjectSchema, TaskTypeOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskTypeWhereInputObjectSchema.optional(), cursor: TaskTypeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskTypeScalarFieldEnumSchema, TaskTypeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeFindManyArgs>;

export const TaskTypeFindManyZodSchema = z.object({ select: TaskTypeFindManySelectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), orderBy: z.union([TaskTypeOrderByWithRelationInputObjectSchema, TaskTypeOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskTypeWhereInputObjectSchema.optional(), cursor: TaskTypeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskTypeScalarFieldEnumSchema, TaskTypeScalarFieldEnumSchema.array()]).optional() }).strict();