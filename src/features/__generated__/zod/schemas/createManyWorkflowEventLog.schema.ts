import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogCreateManyInputObjectSchema as WorkflowEventLogCreateManyInputObjectSchema } from './objects/WorkflowEventLogCreateManyInput.schema';

export const WorkflowEventLogCreateManySchema: z.ZodType<Prisma.WorkflowEventLogCreateManyArgs> = z.object({ data: z.union([ WorkflowEventLogCreateManyInputObjectSchema, z.array(WorkflowEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogCreateManyArgs>;

export const WorkflowEventLogCreateManyZodSchema = z.object({ data: z.union([ WorkflowEventLogCreateManyInputObjectSchema, z.array(WorkflowEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();