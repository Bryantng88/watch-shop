import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutTagsInputObjectSchema as WorkflowTemplateCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutTagsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutTagsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateCreateNestedOneWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutTagsInput>;
export const WorkflowTemplateCreateNestedOneWithoutTagsInputObjectZodSchema = makeSchema();
