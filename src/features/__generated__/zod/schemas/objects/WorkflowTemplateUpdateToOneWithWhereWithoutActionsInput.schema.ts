import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutActionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateUpdateToOneWithWhereWithoutActionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutActionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutActionsInput>;
export const WorkflowTemplateUpdateToOneWithWhereWithoutActionsInputObjectZodSchema = makeSchema();
