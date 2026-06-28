import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogUpdateInputObjectSchema as WorkflowEventLogUpdateInputObjectSchema } from './objects/WorkflowEventLogUpdateInput.schema';
import { WorkflowEventLogUncheckedUpdateInputObjectSchema as WorkflowEventLogUncheckedUpdateInputObjectSchema } from './objects/WorkflowEventLogUncheckedUpdateInput.schema';
import { WorkflowEventLogWhereUniqueInputObjectSchema as WorkflowEventLogWhereUniqueInputObjectSchema } from './objects/WorkflowEventLogWhereUniqueInput.schema';

export const WorkflowEventLogUpdateOneSchema: z.ZodType<Prisma.WorkflowEventLogUpdateArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  data: z.union([WorkflowEventLogUpdateInputObjectSchema, WorkflowEventLogUncheckedUpdateInputObjectSchema]), where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogUpdateArgs>;

export const WorkflowEventLogUpdateOneZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  data: z.union([WorkflowEventLogUpdateInputObjectSchema, WorkflowEventLogUncheckedUpdateInputObjectSchema]), where: WorkflowEventLogWhereUniqueInputObjectSchema }).strict();