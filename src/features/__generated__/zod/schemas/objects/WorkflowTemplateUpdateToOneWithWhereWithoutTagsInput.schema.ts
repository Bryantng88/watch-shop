import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUpdateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutTagsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
export const WorkflowTemplateUpdateToOneWithWhereWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutTagsInput>;
export const WorkflowTemplateUpdateToOneWithWhereWithoutTagsInputObjectZodSchema = makeSchema();
