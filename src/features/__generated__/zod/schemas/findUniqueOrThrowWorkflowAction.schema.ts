import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './objects/WorkflowActionInclude.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './objects/WorkflowActionWhereUniqueInput.schema';

export const WorkflowActionFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkflowActionFindUniqueOrThrowArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), where: WorkflowActionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowActionFindUniqueOrThrowArgs>;

export const WorkflowActionFindUniqueOrThrowZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), where: WorkflowActionWhereUniqueInputObjectSchema }).strict();