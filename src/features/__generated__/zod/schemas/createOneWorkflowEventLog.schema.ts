import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogCreateInputObjectSchema as WorkflowEventLogCreateInputObjectSchema } from './objects/WorkflowEventLogCreateInput.schema';
import { WorkflowEventLogUncheckedCreateInputObjectSchema as WorkflowEventLogUncheckedCreateInputObjectSchema } from './objects/WorkflowEventLogUncheckedCreateInput.schema';

export const WorkflowEventLogCreateOneSchema: z.ZodType<Prisma.WorkflowEventLogCreateArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  data: z.union([WorkflowEventLogCreateInputObjectSchema, WorkflowEventLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogCreateArgs>;

export const WorkflowEventLogCreateOneZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  data: z.union([WorkflowEventLogCreateInputObjectSchema, WorkflowEventLogUncheckedCreateInputObjectSchema]) }).strict();