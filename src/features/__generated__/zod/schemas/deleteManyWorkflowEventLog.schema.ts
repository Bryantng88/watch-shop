import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogWhereInputObjectSchema as WorkflowEventLogWhereInputObjectSchema } from './objects/WorkflowEventLogWhereInput.schema';

export const WorkflowEventLogDeleteManySchema: z.ZodType<Prisma.WorkflowEventLogDeleteManyArgs> = z.object({ where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogDeleteManyArgs>;

export const WorkflowEventLogDeleteManyZodSchema = z.object({ where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict();