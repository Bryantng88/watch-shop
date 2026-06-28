import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventIncludeObjectSchema as WorkflowExecutionEventIncludeObjectSchema } from './objects/WorkflowExecutionEventInclude.schema';
import { WorkflowExecutionEventUpdateInputObjectSchema as WorkflowExecutionEventUpdateInputObjectSchema } from './objects/WorkflowExecutionEventUpdateInput.schema';
import { WorkflowExecutionEventUncheckedUpdateInputObjectSchema as WorkflowExecutionEventUncheckedUpdateInputObjectSchema } from './objects/WorkflowExecutionEventUncheckedUpdateInput.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionEventWhereUniqueInput.schema';

export const WorkflowExecutionEventUpdateOneSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionEventUpdateInputObjectSchema, WorkflowExecutionEventUncheckedUpdateInputObjectSchema]), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateArgs>;

export const WorkflowExecutionEventUpdateOneZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), include: WorkflowExecutionEventIncludeObjectSchema.optional(), data: z.union([WorkflowExecutionEventUpdateInputObjectSchema, WorkflowExecutionEventUncheckedUpdateInputObjectSchema]), where: WorkflowExecutionEventWhereUniqueInputObjectSchema }).strict();