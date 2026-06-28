import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateCreateWithoutTagsInputObjectSchema as WorkflowTemplateCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutTagsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutTagsInput>;
export const WorkflowTemplateCreateOrConnectWithoutTagsInputObjectZodSchema = makeSchema();
