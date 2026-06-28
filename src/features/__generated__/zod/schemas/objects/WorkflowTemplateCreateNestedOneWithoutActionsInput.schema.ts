import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutActionsInputObjectSchema as WorkflowTemplateCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutActionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutActionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateCreateNestedOneWithoutActionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutActionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutActionsInput>;
export const WorkflowTemplateCreateNestedOneWithoutActionsInputObjectZodSchema = makeSchema();
