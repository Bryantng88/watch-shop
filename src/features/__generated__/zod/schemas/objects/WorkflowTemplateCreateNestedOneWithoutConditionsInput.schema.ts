import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutConditionsInputObjectSchema as WorkflowTemplateCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutConditionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutConditionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateCreateNestedOneWithoutConditionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutConditionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateNestedOneWithoutConditionsInput>;
export const WorkflowTemplateCreateNestedOneWithoutConditionsInputObjectZodSchema = makeSchema();
