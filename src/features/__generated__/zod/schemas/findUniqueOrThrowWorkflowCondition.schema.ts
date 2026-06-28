import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';

export const WorkflowConditionFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkflowConditionFindUniqueOrThrowArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionFindUniqueOrThrowArgs>;

export const WorkflowConditionFindUniqueOrThrowZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict();