import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './objects/WorkflowActionInclude.schema';
import { WorkflowActionOrderByWithRelationInputObjectSchema as WorkflowActionOrderByWithRelationInputObjectSchema } from './objects/WorkflowActionOrderByWithRelationInput.schema';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './objects/WorkflowActionWhereInput.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './objects/WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionScalarFieldEnumSchema } from './enums/WorkflowActionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowActionFindFirstSelectSchema: z.ZodType<Prisma.WorkflowActionSelect> = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowActionSelect>;

export const WorkflowActionFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    actionType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict();

export const WorkflowActionFindFirstSchema: z.ZodType<Prisma.WorkflowActionFindFirstArgs> = z.object({ select: WorkflowActionFindFirstSelectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowActionOrderByWithRelationInputObjectSchema, WorkflowActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowActionWhereInputObjectSchema.optional(), cursor: WorkflowActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowActionScalarFieldEnumSchema, WorkflowActionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionFindFirstArgs>;

export const WorkflowActionFindFirstZodSchema = z.object({ select: WorkflowActionFindFirstSelectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowActionOrderByWithRelationInputObjectSchema, WorkflowActionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowActionWhereInputObjectSchema.optional(), cursor: WorkflowActionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowActionScalarFieldEnumSchema, WorkflowActionScalarFieldEnumSchema.array()]).optional() }).strict();