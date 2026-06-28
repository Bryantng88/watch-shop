import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogCreateManyInputObjectSchema as WorkflowEventLogCreateManyInputObjectSchema } from './objects/WorkflowEventLogCreateManyInput.schema';

export const WorkflowEventLogCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowEventLogCreateManyAndReturnArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(), data: z.union([ WorkflowEventLogCreateManyInputObjectSchema, z.array(WorkflowEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogCreateManyAndReturnArgs>;

export const WorkflowEventLogCreateManyAndReturnZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(), data: z.union([ WorkflowEventLogCreateManyInputObjectSchema, z.array(WorkflowEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();