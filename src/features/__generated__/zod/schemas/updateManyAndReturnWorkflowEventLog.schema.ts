import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogUpdateManyMutationInputObjectSchema as WorkflowEventLogUpdateManyMutationInputObjectSchema } from './objects/WorkflowEventLogUpdateManyMutationInput.schema';
import { WorkflowEventLogWhereInputObjectSchema as WorkflowEventLogWhereInputObjectSchema } from './objects/WorkflowEventLogWhereInput.schema';

export const WorkflowEventLogUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkflowEventLogUpdateManyAndReturnArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(), data: WorkflowEventLogUpdateManyMutationInputObjectSchema, where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogUpdateManyAndReturnArgs>;

export const WorkflowEventLogUpdateManyAndReturnZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(), data: WorkflowEventLogUpdateManyMutationInputObjectSchema, where: WorkflowEventLogWhereInputObjectSchema.optional() }).strict();