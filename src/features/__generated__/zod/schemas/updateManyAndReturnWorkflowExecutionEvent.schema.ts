import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventUpdateManyMutationInputObjectSchema as WorkflowExecutionEventUpdateManyMutationInputObjectSchema } from './objects/WorkflowExecutionEventUpdateManyMutationInput.schema';
import { WorkflowExecutionEventWhereInputObjectSchema as WorkflowExecutionEventWhereInputObjectSchema } from './objects/WorkflowExecutionEventWhereInput.schema';

export const WorkflowExecutionEventUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateManyAndReturnArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), data: WorkflowExecutionEventUpdateManyMutationInputObjectSchema, where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateManyAndReturnArgs>;

export const WorkflowExecutionEventUpdateManyAndReturnZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), data: WorkflowExecutionEventUpdateManyMutationInputObjectSchema, where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict();