import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateCreateWithoutConditionsInputObjectSchema as WorkflowTemplateCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutConditionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutConditionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateOrConnectWithoutConditionsInput>;
export const WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectZodSchema = makeSchema();
