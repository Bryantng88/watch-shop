import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './objects/WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateCreateInputObjectSchema as WorkflowTemplateCreateInputObjectSchema } from './objects/WorkflowTemplateCreateInput.schema';
import { WorkflowTemplateUncheckedCreateInputObjectSchema as WorkflowTemplateUncheckedCreateInputObjectSchema } from './objects/WorkflowTemplateUncheckedCreateInput.schema';
import { WorkflowTemplateUpdateInputObjectSchema as WorkflowTemplateUpdateInputObjectSchema } from './objects/WorkflowTemplateUpdateInput.schema';
import { WorkflowTemplateUncheckedUpdateInputObjectSchema as WorkflowTemplateUncheckedUpdateInputObjectSchema } from './objects/WorkflowTemplateUncheckedUpdateInput.schema';

export const WorkflowTemplateUpsertOneSchema: z.ZodType<Prisma.WorkflowTemplateUpsertArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema, create: z.union([ WorkflowTemplateCreateInputObjectSchema, WorkflowTemplateUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowTemplateUpdateInputObjectSchema, WorkflowTemplateUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateUpsertArgs>;

export const WorkflowTemplateUpsertOneZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema, create: z.union([ WorkflowTemplateCreateInputObjectSchema, WorkflowTemplateUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowTemplateUpdateInputObjectSchema, WorkflowTemplateUncheckedUpdateInputObjectSchema ]) }).strict();