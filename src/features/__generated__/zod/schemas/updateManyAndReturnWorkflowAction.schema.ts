import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionUpdateManyMutationInputObjectSchema as WorkflowActionUpdateManyMutationInputObjectSchema } from './objects/WorkflowActionUpdateManyMutationInput.schema';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './objects/WorkflowActionWhereInput.schema';

export const WorkflowActionUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkflowActionUpdateManyAndReturnArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), data: WorkflowActionUpdateManyMutationInputObjectSchema, where: WorkflowActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionUpdateManyAndReturnArgs>;

export const WorkflowActionUpdateManyAndReturnZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), data: WorkflowActionUpdateManyMutationInputObjectSchema, where: WorkflowActionWhereInputObjectSchema.optional() }).strict();