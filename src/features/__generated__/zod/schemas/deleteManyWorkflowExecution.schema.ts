import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './objects/WorkflowExecutionWhereInput.schema';

export const WorkflowExecutionDeleteManySchema: z.ZodType<Prisma.WorkflowExecutionDeleteManyArgs> = z.object({ where: WorkflowExecutionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionDeleteManyArgs>;

export const WorkflowExecutionDeleteManyZodSchema = z.object({ where: WorkflowExecutionWhereInputObjectSchema.optional() }).strict();