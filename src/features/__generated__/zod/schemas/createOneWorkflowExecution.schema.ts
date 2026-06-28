import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionSelectObjectSchema as WorkflowExecutionSelectObjectSchema } from './objects/WorkflowExecutionSelect.schema';
import { WorkflowExecutionIncludeObjectSchema as WorkflowExecutionIncludeObjectSchema } from './objects/WorkflowExecutionInclude.schema';
import { WorkflowExecutionCreateInputObjectSchema as WorkflowExecutionCreateInputObjectSchema } from './objects/WorkflowExecutionCreateInput.schema';
import { WorkflowExecutionUncheckedCreateInputObjectSchema as WorkflowExecutionUncheckedCreateInputObjectSchema } from './objects/WorkflowExecutionUncheckedCreateInput.schema';

export const WorkflowExecutionCreateOneSchema: z.ZodType<Prisma.WorkflowExecutionCreateArgs> = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionCreateInputObjectSchema, WorkflowExecutionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateArgs>;

export const WorkflowExecutionCreateOneZodSchema = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionCreateInputObjectSchema, WorkflowExecutionUncheckedCreateInputObjectSchema]) }).strict();