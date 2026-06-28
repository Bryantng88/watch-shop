import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './objects/WorkflowActionWhereInput.schema';

export const WorkflowActionDeleteManySchema: z.ZodType<Prisma.WorkflowActionDeleteManyArgs> = z.object({ where: WorkflowActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionDeleteManyArgs>;

export const WorkflowActionDeleteManyZodSchema = z.object({ where: WorkflowActionWhereInputObjectSchema.optional() }).strict();