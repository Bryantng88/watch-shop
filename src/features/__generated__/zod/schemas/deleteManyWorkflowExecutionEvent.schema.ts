import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventWhereInputObjectSchema as WorkflowExecutionEventWhereInputObjectSchema } from './objects/WorkflowExecutionEventWhereInput.schema';

export const WorkflowExecutionEventDeleteManySchema: z.ZodType<Prisma.WorkflowExecutionEventDeleteManyArgs> = z.object({ where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventDeleteManyArgs>;

export const WorkflowExecutionEventDeleteManyZodSchema = z.object({ where: WorkflowExecutionEventWhereInputObjectSchema.optional() }).strict();