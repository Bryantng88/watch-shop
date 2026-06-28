import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateOrderByWithRelationInputObjectSchema as WorkflowTemplateOrderByWithRelationInputObjectSchema } from './objects/WorkflowTemplateOrderByWithRelationInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './objects/WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './objects/WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateScalarFieldEnumSchema } from './enums/WorkflowTemplateScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowTemplateFindManySelectSchema: z.ZodType<Prisma.WorkflowTemplateSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    status: z.boolean().optional(),
    strategy: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    conditions: z.boolean().optional(),
    actions: z.boolean().optional(),
    executions: z.boolean().optional(),
    tags: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateSelect>;

export const WorkflowTemplateFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    status: z.boolean().optional(),
    strategy: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    conditions: z.boolean().optional(),
    actions: z.boolean().optional(),
    executions: z.boolean().optional(),
    tags: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WorkflowTemplateFindManySchema: z.ZodType<Prisma.WorkflowTemplateFindManyArgs> = z.object({ select: WorkflowTemplateFindManySelectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), orderBy: z.union([WorkflowTemplateOrderByWithRelationInputObjectSchema, WorkflowTemplateOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowTemplateWhereInputObjectSchema.optional(), cursor: WorkflowTemplateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowTemplateScalarFieldEnumSchema, WorkflowTemplateScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateFindManyArgs>;

export const WorkflowTemplateFindManyZodSchema = z.object({ select: WorkflowTemplateFindManySelectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), orderBy: z.union([WorkflowTemplateOrderByWithRelationInputObjectSchema, WorkflowTemplateOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowTemplateWhereInputObjectSchema.optional(), cursor: WorkflowTemplateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowTemplateScalarFieldEnumSchema, WorkflowTemplateScalarFieldEnumSchema.array()]).optional() }).strict();