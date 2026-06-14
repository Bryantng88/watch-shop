import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionOrderByWithRelationInputObjectSchema as TaskActionOrderByWithRelationInputObjectSchema } from './objects/TaskActionOrderByWithRelationInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './objects/TaskActionWhereInput.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';
import { TaskActionScalarFieldEnumSchema } from './enums/TaskActionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskActionFindManySelectSchema: z.ZodType<Prisma.TaskActionSelect> = z.object({
    id: z.boolean().optional(),
    taskTypeId: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    completionMode: z.boolean().optional(),
    completionRuleKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    technicalDetailCatalogId: z.boolean().optional(),
    supplyCatalogId: z.boolean().optional(),
    mechanicalPartCatalogId: z.boolean().optional(),
    technicalActionMode: z.boolean().optional(),
    defaultTitleTemplate: z.boolean().optional(),
    defaultDescriptionTemplate: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskType: z.boolean().optional(),
    tasks: z.boolean().optional(),
    serviceCatalog: z.boolean().optional(),
    technicalDetailCatalog: z.boolean().optional(),
    supplyCatalog: z.boolean().optional(),
    mechanicalPartCatalog: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskActionSelect>;

export const TaskActionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskTypeId: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    completionMode: z.boolean().optional(),
    completionRuleKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    technicalDetailCatalogId: z.boolean().optional(),
    supplyCatalogId: z.boolean().optional(),
    mechanicalPartCatalogId: z.boolean().optional(),
    technicalActionMode: z.boolean().optional(),
    defaultTitleTemplate: z.boolean().optional(),
    defaultDescriptionTemplate: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    taskType: z.boolean().optional(),
    tasks: z.boolean().optional(),
    serviceCatalog: z.boolean().optional(),
    technicalDetailCatalog: z.boolean().optional(),
    supplyCatalog: z.boolean().optional(),
    mechanicalPartCatalog: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskActionFindManySchema: z.ZodType<Prisma.TaskActionFindManyArgs> = z.object({ select: TaskActionFindManySelectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), orderBy: z.union([TaskActionOrderByWithRelationInputObjectSchema, TaskActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskActionWhereInputObjectSchema.optional(), cursor: TaskActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskActionScalarFieldEnumSchema, TaskActionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionFindManyArgs>;

export const TaskActionFindManyZodSchema = z.object({ select: TaskActionFindManySelectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), orderBy: z.union([TaskActionOrderByWithRelationInputObjectSchema, TaskActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskActionWhereInputObjectSchema.optional(), cursor: TaskActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskActionScalarFieldEnumSchema, TaskActionScalarFieldEnumSchema.array()]).optional() }).strict();