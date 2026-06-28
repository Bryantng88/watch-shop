import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionSelectObjectSchema as WorkflowExecutionSelectObjectSchema } from './objects/WorkflowExecutionSelect.schema';
import { WorkflowExecutionIncludeObjectSchema as WorkflowExecutionIncludeObjectSchema } from './objects/WorkflowExecutionInclude.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionWhereUniqueInput.schema';

export const WorkflowExecutionFindUniqueSchema: z.ZodType<Prisma.WorkflowExecutionFindUniqueArgs> = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), where: WorkflowExecutionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionFindUniqueArgs>;

export const WorkflowExecutionFindUniqueZodSchema = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), where: WorkflowExecutionWhereUniqueInputObjectSchema }).strict();