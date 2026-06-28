import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionUpdateManyMutationInputObjectSchema as WorkflowExecutionUpdateManyMutationInputObjectSchema } from './objects/WorkflowExecutionUpdateManyMutationInput.schema';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './objects/WorkflowExecutionWhereInput.schema';

export const WorkflowExecutionUpdateManySchema: z.ZodType<Prisma.WorkflowExecutionUpdateManyArgs> = z.object({ data: WorkflowExecutionUpdateManyMutationInputObjectSchema, where: WorkflowExecutionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateManyArgs>;

export const WorkflowExecutionUpdateManyZodSchema = z.object({ data: WorkflowExecutionUpdateManyMutationInputObjectSchema, where: WorkflowExecutionWhereInputObjectSchema.optional() }).strict();