import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './objects/WorkflowConditionWhereInput.schema';

export const WorkflowConditionDeleteManySchema: z.ZodType<Prisma.WorkflowConditionDeleteManyArgs> = z.object({ where: WorkflowConditionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionDeleteManyArgs>;

export const WorkflowConditionDeleteManyZodSchema = z.object({ where: WorkflowConditionWhereInputObjectSchema.optional() }).strict();