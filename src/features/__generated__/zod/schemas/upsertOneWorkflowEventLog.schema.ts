import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogSelectObjectSchema as WorkflowEventLogSelectObjectSchema } from './objects/WorkflowEventLogSelect.schema';
import { WorkflowEventLogWhereUniqueInputObjectSchema as WorkflowEventLogWhereUniqueInputObjectSchema } from './objects/WorkflowEventLogWhereUniqueInput.schema';
import { WorkflowEventLogCreateInputObjectSchema as WorkflowEventLogCreateInputObjectSchema } from './objects/WorkflowEventLogCreateInput.schema';
import { WorkflowEventLogUncheckedCreateInputObjectSchema as WorkflowEventLogUncheckedCreateInputObjectSchema } from './objects/WorkflowEventLogUncheckedCreateInput.schema';
import { WorkflowEventLogUpdateInputObjectSchema as WorkflowEventLogUpdateInputObjectSchema } from './objects/WorkflowEventLogUpdateInput.schema';
import { WorkflowEventLogUncheckedUpdateInputObjectSchema as WorkflowEventLogUncheckedUpdateInputObjectSchema } from './objects/WorkflowEventLogUncheckedUpdateInput.schema';

export const WorkflowEventLogUpsertOneSchema: z.ZodType<Prisma.WorkflowEventLogUpsertArgs> = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema, create: z.union([ WorkflowEventLogCreateInputObjectSchema, WorkflowEventLogUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowEventLogUpdateInputObjectSchema, WorkflowEventLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogUpsertArgs>;

export const WorkflowEventLogUpsertOneZodSchema = z.object({ select: WorkflowEventLogSelectObjectSchema.optional(),  where: WorkflowEventLogWhereUniqueInputObjectSchema, create: z.union([ WorkflowEventLogCreateInputObjectSchema, WorkflowEventLogUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowEventLogUpdateInputObjectSchema, WorkflowEventLogUncheckedUpdateInputObjectSchema ]) }).strict();