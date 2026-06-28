import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './objects/WorkflowExecutionEventInclude.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionEventWhereUniqueInput.schema';

export const WorkflowExecutionEventDeleteOneSchema: z.ZodType<Prisma.WorkflowExecutionEventDeleteArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventDeleteArgs>;

export const WorkflowExecutionEventDeleteOneZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict();