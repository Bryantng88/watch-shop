import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutActionsInput.schema';
import { WorkflowTemplateCreateWithoutActionsInputObjectSchema as WorkflowTemplateCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutActionsInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema)]),
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUpsertWithoutActionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpsertWithoutActionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpsertWithoutActionsInput>;
export const WorkflowTemplateUpsertWithoutActionsInputObjectZodSchema = makeSchema();
