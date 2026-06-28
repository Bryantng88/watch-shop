import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogUpdateManyMutationInputObjectSchema as WorkflowEventLogUpdateManyMutationInputObjectSchema } from './objects/WorkflowEventLogUpdateManyMutationInput.schema';
import { WorkflowEventLogWhereInputObjectSchema as WorkflowEventLogWhereInputObjectSchema } from './objects/WorkflowEventLogWhereInput.schema';

export const WorkflowEventLogUpdateManySchema: z.ZodType<Prisma.WorkflowEventLogUpdateManyArgs> = z.object({ data: WorkflowEventLogUpdateManyMutationInputObjectSchema, where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogUpdateManyArgs>;

export const WorkflowEventLogUpdateManyZodSchema = z.object({ data: WorkflowEventLogUpdateManyMutationInputObjectSchema, where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict();