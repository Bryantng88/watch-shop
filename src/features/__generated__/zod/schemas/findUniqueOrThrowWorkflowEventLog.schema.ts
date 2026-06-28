import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogWhereUniqueInputObjectSchema as WorkflowEventLogWhereUniqueInputObjectSchema } from './objects/WorkflowEventLogWhereUniqueInput.schema';

export const WorkflowEventLogFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkflowEventLogFindUniqueOrThrowArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogFindUniqueOrThrowArgs>;

export const WorkflowEventLogFindUniqueOrThrowZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict();