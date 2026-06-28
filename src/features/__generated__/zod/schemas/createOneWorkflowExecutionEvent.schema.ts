import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './objects/WorkflowExecutionEventInclude.schema';
import { WorkflowExecutionEventCreateInputObjectSchema as WorkflowExecutionEventCreateInputObjectSchema } from './objects/WorkflowExecutionEventCreateInput.schema';
import { WorkflowExecutionEventUncheckedCreateInputObjectSchema as WorkflowExecutionEventUncheckedCreateInputObjectSchema } from './objects/WorkflowExecutionEventUncheckedCreateInput.schema';

export const WorkflowExecutionEventCreateOneSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionEventCreateInputObjectSchema, WorkflowExecutionEventUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateArgs>;

export const WorkflowExecutionEventCreateOneZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionEventCreateInputObjectSchema, WorkflowExecutionEventUncheckedCreateInputObjectSchema]) }).strict();