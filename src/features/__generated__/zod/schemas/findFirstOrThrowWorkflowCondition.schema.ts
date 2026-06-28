import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionOrderByWithRelationInputObjectSchema as WorkflowConditionOrderByWithRelationInputObjectSchema } from './objects/WorkflowConditionOrderByWithRelationInput.schema';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './objects/WorkflowConditionWhereInput.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionScalarFieldEnumSchema } from './enums/WorkflowConditionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowConditionFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WorkflowConditionSelect> = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionSelect>;

export const WorkflowConditionFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    workflowId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    configJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workflow: z.boolean().optional()
  }).strict();

export const WorkflowConditionFindFirstOrThrowSchema: z.ZodType<Prisma.WorkflowConditionFindFirstOrThrowArgs> = z.object({ select: WorkflowConditionFindFirstOrThrowSelectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowConditionOrderByWithRelationInputObjectSchema, WorkflowConditionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowConditionWhereInputObjectSchema.optional(), cursor: WorkflowConditionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowConditionScalarFieldEnumSchema, WorkflowConditionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionFindFirstOrThrowArgs>;

export const WorkflowConditionFindFirstOrThrowZodSchema = z.object({ select: WorkflowConditionFindFirstOrThrowSelectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), orderBy: z.union([WorkflowConditionOrderByWithRelationInputObjectSchema, WorkflowConditionOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowConditionWhereInputObjectSchema.optional(), cursor: WorkflowConditionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowConditionScalarFieldEnumSchema, WorkflowConditionScalarFieldEnumSchema.array()]).optional() }).strict();