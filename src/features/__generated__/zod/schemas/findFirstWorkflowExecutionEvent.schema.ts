import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './objects/WorkflowExecutionEventInclude.schema';
import { WorkflowExecutionEventOrderByWithRelationInputObjectSchema as WorkflowExecutionEventOrderByWithRelationInputObjectSchema } from './objects/WorkflowExecutionEventOrderByWithRelationInput.schema';
import { WorkflowExecutionEventWhereInputObjectSchema as WorkflowExecutionEventWhereInputObjectSchema } from './objects/WorkflowExecutionEventWhereInput.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventScalarFieldEnumSchema } from './enums/WorkflowExecutionEventScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowExecutionEventFindFirstSelectSchema: z.ZodType<Prisma.WorkflowExecutionEventSelect> = z.object({
    id: z.boolean().optional(),
    executionId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    eventLogId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    execution: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventSelect>;

export const WorkflowExecutionEventFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    executionId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    eventLogId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    execution: z.boolean().optional()
  }).strict();

export const WorkflowExecutionEventFindFirstSchema: z.ZodType<Prisma.WorkflowExecutionEventFindFirstArgs> = z.object({ select: WorkflowExecutionEventFindFirstSelectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), orderBy: z.union([WorkflowExecutionEventOrderByWithRelationInputObjectSchema, WorkflowExecutionEventOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowExecutionEventWhereInputObjectSchema.optional(), cursor: WorkflowExecutionEventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowExecutionEventScalarFieldEnumSchema, WorkflowExecutionEventScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventFindFirstArgs>;

export const WorkflowExecutionEventFindFirstZodSchema = z.object({ select: WorkflowExecutionEventFindFirstSelectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), orderBy: z.union([WorkflowExecutionEventOrderByWithRelationInputObjectSchema, WorkflowExecutionEventOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowExecutionEventWhereInputObjectSchema.optional(), cursor: WorkflowExecutionEventWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowExecutionEventScalarFieldEnumSchema, WorkflowExecutionEventScalarFieldEnumSchema.array()]).optional() }).strict();