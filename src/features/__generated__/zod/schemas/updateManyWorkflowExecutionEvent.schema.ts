import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventUpdateManyMutationInputObjectSchema as WorkflowExecutionEventUpdateManyMutationInputObjectSchema } from './objects/WorkflowExecutionEventUpdateManyMutationInput.schema';
import { WorkflowExecutionEventWhereInputObjectSchema as WorkflowExecutionEventWhereInputObjectSchema } from './objects/WorkflowExecutionEventWhereInput.schema';

export const WorkflowExecutionEventUpdateManySchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateManyArgs> = z.object({ data: WorkflowExecutionEventUpdateManyMutationInputObjectSchema, where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateManyArgs>;

export const WorkflowExecutionEventUpdateManyZodSchema = z.object({ data: WorkflowExecutionEventUpdateManyMutationInputObjectSchema, where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict();