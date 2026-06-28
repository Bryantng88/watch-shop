import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutExecutionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateCreateNestedOneWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutExecutionsInput>;
export const WorkflowTemplateCreateNestedOneWithoutExecutionsInputObjectZodSchema = makeSchema();
