import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUpdateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutTagsInput.schema';
import { WorkflowTemplateCreateWithoutTagsInputObjectSchema as WorkflowTemplateCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutTagsInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema)]),
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUpsertWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpsertWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpsertWithoutTagsInput>;
export const WorkflowTemplateUpsertWithoutTagsInputObjectZodSchema = makeSchema();
