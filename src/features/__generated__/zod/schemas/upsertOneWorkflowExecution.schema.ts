import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionSelectObjectSchema as WorkflowExecutionSelectObjectSchema } from './objects/WorkflowExecutionSelect.schema';
import { WorkflowExecutionIncludeObjectSchema as WorkflowExecutionIncludeObjectSchema } from './objects/WorkflowExecutionInclude.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './objects/WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionCreateInputObjectSchema as WorkflowExecutionCreateInputObjectSchema } from './objects/WorkflowExecutionCreateInput.schema';
import { WorkflowExecutionUncheckedCreateInputObjectSchema as WorkflowExecutionUncheckedCreateInputObjectSchema } from './objects/WorkflowExecutionUncheckedCreateInput.schema';
import { WorkflowExecutionUpdateInputObjectSchema as WorkflowExecutionUpdateInputObjectSchema } from './objects/WorkflowExecutionUpdateInput.schema';
import { WorkflowExecutionUncheckedUpdateInputObjectSchema as WorkflowExecutionUncheckedUpdateInputObjectSchema } from './objects/WorkflowExecutionUncheckedUpdateInput.schema';

export const WorkflowExecutionUpsertOneSchema: z.ZodType<Prisma.WorkflowExecutionUpsertArgs> = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), where: WorkflowExecutionWhereUniqueInputObjectSchema, create: z.union([ WorkflowExecutionCreateInputObjectSchema, WorkflowExecutionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowExecutionUpdateInputObjectSchema, WorkflowExecutionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionUpsertArgs>;

export const WorkflowExecutionUpsertOneZodSchema = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), include: WorkflowExecutionIncludeObjectSchema.optional(), where: WorkflowExecutionWhereUniqueInputObjectSchema, create: z.union([ WorkflowExecutionCreateInputObjectSchema, WorkflowExecutionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowExecutionUpdateInputObjectSchema, WorkflowExecutionUncheckedUpdateInputObjectSchema ]) }).strict();