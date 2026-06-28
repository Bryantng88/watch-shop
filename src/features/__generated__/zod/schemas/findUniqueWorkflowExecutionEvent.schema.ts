import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './objects/WorkflowExecutionEventInclude.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionEventWhereUniqueInput.schema';

export const WorkflowExecutionEventFindUniqueSchema: z.ZodType<Prisma.WorkflowExecutionEventFindUniqueArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventFindUniqueArgs>;

export const WorkflowExecutionEventFindUniqueZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict();