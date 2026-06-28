import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionUpdateManyMutationInputObjectSchema as WorkflowActionUpdateManyMutationInputObjectSchema } from './objects/WorkflowActionUpdateManyMutationInput.schema';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './objects/WorkflowActionWhereInput.schema';

export const WorkflowActionUpdateManySchema: z.ZodType<Prisma.WorkflowActionUpdateManyArgs> = z.object({ data: WorkflowActionUpdateManyMutationInputObjectSchema, where: WorkflowActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionUpdateManyArgs>;

export const WorkflowActionUpdateManyZodSchema = z.object({ data: WorkflowActionUpdateManyMutationInputObjectSchema, where: WorkflowActionWhereInputObjectSchema.optional() }).strict();