import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateCreateWithoutActionsInputObjectSchema as WorkflowTemplateCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutActionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutActionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutActionsInput>;
export const WorkflowTemplateCreateOrConnectWithoutActionsInputObjectZodSchema = makeSchema();
