import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogWhereUniqueInputObjectSchema as WorkflowEventLogWhereUniqueInputObjectSchema } from './objects/WorkflowEventLogWhereUniqueInput.schema';

export const WorkflowEventLogFindUniqueSchema: z.ZodType<Prisma.WorkflowEventLogFindUniqueArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogFindUniqueArgs>;

export const WorkflowEventLogFindUniqueZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict();