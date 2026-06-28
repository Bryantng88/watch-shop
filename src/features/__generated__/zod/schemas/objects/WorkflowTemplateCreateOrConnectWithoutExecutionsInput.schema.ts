import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutExecutionsInput>;
export const WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectZodSchema = makeSchema();
